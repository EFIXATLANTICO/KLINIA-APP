from __future__ import annotations

import base64
import hashlib
import json
import logging
import math
import re
import secrets
import unicodedata
from datetime import UTC, date, datetime, timedelta
from urllib.parse import quote, urlencode
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import httpx
from cryptography.fernet import Fernet, InvalidToken
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .config import get_settings
from .db import get_db
from .deps import require_subscribed_roles
from .models import (
    Appointment,
    AppointmentGoogleSync,
    AppointmentStatus,
    AuditLog,
    Clinic,
    ClinicDataBlob,
    GoogleCalendarConnection,
    GoogleCalendarOAuthState,
    OnlineBooking,
    OnlineBookingPractitioner,
    OnlineBookingService,
    OnlineBookingSetting,
    Patient,
    Practitioner,
    Room,
    Service,
    User,
    UserRole,
)


logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(tags=["Google Calendar y reservas online"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3"
GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke"
GOOGLE_FREEBUSY_SCOPE = "https://www.googleapis.com/auth/calendar.freebusy"
GOOGLE_CALENDAR_LIST_SCOPE = "https://www.googleapis.com/auth/calendar.calendarlist.readonly"
GOOGLE_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events.owned"
BASE_GOOGLE_SCOPES = ("openid", "email", GOOGLE_FREEBUSY_SCOPE, GOOGLE_CALENDAR_LIST_SCOPE)
DAY_KEYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
SLOT_STEP_MINUTES = 15


class GoogleCalendarError(RuntimeError):
    pass


class GoogleCalendarEventMissing(GoogleCalendarError):
    pass


class CalendarConnectionUpdate(BaseModel):
    calendar_id: str | None = Field(default=None, min_length=1, max_length=1024)
    block_busy_times: bool | None = None
    push_klinia_appointments: bool | None = None
    import_busy_as_unavailable: bool | None = None
    auto_sync: bool | None = None


class OnlineBookingSettingsUpdate(BaseModel):
    enabled: bool = False
    slug: str | None = Field(default=None, max_length=180)
    min_notice_minutes: int = Field(default=120, ge=0, le=43_200)
    max_days_ahead: int = Field(default=90, ge=1, le=730)
    min_cancellation_minutes: int = Field(default=1440, ge=0, le=43_200)
    buffer_minutes: int = Field(default=0, ge=0, le=240)
    automatic_confirmation: bool = True
    allow_professional_selection: bool = True
    show_price: bool = False
    show_duration: bool = True
    service_ids: list[str] = Field(default_factory=list)
    practitioner_ids: list[str] = Field(default_factory=list)


class PublicBookingCreate(BaseModel):
    service_id: str = Field(min_length=1, max_length=36)
    practitioner_id: str = Field(min_length=1, max_length=36)
    booking_date: str = Field(min_length=10, max_length=10)
    start: str = Field(min_length=5, max_length=5)
    first_name: str = Field(min_length=2, max_length=120)
    last_name: str = Field(min_length=2, max_length=180)
    phone: str = Field(min_length=6, max_length=40)
    email: EmailStr
    notes: str | None = Field(default=None, max_length=2000)
    idempotency_key: str = Field(min_length=12, max_length=120)
    website: str | None = Field(default=None, max_length=200)

    @field_validator("booking_date")
    @classmethod
    def validate_booking_date(cls, value: str) -> str:
        try:
            date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError("La fecha no es válida.") from exc
        return value

    @field_validator("start")
    @classmethod
    def validate_start(cls, value: str) -> str:
        _time_to_minutes(value)
        return value


def _now_utc() -> datetime:
    return datetime.now(UTC)


def _as_aware_utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


def _clinic_timezone(clinic: Clinic) -> ZoneInfo:
    try:
        return ZoneInfo(clinic.timezone or "Europe/Madrid")
    except ZoneInfoNotFoundError:
        return ZoneInfo("Europe/Madrid")


def _time_to_minutes(value: str) -> int:
    try:
        hours, minutes = [int(part) for part in value.split(":", 1)]
    except (TypeError, ValueError) as exc:
        raise ValueError("Hora no válida") from exc
    if not (0 <= hours <= 23 and 0 <= minutes <= 59):
        raise ValueError("Hora no válida")
    return hours * 60 + minutes


def _minutes_to_time(value: int) -> str:
    value = max(0, min(24 * 60, value))
    return f"{value // 60:02d}:{value % 60:02d}"


def _overlaps(start: int, end: int, other_start: int, other_end: int) -> bool:
    return start < other_end and end > other_start


def _metadata(value: str | None) -> dict:
    try:
        parsed = json.loads(value or "{}")
        return parsed if isinstance(parsed, dict) else {}
    except (TypeError, ValueError):
        return {}


def _blob_list(db: Session, clinic_id: str, key: str) -> list[dict]:
    blob = db.scalar(
        select(ClinicDataBlob).where(
            ClinicDataBlob.clinic_id == clinic_id,
            ClinicDataBlob.key == key,
        )
    )
    if not blob:
        return []
    try:
        parsed = json.loads(blob.data_json or "[]")
    except (TypeError, ValueError):
        return []
    return [item for item in parsed if isinstance(item, dict)] if isinstance(parsed, list) else []


def _audit(
    db: Session,
    *,
    clinic_id: str | None,
    user_id: str | None,
    action: str,
    resource_type: str,
    resource_id: str | None,
    metadata: dict | None = None,
    request: Request | None = None,
    result: str = "success",
) -> None:
    db.add(
        AuditLog(
            clinic_id=clinic_id,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            result=result,
            origin="calendar-integration",
            ip_address=request.client.host if request and request.client else None,
            user_agent=request.headers.get("user-agent") if request else None,
            metadata_json=json.dumps(metadata or {}, ensure_ascii=True),
        )
    )


def _fernet() -> Fernet:
    raw_key = (settings.google_calendar_token_key or "").strip()
    if not raw_key:
        raise GoogleCalendarError("Falta la clave de cifrado de Google Calendar.")
    try:
        return Fernet(raw_key.encode("ascii"))
    except (ValueError, TypeError) as exc:
        raise GoogleCalendarError("La clave de cifrado de Google Calendar no es válida.") from exc


def _encrypt(value: str | None) -> str | None:
    if not value:
        return None
    return _fernet().encrypt(value.encode("utf-8")).decode("ascii")


def _decrypt(value: str | None) -> str | None:
    if not value:
        return None
    try:
        return _fernet().decrypt(value.encode("ascii")).decode("utf-8")
    except (InvalidToken, ValueError, TypeError) as exc:
        raise GoogleCalendarError("No se pudieron leer las credenciales de Google Calendar.") from exc


def _scope_set(connection: GoogleCalendarConnection | None) -> set[str]:
    return {scope for scope in (connection.granted_scopes or "").split() if scope} if connection else set()


def _calendar_configured() -> bool:
    return settings.google_calendar_enabled


def _connection_for_clinic(db: Session, clinic_id: str) -> GoogleCalendarConnection | None:
    return db.scalar(
        select(GoogleCalendarConnection).where(GoogleCalendarConnection.clinic_id == clinic_id)
    )


def _connection_or_404(db: Session, clinic_id: str) -> GoogleCalendarConnection:
    connection = _connection_for_clinic(db, clinic_id)
    if not connection or not connection.enabled:
        raise HTTPException(status_code=404, detail="Google Calendar no está conectado.")
    return connection


def _booking_setting(db: Session, clinic_id: str) -> OnlineBookingSetting | None:
    return db.scalar(select(OnlineBookingSetting).where(OnlineBookingSetting.clinic_id == clinic_id))


def _slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value or "")
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", ascii_value).strip("-")[:150] or "clinica"


def _unique_slug(db: Session, clinic: Clinic, requested: str | None, current_id: str | None = None) -> str:
    base = _slugify(requested or clinic.name)
    candidate = base
    suffix = clinic.id.replace("-", "")[:6]
    index = 1
    while True:
        existing = db.scalar(select(OnlineBookingSetting).where(OnlineBookingSetting.slug == candidate))
        if not existing or existing.id == current_id:
            return candidate
        candidate = f"{base}-{suffix}" if index == 1 else f"{base}-{suffix}-{index}"
        index += 1


def _clinic_accepts_public_bookings(clinic: Clinic) -> bool:
    current_status = (clinic.subscription_status or "trialing").lower()
    if current_status == "active":
        return True
    if current_status not in {"trial", "trialing"}:
        return False
    trial_end = _as_aware_utc(clinic.trial_ends_at)
    return trial_end is None or trial_end >= _now_utc()


def _public_booking_url(slug: str) -> str:
    base = settings.frontend_url.rstrip("/")
    return f"{base}/reservar/{slug}"


def _google_request(
    method: str,
    url: str,
    *,
    access_token: str | None = None,
    data: dict | None = None,
    json_body: dict | None = None,
    params: dict | None = None,
) -> dict:
    headers = {"Accept": "application/json"}
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    try:
        response = httpx.request(
            method,
            url,
            headers=headers,
            data=data,
            json=json_body,
            params=params,
            timeout=15.0,
        )
    except httpx.HTTPError as exc:
        raise GoogleCalendarError("No se pudo conectar con Google Calendar.") from exc
    if response.status_code == 404:
        raise GoogleCalendarEventMissing("El evento ya no existe en Google Calendar.")
    if response.status_code >= 400:
        body = response.text[:1200]
        raise GoogleCalendarError(f"Google Calendar respondió {response.status_code}: {body}")
    if not response.content:
        return {}
    try:
        return response.json()
    except ValueError as exc:
        raise GoogleCalendarError("Google Calendar devolvió una respuesta no válida.") from exc


def _access_token(db: Session, connection: GoogleCalendarConnection, *, force_refresh: bool = False) -> str:
    expires_at = _as_aware_utc(connection.token_expires_at)
    if not force_refresh and expires_at and expires_at > _now_utc() + timedelta(seconds=90):
        token = _decrypt(connection.access_token_encrypted)
        if token:
            return token
    refresh_token = _decrypt(connection.refresh_token_encrypted)
    if not refresh_token:
        raise GoogleCalendarError("La conexión con Google debe autorizarse de nuevo.")
    payload = {
        "client_id": settings.google_calendar_client_id,
        "client_secret": settings.google_calendar_client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }
    token_data = _google_request("POST", GOOGLE_TOKEN_URL, data=payload)
    token = token_data.get("access_token")
    if not token:
        raise GoogleCalendarError("Google no devolvió una credencial de acceso.")
    connection.access_token_encrypted = _encrypt(token)
    connection.token_expires_at = _now_utc() + timedelta(seconds=max(60, int(token_data.get("expires_in") or 3600)))
    db.flush()
    return token


def _calendar_list(db: Session, connection: GoogleCalendarConnection) -> list[dict]:
    token = _access_token(db, connection)
    data = _google_request(
        "GET",
        f"{GOOGLE_CALENDAR_API}/users/me/calendarList",
        access_token=token,
        params={"minAccessRole": "owner", "showHidden": "false", "maxResults": 250},
    )
    calendars = []
    for item in data.get("items") or []:
        calendar_id = str(item.get("id") or "")
        if not calendar_id:
            continue
        calendars.append(
            {
                "id": calendar_id,
                "name": str(item.get("summary") or "Calendario"),
                "primary": bool(item.get("primary")),
                "access_role": str(item.get("accessRole") or ""),
            }
        )
    return calendars


def _google_busy_ranges(
    db: Session,
    clinic: Clinic,
    connection: GoogleCalendarConnection,
    booking_date: date,
) -> list[tuple[int, int]]:
    timezone = _clinic_timezone(clinic)
    day_start = datetime.combine(booking_date, datetime.min.time(), tzinfo=timezone)
    day_end = day_start + timedelta(days=1)
    token = _access_token(db, connection)
    payload = {
        "timeMin": day_start.astimezone(UTC).isoformat().replace("+00:00", "Z"),
        "timeMax": day_end.astimezone(UTC).isoformat().replace("+00:00", "Z"),
        "timeZone": str(timezone),
        "items": [{"id": connection.calendar_id or "primary"}],
    }
    data = _google_request(
        "POST",
        f"{GOOGLE_CALENDAR_API}/freeBusy",
        access_token=token,
        json_body=payload,
    )
    calendars = data.get("calendars") or {}
    result = calendars.get(connection.calendar_id or "primary")
    if result is None and calendars:
        result = next(iter(calendars.values()))
    if not isinstance(result, dict) or result.get("errors"):
        raise GoogleCalendarError("No se pudo consultar la disponibilidad del calendario seleccionado.")
    ranges: list[tuple[int, int]] = []
    for item in result.get("busy") or []:
        try:
            start_dt = datetime.fromisoformat(str(item["start"]).replace("Z", "+00:00")).astimezone(timezone)
            end_dt = datetime.fromisoformat(str(item["end"]).replace("Z", "+00:00")).astimezone(timezone)
        except (KeyError, ValueError, TypeError):
            continue
        start_minute = max(0, math.floor((start_dt - day_start).total_seconds() / 60))
        end_minute = min(24 * 60, math.ceil((end_dt - day_start).total_seconds() / 60))
        if end_minute > start_minute:
            ranges.append((start_minute, end_minute))
    connection.last_synced_at = _now_utc()
    connection.last_error = None
    db.flush()
    return ranges


def _appointment_end(appointment: Appointment, services_by_id: dict[str, Service]) -> int:
    if appointment.end:
        return _time_to_minutes(appointment.end)
    service = services_by_id.get(appointment.service_id)
    return _time_to_minutes(appointment.start) + max(1, int(service.duration_minutes if service else 60))


def _practitioner_accepts_service(practitioner: Practitioner, service_id: str) -> bool:
    config = _metadata(practitioner.metadata_json).get("serviceCommissions")
    if not isinstance(config, dict) or not config:
        return True
    item = config.get(service_id)
    return bool(isinstance(item, dict) and item.get("enabled"))


def _group_occurrences(
    db: Session,
    clinic_id: str,
    booking_date: str,
    services_by_id: dict[str, Service],
) -> list[dict]:
    day_key = DAY_KEYS[date.fromisoformat(booking_date).weekday()]
    groups = _blob_list(db, clinic_id, "groups")
    overrides = {
        f"{item.get('groupId')}-{item.get('date')}": item
        for item in _blob_list(db, clinic_id, "group-session-overrides")
        if item.get("groupId") and item.get("date")
    }
    occurrences = []
    for group in groups:
        if group.get("active") is False:
            continue
        if day_key not in (group.get("days") or []):
            continue
        if group.get("dateFrom") and booking_date < str(group["dateFrom"]):
            continue
        if group.get("dateTo") and booking_date > str(group["dateTo"]):
            continue
        override = overrides.get(f"{group.get('id')}-{booking_date}") or {}
        start_value = str(override.get("start") or group.get("start") or "")
        practitioner_id = str(override.get("practitionerId") or group.get("practitionerId") or "")
        room_id = str(group.get("roomId") or "")
        service_id = str(group.get("serviceId") or "")
        if not start_value or not practitioner_id or not room_id:
            continue
        try:
            start_minute = _time_to_minutes(start_value)
        except ValueError:
            continue
        duration = max(1, int(services_by_id.get(service_id).duration_minutes if services_by_id.get(service_id) else 60))
        occurrences.append(
            {
                "practitioner_id": practitioner_id,
                "room_id": room_id,
                "start": start_minute,
                "end": start_minute + duration,
            }
        )
    return occurrences


def _availability_blocks(db: Session, clinic_id: str, practitioner_id: str, booking_date: str) -> list[tuple[int, int]]:
    ranges = []
    for block in _blob_list(db, clinic_id, "availability-blocks"):
        if str(block.get("practitionerId") or "") != practitioner_id:
            continue
        start_date = str(block.get("date") or "")
        end_date = str(block.get("endDate") or start_date)
        if not start_date or not (start_date <= booking_date <= end_date):
            continue
        if block.get("allDay", True):
            ranges.append((0, 24 * 60))
            continue
        try:
            ranges.append(
                (
                    _time_to_minutes(str(block.get("start") or "00:00")),
                    _time_to_minutes(str(block.get("end") or "23:59")),
                )
            )
        except ValueError:
            continue
    return ranges


def _practitioner_ranges(clinic: Clinic, practitioner: Practitioner, booking_date: date) -> list[tuple[int, int]]:
    working_days = {item.strip() for item in (clinic.working_days or "").split(",") if item.strip()}
    if DAY_KEYS[booking_date.weekday()] not in working_days:
        return []
    try:
        clinic_start = _time_to_minutes(clinic.opening_start or "09:00")
        clinic_end = _time_to_minutes(clinic.opening_end or "20:00")
    except ValueError:
        clinic_start, clinic_end = 9 * 60, 20 * 60
    raw_ranges = (
        (practitioner.availability_start, practitioner.availability_end),
        (practitioner.availability_start_2, practitioner.availability_end_2),
    )
    ranges = []
    for start_value, end_value in raw_ranges:
        if not start_value or not end_value:
            continue
        try:
            start_minute = max(clinic_start, _time_to_minutes(start_value))
            end_minute = min(clinic_end, _time_to_minutes(end_value))
        except ValueError:
            continue
        if end_minute > start_minute:
            ranges.append((start_minute, end_minute))
    return ranges


def _selected_service_ids(db: Session, setting: OnlineBookingSetting) -> list[str]:
    return list(
        db.scalars(
            select(OnlineBookingService.service_id).where(
                OnlineBookingService.clinic_id == setting.clinic_id,
                OnlineBookingService.settings_id == setting.id,
            )
        )
    )


def _selected_practitioner_ids(db: Session, setting: OnlineBookingSetting) -> list[str]:
    return list(
        db.scalars(
            select(OnlineBookingPractitioner.practitioner_id).where(
                OnlineBookingPractitioner.clinic_id == setting.clinic_id,
                OnlineBookingPractitioner.settings_id == setting.id,
            )
        )
    )


def _day_context(
    db: Session,
    clinic: Clinic,
    booking_date: str,
    *,
    connection: GoogleCalendarConnection | None,
) -> dict:
    services = list(db.scalars(select(Service).where(Service.clinic_id == clinic.id)))
    services_by_id = {item.id: item for item in services}
    appointments = list(
        db.scalars(
            select(Appointment).where(
                Appointment.clinic_id == clinic.id,
                Appointment.date == booking_date,
                Appointment.status != AppointmentStatus.cancelled,
            )
        )
    )
    rooms = list(
        db.scalars(
            select(Room).where(
                Room.clinic_id == clinic.id,
                Room.active.is_(True),
            )
        )
    )
    groups = _group_occurrences(db, clinic.id, booking_date, services_by_id)
    google_busy: list[tuple[int, int]] = []
    if connection and connection.enabled and connection.block_busy_times:
        try:
            google_busy = _google_busy_ranges(db, clinic, connection, date.fromisoformat(booking_date))
        except Exception as exc:
            connection.last_error = "No se pudo consultar la disponibilidad de Google Calendar."
            db.flush()
            logger.exception("Google Calendar free/busy failed for clinic=%s", clinic.id)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="No pudimos comprobar la disponibilidad completa. Inténtalo de nuevo.",
            ) from exc
    return {
        "services_by_id": services_by_id,
        "appointments": appointments,
        "rooms": rooms,
        "groups": groups,
        "google_busy": google_busy,
    }


def _room_is_free(
    room_id: str,
    start_minute: int,
    end_minute: int,
    context: dict,
    buffer_minutes: int,
) -> bool:
    services_by_id = context["services_by_id"]
    for appointment in context["appointments"]:
        if appointment.room_id != room_id:
            continue
        other_start = _time_to_minutes(appointment.start)
        other_end = _appointment_end(appointment, services_by_id)
        if _overlaps(start_minute, end_minute, other_start - buffer_minutes, other_end + buffer_minutes):
            return False
    for group in context["groups"]:
        if group["room_id"] == room_id and _overlaps(
            start_minute,
            end_minute,
            group["start"] - buffer_minutes,
            group["end"] + buffer_minutes,
        ):
            return False
    return True


def _select_room(
    practitioner: Practitioner,
    start_minute: int,
    end_minute: int,
    context: dict,
    buffer_minutes: int,
    *,
    patient_id: str | None = None,
) -> Room | None:
    services_by_id = context["services_by_id"]
    for blocked_start, blocked_end in context["google_busy"]:
        if _overlaps(start_minute, end_minute, blocked_start - buffer_minutes, blocked_end + buffer_minutes):
            return None
    for blocked_start, blocked_end in context.get("practitioner_blocks", {}).get(practitioner.id, []):
        if _overlaps(start_minute, end_minute, blocked_start, blocked_end):
            return None
    for appointment in context["appointments"]:
        same_practitioner = appointment.practitioner_id == practitioner.id
        same_patient = bool(patient_id and appointment.patient_id == patient_id)
        if not (same_practitioner or same_patient):
            continue
        other_start = _time_to_minutes(appointment.start)
        other_end = _appointment_end(appointment, services_by_id)
        if _overlaps(start_minute, end_minute, other_start - buffer_minutes, other_end + buffer_minutes):
            return None
    for group in context["groups"]:
        if group["practitioner_id"] == practitioner.id and _overlaps(
            start_minute,
            end_minute,
            group["start"] - buffer_minutes,
            group["end"] + buffer_minutes,
        ):
            return None
    for room in context["rooms"]:
        if _room_is_free(room.id, start_minute, end_minute, context, buffer_minutes):
            return room
    return None


def _availability_candidates(
    db: Session,
    *,
    clinic: Clinic,
    setting: OnlineBookingSetting,
    service: Service,
    booking_date: str,
    practitioner_id: str | None = None,
    patient_id: str | None = None,
) -> list[dict]:
    selected_practitioners = set(_selected_practitioner_ids(db, setting))
    query = select(Practitioner).where(
        Practitioner.clinic_id == clinic.id,
        Practitioner.active.is_(True),
        Practitioner.id.in_(selected_practitioners),
    )
    if practitioner_id:
        query = query.where(Practitioner.id == practitioner_id)
    practitioners = list(db.scalars(query.order_by(Practitioner.name)))
    practitioners = [item for item in practitioners if _practitioner_accepts_service(item, service.id)]
    connection = _connection_for_clinic(db, clinic.id)
    context = _day_context(db, clinic, booking_date, connection=connection)
    context["practitioner_blocks"] = {
        item.id: _availability_blocks(db, clinic.id, item.id, booking_date)
        for item in practitioners
    }
    booking_day = date.fromisoformat(booking_date)
    timezone = _clinic_timezone(clinic)
    now_local = _now_utc().astimezone(timezone)
    earliest = now_local + timedelta(minutes=setting.min_notice_minutes)
    latest_day = now_local.date() + timedelta(days=setting.max_days_ahead)
    if booking_day < now_local.date() or booking_day > latest_day:
        return []
    duration = max(1, int(service.duration_minutes or 60))
    candidates = []
    for practitioner in practitioners:
        for range_start, range_end in _practitioner_ranges(clinic, practitioner, booking_day):
            first_start = int(math.ceil(range_start / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES)
            for start_minute in range(first_start, range_end - duration + 1, SLOT_STEP_MINUTES):
                end_minute = start_minute + duration
                start_dt = datetime.combine(
                    booking_day,
                    datetime.min.time(),
                    tzinfo=timezone,
                ) + timedelta(minutes=start_minute)
                if start_dt < earliest:
                    continue
                room = _select_room(
                    practitioner,
                    start_minute,
                    end_minute,
                    context,
                    setting.buffer_minutes,
                    patient_id=patient_id,
                )
                if not room:
                    continue
                candidates.append(
                    {
                        "start": _minutes_to_time(start_minute),
                        "end": _minutes_to_time(end_minute),
                        "practitioner_id": practitioner.id,
                        "practitioner_name": practitioner.name if setting.allow_professional_selection else None,
                        "room_id": room.id,
                    }
                )
    candidates.sort(key=lambda item: (item["start"], item["practitioner_name"] or "", item["practitioner_id"]))
    if setting.allow_professional_selection:
        return candidates
    first_by_time: dict[str, dict] = {}
    for candidate in candidates:
        first_by_time.setdefault(candidate["start"], candidate)
    return list(first_by_time.values())


def _connection_payload(connection: GoogleCalendarConnection | None) -> dict:
    connected = bool(connection and connection.enabled and connection.refresh_token_encrypted)
    return {
        "configured": _calendar_configured(),
        "connected": connected,
        "account_email": connection.account_email if connected else None,
        "calendar_id": connection.calendar_id if connected else "primary",
        "last_synced_at": connection.last_synced_at.isoformat() if connected and connection.last_synced_at else None,
        "block_busy_times": connection.block_busy_times if connection else True,
        "push_klinia_appointments": connection.push_klinia_appointments if connection else False,
        "import_busy_as_unavailable": connection.import_busy_as_unavailable if connection else True,
        "auto_sync": connection.auto_sync if connection else True,
        "write_authorized": GOOGLE_EVENTS_SCOPE in _scope_set(connection),
        "sync_state": "error" if connection and connection.last_error else ("connected" if connected else "disconnected"),
    }


def _booking_payload(db: Session, clinic: Clinic, setting: OnlineBookingSetting | None) -> dict:
    if not setting:
        slug = _slugify(clinic.name)
        return {
            "enabled": False,
            "slug": slug,
            "public_url": _public_booking_url(slug),
            "min_notice_minutes": 120,
            "max_days_ahead": 90,
            "min_cancellation_minutes": 1440,
            "buffer_minutes": 0,
            "automatic_confirmation": True,
            "allow_professional_selection": True,
            "show_price": False,
            "show_duration": True,
            "service_ids": [],
            "practitioner_ids": [],
        }
    return {
        "enabled": setting.enabled,
        "slug": setting.slug,
        "public_url": _public_booking_url(setting.slug),
        "min_notice_minutes": setting.min_notice_minutes,
        "max_days_ahead": setting.max_days_ahead,
        "min_cancellation_minutes": setting.min_cancellation_minutes,
        "buffer_minutes": setting.buffer_minutes,
        "automatic_confirmation": setting.automatic_confirmation,
        "allow_professional_selection": setting.allow_professional_selection,
        "show_price": setting.show_price,
        "show_duration": setting.show_duration,
        "service_ids": _selected_service_ids(db, setting),
        "practitioner_ids": _selected_practitioner_ids(db, setting),
    }


def _integration_payload(db: Session, clinic: Clinic) -> dict:
    connection = _connection_for_clinic(db, clinic.id)
    setting = _booking_setting(db, clinic.id)
    available_services = [
        {
            "id": item.id,
            "name": item.name,
            "duration_minutes": item.duration_minutes,
            "price_cents": item.price_cents,
        }
        for item in db.scalars(
            select(Service)
            .where(Service.clinic_id == clinic.id, Service.active.is_(True))
            .order_by(Service.name)
        )
    ]
    available_practitioners = [
        {"id": item.id, "name": item.name, "specialty": item.specialty}
        for item in db.scalars(
            select(Practitioner)
            .where(Practitioner.clinic_id == clinic.id, Practitioner.active.is_(True))
            .order_by(Practitioner.name)
        )
    ]
    return {
        "calendar": _connection_payload(connection),
        "booking": _booking_payload(db, clinic, setting),
        "available_services": available_services,
        "available_practitioners": available_practitioners,
    }


def _event_body(clinic: Clinic, appointment: Appointment) -> dict:
    timezone = _clinic_timezone(clinic)
    booking_day = date.fromisoformat(appointment.date)
    start_minute = _time_to_minutes(appointment.start)
    end_minute = _time_to_minutes(appointment.end)
    start_dt = datetime.combine(booking_day, datetime.min.time(), tzinfo=timezone) + timedelta(minutes=start_minute)
    end_dt = datetime.combine(booking_day, datetime.min.time(), tzinfo=timezone) + timedelta(minutes=end_minute)
    return {
        "summary": "Klinia - Cita",
        "description": "Gestionada desde Klinia.",
        "visibility": "private",
        "transparency": "opaque",
        "start": {"dateTime": start_dt.isoformat(), "timeZone": str(timezone)},
        "end": {"dateTime": end_dt.isoformat(), "timeZone": str(timezone)},
        "extendedProperties": {
            "private": {
                "kliniaAppointmentId": appointment.id,
                "kliniaClinicId": appointment.clinic_id,
            }
        },
    }


def _sync_row(db: Session, appointment: Appointment) -> AppointmentGoogleSync:
    row = db.scalar(
        select(AppointmentGoogleSync).where(
            AppointmentGoogleSync.appointment_id == appointment.id,
            AppointmentGoogleSync.clinic_id == appointment.clinic_id,
        )
    )
    if row:
        return row
    metadata = _metadata(appointment.metadata_json)
    row = AppointmentGoogleSync(
        clinic_id=appointment.clinic_id,
        appointment_id=appointment.id,
        sync_status="pending",
        booking_source=str(metadata.get("source") or metadata.get("bookingSource") or "manual"),
    )
    db.add(row)
    db.flush()
    return row


def _delete_google_event(
    db: Session,
    connection: GoogleCalendarConnection,
    row: AppointmentGoogleSync,
) -> None:
    if not row.google_event_id:
        row.sync_status = "synced"
        row.sync_error = None
        row.last_synced_at = _now_utc()
        return
    token = _access_token(db, connection)
    try:
        _google_request(
            "DELETE",
            f"{GOOGLE_CALENDAR_API}/calendars/{quote(connection.calendar_id, safe='')}/events/{quote(row.google_event_id, safe='')}",
            access_token=token,
        )
    except GoogleCalendarEventMissing:
        pass
    row.google_event_id = None
    row.calendar_id = connection.calendar_id
    row.sync_status = "synced"
    row.sync_error = None
    row.last_synced_at = _now_utc()


def sync_appointment_to_google(
    db: Session,
    appointment: Appointment,
    *,
    force: bool = False,
) -> AppointmentGoogleSync | None:
    connection = _connection_for_clinic(db, appointment.clinic_id)
    existing = db.scalar(
        select(AppointmentGoogleSync).where(
            AppointmentGoogleSync.appointment_id == appointment.id,
            AppointmentGoogleSync.clinic_id == appointment.clinic_id,
        )
    )
    if not connection or not connection.enabled:
        if existing:
            existing.sync_status = "disconnected"
            existing.sync_error = None
        return existing
    if not connection.push_klinia_appointments:
        return existing
    row = existing or _sync_row(db, appointment)
    row.calendar_id = connection.calendar_id
    if not connection.auto_sync and not force:
        row.sync_status = "pending"
        row.sync_error = None
        return row
    clinic = db.get(Clinic, appointment.clinic_id)
    if not clinic:
        return row
    try:
        if appointment.status == AppointmentStatus.cancelled:
            _delete_google_event(db, connection, row)
            return row
        token = _access_token(db, connection)
        event_body = _event_body(clinic, appointment)
        if force and row.sync_status == "error":
            row.google_event_id = None
        if row.google_event_id:
            event = _google_request(
                "PATCH",
                f"{GOOGLE_CALENDAR_API}/calendars/{quote(connection.calendar_id, safe='')}/events/{quote(row.google_event_id, safe='')}",
                access_token=token,
                json_body=event_body,
            )
        else:
            event = _google_request(
                "POST",
                f"{GOOGLE_CALENDAR_API}/calendars/{quote(connection.calendar_id, safe='')}/events",
                access_token=token,
                json_body=event_body,
            )
        row.google_event_id = str(event.get("id") or row.google_event_id or "")
        row.sync_status = "synced"
        row.sync_error = None
        row.last_synced_at = _now_utc()
        connection.last_synced_at = row.last_synced_at
        connection.last_error = None
    except Exception as exc:
        logger.exception(
            "Klinia appointment Google sync failed clinic=%s appointment=%s",
            appointment.clinic_id,
            appointment.id,
        )
        row.sync_status = "error"
        row.sync_error = str(exc)[:1200]
        connection.last_error = "No se pudo sincronizar una cita con Google Calendar."
    db.flush()
    return row


def remove_appointment_from_google(db: Session, appointment: Appointment) -> None:
    connection = _connection_for_clinic(db, appointment.clinic_id)
    row = db.scalar(
        select(AppointmentGoogleSync).where(
            AppointmentGoogleSync.appointment_id == appointment.id,
            AppointmentGoogleSync.clinic_id == appointment.clinic_id,
        )
    )
    if not row:
        return
    if not connection or not connection.enabled:
        row.sync_status = "disconnected"
        return
    try:
        _delete_google_event(db, connection, row)
    except Exception as exc:
        logger.exception(
            "Klinia appointment Google deletion failed clinic=%s appointment=%s",
            appointment.clinic_id,
            appointment.id,
        )
        row.sync_status = "error"
        row.sync_error = str(exc)[:1200]
        connection.last_error = "No se pudo retirar una cita de Google Calendar."
    db.flush()


@router.get("/integrations/google-calendar")
def get_google_calendar_integration(
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    clinic = db.get(Clinic, user.clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clínica no encontrada.")
    return _integration_payload(db, clinic)


@router.get("/integrations/google-calendar/oauth/start")
def start_google_calendar_oauth(
    include_write: bool = Query(default=False),
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    if not _calendar_configured():
        raise HTTPException(status_code=503, detail="La conexión con Google Calendar no está disponible ahora.")
    raw_state = secrets.token_urlsafe(40)
    state = GoogleCalendarOAuthState(
        nonce_hash=hashlib.sha256(raw_state.encode("utf-8")).hexdigest(),
        clinic_id=user.clinic_id,
        user_id=user.id,
        include_write=include_write,
        expires_at=_now_utc() + timedelta(minutes=10),
    )
    db.add(state)
    db.commit()
    scopes = list(BASE_GOOGLE_SCOPES)
    if include_write:
        scopes.append(GOOGLE_EVENTS_SCOPE)
    authorization_url = f"{GOOGLE_AUTH_URL}?{urlencode({
        'client_id': settings.google_calendar_client_id,
        'redirect_uri': settings.google_calendar_redirect_uri,
        'response_type': 'code',
        'scope': ' '.join(scopes),
        'access_type': 'offline',
        'include_granted_scopes': 'true',
        'prompt': 'consent',
        'state': raw_state,
    })}"
    return {"authorization_url": authorization_url}


def _oauth_frontend_redirect(result: str) -> RedirectResponse:
    base = settings.frontend_url.rstrip("/")
    return RedirectResponse(f"{base}/?calendar_integration={quote(result, safe='')}#configuracion", status_code=302)


@router.get("/integrations/google-calendar/oauth/callback", include_in_schema=False)
def google_calendar_oauth_callback(
    state: str | None = None,
    code: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
) -> RedirectResponse:
    if error or not state or not code:
        logger.warning("Google Calendar OAuth callback rejected error=%s", error or "missing_parameters")
        return _oauth_frontend_redirect("cancelled")
    state_row = db.scalar(
        select(GoogleCalendarOAuthState).where(
            GoogleCalendarOAuthState.nonce_hash == hashlib.sha256(state.encode("utf-8")).hexdigest()
        )
    )
    if (
        not state_row
        or state_row.used_at is not None
        or (_as_aware_utc(state_row.expires_at) or _now_utc()) < _now_utc()
    ):
        logger.warning("Google Calendar OAuth callback has invalid or expired state")
        return _oauth_frontend_redirect("invalid")
    state_row.used_at = _now_utc()
    user = db.get(User, state_row.user_id)
    clinic = db.get(Clinic, state_row.clinic_id)
    if not user or not user.active or not clinic or user.clinic_id != clinic.id:
        db.commit()
        return _oauth_frontend_redirect("invalid")
    try:
        token_data = _google_request(
            "POST",
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.google_calendar_client_id,
                "client_secret": settings.google_calendar_client_secret,
                "code": code,
                "redirect_uri": settings.google_calendar_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        access_token = str(token_data.get("access_token") or "")
        if not access_token:
            raise GoogleCalendarError("Google no devolvió una credencial de acceso.")
        profile = _google_request("GET", GOOGLE_USERINFO_URL, access_token=access_token)
        connection = _connection_for_clinic(db, clinic.id)
        previous_refresh = _decrypt(connection.refresh_token_encrypted) if connection else None
        refresh_token = str(token_data.get("refresh_token") or previous_refresh or "")
        if not refresh_token:
            raise GoogleCalendarError("Google no devolvió permiso de acceso sin conexión.")
        if not connection:
            connection = GoogleCalendarConnection(clinic_id=clinic.id)
            db.add(connection)
        connection.user_id = user.id
        connection.account_email = str(profile.get("email") or user.email)
        connection.calendar_id = connection.calendar_id or "primary"
        connection.access_token_encrypted = _encrypt(access_token)
        connection.refresh_token_encrypted = _encrypt(refresh_token)
        connection.token_expires_at = _now_utc() + timedelta(seconds=max(60, int(token_data.get("expires_in") or 3600)))
        connection.granted_scopes = str(token_data.get("scope") or " ".join(BASE_GOOGLE_SCOPES + ((GOOGLE_EVENTS_SCOPE,) if state_row.include_write else ())))
        connection.enabled = True
        connection.last_error = None
        connection.last_synced_at = _now_utc()
        db.flush()
        _audit(
            db,
            clinic_id=clinic.id,
            user_id=user.id,
            action="connect-google-calendar",
            resource_type="google-calendar-connection",
            resource_id=connection.id,
            metadata={"write_authorized": GOOGLE_EVENTS_SCOPE in _scope_set(connection)},
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Google Calendar OAuth callback failed clinic=%s", state_row.clinic_id)
        return _oauth_frontend_redirect("error")
    return _oauth_frontend_redirect("connected")


@router.get("/integrations/google-calendar/calendars")
def list_google_calendars(
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    connection = _connection_or_404(db, user.clinic_id)
    try:
        calendars = _calendar_list(db, connection)
        connection.last_error = None
        db.commit()
        return {"items": calendars}
    except Exception as exc:
        db.rollback()
        logger.exception("Google Calendar list failed clinic=%s", user.clinic_id)
        raise HTTPException(status_code=502, detail="No se pudieron cargar los calendarios de Google.") from exc


@router.patch("/integrations/google-calendar")
def update_google_calendar_integration(
    payload: CalendarConnectionUpdate,
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    connection = _connection_or_404(db, user.clinic_id)
    data = payload.model_dump(exclude_unset=True)
    if data.get("push_klinia_appointments") and GOOGLE_EVENTS_SCOPE not in _scope_set(connection):
        raise HTTPException(
            status_code=409,
            detail="Autoriza el permiso de sincronización antes de activar esta opción.",
        )
    for field_name, value in data.items():
        setattr(connection, field_name, value)
    connection.last_error = None
    _audit(
        db,
        clinic_id=user.clinic_id,
        user_id=user.id,
        action="update-google-calendar-settings",
        resource_type="google-calendar-connection",
        resource_id=connection.id,
        metadata={"fields": sorted(data.keys())},
    )
    db.commit()
    clinic = db.get(Clinic, user.clinic_id)
    return _integration_payload(db, clinic)


@router.post("/integrations/google-calendar/disconnect")
def disconnect_google_calendar(
    request: Request,
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    connection = _connection_or_404(db, user.clinic_id)
    token = _decrypt(connection.refresh_token_encrypted) or _decrypt(connection.access_token_encrypted)
    if token:
        try:
            httpx.post(GOOGLE_REVOKE_URL, params={"token": token}, timeout=10.0)
        except httpx.HTTPError:
            logger.exception("Google token revoke failed clinic=%s", user.clinic_id)
    connection.enabled = False
    connection.access_token_encrypted = None
    connection.refresh_token_encrypted = None
    connection.token_expires_at = None
    connection.last_error = None
    for row in db.scalars(
        select(AppointmentGoogleSync).where(AppointmentGoogleSync.clinic_id == user.clinic_id)
    ):
        row.sync_status = "disconnected"
        row.sync_error = None
    _audit(
        db,
        clinic_id=user.clinic_id,
        user_id=user.id,
        action="disconnect-google-calendar",
        resource_type="google-calendar-connection",
        resource_id=connection.id,
        request=request,
    )
    db.commit()
    clinic = db.get(Clinic, user.clinic_id)
    return _integration_payload(db, clinic)


@router.post("/integrations/google-calendar/sync")
def synchronize_google_calendar_now(
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    connection = _connection_or_404(db, user.clinic_id)
    clinic = db.get(Clinic, user.clinic_id)
    try:
        _google_busy_ranges(db, clinic, connection, _now_utc().astimezone(_clinic_timezone(clinic)).date())
        synchronized = 0
        failed = 0
        if connection.push_klinia_appointments:
            appointments = list(
                db.scalars(
                    select(Appointment)
                    .where(
                        Appointment.clinic_id == user.clinic_id,
                        Appointment.date >= (_now_utc().date() - timedelta(days=1)).isoformat(),
                    )
                    .order_by(Appointment.date, Appointment.start)
                    .limit(1000)
                )
            )
            for appointment in appointments:
                row = sync_appointment_to_google(db, appointment, force=True)
                if row and row.sync_status == "synced":
                    synchronized += 1
                elif row and row.sync_status == "error":
                    failed += 1
        connection.last_synced_at = _now_utc()
        connection.last_error = None if not failed else "Algunas citas no pudieron sincronizarse."
        _audit(
            db,
            clinic_id=user.clinic_id,
            user_id=user.id,
            action="sync-google-calendar",
            resource_type="google-calendar-connection",
            resource_id=connection.id,
            metadata={"synchronized": synchronized, "failed": failed},
        )
        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        logger.exception("Google Calendar manual sync failed clinic=%s", user.clinic_id)
        raise HTTPException(status_code=502, detail="No se pudo completar la sincronización con Google Calendar.") from exc
    return {"ok": True, "synchronized": synchronized, "failed": failed, "last_synced_at": connection.last_synced_at}


@router.put("/integrations/online-booking")
def update_online_booking_settings(
    payload: OnlineBookingSettingsUpdate,
    user: User = Depends(require_subscribed_roles(UserRole.owner)),
    db: Session = Depends(get_db),
) -> dict:
    clinic = db.get(Clinic, user.clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clínica no encontrada.")
    service_ids = list(dict.fromkeys(payload.service_ids))
    practitioner_ids = list(dict.fromkeys(payload.practitioner_ids))
    valid_services = set(
        db.scalars(
            select(Service.id).where(
                Service.clinic_id == user.clinic_id,
                Service.active.is_(True),
                Service.id.in_(service_ids),
            )
        )
    ) if service_ids else set()
    valid_practitioners = set(
        db.scalars(
            select(Practitioner.id).where(
                Practitioner.clinic_id == user.clinic_id,
                Practitioner.active.is_(True),
                Practitioner.id.in_(practitioner_ids),
            )
        )
    ) if practitioner_ids else set()
    if len(valid_services) != len(service_ids) or len(valid_practitioners) != len(practitioner_ids):
        raise HTTPException(status_code=422, detail="Revisa los servicios y profesionales seleccionados.")
    if payload.enabled and (not valid_services or not valid_practitioners):
        raise HTTPException(
            status_code=422,
            detail="Selecciona al menos un servicio y un profesional antes de activar las reservas.",
        )
    setting = _booking_setting(db, user.clinic_id)
    if not setting:
        setting = OnlineBookingSetting(
            clinic_id=user.clinic_id,
            slug=_unique_slug(db, clinic, payload.slug),
        )
        db.add(setting)
        db.flush()
    setting.enabled = payload.enabled
    setting.slug = _unique_slug(db, clinic, payload.slug, setting.id)
    setting.min_notice_minutes = payload.min_notice_minutes
    setting.max_days_ahead = payload.max_days_ahead
    setting.min_cancellation_minutes = payload.min_cancellation_minutes
    setting.buffer_minutes = payload.buffer_minutes
    setting.automatic_confirmation = payload.automatic_confirmation
    setting.allow_professional_selection = payload.allow_professional_selection
    setting.show_price = payload.show_price
    setting.show_duration = payload.show_duration
    for item in list(
        db.scalars(
            select(OnlineBookingService).where(
                OnlineBookingService.clinic_id == user.clinic_id,
                OnlineBookingService.settings_id == setting.id,
            )
        )
    ):
        db.delete(item)
    for item in list(
        db.scalars(
            select(OnlineBookingPractitioner).where(
                OnlineBookingPractitioner.clinic_id == user.clinic_id,
                OnlineBookingPractitioner.settings_id == setting.id,
            )
        )
    ):
        db.delete(item)
    db.flush()
    for service_id in valid_services:
        db.add(
            OnlineBookingService(
                clinic_id=user.clinic_id,
                settings_id=setting.id,
                service_id=service_id,
            )
        )
    for practitioner_id in valid_practitioners:
        db.add(
            OnlineBookingPractitioner(
                clinic_id=user.clinic_id,
                settings_id=setting.id,
                practitioner_id=practitioner_id,
            )
        )
    _audit(
        db,
        clinic_id=user.clinic_id,
        user_id=user.id,
        action="update-online-booking-settings",
        resource_type="online-booking-setting",
        resource_id=setting.id,
        metadata={
            "enabled": setting.enabled,
            "services": len(valid_services),
            "practitioners": len(valid_practitioners),
        },
    )
    db.commit()
    return _integration_payload(db, clinic)


def _public_setting_or_404(db: Session, slug: str) -> tuple[Clinic, OnlineBookingSetting]:
    setting = db.scalar(
        select(OnlineBookingSetting).where(
            OnlineBookingSetting.slug == slug,
            OnlineBookingSetting.enabled.is_(True),
        )
    )
    if not setting:
        raise HTTPException(status_code=404, detail="Este enlace de reservas no está activo.")
    clinic = db.get(Clinic, setting.clinic_id)
    if not clinic or not _clinic_accepts_public_bookings(clinic):
        raise HTTPException(status_code=404, detail="Este enlace de reservas no está activo.")
    return clinic, setting


@router.get("/public/bookings/{slug}")
def get_public_booking_page(slug: str, db: Session = Depends(get_db)) -> dict:
    clinic, setting = _public_setting_or_404(db, slug)
    selected_service_ids = set(_selected_service_ids(db, setting))
    selected_practitioner_ids = set(_selected_practitioner_ids(db, setting))
    services = [
        {
            "id": item.id,
            "name": item.name,
            "duration_minutes": item.duration_minutes if setting.show_duration else None,
            "price_cents": item.price_cents if setting.show_price else None,
        }
        for item in db.scalars(
            select(Service)
            .where(
                Service.clinic_id == clinic.id,
                Service.active.is_(True),
                Service.id.in_(selected_service_ids),
            )
            .order_by(Service.name)
        )
    ]
    practitioners = []
    if setting.allow_professional_selection:
        practitioners = [
            {"id": item.id, "name": item.name, "specialty": item.specialty}
            for item in db.scalars(
                select(Practitioner)
                .where(
                    Practitioner.clinic_id == clinic.id,
                    Practitioner.active.is_(True),
                    Practitioner.id.in_(selected_practitioner_ids),
                )
                .order_by(Practitioner.name)
            )
        ]
    return {
        "clinic": {"name": clinic.name, "timezone": clinic.timezone},
        "settings": {
            "min_notice_minutes": setting.min_notice_minutes,
            "max_days_ahead": setting.max_days_ahead,
            "allow_professional_selection": setting.allow_professional_selection,
            "show_price": setting.show_price,
            "show_duration": setting.show_duration,
            "automatic_confirmation": setting.automatic_confirmation,
        },
        "services": services,
        "practitioners": practitioners,
    }


@router.get("/public/bookings/{slug}/availability")
def get_public_booking_availability(
    slug: str,
    service_id: str,
    booking_date: str,
    practitioner_id: str | None = None,
    db: Session = Depends(get_db),
) -> dict:
    clinic, setting = _public_setting_or_404(db, slug)
    try:
        parsed_date = date.fromisoformat(booking_date)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="La fecha no es válida.") from exc
    selected_service_ids = set(_selected_service_ids(db, setting))
    if service_id not in selected_service_ids:
        raise HTTPException(status_code=404, detail="Servicio no disponible para reserva online.")
    if practitioner_id and practitioner_id not in set(_selected_practitioner_ids(db, setting)):
        raise HTTPException(status_code=404, detail="Profesional no disponible para reserva online.")
    if setting.allow_professional_selection and not practitioner_id:
        raise HTTPException(status_code=422, detail="Selecciona un profesional.")
    service = db.scalar(
        select(Service).where(
            Service.id == service_id,
            Service.clinic_id == clinic.id,
            Service.active.is_(True),
        )
    )
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no disponible para reserva online.")
    slots = _availability_candidates(
        db,
        clinic=clinic,
        setting=setting,
        service=service,
        booking_date=parsed_date.isoformat(),
        practitioner_id=practitioner_id,
    )
    db.commit()
    return {
        "date": parsed_date.isoformat(),
        "timezone": clinic.timezone,
        "slots": [
            {
                "start": item["start"],
                "end": item["end"],
                "practitioner_id": item["practitioner_id"],
                "practitioner_name": item["practitioner_name"],
            }
            for item in slots
        ],
    }


def _normalize_name(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value or "")
    return re.sub(r"\s+", " ", normalized.encode("ascii", "ignore").decode("ascii").lower()).strip()


def _normalize_phone(value: str | None) -> str:
    return re.sub(r"\D+", "", value or "")


def _matching_patient(
    db: Session,
    clinic_id: str,
    full_name: str,
    email: str,
    phone: str,
) -> Patient | None:
    normalized_name = _normalize_name(full_name)
    normalized_email = email.strip().lower()
    normalized_phone = _normalize_phone(phone)
    matches = []
    for patient in db.scalars(select(Patient).where(Patient.clinic_id == clinic_id)):
        if _normalize_name(patient.name) != normalized_name:
            continue
        same_email = bool(patient.email and patient.email.strip().lower() == normalized_email)
        same_phone = bool(patient.phone and _normalize_phone(patient.phone) == normalized_phone)
        if same_email or same_phone:
            matches.append(patient)
    return matches[0] if len(matches) == 1 else None


def _booking_lock(db: Session, clinic_id: str, booking_date: str) -> None:
    bind = db.get_bind()
    if bind.dialect.name != "postgresql":
        return
    digest = hashlib.sha256(f"{clinic_id}:{booking_date}".encode("utf-8")).digest()
    lock_key = int.from_bytes(digest[:8], byteorder="big", signed=True)
    db.execute(text("SELECT pg_advisory_xact_lock(:lock_key)"), {"lock_key": lock_key})


def _booking_result(db: Session, booking: OnlineBooking) -> dict:
    appointment = db.get(Appointment, booking.appointment_id)
    service = db.get(Service, appointment.service_id)
    practitioner = db.get(Practitioner, appointment.practitioner_id)
    clinic = db.get(Clinic, booking.clinic_id)
    return {
        "booking_id": booking.booking_code,
        "status": booking.status,
        "clinic": clinic.name if clinic else "",
        "service": service.name if service else "",
        "professional": practitioner.name if practitioner else "",
        "date": appointment.date,
        "start": appointment.start,
        "end": appointment.end,
        "appointment_id": appointment.id,
    }


@router.post("/public/bookings/{slug}", status_code=status.HTTP_201_CREATED)
def create_public_booking(
    slug: str,
    payload: PublicBookingCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    if payload.website:
        raise HTTPException(status_code=400, detail="No se pudo completar la reserva.")
    clinic, setting = _public_setting_or_404(db, slug)
    existing = db.scalar(
        select(OnlineBooking).where(
            OnlineBooking.clinic_id == clinic.id,
            OnlineBooking.idempotency_key == payload.idempotency_key,
        )
    )
    if existing:
        return _booking_result(db, existing)
    _booking_lock(db, clinic.id, payload.booking_date)
    existing = db.scalar(
        select(OnlineBooking).where(
            OnlineBooking.clinic_id == clinic.id,
            OnlineBooking.idempotency_key == payload.idempotency_key,
        )
    )
    if existing:
        return _booking_result(db, existing)
    selected_service_ids = set(_selected_service_ids(db, setting))
    selected_practitioner_ids = set(_selected_practitioner_ids(db, setting))
    if payload.service_id not in selected_service_ids or payload.practitioner_id not in selected_practitioner_ids:
        raise HTTPException(status_code=409, detail="Este horario acaba de dejar de estar disponible. Elige otro hueco.")
    service = db.scalar(
        select(Service).where(
            Service.id == payload.service_id,
            Service.clinic_id == clinic.id,
            Service.active.is_(True),
        )
    )
    practitioner = db.scalar(
        select(Practitioner).where(
            Practitioner.id == payload.practitioner_id,
            Practitioner.clinic_id == clinic.id,
            Practitioner.active.is_(True),
        )
    )
    if not service or not practitioner or not _practitioner_accepts_service(practitioner, service.id):
        raise HTTPException(status_code=409, detail="Este horario acaba de dejar de estar disponible. Elige otro hueco.")
    full_name = f"{payload.first_name.strip()} {payload.last_name.strip()}".strip()
    patient = _matching_patient(db, clinic.id, full_name, str(payload.email), payload.phone)
    patient_id = patient.id if patient else None
    candidates = _availability_candidates(
        db,
        clinic=clinic,
        setting=setting,
        service=service,
        booking_date=payload.booking_date,
        practitioner_id=practitioner.id,
        patient_id=patient_id,
    )
    selected_slot = next(
        (
            item
            for item in candidates
            if item["start"] == payload.start and item["practitioner_id"] == practitioner.id
        ),
        None,
    )
    if not selected_slot:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este horario acaba de dejar de estar disponible. Elige otro hueco.",
        )
    if not patient:
        patient = Patient(
            clinic_id=clinic.id,
            name=full_name,
            phone=payload.phone.strip(),
            email=str(payload.email).strip().lower(),
            status="Activo",
            metadata_json=json.dumps({"source": "online_booking"}, ensure_ascii=True),
        )
        db.add(patient)
        db.flush()
    booking_code = f"KB-{_now_utc().strftime('%Y%m%d')}-{secrets.token_hex(4).upper()}"
    appointment_status = AppointmentStatus.confirmed if setting.automatic_confirmation else AppointmentStatus.pending
    metadata_json = json.dumps(
        {
            "source": "online_booking",
            "bookingSource": "online_booking",
            "bookingId": booking_code,
        },
        ensure_ascii=True,
    )
    appointment = Appointment(
        clinic_id=clinic.id,
        patient_id=patient.id,
        practitioner_id=practitioner.id,
        room_id=selected_slot["room_id"],
        service_id=service.id,
        date=payload.booking_date,
        start=selected_slot["start"],
        end=selected_slot["end"],
        status=appointment_status,
        internal_notes=payload.notes.strip() if payload.notes else None,
        metadata_json=metadata_json,
    )
    db.add(appointment)
    db.flush()
    booking = OnlineBooking(
        clinic_id=clinic.id,
        appointment_id=appointment.id,
        patient_id=patient.id,
        booking_code=booking_code,
        idempotency_key=payload.idempotency_key,
        source="online_booking",
        status=appointment_status.value,
    )
    db.add(booking)
    db.flush()
    sync_appointment_to_google(db, appointment)
    _audit(
        db,
        clinic_id=clinic.id,
        user_id=None,
        action="create-online-booking",
        resource_type="appointment",
        resource_id=appointment.id,
        metadata={
            "booking_id": booking.booking_code,
            "service_id": service.id,
            "practitioner_id": practitioner.id,
        },
        request=request,
    )
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        existing = db.scalar(
            select(OnlineBooking).where(
                OnlineBooking.clinic_id == clinic.id,
                OnlineBooking.idempotency_key == payload.idempotency_key,
            )
        )
        if existing:
            return _booking_result(db, existing)
        logger.exception("Online booking integrity error clinic=%s", clinic.id)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este horario acaba de dejar de estar disponible. Elige otro hueco.",
        ) from exc
    db.refresh(booking)
    return _booking_result(db, booking)
