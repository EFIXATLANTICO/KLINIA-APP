"""Dependency-free transport checks; not a substitute for app integration tests."""
import ast
from pathlib import Path
from types import SimpleNamespace
import unittest


class GoogleTransportTests(unittest.TestCase):
    def setUp(self):
        source = Path(__file__).parents[1] / "app" / "calendar_integration.py"
        tree = ast.parse(source.read_text(encoding="utf-8"))
        function = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == "_google_request")
        self.error = type("GoogleCalendarError", (Exception,), {})
        self.missing = type("GoogleCalendarEventMissing", (self.error,), {})
        self.http_error = type("HTTPError", (Exception,), {})
        self.http = SimpleNamespace(HTTPError=self.http_error, request=None)
        namespace = {"httpx": self.http, "GoogleCalendarError": self.error, "GoogleCalendarEventMissing": self.missing}
        exec(compile(ast.Module(body=[function], type_ignores=[]), str(source), "exec"), namespace)
        self.request = namespace["_google_request"]

    def test_http_errors_do_not_expose_body(self):
        for status in (401, 403, 404, 409, 429, 500):
            with self.subTest(status=status):
                self.http.request = lambda *a, **kw: SimpleNamespace(status_code=status, content=b"sensitive-test-marker")
                with self.assertRaises(self.missing if status == 404 else self.error) as caught:
                    self.request("GET", "https://example.invalid")
                self.assertNotIn("sensitive-test-marker", str(caught.exception))

    def test_transport_error_suppresses_sensitive_context(self):
        def fail(*args, **kwargs):
            raise self.http_error("sensitive-test-marker")
        self.http.request = fail
        with self.assertRaises(self.error) as caught:
            self.request("GET", "https://example.invalid")
        self.assertIsNone(caught.exception.__cause__)
        self.assertTrue(caught.exception.__suppress_context__)
        self.assertNotIn("sensitive-test-marker", str(caught.exception))

    def test_invalid_json_suppresses_sensitive_context(self):
        def fail():
            raise ValueError("sensitive-test-marker")
        self.http.request = lambda *a, **kw: SimpleNamespace(status_code=200, content=b"x", json=fail)
        with self.assertRaises(self.error) as caught:
            self.request("GET", "https://example.invalid")
        self.assertIsNone(caught.exception.__cause__)
        self.assertTrue(caught.exception.__suppress_context__)

    def test_token_is_header_not_url(self):
        calls = []
        def respond(*args, **kwargs):
            calls.append((args, kwargs))
            return SimpleNamespace(status_code=204, content=b"")
        self.http.request = respond
        self.assertEqual(self.request("DELETE", "https://example.invalid/event", access_token="fake-token"), {})
        self.assertEqual(calls[0][0][1], "https://example.invalid/event")
        self.assertEqual(calls[0][1]["headers"]["Authorization"], "Bearer fake-token")
        self.assertIsNone(calls[0][1]["params"])


if __name__ == "__main__":
    unittest.main()
