import unittest
from unittest.mock import patch
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
    AppointmentGoogleSync,
    Clinic,
    GoogleCalendarConnection,
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
            calendar, "_google_request", return_value={"id": "google-event-1"}
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
            calendar, "_google_request", return_value={"id": "google-event-a"}
        ) as google_request:
            row = calendar.sync_appointment_to_google(self.db, appointment)

        request_url = google_request.call_args.args[1]
        self.assertEqual(row.clinic_id, self.clinic.id)
        self.assertEqual(row.calendar_id, connection_a.calendar_id)
        self.assertIn("calendar-a%40example.com", request_url)
        self.assertNotIn("calendar-b%40example.com", request_url)

    def test_slug_generation_never_reuses_another_clinic_slug(self):
        other = self.create_secondary_clinic()

        candidate = calendar._unique_slug(self.db, other["clinic"], "clinica-test", other["setting"].id)

        self.assertNotEqual(candidate, self.setting.slug)
        self.assertTrue(candidate.startswith("clinica-test-"))


if __name__ == "__main__":
    unittest.main()
