# Google Calendar production rollout

This runbook covers the controlled production rollout of Google Calendar and
online booking. Klinia remains the source of truth. Google integration failures
must never roll back a committed Klinia appointment, patient, billing, or agenda
operation.

## 1. Google Production configuration

Use only the Google Cloud project `Klinia Calendar Production` and the OAuth web
client `Klinia Production Web`.

Authorized redirect URI:

`https://api.kliniasolutions.com/integrations/google-calendar/oauth/callback`

Required scopes only:

- `openid`
- `email`
- `https://www.googleapis.com/auth/calendar.freebusy`
- `https://www.googleapis.com/auth/calendar.calendarlist.readonly`
- `https://www.googleapis.com/auth/calendar.events.owned`, requested
  incrementally when the clinic enables Klinia-to-Google synchronization

Do not use the staging OAuth client, Render staging URLs, Vercel Preview URLs,
or additional Google APIs/scopes.

## 2. Production environment

Configure these values only on the production backend service:

- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REDIRECT_URI=https://api.kliniasolutions.com/integrations/google-calendar/oauth/callback`
- `GOOGLE_CALENDAR_TOKEN_KEY`
- `GOOGLE_CALENDAR_ROLLOUT_CLINIC_IDS`

Generate a new Fernet key exclusively for production and store it as a secret.
Keep it stable after connections exist. Never copy the staging key or expose any
of these values in logs, screenshots, tickets, or chat.

The first production deployment must use an unset or empty
`GOOGLE_CALENDAR_ROLLOUT_CLINIC_IDS`. Both forms authorize zero clinics. Do not
add a clinic ID until the no-Google production smoke test passes.

## 3. Database migration

The required linear migration chain is:

`20260506_1805 -> 20260907_1200 -> 20260909_1200`

Before deployment, run read-only checks from the production backend shell:

```bash
alembic current
alembic heads
```

The expected starting revision is `20260506_1805`; the expected repository head
is `20260909_1200`. Stop if either value differs.

The production upgrade command is:

```bash
alembic upgrade 20260909_1200
```

Run it as the Render pre-deploy command for the exact reviewed merge commit, so
the build contains both migration files and the upgrade completes before the new
backend receives traffic. After deployment, `alembic current` must report
`20260909_1200`.

`20260907_1200` creates seven additive Calendar/booking tables.
`20260909_1200` makes `appointment_google_sync.appointment_id` nullable and
changes its appointment foreign key to `ON DELETE SET NULL`, preserving failed
Google deletion targets. It sets bounded PostgreSQL lock and statement timeouts.

Never use `alembic downgrade` as a production rollback. Keep the additive tables
in place unless a separately reviewed data-migration plan explicitly replaces
them.

## 4. Controlled deployment order

1. Confirm production service/database IDs, branches, deployed SHAs, health,
   Auto-Deploy settings, and the canonical Vercel project.
2. Prevent Render and Vercel from releasing the merge automatically before the
   controlled sequence is ready.
3. Create a fresh production PostgreSQL export or recovery point and verify it
   is available. Record its timestamp.
4. Record the current `main`, Render deployment, Vercel deployment, and Alembic
   revision.
5. Prepare the five Calendar variables with the rollout allowlist empty.
6. Merge only the reviewed PR after all CI checks pass and record the merge SHA.
7. Manually deploy that exact SHA to `klinia-api`; its pre-deploy command applies
   the migration before traffic switches.
8. Require `alembic current=20260909_1200`, `GET /health=200`,
   `env=production`, backend setup `ready`, and clean logs.
9. Release only the canonical Vercel production project and verify that it calls
   `https://api.kliniasolutions.com`, never staging.
10. Complete the no-Google smoke test while the allowlist remains empty.

## 5. No-Google smoke test

Verify homepage, classic login, existing Google Login, Agenda day/week/two-month
views, professional filters/colors, local appointment create/edit/move/cancel,
patients, workers, rooms, permissions, settings, reminders, packs, billing,
performance, navigation, and PWA/service-worker refresh.

Expected result: normal Klinia behavior, no Google network calls, no Calendar
sync rows for ordinary appointments, OAuth blocked for real clinics, and public
booking unavailable for non-allowlisted clinic slugs.

## 6. Review clinic and production OAuth check

Create only the fictitious `CLINICA GOOGLE REVIEW` after the smoke test. Use slug
`clinica-google-review`, owner `google-review@kliniasolutions.com`, practitioner
`ANGEL REVIEW`, service `Fisioterapia Review - 60 min`, room `SALA REVIEW`,
and patient `Paciente Google Review`.

Read its clinic ID from the authenticated `/me` response and cross-check it in
the Superadmin clinic record. Set the rollout variable to that one exact ID,
restart/deploy the configuration safely, and confirm every other clinic remains
blocked.

Run OAuth Production, CalendarList selection, private-event FreeBusy blocking,
incremental `calendar.events.owned` consent, CREATE, UPDATE of the same stored
Google event ID, DELETE, and DISCONNECT. Capture no tokens, secrets, OAuth codes,
cookies, headers, or real clinical data.

After the review/video, empty the allowlist again unless the approved pilot is
starting immediately.

## 7. Monitoring and rollback

For the first 30 minutes inspect `/health`, HTTP 5xx, authentication failures,
database/Alembic errors, lock timeouts, failed bookings, OAuth callback errors,
Google failures, `reconciliation_required`, duplicate events, and latency.

- Level 1: empty the allowlist for a Google-only incident.
- Level 2: restore the previous Render/Vercel deployments for a core regression.
- Level 3: use the verified recovery copy only for confirmed database corruption.

Do not delete appointments, patients, connections, or additive tables during
rollback. Google disabled must leave normal Klinia operation available.

## 8. Progressive rollout

Add clinic IDs one at a time only after the review clinic passes. Verify OAuth,
availability, synchronization, booking, logs, billing, and performance after
each cohort. Never begin with a mass allowlist.
