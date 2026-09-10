"""Dependency-free checks preventing Google credentials from entering logs/URLs."""

import ast
from pathlib import Path
import unittest


SOURCE = Path(__file__).parents[1] / "app" / "calendar_integration.py"
TREE = ast.parse(SOURCE.read_text(encoding="utf-8"))
SENSITIVE_NAMES = {"access_token", "refresh_token", "previous_refresh", "token", "token_data", "client_secret"}


def function(name: str) -> ast.FunctionDef:
    return next(node for node in TREE.body if isinstance(node, ast.FunctionDef) and node.name == name)


class GoogleLoggingTests(unittest.TestCase):
    def test_logger_calls_never_reference_credential_variables(self):
        for node in ast.walk(TREE):
            if not isinstance(node, ast.Call) or not isinstance(node.func, ast.Attribute):
                continue
            if not isinstance(node.func.value, ast.Name) or node.func.value.id != "logger":
                continue
            referenced = {item.id for arg in node.args for item in ast.walk(arg) if isinstance(item, ast.Name)}
            self.assertFalse(referenced & SENSITIVE_NAMES, f"sensitive logger arguments at line {node.lineno}")

    def test_google_request_puts_credentials_only_in_authorization_header(self):
        source = ast.unparse(function("_google_request"))
        self.assertIn("headers['Authorization']", source)
        self.assertNotIn("urlencode", source)
        self.assertNotIn("access_token=", source)

    def test_revocation_uses_request_body_not_query_parameters(self):
        disconnect = function("disconnect_google_calendar")
        calls = [
            node for node in ast.walk(disconnect)
            if isinstance(node, ast.Call)
            and isinstance(node.func, ast.Attribute)
            and isinstance(node.func.value, ast.Name)
            and node.func.value.id == "httpx"
            and node.func.attr == "post"
        ]
        self.assertEqual(len(calls), 1)
        keywords = {item.arg for item in calls[0].keywords}
        self.assertIn("data", keywords)
        self.assertNotIn("params", keywords)


if __name__ == "__main__":
    unittest.main()
