# PR 7 hardening checkpoint - 2026-09-10

Status: CODE HARDENING COMPLETE. Runtime, PostgreSQL and manual E2E validation remain pending.

## Current offline rerun (2026-09-10)

No downloads or dependency installs. Available: Python 3.14.4, pip 25.1.1,
Node 22.22.1, npm 9.2.0, PostgreSQL 18.6 binaries. No installed SQLAlchemy,
FastAPI, Alembic, pytest or psycopg driver was found in the active Python.
No alternative virtual environment was found under /home (depth five).
initdb succeeded in /tmp/klinia-pr7-audit-pg; pg_ctl failed because the sandbox
refused the Unix socket with Operation not permitted. No server remains running.
No alternate socket/network route or approval bypass was attempted.

CURRENT PASS: 30 dependency-free tests cover event-ID invariants, refresh-token
reuse rules, callback/sync wiring, six HTTP failures, transport and JSON errors,
credential placement, logging, transaction ordering and shared schedule-lock
wiring. These are pure or static tests, not FastAPI/database integration tests.
JSON error chaining suppresses the original parser error. Service-worker
isolation and syntax checks for all nine frontend JavaScript/CJS files passed.
All 19 backend app/test/migration Python files parse successfully.
Legal HTML/CSS equal local main, rewrite sources are unique, original migration
equals HEAD. A heuristic scan of the application source directories found no
private keys, token literals or credential-bearing URLs matching its patterns;
this is not an exhaustive secret/history audit.

CURRENT BLOCKED: backend runtime suite, Alembic rehearsal, backup/restore and
PostgreSQL concurrency (including double booking), due missing Python packages
and denied socket creation. The current full-suite attempt stops at
`ModuleNotFoundError: No module named 'httpx'`. Earlier 41-test and migration
results below remain historical only. Browser/real Google E2E is pending manual
execution, not attempted.

Code changes now close the identified static blockers:
- POST/PATCH responses must confirm the exact persisted event ID. A mismatch
  becomes reconciliation_required, preserves the original ID and blocks every
  automatic or forced retry. A timeout still reconciles only the deterministic ID.
- A prior refresh credential is reusable only for a verified matching Google
  email, clinic and authorizing user. A verified account switch without a new
  refresh credential clears the old local credentials and disconnects safely.
- Clinical create/update/public-booking transactions commit before Google sync.
  Synchronization no longer locks the appointments row. It retains only a
  clinic/appointment integration advisory lock and appointment_google_sync row
  lock while calling Google, because those locks serialize one remote event.
- Public FreeBusy runs before the clinic/day schedule lock. After taking that
  lock, availability is recomputed locally without Google and patient matching
  is repeated. Manual create/update and public booking now use the same lock.
- A cancellation following an uncertain CREATE retains its deterministic ID
  after the first missing DELETE response; an explicit confirmed retry closes it.

The full dependency-backed suite now contains 51 Calendar integration tests plus
30 dependency-free tests. Only the 30 dependency-free tests can run currently.

Local branch: codex/google-calendar-booking-20260907.
Starting HEAD before local reconciliation/hardening commits:
b4a2e9c3a1535664e8399fead47c95b600ecb0bd.
Main remains 4d7282e35bea4cd75eb8257a916e114907d2e6d3.
Reconciliation with origin/main has resolved conflicts but is not committed.
No push, remote PR merge, deployment, production data access or Google Cloud change.

## Verified locally

- Python 3.12 isolated environment in /tmp/klinia-pr7-tests; repo dependencies unchanged.
- 41 unittest tests passed in the previous local test session, including existing clinic isolation tests and retained deletion retries.
- CREATE stable identity is persisted before sending a Google event. Uncertain results use a GET limited to id/status for the managed event; an explicit retry after not-found reuses the same identity.
- PostgreSQL two-worker test with a simulated Google service produced one POST and one remote event.
- PATCH retries keep event-123 and the original calendar. Calendar selection changes do not redirect DELETE.
- Create/update/cancel and public booking commit clinical data before best-effort Google synchronization. Physical deletion now commits locally before retrying Google deletion using the retained sync record.
- Disconnect clears local credentials before revocation; corrupt ciphertext and revoke timeout are tested. Revocation uses a request body.
- OAuth state uses conditional UPDATE RETURNING and commits consumption before token exchange. PostgreSQL simultaneous consumption accepts one callback only.
- Empty allowlist skips connection/sync queries in appointment synchronization and removal helpers.
- Google error response bodies are excluded from error messages; integration logger.exception calls removed. This is not an exhaustive repository secret scan.
- Missing/wrong-calendar or malformed FreeBusy data fails closed.
- Public legal/booking/portfolio navigation cannot overwrite the application shell cache; Node VM test passed.
- Backend import and Python syntax checks passed before the additional migration. The new migration revision is 20260909_1200; the PostgreSQL rehearsal reached this head.

## PostgreSQL rehearsal

tests/postgres_calendar_rehearsal.py only targets a private local Unix socket,
port 55437, in /tmp/klinia-pr7-staging-postgres. Each execution creates fresh
databases named klinia_pr7_staging_<random> and a separate restore database.

The predecessor schema is reconstructed from non-Calendar model tables and
stamped 20260506_1805. This is NOT a snapshot of production, nor proof that
production has no schema drift. Fictitious clinic/user/patient/practitioner/
room/service/appointment records are inserted before running Alembic.

Last successful chain: 20260506_1805 -> 20260907_1200 -> 20260909_1200.
Observed durations were 0.3377 and 0.2538 seconds respectively. Seven additional
tables, all baseline rows unchanged. The new migration makes appointment_id
nullable with ON DELETE SET NULL; row fingerprints and indexes were preserved.
Tests covered physical deletion with timeout, retry with HTTP 500, successful
retry, HTTP 404, cross-clinic isolation and normal cancellation with Google failure.
The existing calendar_id field retains the original Google calendar identifier.
Observed lock modes for the first migration include AccessExclusiveLock,
AccessShareLock, RowExclusiveLock, ShareLock and ShareRowExclusiveLock.
The second migration's locks were not sampled. Sampling does not establish a
production lock budget. The original 20260907_1200 migration is unchanged.
pg_dump custom archive restored with pg_restore --exit-on-error into a separate
database; model table rows and Alembic revision match. No downgrade was used.

## Environment checkpoint

On resuming, /tmp/klinia-pr7-tests, /tmp/klinia-pr7-python and
/tmp/klinia-pr7-staging-postgres no longer exist. Previous Python/PostgreSQL
results above are historical observations, not a fresh rerun. The temporary
test runtime and disposable database must be rebuilt to reproduce them.
The latest browser download approval was rejected because the approval service
reported the workspace was out of credits. No alternative download was attempted.
Node syntax validation for app.js and the service-worker isolation test passed
again on this resume. git diff --check passed; no unresolved Git entries remain.

## Still open

- Reproduce the successful new-migration tests after restoring the disposable
  local test environment. No production migration or downgrade was executed.
- Execute the prepared PostgreSQL manual-vs-public race test. Static wiring and
  sequential integration tests exist, but PostgreSQL execution is still required.
- Execute the 51 dependency-backed Calendar integration tests, including account
  switching and uncertain-CREATE cancellation behavior.
- Complete general UI/regression testing, PWA browser tests and a comprehensive
  secret scan including environment configuration and Git history.
- Real Google staging E2E has NOT run. Remote staging was not deployed; production
  OAuth was not used. Latest user instruction prohibits deployments.
- Workflow changes are prepared locally; remote CI has NOT run on these edits.
- Remote CI has not validated the prepared migration/concurrency workflow.

Verdict: A1 - IDENTIFIED CODE BLOCKERS CLOSED; PostgreSQL/integration/manual E2E validation remains mandatory before deployment.
