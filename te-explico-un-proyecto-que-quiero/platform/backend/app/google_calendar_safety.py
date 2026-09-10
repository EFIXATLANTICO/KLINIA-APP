"""Small, dependency-free invariants for the Google Calendar integration."""

import hmac


class UnexpectedGoogleEventId(ValueError):
    """Google confirmed an event other than the one Klinia addressed."""


def require_expected_event_id(expected: str | None, returned: object) -> str:
    """Return the persisted ID only when Google confirms that exact event."""
    expected_value = str(expected or "")
    returned_value = str(returned or "")
    if not expected_value or not returned_value or not hmac.compare_digest(expected_value, returned_value):
        raise UnexpectedGoogleEventId("Google returned an unexpected event identifier")
    return expected_value


def may_reuse_refresh_token(
    *,
    connection_clinic_id: str | None,
    connection_user_id: str | None,
    connection_account_email: str | None,
    callback_clinic_id: str | None,
    callback_user_id: str | None,
    profile_email: str | None,
    profile_email_verified: object,
) -> bool:
    """Permit reuse only when the previous Google identity is provably unchanged."""
    values = (
        connection_clinic_id,
        connection_user_id,
        connection_account_email,
        callback_clinic_id,
        callback_user_id,
        profile_email,
    )
    if profile_email_verified is not True or not all(isinstance(value, str) and value.strip() for value in values):
        return False
    return (
        connection_clinic_id == callback_clinic_id
        and connection_user_id == callback_user_id
        and connection_account_email.strip().casefold() == profile_email.strip().casefold()
    )
