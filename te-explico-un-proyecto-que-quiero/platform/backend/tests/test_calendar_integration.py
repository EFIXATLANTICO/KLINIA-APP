import unittest
import httpx
from unittest.mock import patch
from datetime import UTC, date, datetime, timedelta
from uuid import uuid4

from cryptography.fernet import Fernet
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from starlette.requests import Request

from app import calendar_integration as calendar
from app.db import Base
from app.models import (
    Appointment,
    AppointmentStatus,
    AppointmentGoogleSync,
    Clinic,
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


def confirmed_event_response(method, url, **kwargs):
    if method == "POST":
        return {"id": kwargs["json_body"]["id"], "status": "confirmed"}
    if method in {"GET", "PATCH"}:
        return {"id": url.rsplit("/", 1)[-1], "status": "confirmed"}
    return {}


class CalendarBookingTests(unittest.TestCase):
    def setUp(self):
        self.previous_rollout_clinic_ids = calendar.settings.google_calendar_rollout_clinic_ids
        self.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)
        tomorrow = (datetime.now(UTC) + timedelta(days=1)).date()
        self.booking_date = tomorrow.isoformat()
        self.clinic = Clinic(
            name="Clinica Test",
            email="test@example.com",
            timezone="Europe/Madrid",
            working_days="mon,tue,wed,thu,fri,sat,sun",
            opening_start="09:00",
            opening_end="14:00",
            subscription_status="active",
        )
        self.db.add(self.clinic)
        self.db.flush()
        calendar.settings.google_calendar_rollout_clinic_ids = self.clinic.id
        self.user = User(
            clinic_id=self.clinic.id,
            name="Direccion",
            email="owner@example.com",
            password_hash="not-used",
            role=UserRole.owner,
            active=True,
        )
        self.practitioner = Practitioner(
            clinic_id=self.clinic.id,
            name="Profesional Test",
            active=True,
            availability_start="09:00",
            availability_end="14:00",
        )
        self.room = Room(clinic_id=self.clinic.id, name="Sala 1", active=True)
        self.service = Service(
            clinic_id=self.clinic.id,
            name="Fisioterapia",
            duration_minutes=60,
            price_cents=5000,
            active=True,
        )
        self.db.add_all([self.user, self.practitioner, self.room, self.service])
        self.db.flush()
        self.setting = OnlineBookingSetting(
            clinic_id=self.clinic.id,
            enabled=True,
            slug="clinica-test",
            min_notice_minutes=0,
            max_days_ahead=30,
            buffer_minutes=0,
            automatic_confirmation=True,
            allow_professional_selection=True,
        )
        self.db.add(self.setting)
        self.db.flush()
        self.db.add_all(
            [
                OnlineBookingService(
                    clinic_id=self.clinic.id,
                    settings_id=self.setting.id,
                    service_id=self.service.id,
                ),
                OnlineBookingPractitioner(
                    clinic_id=self.clinic.id,
                    settings_id=self.setting.id,
                    practitioner_id=self.practitioner.id,
                ),
            ]
        )
        self.db.commit()
        self.request = Request(
            {
                "type": "http",
                "method": "POST",
                "path": "/public/bookings/clinica-test",
                "headers": [],
                "client": ("127.0.0.1", 12345),
            }
        )

    def tearDown(self):
        calendar.settings.google_calendar_rollout_clinic_ids = self.previous_rollout_clinic_ids
        self.db.close()
        self.engine.dispose()

    def payload(self, *, key="booking-idempotency-0001", start="12:00"):
        return calendar.PublicBookingCreate(
            service_id=self.service.id,
            practitioner_id=self.practitioner.id,
            booking_date=self.booking_date,
            start=start,
            first_name="Ana",
            last_name="Paciente",
            phone="600111222",
            email="ana@example.com",
            notes="Dato clinico que nunca debe viajar a Google",
            idempotency_key=key,
        )

    def create_secondary_clinic(self):
        clinic = Clinic(
            name="Clinica Test B",
            email="test-b@example.com",
            timezone="Europe/Madrid",
            working_days="mon,tue,wed,thu,fri,sat,sun",
            opening_start="09:00",
            opening_end="14:00",
            subscription_status="active",
        )
        self.db.add(clinic)
        self.db.flush()
        user = User(
            clinic_id=clinic.id,
            name="Direccion B",
            email="owner-b@example.com",
            password_hash="not-used",
            role=UserRole.owner,
            active=True,
        )
        practitioner = Practitioner(
            clinic_id=clinic.id,
            name="Profesional Test B",
            active=True,
            availability_start="09:00",
            availability_end="14:00",
        )
        room = Room(clinic_id=clinic.id, name="Sala B", active=True)
        service = Service(
            clinic_id=clinic.id,
            name="Podologia B",
            duration_minutes=60,
            price_cents=6000,
            active=True,
        )
        self.db.add_all([user, practitioner, room, service])
        self.db.flush()
        setting = OnlineBookingSetting(
            clinic_id=clinic.id,
            enabled=True,
            slug="clinica-test-b",
            min_notice_minutes=0,
            max_days_ahead=30,
            buffer_minutes=0,
            automatic_confirmation=True,
            allow_professional_selection=True,
        )
        self.db.add(setting)
        self.db.flush()
        self.db.add_all(
            [
                OnlineBookingService(
                    clinic_id=clinic.id,
                    settings_id=setting.id,
                    service_id=service.id,
                ),
                OnlineBookingPractitioner(
                    clinic_id=clinic.id,
                    settings_id=setting.id,
                    practitioner_id=practitioner.id,
                ),
            ]
        )
        self.db.commit()
        authorized_ids = calendar.settings.google_calendar_rollout_clinic_id_set
        authorized_ids.add(clinic.id)
        calendar.settings.google_calendar_rollout_clinic_ids = ",".join(sorted(authorized_ids))
        return {
            "clinic": clinic,
            "user": user,
            "practitioner": practitioner,
            "room": room,
            "service": service,
            "setting": setting,
        }

    def test_token_encryption_round_trip(self):
        previous = calendar.settings.google_calendar_token_key
        calendar.settings.google_calendar_token_key = Fernet.generate_key().decode("ascii")
        try:
            encrypted = calendar._encrypt("token-secreto")
            self.assertNotEqual(encrypted, "token-secreto")
            self.assertEqual(calendar._decrypt(encrypted), "token-secreto")
        finally:
            calendar.settings.google_calendar_token_key = previous

    def test_google_event_contains_no_patient_or_clinical_data(self):
        appointment = Appointment(
            clinic_id=self.clinic.id,
            patient_id="patient-private",
            practitioner_id=self.practitioner.id,
            room_id=self.room.id,
            service_id=self.service.id,
            date=self.booking_date,
            start="12:00",
            end="13:00",
            status=AppointmentStatus.confirmed,
            internal_notes="Diagnostico privado",
        )
        appointment.id = "appointment-private"
        body = calendar._event_body(self.clinic, appointment)
        serialized = str(body).lower()
        self.assertEqual(body["summary"], "Klinia - Cita")
        self.assertNotIn("patient-private", serialized)
        self.assertNotIn("diagnostico", serialized)
        self.assertNotIn("invitados", serialized)

    def test_availability_respects_existing_appointments(self):
        patient = Patient(clinic_id=self.clinic.id, name="Paciente Ocupado")
        self.db.add(patient)
        self.db.flush()
        self.db.add(
            Appointment(
                clinic_id=self.clinic.id,
                patient_id=patient.id,
                practitioner_id=self.practitioner.id,
                room_id=self.room.id,
                service_id=self.service.id,
                date=self.booking_date,
                start="10:00",
                end="11:00",
                status=AppointmentStatus.confirmed,
            )
        )
        self.db.commit()
        slots = calendar._availability_candidates(
            self.db,
            clinic=self.clinic,
            setting=self.setting,
            service=self.service,
            booking_date=self.booking_date,
            practitioner_id=self.practitioner.id,
        )
        starts = {item["start"] for item in slots}
        self.assertNotIn("10:00", starts)
        self.assertIn("11:00", starts)

    def test_public_booking_is_idempotent_and_blocks_second_booking(self):
        first = calendar.create_public_booking(
            "clinica-test",
            self.payload(),
            self.request,
            self.db,
        )
        retry = calendar.create_public_booking(
            "clinica-test",
            self.payload(),
            self.request,
            self.db,
        )
        self.assertEqual(first["appointment_id"], retry["appointment_id"])
        self.assertEqual(len(list(self.db.scalars(select(OnlineBooking)))), 1)
        self.assertEqual(len(list(self.db.scalars(select(Appointment)))), 1)

        with self.assertRaises(HTTPException) as conflict:
            calendar.create_public_booking(
                "clinica-test",
                calendar.PublicBookingCreate(
                    service_id=self.service.id,
                    practitioner_id=self.practitioner.id,
                    booking_date=self.booking_date,
                    start="12:00",
                    first_name="Otra",
                    last_name="Persona",
                    phone="699888777",
                    email="otra@example.com",
                    idempotency_key="booking-idempotency-0002",
                ),
                self.request,
                self.db,
            )
        self.assertEqual(conflict.exception.status_code, 409)
        self.assertEqual(len(list(self.db.scalars(select(Appointment)))), 1)

    def test_manual_appointment_wins_before_public_booking(self):
        from app.main import create_appointment
        from app.schemas import AppointmentCreate

        patient = Patient(clinic_id=self.clinic.id, name="Paciente Manual")
        self.db.add(patient)
        self.db.commit()
        create_appointment(
            AppointmentCreate(
                patient_id=patient.id,
                practitioner_id=self.practitioner.id,
                room_id=self.room.id,
                service_id=self.service.id,
                date=self.booking_date,
                start="12:00",
                end="13:00",
            ),
            self.user,
            self.db,
        )
        with self.assertRaises(HTTPException) as conflict:
            calendar.create_public_booking("clinica-test", self.payload(), self.request, self.db)
        self.assertEqual(conflict.exception.status_code, 409)
        self.assertEqual(len(list(self.db.scalars(select(Appointment)))), 1)

    def test_public_booking_wins_before_manual_appointment(self):
        from app.main import create_appointment
        from app.schemas import AppointmentCreate

        manual_patient = Patient(clinic_id=self.clinic.id, name="Paciente Manual")
        self.db.add(manual_patient)
        self.db.commit()
        calendar.create_public_booking("clinica-test", self.payload(), self.request, self.db)
        with self.assertRaises(HTTPException) as conflict:
            create_appointment(
                AppointmentCreate(
                    patient_id=manual_patient.id,
                    practitioner_id=self.practitioner.id,
                    room_id=self.room.id,
                    service_id=self.service.id,
                    date=self.booking_date,
                    start="12:00",
                    end="13:00",
                ),
                self.user,
                self.db,
            )
        self.assertEqual(conflict.exception.status_code, 409)
        self.assertEqual(len(list(self.db.scalars(select(Appointment)))), 1)

    def test_schedule_conflict_scope_isolated_by_clinic(self):
        from app.main import create_appointment
        from app.schemas import AppointmentCreate

        patient = Patient(clinic_id=self.clinic.id, name="Paciente Clinica A")
        self.db.add(patient)
        self.db.commit()
        create_appointment(
            AppointmentCreate(
                patient_id=patient.id,
                practitioner_id=self.practitioner.id,
                room_id=self.room.id,
                service_id=self.service.id,
                date=self.booking_date,
                start="12:00",
                end="13:00",
            ),
            self.user,
            self.db,
        )
        other = self.create_secondary_clinic()
        result = calendar.create_public_booking(
            other["setting"].slug,
            calendar.PublicBookingCreate(
                service_id=other["service"].id,
                practitioner_id=other["practitioner"].id,
                booking_date=self.booking_date,
                start="12:00",
                first_name="Paciente",
                last_name="Clinica B",
                phone="600222333",
                email="clinic-b@example.com",
                idempotency_key="clinic-b-idempotency-001",
            ),
            self.request,
            self.db,
        )
        self.assertEqual(result["clinic"], other["clinic"].name)
        self.assertEqual(len(list(self.db.scalars(select(Appointment)))), 2)

    def test_google_busy_time_blocks_slot_without_event_details(self):
        connection = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            calendar_id="primary",
            access_token_encrypted="unused",
            refresh_token_encrypted="unused",
            granted_scopes=calendar.GOOGLE_FREEBUSY_SCOPE,
            enabled=True,
            block_busy_times=True,
        )
        self.db.add(connection)
        self.db.commit()
        response = {
            "calendars": {
                "primary": {
                    "busy": [
                        {
                            "start": f"{self.booking_date}T11:00:00+02:00",
                            "end": f"{self.booking_date}T12:00:00+02:00",
                        }
                    ]
                }
            }
        }
        with patch.object(calendar, "_access_token", return_value="token"), patch.object(
            calendar, "_google_request", return_value=response
        ):
            slots = calendar._availability_candidates(
                self.db,
                clinic=self.clinic,
                setting=self.setting,
                service=self.service,
                booking_date=self.booking_date,
                practitioner_id=self.practitioner.id,
            )
        starts = {item["start"] for item in slots}
        self.assertNotIn("11:00", starts)
        self.assertIn("12:00", starts)
        self.assertNotIn("summary", str(slots).lower())
        self.assertNotIn("description", str(slots).lower())

    def test_google_event_is_created_updated_and_cancelled_without_duplicates(self):
        patient = Patient(clinic_id=self.clinic.id, name="Paciente Privado")
        connection = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            calendar_id="primary",
            access_token_encrypted="unused",
            refresh_token_encrypted="unused",
            granted_scopes=calendar.GOOGLE_EVENTS_SCOPE,
            enabled=True,
            push_klinia_appointments=True,
            auto_sync=True,
        )
        self.db.add_all([patient, connection])
        self.db.flush()
        appointment = Appointment(
            clinic_id=self.clinic.id,
            patient_id=patient.id,
            practitioner_id=self.practitioner.id,
            room_id=self.room.id,
            service_id=self.service.id,
            date=self.booking_date,
            start="12:00",
            end="13:00",
            status=AppointmentStatus.confirmed,
            internal_notes="Nunca enviar a Google",
        )
        self.db.add(appointment)
        self.db.flush()
        with patch.object(calendar, "_access_token", return_value="token"), patch.object(
            calendar, "_google_request", side_effect=confirmed_event_response
        ) as google_request:
            first = calendar.sync_appointment_to_google(self.db, appointment)
            appointment.start = "12:15"
            appointment.end = "13:15"
            second = calendar.sync_appointment_to_google(self.db, appointment)
            appointment.status = AppointmentStatus.cancelled
            third = calendar.sync_appointment_to_google(self.db, appointment)
        self.db.flush()
        rows = list(self.db.scalars(select(AppointmentGoogleSync)))
        self.assertEqual(len(rows), 1)
        self.assertEqual(first.id, second.id)
        self.assertEqual(second.id, third.id)
        self.assertIsNone(third.google_event_id)
        self.assertEqual([call.args[0] for call in google_request.call_args_list], ["POST", "PATCH", "DELETE"])

    def test_patient_is_not_linked_by_email_only(self):
        existing = Patient(
            clinic_id=self.clinic.id,
            name="Persona Distinta",
            email="same@example.com",
            phone="600000000",
        )
        self.db.add(existing)
        self.db.commit()
        match = calendar._matching_patient(
            self.db,
            self.clinic.id,
            "Paciente Nuevo",
            "same@example.com",
            "611111111",
        )
        self.assertIsNone(match)

    def sync_fixture(self):
        patient = Patient(clinic_id=self.clinic.id, name="Google Test")
        connection = GoogleCalendarConnection(
            clinic_id=self.clinic.id, user_id=self.user.id,
            calendar_id="calendar-a@example.com", enabled=True,
            push_klinia_appointments=True, auto_sync=True,
            granted_scopes=calendar.GOOGLE_EVENTS_SCOPE,
        )
        self.db.add_all([patient, connection])
        self.db.flush()
        appointment = Appointment(
            clinic_id=self.clinic.id, patient_id=patient.id,
            practitioner_id=self.practitioner.id, service_id=self.service.id,
            room_id=self.room.id, date=self.booking_date,
            start="12:00", end="13:00", status=AppointmentStatus.confirmed,
        )
        self.db.add(appointment)
        self.db.flush()
        return appointment, connection

    def oauth_state_fixture(self, *, expired=False):
        raw = f"staging-state-test-{uuid4().hex}"
        row = GoogleCalendarOAuthState(
            clinic_id=self.clinic.id, user_id=self.user.id,
            nonce_hash=calendar.hashlib.sha256(raw.encode()).hexdigest(),
            expires_at=datetime.now(UTC) + timedelta(minutes=-1 if expired else 10),
            include_write=False,
        )
        self.db.add(row)
        self.db.commit()
        return raw, row

    def test_oauth_state_consumption_survives_rollback_and_rejects_replay(self):
        raw, row = self.oauth_state_fixture()
        consumed = calendar._consume_oauth_state(self.db, raw)
        self.assertEqual(consumed.id, row.id)
        self.db.rollback()
        self.assertIsNone(calendar._consume_oauth_state(self.db, raw))

    def test_oauth_state_expired_unknown_and_modified_rejected(self):
        raw, _ = self.oauth_state_fixture(expired=True)
        for candidate in (raw, raw + "tampered", "unknown"):
            self.assertIsNone(calendar._consume_oauth_state(self.db, candidate))

    def test_oauth_callback_after_rollout_removal_never_exchanges_code(self):
        raw, _ = self.oauth_state_fixture()
        calendar.settings.google_calendar_rollout_clinic_ids = ""
        with patch.object(calendar, "_google_request") as remote:
            response = calendar.google_calendar_oauth_callback(raw, "test-code", None, self.db)
            remote.assert_not_called()
        self.assertIn("unavailable", response.headers["location"])
        self.assertIsNone(calendar._consume_oauth_state(self.db, raw))

    def test_oauth_callback_reuses_refresh_only_for_same_verified_identity(self):
        raw, _ = self.oauth_state_fixture()
        connection = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            account_email="same@example.com",
            calendar_id="calendar-a@example.com",
            refresh_token_encrypted="stored-ciphertext",
            enabled=True,
        )
        self.db.add(connection)
        self.db.commit()

        def remote(method, url, **kwargs):
            if url == calendar.GOOGLE_TOKEN_URL:
                return {"access_token": "opaque-access", "expires_in": 3600}
            if url == calendar.GOOGLE_USERINFO_URL:
                return {"email": "SAME@example.com", "email_verified": True}
            raise AssertionError(url)

        with patch.object(calendar, "_google_request", side_effect=remote), patch.object(
            calendar, "_decrypt", return_value="opaque-previous"
        ) as decrypt, patch.object(calendar, "_encrypt", side_effect=lambda value: "cipher-" + value):
            response = calendar.google_calendar_oauth_callback(raw, "opaque-code", None, self.db)
        self.assertIn("connected", response.headers["location"])
        decrypt.assert_called_once_with("stored-ciphertext")
        self.assertEqual(connection.refresh_token_encrypted, "cipher-opaque-previous")
        self.assertEqual(connection.calendar_id, "calendar-a@example.com")

    def test_changed_verified_account_without_refresh_discards_old_credentials(self):
        raw, _ = self.oauth_state_fixture()
        connection = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            account_email="same@example.com",
            calendar_id="calendar-a@example.com",
            access_token_encrypted="stored-access-ciphertext",
            refresh_token_encrypted="stored-ciphertext",
            enabled=True,
        )
        self.db.add(connection)
        self.db.commit()

        def remote(method, url, **kwargs):
            if url == calendar.GOOGLE_TOKEN_URL:
                return {"access_token": "opaque-access", "expires_in": 3600}
            if url == calendar.GOOGLE_USERINFO_URL:
                return {"email": "other@example.com", "email_verified": True}
            raise AssertionError(url)

        with patch.object(calendar, "_google_request", side_effect=remote), patch.object(
            calendar, "_decrypt", side_effect=AssertionError("old credential reused")
        ) as decrypt:
            response = calendar.google_calendar_oauth_callback(raw, "opaque-code", None, self.db)
        self.assertIn("error", response.headers["location"])
        decrypt.assert_not_called()
        self.assertFalse(connection.enabled)
        self.assertIsNone(connection.access_token_encrypted)
        self.assertIsNone(connection.refresh_token_encrypted)
        self.assertEqual(connection.calendar_id, "primary")

    def test_unverifiable_account_never_reuses_refresh(self):
        for profile in ({"email": "same@example.com", "email_verified": False}, {"email_verified": True}):
            with self.subTest(profile=profile):
                raw, _ = self.oauth_state_fixture()
                connection = self.db.scalar(select(GoogleCalendarConnection).where(GoogleCalendarConnection.clinic_id == self.clinic.id))
                if connection is None:
                    connection = GoogleCalendarConnection(
                        clinic_id=self.clinic.id,
                        user_id=self.user.id,
                        account_email="same@example.com",
                        calendar_id="calendar-a@example.com",
                        refresh_token_encrypted="stored-ciphertext",
                        enabled=True,
                    )
                    self.db.add(connection)
                self.db.commit()

                def remote(method, url, **kwargs):
                    if url == calendar.GOOGLE_TOKEN_URL:
                        return {"access_token": "opaque-access", "expires_in": 3600}
                    if url == calendar.GOOGLE_USERINFO_URL:
                        return profile
                    raise AssertionError(url)

                with patch.object(calendar, "_google_request", side_effect=remote), patch.object(
                    calendar, "_decrypt", side_effect=AssertionError("old credential reused")
                ) as decrypt:
                    response = calendar.google_calendar_oauth_callback(raw, "opaque-code", None, self.db)
                self.assertIn("error", response.headers["location"])
                decrypt.assert_not_called()
                self.db.expire_all()
                connection = self.db.get(GoogleCalendarConnection, connection.id)
                self.assertEqual(connection.account_email, "same@example.com")
                self.assertEqual(connection.refresh_token_encrypted, "stored-ciphertext")

    def test_changed_account_with_new_refresh_resets_calendar_selection(self):
        raw, _ = self.oauth_state_fixture()
        connection = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            account_email="old@example.com",
            calendar_id="old-calendar@example.com",
            refresh_token_encrypted="stored-ciphertext",
            enabled=True,
        )
        self.db.add(connection)
        self.db.commit()

        def remote(method, url, **kwargs):
            if url == calendar.GOOGLE_TOKEN_URL:
                return {"access_token": "opaque-access", "refresh_token": "opaque-new", "expires_in": 3600}
            if url == calendar.GOOGLE_USERINFO_URL:
                return {"email": "new@example.com", "email_verified": True}
            raise AssertionError(url)

        with patch.object(calendar, "_google_request", side_effect=remote), patch.object(
            calendar, "_decrypt", side_effect=AssertionError("old credential reused")
        ) as decrypt, patch.object(calendar, "_encrypt", side_effect=lambda value: "cipher-" + value):
            response = calendar.google_calendar_oauth_callback(raw, "opaque-code", None, self.db)
        self.assertIn("connected", response.headers["location"])
        decrypt.assert_not_called()
        self.assertEqual(connection.account_email, "new@example.com")
        self.assertEqual(connection.refresh_token_encrypted, "cipher-opaque-new")
        self.assertEqual(connection.calendar_id, "primary")

    def test_unexpected_create_response_never_replaces_persisted_identity(self):
        appointment, _ = self.sync_fixture()
        expected = calendar.hashlib.sha256(f"klinia:{appointment.clinic_id}:{appointment.id}".encode()).hexdigest()
        with patch.object(calendar, "_access_token", return_value="opaque"), patch.object(
            calendar, "_google_request", return_value={"id": "event-456", "status": "confirmed"}
        ) as remote:
            row = calendar.sync_appointment_to_google(self.db, appointment)
        self.assertEqual(remote.call_args.args[0], "POST")
        self.assertEqual(remote.call_args.kwargs["json_body"]["id"], expected)
        self.assertEqual(row.google_event_id, expected)
        self.assertEqual(row.sync_status, "reconciliation_required")

        with patch.object(calendar, "_google_request") as remote:
            row = calendar.sync_appointment_to_google(self.db, appointment, force=True)
        remote.assert_not_called()
        self.assertEqual(row.google_event_id, expected)
        self.assertEqual(row.sync_status, "reconciliation_required")

    def test_unexpected_patch_response_preserves_known_identity(self):
        appointment, _ = self.sync_fixture()
        row = calendar._sync_row(self.db, appointment)
        row.google_event_id = "event-123"
        row.calendar_id = "calendar-a@example.com"
        row.sync_status = "synced"
        with patch.object(calendar, "_access_token", return_value="opaque"), patch.object(
            calendar, "_google_request", return_value={"id": "event-456", "status": "confirmed"}
        ):
            calendar.sync_appointment_to_google(self.db, appointment, force=True)
        self.assertEqual(row.google_event_id, "event-123")
        self.assertEqual(row.sync_status, "reconciliation_required")

    def test_cancel_after_uncertain_create_retains_identity_until_confirmed_retry(self):
        appointment, _ = self.sync_fixture()
        with patch.object(calendar, "_access_token", return_value="opaque"), patch.object(
            calendar, "_google_request", side_effect=httpx.ReadTimeout("response lost")
        ):
            row = calendar.sync_appointment_to_google(self.db, appointment)
        expected = row.google_event_id
        self.assertEqual(row.sync_status, "unknown_remote_state")
        appointment.status = AppointmentStatus.cancelled
        with patch.object(calendar, "_access_token", return_value="opaque"), patch.object(
            calendar, "_google_request", side_effect=calendar.GoogleCalendarEventMissing("not found")
        ):
            calendar.sync_appointment_to_google(self.db, appointment)
        self.assertEqual(row.google_event_id, expected)
        self.assertEqual(row.sync_status, "delete_pending_confirmation")
        with patch.object(calendar, "_access_token", return_value="opaque"), patch.object(
            calendar, "_google_request", side_effect=calendar.GoogleCalendarEventMissing("not found")
        ):
            calendar.sync_appointment_to_google(self.db, appointment, force=True)
        self.assertIsNone(row.google_event_id)
        self.assertEqual(row.sync_status, "synced")

    def test_update_retry_and_delete_keep_original_event_and_calendar(self):
        appointment, connection = self.sync_fixture()
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(
            calendar, "_google_request", side_effect=confirmed_event_response
        ):
            row = calendar.sync_appointment_to_google(self.db, appointment)
        connection.calendar_id = "calendar-b@example.com"
        event_id = row.google_event_id
        expected = calendar.GOOGLE_CALENDAR_API + f"/calendars/calendar-a%40example.com/events/{event_id}"
        for failure in (httpx.ReadTimeout("private-response"), calendar.GoogleCalendarEventMissing("missing")):
            with patch.object(calendar, "_access_token", return_value="test"), patch.object(
                calendar, "_google_request", side_effect=failure
            ) as remote:
                calendar.sync_appointment_to_google(self.db, appointment, force=True)
            self.assertEqual(remote.call_args.args, ("PATCH", expected))
            self.assertEqual(row.google_event_id, event_id)
            self.assertEqual(row.calendar_id, "calendar-a@example.com")
            self.assertEqual(row.sync_status, "error")
            self.assertNotIn("private-response", row.sync_error)
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(
            calendar, "_google_request", side_effect=confirmed_event_response
        ) as remote:
            calendar.sync_appointment_to_google(self.db, appointment, force=True)
            self.assertEqual(remote.call_args.args, ("PATCH", expected))
            appointment.status = AppointmentStatus.cancelled
            calendar.sync_appointment_to_google(self.db, appointment)
            self.assertEqual(remote.call_args.args, ("DELETE", expected))

    def test_empty_allowlist_does_not_query_google_tables(self):
        appointment, _ = self.sync_fixture()
        calendar.settings.google_calendar_rollout_clinic_ids = ""
        with patch.object(self.db, "scalar", side_effect=AssertionError("unexpected query")), patch.object(
            calendar, "_connection_for_clinic", side_effect=AssertionError("unexpected connection query")
        ), patch.object(calendar, "_google_request") as remote:
            self.assertIsNone(calendar.sync_appointment_to_google(self.db, appointment))
            calendar.remove_appointment_from_google(self.db, appointment)
            remote.assert_not_called()

    def test_disconnect_cleans_corrupt_credentials_even_after_rollout_removal(self):
        _, connection = self.sync_fixture()
        connection.access_token_encrypted = "corrupt"
        connection.refresh_token_encrypted = "corrupt"
        self.db.commit()
        calendar.settings.google_calendar_rollout_clinic_ids = ""
        with patch.object(calendar, "_decrypt", side_effect=calendar.InvalidToken), patch.object(calendar.httpx, "post") as remote:
            calendar.disconnect_google_calendar(self.request, self.user, self.db)
            remote.assert_not_called()
        self.db.refresh(connection)
        self.assertFalse(connection.enabled)
        self.assertIsNone(connection.access_token_encrypted)
        self.assertIsNone(connection.refresh_token_encrypted)

    def test_disconnect_commits_before_failed_revoke_and_uses_body(self):
        _, connection = self.sync_fixture()
        connection.refresh_token_encrypted = "encrypted"
        self.db.commit()
        def revoke(url, **kwargs):
            self.assertEqual(url, calendar.GOOGLE_REVOKE_URL)
            self.assertEqual(kwargs["data"], {"token": "test-token"})
            self.assertNotIn("params", kwargs)
            self.assertFalse(self.db.in_transaction())
            self.assertFalse(connection.enabled)
            self.assertIsNone(connection.refresh_token_encrypted)
            raise httpx.ReadTimeout("test")
        with patch.object(calendar, "_decrypt", return_value="test-token"), patch.object(calendar.httpx, "post", side_effect=revoke):
            calendar.disconnect_google_calendar(self.request, self.user, self.db)
        self.assertFalse(connection.enabled)

    def test_google_http_error_does_not_include_response_body(self):
        for status_code in (401, 403, 429, 500):
            with self.subTest(status=status_code), patch.object(calendar.httpx, "request", return_value=httpx.Response(status_code, text="secret-test-token")):
                with self.assertRaises(calendar.GoogleCalendarError) as error:
                    calendar._google_request("GET", calendar.GOOGLE_CALENDAR_API)
                self.assertNotIn("secret-test-token", str(error.exception))

    def test_cancel_endpoint_commits_clinical_status_before_google_failure(self):
        from app.main import update_appointment, AppointmentUpdate
        appointment, _ = self.sync_fixture()
        row = calendar._sync_row(self.db, appointment)
        row.calendar_id = "calendar-a@example.com"
        row.google_event_id = "event-123"
        self.db.commit()
        appointment_id = appointment.id
        real_commit = self.db.commit
        with patch.object(self.db, "commit", wraps=real_commit) as commit, patch.object(calendar, "_access_token", return_value="test"), patch.object(
            calendar, "_google_request", side_effect=httpx.ReadTimeout("test")
        ) as remote:
            result = update_appointment(appointment_id, AppointmentUpdate(status=AppointmentStatus.cancelled), self.user, self.db)
            self.assertGreaterEqual(commit.call_count, 2)
            self.assertEqual(remote.call_args.args[0], "DELETE")
            self.assertEqual(result.status, AppointmentStatus.cancelled)
        self.db.expire_all()
        self.assertEqual(self.db.get(Appointment, appointment_id).status, AppointmentStatus.cancelled)
        self.assertEqual(row.google_event_id, "event-123")
        self.assertEqual(row.sync_status, "error")

    def test_create_timeout_after_remote_success_reconciles_without_second_post(self):
        appointment, _ = self.sync_fixture()
        events = {}
        methods = []
        def remote(method, url, **kwargs):
            methods.append(method)
            if method == "POST":
                body = kwargs["json_body"]
                events[body["id"]] = body
                raise httpx.ReadTimeout("response lost")
            event_id = url.rsplit("/", 1)[1]
            self.assertIn(event_id, events)
            if method == "GET":
                self.assertEqual(kwargs["params"], {"fields": "id,status"})
            return {"id": event_id, "status": "confirmed"}
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=remote):
            row = calendar.sync_appointment_to_google(self.db, appointment)
            stable_id = row.google_event_id
            self.assertEqual(row.sync_status, "unknown_remote_state")
            self.db.commit()
            row = calendar.sync_appointment_to_google(self.db, appointment)
            self.assertEqual(row.google_event_id, stable_id)
            self.assertEqual(row.sync_status, "synced")
            calendar.sync_appointment_to_google(self.db, appointment)
        self.assertEqual(methods, ["POST", "GET", "PATCH", "PATCH"])
        self.assertEqual(len(events), 1)

    def test_create_timeout_without_remote_event_requires_explicit_same_id_retry(self):
        appointment, _ = self.sync_fixture()
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=httpx.ConnectTimeout("test")):
            row = calendar.sync_appointment_to_google(self.db, appointment)
        stable_id = row.google_event_id
        self.db.commit()
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=calendar.GoogleCalendarEventMissing("missing")) as remote:
            calendar.sync_appointment_to_google(self.db, appointment)
            self.assertEqual([call.args[0] for call in remote.call_args_list], ["GET"])
        def retry(method, url, **kwargs):
            if method == "GET":
                raise calendar.GoogleCalendarEventMissing("missing")
            self.assertEqual(method, "POST")
            self.assertEqual(kwargs["json_body"]["id"], stable_id)
            return {"id": stable_id}
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=retry):
            calendar.sync_appointment_to_google(self.db, appointment, force=True)
        self.assertEqual(row.google_event_id, stable_id)
        self.assertEqual(row.sync_status, "synced")

    def test_freebusy_rejects_wrong_calendar_and_malformed_busy_data(self):
        _, connection = self.sync_fixture()
        payloads = [
            {"calendars": {"other-calendar": {"busy": []}}},
            {"calendars": {connection.calendar_id: {}}},
            {"calendars": {connection.calendar_id: {"busy": [{"start": "invalid"}]}}},
            {"calendars": {connection.calendar_id: {"errors": [{"reason": "notFound"}], "busy": []}}},
        ]
        for payload in payloads:
            with self.subTest(payload=payload), patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", return_value=payload):
                with self.assertRaises(calendar.GoogleCalendarError):
                    calendar._google_busy_ranges(self.db, self.clinic, connection, date.fromisoformat(self.booking_date))

    def test_rollout_settings_unset_empty_single_and_multiple(self):
        from app.config import Settings
        with patch.dict("os.environ", {}, clear=True):
            self.assertEqual(Settings(_env_file=None).google_calendar_rollout_clinic_id_set, set())
        for raw, expected in (("", set()), ("A", {"A"}), ("A,B", {"A", "B"}), (" A , B , ", {"A", "B"})):
            with self.subTest(raw=raw):
                value = Settings(_env_file=None, google_calendar_rollout_clinic_ids=raw)
                self.assertEqual(value.google_calendar_rollout_clinic_id_set, expected)

    def test_google_failure_matrix_keeps_synced_event_identity(self):
        appointment, _ = self.sync_fixture()
        row = calendar._sync_row(self.db, appointment)
        row.calendar_id = "calendar-a@example.com"
        row.google_event_id = "event-123"
        failures = [httpx.ReadTimeout("test"), httpx.ConnectError("test")]
        failures += [calendar.GoogleCalendarError(f"HTTP {status}") for status in (401, 403, 429, 500)]
        failures += [calendar.GoogleCalendarEventMissing("missing"), calendar.InvalidToken()]
        for failure in failures:
            with self.subTest(error=type(failure).__name__), patch.object(calendar, "_access_token", side_effect=failure):
                calendar.sync_appointment_to_google(self.db, appointment, force=True)
                self.assertEqual(row.google_event_id, "event-123")
                self.assertEqual(row.sync_status, "error")
                self.assertEqual(appointment.status, AppointmentStatus.confirmed)

    def test_physical_delete_preserves_google_target_on_timeout_and_500(self):
        from app.main import delete_appointment
        with self.engine.connect() as connection:
            connection.exec_driver_sql("PRAGMA foreign_keys=ON")
        appointment, connection = self.sync_fixture()
        row = calendar._sync_row(self.db, appointment)
        row.calendar_id = "original-calendar@example.com"
        row.google_event_id = "event-123"
        row.sync_status = "synced"
        self.db.commit()
        appointment_id, row_id = appointment.id, row.id
        connection.calendar_id = "new-calendar@example.com"
        self.db.commit()
        expected = calendar.GOOGLE_CALENDAR_API + "/calendars/original-calendar%40example.com/events/event-123"
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=httpx.ReadTimeout("test")) as remote:
            delete_appointment(appointment_id, self.user, self.db)
            self.assertEqual(remote.call_args.args, ("DELETE", expected))
        self.db.expire_all()
        self.assertIsNone(self.db.get(Appointment, appointment_id))
        row = self.db.get(AppointmentGoogleSync, row_id)
        self.assertIsNone(row.appointment_id)
        self.assertEqual(row.google_event_id, "event-123")
        self.assertEqual(row.calendar_id, "original-calendar@example.com")
        self.assertEqual(row.sync_status, "error")
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=calendar.GoogleCalendarError("HTTP 500")) as remote:
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, self.clinic.id), (0, 1))
            self.db.commit()
            self.assertEqual(remote.call_args.args, ("DELETE", expected))
        self.assertEqual(row.google_event_id, "event-123")
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", return_value={}) as remote:
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, self.clinic.id), (1, 0))
            self.db.commit()
            self.assertEqual(remote.call_args.args, ("DELETE", expected))
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, self.clinic.id), (0, 0))
            self.assertEqual(remote.call_count, 1)
        self.assertIsNone(row.google_event_id)
        self.assertEqual(row.calendar_id, "original-calendar@example.com")
        self.assertEqual(row.sync_status, "synced")

    def test_orphan_delete_404_is_idempotent_and_cross_clinic_target_is_ignored(self):
        _, connection = self.sync_fixture()
        other = self.create_secondary_clinic()
        row = AppointmentGoogleSync(clinic_id=self.clinic.id, appointment_id=None, google_event_id="event-a", calendar_id="calendar-a", sync_status="error")
        other_row = AppointmentGoogleSync(clinic_id=other["clinic"].id, appointment_id=None, google_event_id="event-b", calendar_id="calendar-b", sync_status="error")
        self.db.add_all([row, other_row])
        self.db.commit()
        with patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=calendar.GoogleCalendarEventMissing("missing")) as remote:
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, self.clinic.id, sync_id=other_row.id), (0, 0))
            remote.assert_not_called()
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, self.clinic.id), (1, 0))
            self.db.commit()
            self.assertEqual(remote.call_count, 1)
            self.assertEqual(remote.call_args.args[0], "DELETE")
        self.assertIsNone(row.google_event_id)
        self.assertEqual(row.sync_status, "synced")
        self.assertEqual(other_row.google_event_id, "event-b")
        self.assertEqual(other_row.sync_status, "error")

    def test_orphan_retries_blocked_when_clinic_removed_or_disconnected(self):
        _, connection = self.sync_fixture()
        row = AppointmentGoogleSync(clinic_id=self.clinic.id, appointment_id=None, google_event_id="event-a", calendar_id="calendar-a", sync_status="error")
        self.db.add(row)
        self.db.commit()
        clinic_id = self.clinic.id
        calendar.settings.google_calendar_rollout_clinic_ids = ""
        with patch.object(calendar, "_connection_for_clinic", side_effect=AssertionError("unexpected query")):
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, clinic_id), (0, 0))
        calendar.settings.google_calendar_rollout_clinic_ids = clinic_id
        connection.enabled = False
        self.db.commit()
        with patch.object(calendar, "_google_request") as remote:
            self.assertEqual(calendar.retry_orphaned_google_deletions(self.db, clinic_id), (0, 0))
            remote.assert_not_called()
        self.assertEqual(row.google_event_id, "event-a")


    def test_public_catalog_is_scoped_to_slug_clinic(self):
        other = self.create_secondary_clinic()

        clinic_a = calendar.get_public_booking_page("clinica-test", self.db)
        clinic_b = calendar.get_public_booking_page("clinica-test-b", self.db)

        self.assertEqual({item["id"] for item in clinic_a["services"]}, {self.service.id})
        self.assertEqual({item["id"] for item in clinic_a["practitioners"]}, {self.practitioner.id})
        self.assertNotIn(other["service"].id, {item["id"] for item in clinic_a["services"]})
        self.assertNotIn(other["practitioner"].id, {item["id"] for item in clinic_a["practitioners"]})
        self.assertEqual({item["id"] for item in clinic_b["services"]}, {other["service"].id})
        self.assertEqual({item["id"] for item in clinic_b["practitioners"]}, {other["practitioner"].id})

    def test_cross_clinic_service_and_practitioner_ids_are_rejected(self):
        other = self.create_secondary_clinic()

        with self.assertRaises(HTTPException) as availability_error:
            calendar.get_public_booking_availability(
                "clinica-test",
                other["service"].id,
                self.booking_date,
                other["practitioner"].id,
                self.db,
            )
        self.assertEqual(availability_error.exception.status_code, 404)

        cross_clinic_payload = calendar.PublicBookingCreate(
            service_id=other["service"].id,
            practitioner_id=other["practitioner"].id,
            booking_date=self.booking_date,
            start="12:00",
            first_name="Ataque",
            last_name="Cruzado",
            phone="600123123",
            email="cross@example.com",
            idempotency_key="cross-clinic-booking-0001",
        )
        with self.assertRaises(HTTPException) as booking_error:
            calendar.create_public_booking(
                "clinica-test",
                cross_clinic_payload,
                self.request,
                self.db,
            )
        self.assertEqual(booking_error.exception.status_code, 409)
        self.assertEqual(len(list(self.db.scalars(select(Appointment)))), 0)

    def test_authenticated_settings_reject_other_clinic_resources(self):
        other = self.create_secondary_clinic()
        payload = calendar.OnlineBookingSettingsUpdate(
            enabled=True,
            slug="clinica-test",
            service_ids=[other["service"].id],
            practitioner_ids=[other["practitioner"].id],
        )

        with self.assertRaises(HTTPException) as error:
            calendar.update_online_booking_settings(payload, self.user, self.db)

        self.assertEqual(error.exception.status_code, 422)
        selected_services = set(calendar._selected_service_ids(self.db, self.setting))
        selected_practitioners = set(calendar._selected_practitioner_ids(self.db, self.setting))
        self.assertEqual(selected_services, {self.service.id})
        self.assertEqual(selected_practitioners, {self.practitioner.id})

    def test_corrupt_cross_clinic_selection_rows_are_not_exposed(self):
        other = self.create_secondary_clinic()
        self.db.add_all(
            [
                OnlineBookingService(
                    clinic_id=self.clinic.id,
                    settings_id=self.setting.id,
                    service_id=other["service"].id,
                ),
                OnlineBookingPractitioner(
                    clinic_id=self.clinic.id,
                    settings_id=self.setting.id,
                    practitioner_id=other["practitioner"].id,
                ),
            ]
        )
        self.db.commit()

        page = calendar.get_public_booking_page("clinica-test", self.db)

        self.assertNotIn(other["service"].id, {item["id"] for item in page["services"]})
        self.assertNotIn(other["practitioner"].id, {item["id"] for item in page["practitioners"]})

    def test_patient_matching_never_crosses_clinics(self):
        other = self.create_secondary_clinic()
        other_patient = Patient(
            clinic_id=other["clinic"].id,
            name="Ana Paciente",
            email="ana@example.com",
            phone="600111222",
        )
        self.db.add(other_patient)
        self.db.commit()

        match = calendar._matching_patient(
            self.db,
            self.clinic.id,
            "Ana Paciente",
            "ana@example.com",
            "600111222",
        )

        self.assertIsNone(match)
        result = calendar.create_public_booking(
            "clinica-test",
            self.payload(key="patient-clinic-isolation-0001"),
            self.request,
            self.db,
        )
        appointment = self.db.get(Appointment, result["appointment_id"])
        created_patient = self.db.get(Patient, appointment.patient_id)
        self.assertEqual(created_patient.clinic_id, self.clinic.id)
        self.assertNotEqual(created_patient.id, other_patient.id)

    def test_google_busy_connection_cannot_cross_clinics(self):
        other = self.create_secondary_clinic()
        connection_b = GoogleCalendarConnection(
            clinic_id=other["clinic"].id,
            user_id=other["user"].id,
            calendar_id="calendar-b@example.com",
            access_token_encrypted="unused",
            refresh_token_encrypted="unused",
            granted_scopes=calendar.GOOGLE_FREEBUSY_SCOPE,
            enabled=True,
            block_busy_times=True,
        )
        self.db.add(connection_b)
        self.db.commit()

        with patch.object(calendar, "_google_request") as google_request:
            slots = calendar._availability_candidates(
                self.db,
                clinic=self.clinic,
                setting=self.setting,
                service=self.service,
                booking_date=self.booking_date,
                practitioner_id=self.practitioner.id,
            )
            google_request.assert_not_called()
        self.assertIn("11:00", {item["start"] for item in slots})

        with patch.object(calendar, "_access_token") as access_token:
            with self.assertRaises(calendar.GoogleCalendarError):
                calendar._google_busy_ranges(
                    self.db,
                    self.clinic,
                    connection_b,
                    date.fromisoformat(self.booking_date),
                )
            access_token.assert_not_called()

    def test_booking_result_rejects_cross_clinic_relations(self):
        other = self.create_secondary_clinic()
        patient_a = Patient(clinic_id=self.clinic.id, name="Paciente A")
        patient_b = Patient(clinic_id=other["clinic"].id, name="Paciente B")
        self.db.add_all([patient_a, patient_b])
        self.db.flush()
        appointment_a = Appointment(
            clinic_id=self.clinic.id,
            patient_id=patient_a.id,
            practitioner_id=self.practitioner.id,
            room_id=self.room.id,
            service_id=self.service.id,
            date=self.booking_date,
            start="12:00",
            end="13:00",
            status=AppointmentStatus.confirmed,
        )
        self.db.add(appointment_a)
        self.db.flush()
        corrupt_booking = OnlineBooking(
            clinic_id=other["clinic"].id,
            appointment_id=appointment_a.id,
            patient_id=patient_b.id,
            booking_code="KB-CROSS-CLINIC",
            idempotency_key="cross-clinic-result-0001",
            source="online_booking",
            status="confirmed",
        )
        self.db.add(corrupt_booking)
        self.db.commit()

        with self.assertRaises(HTTPException) as error:
            calendar._booking_result(self.db, corrupt_booking)

        self.assertEqual(error.exception.status_code, 404)

    def test_google_sync_uses_only_the_appointment_clinic_calendar(self):
        other = self.create_secondary_clinic()
        patient = Patient(clinic_id=self.clinic.id, name="Paciente A")
        connection_a = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            calendar_id="calendar-a@example.com",
            access_token_encrypted="unused",
            refresh_token_encrypted="unused",
            granted_scopes=calendar.GOOGLE_EVENTS_SCOPE,
            enabled=True,
            push_klinia_appointments=True,
            auto_sync=True,
        )
        connection_b = GoogleCalendarConnection(
            clinic_id=other["clinic"].id,
            user_id=other["user"].id,
            calendar_id="calendar-b@example.com",
            access_token_encrypted="unused",
            refresh_token_encrypted="unused",
            granted_scopes=calendar.GOOGLE_EVENTS_SCOPE,
            enabled=True,
            push_klinia_appointments=True,
            auto_sync=True,
        )
        self.db.add_all([patient, connection_a, connection_b])
        self.db.flush()
        appointment = Appointment(
            clinic_id=self.clinic.id,
            patient_id=patient.id,
            practitioner_id=self.practitioner.id,
            room_id=self.room.id,
            service_id=self.service.id,
            date=self.booking_date,
            start="12:00",
            end="13:00",
            status=AppointmentStatus.confirmed,
        )
        self.db.add(appointment)
        self.db.flush()

        with patch.object(calendar, "_access_token", return_value="token"), patch.object(
            calendar, "_google_request", side_effect=confirmed_event_response
        ) as google_request:
            row = calendar.sync_appointment_to_google(self.db, appointment)

        request_url = google_request.call_args.args[1]
        self.assertEqual(row.clinic_id, self.clinic.id)
        self.assertEqual(row.calendar_id, connection_a.calendar_id)
        self.assertIn("calendar-a%40example.com", request_url)
        self.assertNotIn("calendar-b%40example.com", request_url)

    def test_disconnect_only_disables_the_authenticated_clinic_connection(self):
        other = self.create_secondary_clinic()
        connection_a = GoogleCalendarConnection(
            clinic_id=self.clinic.id,
            user_id=self.user.id,
            calendar_id="calendar-a@example.com",
            enabled=True,
        )
        connection_b = GoogleCalendarConnection(
            clinic_id=other["clinic"].id,
            user_id=other["user"].id,
            calendar_id="calendar-b@example.com",
            access_token_encrypted="encrypted-b",
            refresh_token_encrypted="refresh-b",
            enabled=True,
        )
        self.db.add_all([connection_a, connection_b])
        self.db.commit()

        response = calendar.disconnect_google_calendar(self.request, self.user, self.db)
        self.db.refresh(connection_a)
        self.db.refresh(connection_b)

        self.assertFalse(response["calendar"]["connected"])
        self.assertFalse(connection_a.enabled)
        self.assertIsNone(connection_a.access_token_encrypted)
        self.assertIsNone(connection_a.refresh_token_encrypted)
        self.assertTrue(connection_b.enabled)
        self.assertEqual(connection_b.calendar_id, "calendar-b@example.com")
        self.assertEqual(connection_b.access_token_encrypted, "encrypted-b")
        self.assertEqual(connection_b.refresh_token_encrypted, "refresh-b")
        self.assertTrue(self.db.get(OnlineBookingSetting, other["setting"].id).enabled)

    def test_empty_rollout_allowlist_blocks_oauth(self):
        calendar.settings.google_calendar_rollout_clinic_ids = ""

        with patch.object(calendar, "_calendar_configured", return_value=True), self.assertRaises(HTTPException) as error:
            calendar.start_google_calendar_oauth(False, self.user, self.db)

        self.assertEqual(error.exception.status_code, 403)
        self.assertEqual(error.exception.detail, calendar.CALENDAR_ROLLOUT_MESSAGE)
        self.assertEqual(self.db.scalar(select(GoogleCalendarOAuthState)), None)

    def test_authorized_clinic_can_start_oauth(self):
        calendar.settings.google_calendar_rollout_clinic_ids = self.clinic.id

        with patch.object(calendar, "_calendar_configured", return_value=True):
            result = calendar.start_google_calendar_oauth(False, self.user, self.db)

        state_row = self.db.scalar(select(GoogleCalendarOAuthState))
        self.assertIn("https://accounts.google.com/", result["authorization_url"])
        self.assertIsNotNone(state_row)
        self.assertEqual(state_row.clinic_id, self.clinic.id)
        self.assertEqual(state_row.user_id, self.user.id)

    def test_unauthorized_clinic_cannot_run_manual_sync(self):
        calendar.settings.google_calendar_rollout_clinic_ids = ""

        with patch.object(calendar, "_connection_for_clinic") as connection_lookup:
            with self.assertRaises(HTTPException) as error:
                calendar.synchronize_google_calendar_now(self.user, self.db)

        self.assertEqual(error.exception.status_code, 403)
        connection_lookup.assert_not_called()

    def test_unauthorized_public_slug_is_not_available(self):
        calendar.settings.google_calendar_rollout_clinic_ids = ""

        with self.assertRaises(HTTPException) as error:
            calendar.get_public_booking_page("clinica-test", self.db)

        self.assertEqual(error.exception.status_code, 404)
        self.assertEqual(error.exception.detail, calendar.PUBLIC_BOOKING_ROLLOUT_MESSAGE)

    def test_authorized_rollout_preserves_public_booking_flow(self):
        page = calendar.get_public_booking_page("clinica-test", self.db)

        self.assertEqual(page["clinic"]["name"], self.clinic.name)
        self.assertEqual({item["id"] for item in page["services"]}, {self.service.id})
        self.assertEqual({item["id"] for item in page["practitioners"]}, {self.practitioner.id})

    def test_client_supplied_clinic_id_is_rejected(self):
        with self.assertRaises(ValidationError):
            calendar.OnlineBookingSettingsUpdate.model_validate(
                {
                    "enabled": False,
                    "clinic_id": "clinic-id-manipulated",
                }
            )
        with self.assertRaises(ValidationError):
            calendar.PublicBookingCreate.model_validate(
                {
                    **self.payload().model_dump(),
                    "clinic_id": "clinic-id-manipulated",
                }
            )

    def test_rollout_allowlist_preserves_multiclinic_isolation(self):
        other = self.create_secondary_clinic()
        calendar.settings.google_calendar_rollout_clinic_ids = self.clinic.id

        page = calendar.get_public_booking_page("clinica-test", self.db)
        self.assertEqual(page["clinic"]["name"], self.clinic.name)

        with self.assertRaises(HTTPException) as public_error:
            calendar.get_public_booking_page("clinica-test-b", self.db)
        self.assertEqual(public_error.exception.status_code, 404)

        with patch.object(calendar, "_calendar_configured", return_value=True):
            with self.assertRaises(HTTPException) as oauth_error:
                calendar.start_google_calendar_oauth(False, other["user"], self.db)
        self.assertEqual(oauth_error.exception.status_code, 403)

    def test_slug_generation_never_reuses_another_clinic_slug(self):
        other = self.create_secondary_clinic()

        candidate = calendar._unique_slug(self.db, other["clinic"], "clinica-test", other["setting"].id)

        self.assertNotEqual(candidate, self.setting.slug)
        self.assertTrue(candidate.startswith("clinica-test-"))


if __name__ == "__main__":
    unittest.main()
