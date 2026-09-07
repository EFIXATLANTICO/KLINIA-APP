# Google Calendar and online booking rollout

This change is additive. Klinia remains the source of truth for appointments. Google Calendar contributes only free/busy availability and, when explicitly enabled by the clinic, a minimal synchronized event.

## 1. Google Cloud

1. Enable **Google Calendar API** in the Google Cloud project used for Klinia.
2. Configure the OAuth consent screen and publish or authorize the test users as appropriate.
3. Create an OAuth 2.0 client of type **Web application**.
4. Add this authorized redirect URI exactly:

   `https://api.kliniasolutions.com/integrations/google-calendar/oauth/callback`

5. Keep the existing Google Login client untouched unless both integrations intentionally share the same Google Cloud project. Calendar OAuth uses its own backend client secret.

The integration requests these scopes:

- `openid`
- `email`
- `https://www.googleapis.com/auth/calendar.freebusy`
- `https://www.googleapis.com/auth/calendar.calendarlist.readonly`
- `https://www.googleapis.com/auth/calendar.events.owned` only when the clinic enables Klinia-to-Google event synchronization

It does not request Gmail, Contacts, Drive, broad Calendar read access, or access to event content. The calendar selector is restricted to calendars owned by the connected account so the write scope remains minimal.

## 2. Render environment

Configure these secret values on the backend service:

- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REDIRECT_URI=https://api.kliniasolutions.com/integrations/google-calendar/oauth/callback`
- `GOOGLE_CALENDAR_TOKEN_KEY`

Generate `GOOGLE_CALENDAR_TOKEN_KEY` once with:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Store the key as a Render secret and keep it stable. Rotating or deleting it without a token migration invalidates existing Calendar connections.

Existing shared settings must remain:

- `FRONTEND_URL=https://www.kliniasolutions.com`
- `DATABASE_URL`
- existing JWT, Stripe, Brevo, and Google Login variables

## 3. Database

Apply migration:

```bash
alembic upgrade head
```

The migration only creates these tables:

- `google_calendar_connections`
- `google_calendar_oauth_states`
- `online_booking_settings`
- `online_booking_services`
- `online_booking_practitioners`
- `online_bookings`
- `appointment_google_sync`

It does not alter or delete existing appointments, patients, billing, reminders, packs, users, or clinics.

If production is not currently Alembic-stamped, do not run a blind full upgrade. Inspect `alembic current` first and use the established Render migration procedure.

## 4. Deployment order

1. Take/confirm a current PostgreSQL backup.
2. Deploy the backend to Render with the four Calendar variables.
3. Apply/verify the new non-destructive tables.
4. Verify `GET /health` returns 200.
5. Verify the authenticated `GET /integrations/google-calendar`.
6. Deploy the frontend to Vercel.
7. Connect a dedicated test calendar from Configuración > Integraciones.
8. Enable online booking for one test service and professional.
9. Verify the public URL `/reservar/{slug}` before enabling it for real clinics.

## 5. Acceptance checks

- A private Google event blocks its interval but its title, description, attendees, location, and contents never reach the public API.
- A public reservation is revalidated on the backend under a PostgreSQL advisory transaction lock.
- Two confirmations for the same slot create one appointment; the second receives HTTP 409.
- Repeating one request with the same idempotency key returns the original booking.
- The created row is a normal Klinia `Appointment`, with source metadata `online_booking`.
- When synchronization is enabled, Google receives only:
  - title: `Klinia - Cita`
  - description: `Gestionada desde Klinia.`
  - date/time and private internal correlation identifiers
- Editing or cancelling in Klinia updates/removes the Google event.
- Deleting the Google event never deletes the Klinia appointment; manual synchronization can recreate it.
- Disconnecting Google clears encrypted credentials and leaves all Klinia data intact.
