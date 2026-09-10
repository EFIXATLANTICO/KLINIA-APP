"""Static contract checks for the shared PostgreSQL appointment lock."""

import ast
from pathlib import Path
import unittest


BACKEND = Path(__file__).parents[1]


def function(path: Path, name: str) -> ast.FunctionDef:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    return next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == name)


def call_lines(node: ast.AST, name: str) -> list[int]:
    result = []
    for item in ast.walk(node):
        if not isinstance(item, ast.Call):
            continue
        if isinstance(item.func, ast.Name):
            called = item.func.id
        elif isinstance(item.func, ast.Attribute):
            called = item.func.attr
        else:
            continue
        if called == name:
            result.append(item.lineno)
    return result


class SharedScheduleLockTests(unittest.TestCase):
    def assert_commit_before_google_sync(self, path: Path, name: str) -> None:
        node = function(path, name)
        self.assertLess(max(call_lines(node, "commit")), call_lines(node, "sync_after_clinical_commit")[0])

    def test_manual_create_locks_before_schedule_validation(self):
        node = function(BACKEND / "app" / "main.py", "create_appointment")
        self.assertLess(call_lines(node, "lock_appointment_schedule")[0], call_lines(node, "validate_appointment_schedule")[0])

    def test_schedule_lock_key_contains_clinic_and_date(self):
        source = ast.unparse(function(BACKEND / "app" / "calendar_integration.py", "lock_appointment_schedule"))
        self.assertIn("clinic_id", source)
        self.assertIn("booking_date", source)
        self.assertIn("pg_advisory_xact_lock", source)

    def test_manual_update_locks_before_schedule_validation(self):
        node = function(BACKEND / "app" / "main.py", "update_appointment")
        self.assertLess(call_lines(node, "lock_appointment_schedule")[0], call_lines(node, "validate_appointment_schedule")[0])

    def test_public_booking_uses_the_same_lock(self):
        node = function(BACKEND / "app" / "calendar_integration.py", "create_public_booking")
        lock_line = call_lines(node, "lock_appointment_schedule")
        availability_lines = sorted(call_lines(node, "_availability_candidates"))
        self.assertEqual(len(lock_line), 1)
        self.assertEqual(len(availability_lines), 2)
        self.assertLess(availability_lines[0], lock_line[0])
        self.assertLess(lock_line[0], availability_lines[1])
        local_recheck = [
            item for item in ast.walk(node)
            if isinstance(item, ast.Call)
            and isinstance(item.func, ast.Name)
            and item.func.id == "_availability_candidates"
            and any(keyword.arg == "include_google" and isinstance(keyword.value, ast.Constant) and keyword.value.value is False for keyword in item.keywords)
        ]
        self.assertEqual(len(local_recheck), 1)

    def test_google_sync_never_locks_the_clinical_appointment_row(self):
        sync = function(BACKEND / "app" / "calendar_integration.py", "sync_appointment_to_google")
        for item in ast.walk(sync):
            if not isinstance(item, ast.Call) or not isinstance(item.func, ast.Attribute) or item.func.attr != "with_for_update":
                continue
            rendered = ast.unparse(item.func.value)
            self.assertNotIn("select(Appointment)", rendered)
        source = ast.unparse(sync)
        self.assertIn("AppointmentGoogleSync", source)
        self.assertIn("with_for_update", source)
        self.assertIn("_lock_google_appointment_sync", source)

    def test_clinical_create_and_update_commit_before_google(self):
        main = BACKEND / "app" / "main.py"
        self.assert_commit_before_google_sync(main, "create_appointment")
        self.assert_commit_before_google_sync(main, "update_appointment")

    def test_public_booking_commits_before_google_sync(self):
        self.assert_commit_before_google_sync(BACKEND / "app" / "calendar_integration.py", "create_public_booking")


if __name__ == "__main__":
    unittest.main()
