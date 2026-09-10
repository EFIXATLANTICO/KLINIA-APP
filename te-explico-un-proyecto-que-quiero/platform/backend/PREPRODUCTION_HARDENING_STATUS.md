# PR 7 preproduction verification - 2026-09-10

Status: FUNCTIONAL AND STAGING VALIDATION COMPLETE. The code is suitable for a
controlled review deployment after the operational production gates below pass.

## Validated functional baseline

Branch: `codex/google-calendar-booking-20260907`

Functional commit validated before this documentation-only update:
`1f325fd853cbaf13b171504d6a3cd41b7e079216`

- Calendar integration suite: 51/51 PASS.
- Python regression suite: 81/81 PASS.
- Frontend JavaScript and service-worker checks: PASS.
- PostgreSQL concurrency: manual versus public booking, duplicate booking,
  OAuth-state consumption, concurrent Google CREATE, and clinic/date advisory
  lock isolation PASS.
- Migration rehearsal and isolated backup/restore PASS.
- Staging OAuth, CalendarList, FreeBusy, incremental consent, CREATE, UPDATE of
  the same event, DELETE, DISCONNECT, double booking, application regression,
  mobile/PWA, logs, and zero production calls PASS.

## Hardened behavior

- Google CREATE uses a stable appointment identity and does not accept a second
  unexpected remote event ID.
- PATCH and DELETE retain the original Google event and calendar IDs.
- Klinia clinical commits complete before best-effort Google synchronization.
- Failed cancellation/deletion remains retryable without undoing local state.
- OAuth state is random, clinic/user-bound, expiring, one-use, and consumed
  atomically.
- Disconnect clears local credentials even when decryption or Google revocation
  fails; token values and credential-bearing URLs are not logged.
- An unset or empty rollout allowlist performs no Google calls for normal clinic
  operations and authorizes no OAuth, sync, FreeBusy, or public booking.
- Public and manual bookings use the same PostgreSQL clinic/date schedule lock.

## Migration evidence

Validated chain:

`20260506_1805 -> 20260907_1200 -> 20260909_1200`

Observed disposable PostgreSQL durations were approximately 0.34 seconds and
0.25 seconds. Seven additive tables were created, baseline row fingerprints and
indexes remained intact, and the final appointment sync foreign key used
`ON DELETE SET NULL`. A custom-format backup restored successfully into a
separate disposable database. No downgrade was used.

These measurements do not prove the absence of production schema drift or
guarantee the production lock duration. Production `alembic current`, a current
Render recovery/export, and a quiet deployment window remain mandatory.

## Operational gates before merge/deploy

- Confirm production Render service/database IDs, branch, deployed SHA, region,
  plan, PostgreSQL version, health, and Auto-Deploy state.
- Identify the single Vercel project that owns `www.kliniasolutions.com`; contain
  automatic releases from it and any duplicate Git-connected projects.
- Verify a fresh production PostgreSQL export or recovery point.
- Require production `alembic current=20260506_1805` and repository
  `alembic heads=20260909_1200` before upgrade.
- Configure the Production OAuth client values and an empty rollout allowlist.
- Rotate the exposed staging PostgreSQL credential, update every staging
  consumer, verify staging health/database access, and remove the temporary
  `Angel WSL temporal` access rule.

No merge, production deployment, production migration, production variable
change, Google Cloud change, or production data creation is recorded by this
document update.
