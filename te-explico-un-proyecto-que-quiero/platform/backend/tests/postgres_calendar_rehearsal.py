"""Explicit local-only rehearsal; never uses a configured application database."""
import hashlib
import json
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from pathlib import Path
from unittest.mock import patch
from uuid import uuid4

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, select, text
from sqlalchemy.orm import Session

from app import calendar_integration as calendar
from app import db as app_db
from app.db import Base
from app.models import Clinic, User, UserRole, Patient, Practitioner, Room, Service, Appointment, AppointmentStatus, AppointmentGoogleSync, GoogleCalendarOAuthState, GoogleCalendarConnection, OnlineBookingSetting, OnlineBookingService, OnlineBookingPractitioner


SOCKET = "/tmp/klinia-pr7-staging-postgres"
PORT = "55437"
DATABASE = "klinia_pr7_staging_" + uuid4().hex[:12]
RESTORED = DATABASE + "_restore"
NEW_TABLES = {
    "google_calendar_connections", "google_calendar_oauth_states",
    "online_booking_settings", "online_booking_services", "online_booking_practitioners",
    "online_bookings", "appointment_google_sync",
}


def engine_for(name):
    assert name in {DATABASE, RESTORED}
    return create_engine(f"postgresql+psycopg:///{name}?host={SOCKET}&port={PORT}")


def fingerprint(engine, names):
    with engine.connect() as connection:
        return {
            name: sorted(str(tuple(row)) for row in connection.execute(Base.metadata.tables[name].select()))
            for name in names
        }


def run():
    subprocess.run(["createdb", "-h", SOCKET, "-p", PORT, DATABASE], check=True)
    engine = engine_for(DATABASE)
    assert not inspect(engine).get_table_names(), "Refusing to overwrite a nonempty rehearsal database"
    baseline = [table for table in Base.metadata.sorted_tables if table.name not in NEW_TABLES]
    Base.metadata.create_all(engine, tables=baseline)
    with Session(engine) as session:
        clinic = Clinic(name="CLINICA MIGRATION STAGING", email="migration@example.com", subscription_status="active")
        session.add(clinic)
        session.flush()
        user = User(clinic_id=clinic.id, name="Review Test", email="review@example.com", password_hash="fictional-unused", role=UserRole.owner, active=True)
        patient = Patient(clinic_id=clinic.id, name="Paciente Migration Test")
        practitioner = Practitioner(clinic_id=clinic.id, name="Professional Test", active=True)
        room = Room(clinic_id=clinic.id, name="Room Test", active=True)
        service = Service(clinic_id=clinic.id, name="Service Test", duration_minutes=60, price_cents=5000, active=True)
        session.add_all([user, patient, practitioner, room, service])
        session.flush()
        session.add(Appointment(clinic_id=clinic.id, patient_id=patient.id, practitioner_id=practitioner.id, room_id=room.id, service_id=service.id, date="2026-10-01", start="12:00", end="13:00"))
        session.commit()
        clinic_id, user_id = clinic.id, user.id
    names = {table.name for table in baseline}
    before = fingerprint(engine, names)
    config = Config()
    config.set_main_option("script_location", str(Path(__file__).resolve().parents[1] / "migrations"))
    observed = set()
    stop = threading.Event()

    def observe():
        with engine.connect() as connection:
            while not stop.is_set():
                rows = connection.execute(text("SELECT mode FROM pg_locks WHERE database = (SELECT oid FROM pg_database WHERE datname = current_database())"))
                observed.update(row[0] for row in rows)
                time.sleep(0.005)

    with patch.object(app_db, "database_url", f"postgresql+psycopg:///{DATABASE}?host={SOCKET}&port={PORT}"):
        command.stamp(config, "20260506_1805")
        command.current(config)
        watcher = threading.Thread(target=observe)
        watcher.start()
        started = time.monotonic()
        try:
            command.upgrade(config, "20260907_1200")
        finally:
            duration = time.monotonic() - started
            stop.set()
            watcher.join()
        command.current(config)
        assert fingerprint(engine, names) == before
        with Session(engine) as session:
            original = session.scalar(select(Appointment))
            retained_appointment = Appointment(clinic_id=clinic_id, patient_id=original.patient_id, practitioner_id=original.practitioner_id, room_id=original.room_id, service_id=original.service_id, date=original.date, start="11:00", end="12:00")
            session.add(retained_appointment)
            session.flush()
            retained = AppointmentGoogleSync(clinic_id=clinic_id, appointment_id=retained_appointment.id, google_event_id="event-migration-test", calendar_id="calendar-original-staging", sync_status="synced")
            session.add(retained)
            session.commit()
            retained_id, retained_appointment_id = retained.id, retained_appointment.id
        before_second = fingerprint(engine, names | NEW_TABLES)
        indexes_before = inspect(engine).get_indexes("appointment_google_sync")
        started_second = time.monotonic()
        command.upgrade(config, "20260909_1200")
        second_duration = time.monotonic() - started_second
        command.current(config)
        assert fingerprint(engine, names | NEW_TABLES) == before_second
        assert inspect(engine).get_indexes("appointment_google_sync") == indexes_before
        fk = next(fk for fk in inspect(engine).get_foreign_keys("appointment_google_sync") if fk["constrained_columns"] == ["appointment_id"])
        assert fk["options"]["ondelete"] == "SET NULL", fk
        column = next(column for column in inspect(engine).get_columns("appointment_google_sync") if column["name"] == "appointment_id")
        assert column["nullable"]
    assert set(inspect(engine).get_table_names()) - names - {"alembic_version"} == NEW_TABLES

    raw = "local-staging-concurrent-state"
    with Session(engine) as session:
        session.add(GoogleCalendarOAuthState(clinic_id=clinic_id, user_id=user_id, nonce_hash=hashlib.sha256(raw.encode()).hexdigest(), expires_at=datetime.now(UTC) + timedelta(minutes=10), include_write=False))
        session.commit()
    barrier = threading.Barrier(2)

    def consume():
        with Session(engine) as session:
            barrier.wait(timeout=10)
            return calendar._consume_oauth_state(session, raw) is not None

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: consume(), range(2)))
    assert sorted(results) == [False, True], results

    with Session(engine) as session:
        session.add(GoogleCalendarConnection(clinic_id=clinic_id, user_id=user_id, calendar_id="calendar-staging-test", enabled=True, auto_sync=True, push_klinia_appointments=True, block_busy_times=False, granted_scopes=calendar.GOOGLE_EVENTS_SCOPE))
        session.commit()
        appointment_id = session.scalar(select(Appointment.id).where(Appointment.start == "12:00"))
    remote_events = {}
    remote_posts = []
    barrier = threading.Barrier(2)

    def remote(method, url, **kwargs):
        if method == "POST":
            event_id = kwargs["json_body"]["id"]
            remote_posts.append(event_id)
            assert event_id not in remote_events, "Duplicate remote POST"
            remote_events[event_id] = kwargs["json_body"]
            time.sleep(0.02)
        else:
            event_id = url.rsplit("/", 1)[1]
            if event_id not in remote_events:
                raise calendar.GoogleCalendarEventMissing("missing")
        return {"id": event_id, "status": "confirmed"}

    def sync():
        with Session(engine) as session:
            appointment = session.get(Appointment, appointment_id)
            barrier.wait(timeout=10)
            row = calendar.sync_appointment_to_google(session, appointment, force=True)
            session.commit()
            return row.google_event_id, row.sync_status

    with patch.object(calendar.settings, "google_calendar_rollout_clinic_ids", clinic_id), patch.object(calendar, "_access_token", return_value="test"), patch.object(calendar, "_google_request", side_effect=remote):
        with ThreadPoolExecutor(max_workers=2) as pool:
            sync_results = list(pool.map(lambda _: sync(), range(2)))
    assert len(remote_posts) == 1, remote_posts
    assert len(remote_events) == 1
    assert len(set(sync_results)) == 1 and sync_results[0][1] == "synced", sync_results

    # Manual and public writes share the same clinic/day transaction lock.
    from app import main as app_main
    from app.schemas import AppointmentCreate
    from fastapi import HTTPException
    from starlette.requests import Request

    race_day = datetime.now(UTC).date() + timedelta(days=7)
    while race_day.weekday() >= 5:
        race_day += timedelta(days=1)
    race_date = race_day.isoformat()
    with Session(engine) as session:
        service_id = session.scalar(select(Service.id))
        practitioner_id = session.scalar(select(Practitioner.id))
        room_id = session.scalar(select(Room.id))
        patient_id = session.scalar(select(Patient.id))
        setting = OnlineBookingSetting(
            clinic_id=clinic_id,
            enabled=True,
            slug="migration-race-test",
            min_notice_minutes=0,
            max_days_ahead=90,
            buffer_minutes=0,
            automatic_confirmation=True,
            allow_professional_selection=True,
        )
        session.add(setting)
        session.flush()
        session.add_all([
            OnlineBookingService(clinic_id=clinic_id, settings_id=setting.id, service_id=service_id),
            OnlineBookingPractitioner(clinic_id=clinic_id, settings_id=setting.id, practitioner_id=practitioner_id),
        ])
        session.commit()

    race_barrier = threading.Barrier(2)

    def make_racing_appointment(kind):
        with Session(engine) as session:
            user = session.get(User, user_id)
            race_barrier.wait(timeout=10)
            try:
                if kind == "manual":
                    app_main.create_appointment(
                        AppointmentCreate(
                            patient_id=patient_id,
                            practitioner_id=practitioner_id,
                            room_id=room_id,
                            service_id=service_id,
                            date=race_date,
                            start="13:00",
                            end="14:00",
                        ),
                        user,
                        session,
                    )
                else:
                    request = Request({"type": "http", "method": "POST", "path": "/public/bookings/migration-race-test", "headers": [], "client": ("127.0.0.1", 12345)})
                    calendar.create_public_booking(
                        "migration-race-test",
                        calendar.PublicBookingCreate(
                            service_id=service_id,
                            practitioner_id=practitioner_id,
                            booking_date=race_date,
                            start="13:00",
                            first_name="Paciente",
                            last_name="Concurrente",
                            phone="600333444",
                            email="concurrent@example.com",
                            idempotency_key="postgres-race-booking-001",
                        ),
                        request,
                        session,
                    )
                return kind, "created"
            except HTTPException as exc:
                session.rollback()
                return kind, exc.status_code

    with patch.object(calendar.settings, "google_calendar_rollout_clinic_ids", clinic_id), patch.object(
        calendar, "sync_after_clinical_commit", return_value=None
    ), patch.object(app_main, "sync_after_clinical_commit", return_value=None):
        with ThreadPoolExecutor(max_workers=2) as pool:
            race_results = list(pool.map(make_racing_appointment, ("manual", "public")))
    assert sorted((result for _, result in race_results), key=str) == [409, "created"], race_results
    with Session(engine) as session:
        race_appointments = list(session.scalars(select(Appointment).where(Appointment.clinic_id == clinic_id, Appointment.date == race_date, Appointment.start == "13:00")))
        assert len(race_appointments) == 1, race_results

    # The advisory key is clinic-scoped: another clinic does not wait on this one.
    with Session(engine) as first_lock, Session(engine) as second_lock:
        calendar.lock_appointment_schedule(first_lock, clinic_id, race_date)
        second_lock.execute(text("SET LOCAL lock_timeout = '500ms'"))
        calendar.lock_appointment_schedule(second_lock, "isolated-clinic-id", race_date)
        first_lock.rollback()
        second_lock.rollback()

    from app.main import delete_appointment
    import httpx
    with Session(engine) as session, patch.object(calendar.settings, "google_calendar_rollout_clinic_ids", clinic_id), patch.object(calendar, "_access_token", return_value="test"):
        user = session.get(User, user_id)
        patient_count = len(list(session.scalars(select(Patient.id))))
        with patch.object(calendar, "_google_request", side_effect=httpx.ReadTimeout("simulated")) as request:
            delete_appointment(retained_appointment_id, user, session)
            assert request.call_args.args == ("DELETE", calendar.GOOGLE_CALENDAR_API + "/calendars/calendar-original-staging/events/event-migration-test")
        assert session.get(Appointment, retained_appointment_id) is None
        retained = session.get(AppointmentGoogleSync, retained_id)
        assert retained.appointment_id is None
        assert retained.google_event_id == "event-migration-test"
        assert retained.calendar_id == "calendar-original-staging"
        assert retained.sync_status == "error"
        assert len(list(session.scalars(select(Patient.id)))) == patient_count
        with patch.object(calendar, "_google_request", side_effect=calendar.GoogleCalendarError("HTTP 500")):
            assert calendar.retry_orphaned_google_deletions(session, clinic_id, sync_id=retained_id) == (0, 1)
            session.commit()
        assert retained.google_event_id == "event-migration-test"
        with patch.object(calendar, "_google_request", return_value={}) as request:
            assert calendar.retry_orphaned_google_deletions(session, clinic_id, sync_id=retained_id) == (1, 0)
            session.commit()
            assert request.call_args.args == ("DELETE", calendar.GOOGLE_CALENDAR_API + "/calendars/calendar-original-staging/events/event-migration-test")
        assert retained.appointment_id is None and retained.google_event_id is None
        assert retained.sync_status == "synced"
        with patch.object(calendar, "_google_request") as request:
            assert calendar.retry_orphaned_google_deletions(session, clinic_id, sync_id=retained_id) == (0, 0)
            request.assert_not_called()
        already_missing = AppointmentGoogleSync(clinic_id=clinic_id, appointment_id=None, google_event_id="event-404", calendar_id="calendar-original-staging", sync_status="error")
        other_clinic = Clinic(name="CLINICA ISOLATION STAGING", email="other@example.com", subscription_status="active")
        session.add(other_clinic)
        session.flush()
        foreign = AppointmentGoogleSync(clinic_id=other_clinic.id, appointment_id=None, google_event_id="event-other", calendar_id="calendar-other-staging", sync_status="error")
        session.add_all([already_missing, foreign])
        session.commit()
        with patch.object(calendar, "_google_request", side_effect=calendar.GoogleCalendarEventMissing("missing")) as request:
            assert calendar.retry_orphaned_google_deletions(session, clinic_id, sync_id=foreign.id) == (0, 0)
            request.assert_not_called()
            assert calendar.retry_orphaned_google_deletions(session, clinic_id, sync_id=already_missing.id) == (1, 0)
            session.commit()
        assert already_missing.google_event_id is None and already_missing.sync_status == "synced"
        assert foreign.google_event_id == "event-other" and foreign.sync_status == "error"
        from app.main import update_appointment, AppointmentUpdate
        with patch.object(calendar, "_google_request", side_effect=calendar.GoogleCalendarError("HTTP 500")):
            cancelled = update_appointment(appointment_id, AppointmentUpdate(status=AppointmentStatus.cancelled), user, session)
        assert cancelled.status == AppointmentStatus.cancelled
        attached = session.scalar(select(AppointmentGoogleSync).where(AppointmentGoogleSync.appointment_id == appointment_id))
        assert attached.google_event_id and attached.sync_status == "error"

    archive = f"/tmp/{DATABASE}-backup.dump"
    subprocess.run(["pg_dump", "-h", SOCKET, "-p", PORT, "-Fc", "-f", archive, DATABASE], check=True)
    subprocess.run(["createdb", "-h", SOCKET, "-p", PORT, RESTORED], check=True)
    subprocess.run(["pg_restore", "-h", SOCKET, "-p", PORT, "--exit-on-error", "-d", RESTORED, archive], check=True)
    restored = engine_for(RESTORED)
    assert fingerprint(restored, names | NEW_TABLES) == fingerprint(engine, names | NEW_TABLES)
    with restored.connect() as connection:
        assert connection.scalar(text("SELECT version_num FROM alembic_version")) == "20260909_1200"
    print(json.dumps({"migration_seconds": round(duration, 4), "delete_retry_migration_seconds": round(second_duration, 4), "new_tables": sorted(NEW_TABLES), "baseline_unchanged": True, "fk_set_null_and_indexes_intact": True, "physical_delete_retained_and_retried": True, "delete_404_500_timeout_isolation_and_cancel": True, "observed_lock_modes": sorted(observed), "concurrent_state_one_winner": True, "concurrent_create_one_post": True, "manual_public_race_one_appointment": True, "booking_lock_clinic_isolation": True, "backup_restore_equal": True}))
    restored.dispose()
    engine.dispose()


if __name__ == "__main__":
    run()
