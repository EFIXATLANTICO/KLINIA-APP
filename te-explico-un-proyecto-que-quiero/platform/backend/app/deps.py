from datetime import UTC, datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .db import get_db
from .models import User, UserRole
from .security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user_id = payload.get("sub")
    clinic_id = payload.get("clinic_id")
    user = db.get(User, user_id)
    if not user or not user.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if user.role == UserRole.superadmin:
        if payload.get("role") != UserRole.superadmin.value:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return user
    if not clinic_id or user.clinic_id != clinic_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def require_roles(*roles: UserRole):
    def dependency(user: User = Depends(current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return dependency


def require_superadmin(user: User = Depends(current_user)) -> User:
    if user.role != UserRole.superadmin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Superadmin access required")
    return user


def subscription_allows_use(user: User) -> bool:
    if user.role == UserRole.superadmin:
        return True
    clinic = user.clinic
    if not clinic:
        return False
    subscription_status = clinic.subscription_status or "trialing"
    if subscription_status == "active":
        return True
    if clinic.trial_ends_at:
        trial_ends_at = clinic.trial_ends_at
        if trial_ends_at.tzinfo is None:
            trial_ends_at = trial_ends_at.replace(tzinfo=UTC)
        if trial_ends_at >= datetime.now(UTC):
            return True
    if subscription_status in {"trial", "trialing"}:
        if not clinic.trial_ends_at:
            return True
        return False
    return False


def current_subscribed_user(user: User = Depends(current_user)) -> User:
    if not subscription_allows_use(user):
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription inactive or trial expired")
    return user


def require_subscribed_roles(*roles: UserRole):
    def dependency(user: User = Depends(current_subscribed_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return dependency
