import unittest
from datetime import UTC, datetime, timedelta

from cryptography.fernet import Fernet
from fastapi import HTTPException
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from starlette.requests import Request

from app import calendar_integration as calendar
from app.db import Base
from app.models import (
    Appointment,
    AppointmentStatus,
    Clinic,
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


class CalendarBookingTests(unittest.TestCase):
    def setUp(self):
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


if __name__ == "__main__":
    unittest.main()
