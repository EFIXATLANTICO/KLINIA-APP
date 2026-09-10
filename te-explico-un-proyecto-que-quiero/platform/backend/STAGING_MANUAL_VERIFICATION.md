# Manual staging verification (pending, not evidence of success)

Do not run against production. No deployment is authorized by this checklist.
First verify staging runs the exact reviewed commit. Otherwise results do not
validate the local hardening changes. Record commit, date and timezone.

## Preconditions

- Use only the confirmed PR preview, klinia-api-staging, a fictitious clinic,
  fictitious patient and a dedicated Google staging account/calendar.
- Confirm staging OAuth client and staging callback; never use Production Client.
- Record the fictitious clinic ID privately; allowlist only test clinics.
- Use a future bookable working day, same timezone in Klinia and Google,
  professional 09:00-14:00 and service duration 60 minutes.
- Capture no passwords, OAuth codes, tokens, cookies or environment screens.
- If a test fails, stop and record expected/actual behavior. Do not call it OK.

## Calendar flow and evidence

1. Start disconnected using the test account. Connect from clinic Integrations.
   Expand all OAuth permission details. Expect identity, CalendarList and
   FreeBusy permissions, no unrelated scopes. Capture consent and connected
   clinic view, never callback code. Reconsent/revocation only for this test app.
2. Open calendar selector, choose the owned test calendar and save. Expect
   selected calendar to persist after reload. Capture list and saved selection.
3. In Google create REUNION PRIVADA TEST, 11:00-12:00, Private and Busy.
   In public booking choose test service/professional/date. Expect no 11:00 slot;
   compatible 12:00 slot remains. Capture both views; public view must not show
   event title, description, location or attendees. Visual evidence alone does
   not prove the backend never retrieves those fields.
4. Enable Create Klinia appointments in Google. Complete incremental consent
   for calendar.events.owned if requested. Capture expanded permissions and
   enabled state. Stop if an additional unrelated permission appears.
5. CREATE: reserve 12:00 using a fictitious patient. Expect one appointment in
   staging Agenda and one Klinia - Cita event in Google. Capture both views.
   Authorized staging DB inspection must record sync ID, original calendar ID
   and Google event ID without tokens to prove identity, not just matching title.
6. UPDATE: change 12:00 to 12:30 in Klinia. Reload Google. Expect the same event
   moved, no second event. Capture before/after views and unchanged stored event ID.
7. CANCEL: cancel in Klinia. Expect local canceled status, Google event removed,
   no orphan or duplicate. Capture both views and sync status. Physical deletion
   is a separate test, not equivalent to cancellation.
8. DISCONNECT: record test clinic patient/appointment counts; disconnect only
   this staging integration. Expect inactive connection, no lost local records,
   normal Agenda and Klinia-only availability. Capture counts and views.
   Backend verification of cleared credentials must report booleans only.

## Manual regression

Use fictitious staging records only; do not send real reminders or charge money.
Capture console/network errors without sensitive headers and one result per step.

- Classic login and existing Google Login: correct clinic, normal navigation.
- Agenda day/week/two-month: same records, filters/colors retained after reload.
- Create/edit/move/cancel manual appointment: correct duration, room, professional
  and persisted state with Google disabled.
- Patients/history/templates/consents/legal representative: existing test records
  open and save without unrelated changes or cross-clinic disclosure.
- Billing/performance/packs: test totals unchanged; any pack use/payment exercise
  requires confirmed staging-only side effects and no external production calls.
- Reminders: inspect configuration/queue only unless test delivery is authorized.
- Workers/permissions/settings: allowed actions work; other clinic stays inaccessible.
- Mobile/PWA: navigation, refresh, offline shell and online return; public booking
  and legal pages never replace the authenticated application shell cache.
- Non-allowlisted clinic: Google operations/public booking blocked, normal
  appointment workflows unchanged; removed clinic can still disconnect.

Real Google E2E status: PENDING MANUAL EXECUTION.
