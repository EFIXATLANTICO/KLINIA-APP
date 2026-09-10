"""Tests for invariants that intentionally require only the Python stdlib."""

import importlib.util
import ast
from pathlib import Path
import unittest


SOURCE = Path(__file__).parents[1] / "app" / "google_calendar_safety.py"
SPEC = importlib.util.spec_from_file_location("google_calendar_safety", SOURCE)
safety = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(safety)
CALENDAR_SOURCE = Path(__file__).parents[1] / "app" / "calendar_integration.py"
CALENDAR_TREE = ast.parse(CALENDAR_SOURCE.read_text(encoding="utf-8"))


def calendar_function(name: str) -> ast.FunctionDef:
    return next(node for node in CALENDAR_TREE.body if isinstance(node, ast.FunctionDef) and node.name == name)


class EventIdentityTests(unittest.TestCase):
    def test_first_create_confirms_persisted_identity(self):
        self.assertEqual(safety.require_expected_event_id("event-123", "event-123"), "event-123")

    def test_retry_confirms_same_identity(self):
        self.assertEqual(safety.require_expected_event_id("event-123", "event-123"), "event-123")

    def test_uncertain_retry_rejects_another_identity(self):
        with self.assertRaises(safety.UnexpectedGoogleEventId):
            safety.require_expected_event_id("event-123", "event-456")

    def test_patch_rejects_another_identity(self):
        with self.assertRaises(safety.UnexpectedGoogleEventId):
            safety.require_expected_event_id("event-123", "event-456")

    def test_error_does_not_mutate_persisted_identity(self):
        persisted = "event-123"
        with self.assertRaises(safety.UnexpectedGoogleEventId):
            safety.require_expected_event_id(persisted, "event-456")
        self.assertEqual(persisted, "event-123")

    def test_missing_or_second_identity_is_never_accepted(self):
        for returned in (None, "", "event-456"):
            with self.subTest(returned=returned), self.assertRaises(safety.UnexpectedGoogleEventId):
                safety.require_expected_event_id("event-123", returned)


class RefreshTokenReuseTests(unittest.TestCase):
    def allowed(self, **changes):
        values = {
            "connection_clinic_id": "clinic-a",
            "connection_user_id": "user-a",
            "connection_account_email": "account-a@example.test",
            "callback_clinic_id": "clinic-a",
            "callback_user_id": "user-a",
            "profile_email": "ACCOUNT-A@example.test",
            "profile_email_verified": True,
        }
        values.update(changes)
        return safety.may_reuse_refresh_token(**values)

    def test_same_verified_account_allows_reuse(self):
        self.assertTrue(self.allowed())

    def test_different_account_rejects_reuse(self):
        self.assertFalse(self.allowed(profile_email="account-b@example.test"))

    def test_different_clinic_rejects_reuse(self):
        self.assertFalse(self.allowed(callback_clinic_id="clinic-b"))

    def test_missing_connection_identity_rejects_reuse(self):
        self.assertFalse(self.allowed(connection_account_email=None))

    def test_unverifiable_identity_rejects_reuse(self):
        self.assertFalse(self.allowed(profile_email_verified=False))
        self.assertFalse(self.allowed(profile_email=None))

    def test_different_authorizing_user_rejects_reuse(self):
        self.assertFalse(self.allowed(callback_user_id="user-b"))


class IntegrationWiringTests(unittest.TestCase):
    def test_create_persists_stable_identity_before_remote_request(self):
        node = calendar_function("sync_appointment_to_google")
        source = ast.unparse(node)
        identity_offset = source.index("row.google_event_id = hashlib.sha256")
        commit_offset = source.index("db.commit()", identity_offset)
        post_offset = source.index("_google_request('POST'", commit_offset)
        self.assertLess(identity_offset, commit_offset)
        self.assertLess(commit_offset, post_offset)

    def test_reconciliation_required_blocks_remote_retries(self):
        node = calendar_function("sync_appointment_to_google")
        guard = next(
            item
            for item in ast.walk(node)
            if isinstance(item, ast.If)
            and "row.sync_status == 'reconciliation_required'" in ast.unparse(item.test)
        )
        self.assertTrue(any(isinstance(item, ast.Return) for item in guard.body))
        first_remote_line = min(
            item.lineno
            for item in ast.walk(node)
            if isinstance(item, ast.Call)
            and isinstance(item.func, ast.Name)
            and item.func.id == "_google_request"
        )
        self.assertLess(guard.lineno, first_remote_line)

    def test_sync_assigns_only_a_validated_event_identity(self):
        source = ast.unparse(calendar_function("sync_appointment_to_google"))
        self.assertIn("row.google_event_id = require_expected_event_id(row.google_event_id, event.get('id'))", source)
        self.assertNotIn("row.google_event_id = str(event", source)
        self.assertIn("row.sync_status == 'reconciliation_required'", source)
        self.assertIn("except UnexpectedGoogleEventId", source)

    def test_callback_decrypts_previous_refresh_only_for_same_identity(self):
        source = ast.unparse(calendar_function("google_calendar_oauth_callback"))
        self.assertIn("_decrypt(connection.refresh_token_encrypted) if same_google_identity else None", source)
        self.assertIn("connection.refresh_token_encrypted = None", source)
        self.assertIn("connection.calendar_id = 'primary'", source)


if __name__ == "__main__":
    unittest.main()
