from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


def _truncate_password(password: str) -> str:
    """Truncates password to 72 bytes for bcrypt compatibility."""
    encoded = password.encode("utf-8")
    if len(encoded) > 72:
        # Truncate to 72 bytes and decode back to string, ignoring partial characters
        return encoded[:72].decode("utf-8", errors="ignore")
    return password


def hash_password(password: str) -> str:
    """Hashes password using direct bcrypt library to bypass passlib limit."""
    truncated = _truncate_password(password)
    # bcrypt requires bytes
    b_password = truncated.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(b_password, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies password using direct bcrypt library."""
    try:
        truncated = _truncate_password(plain_password)
        b_password = truncated.encode("utf-8")
        b_hashed = hashed_password.encode("utf-8")
        return bcrypt.checkpw(b_password, b_hashed)
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=settings.JWT_EXPIRATION_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"id": int(user_id), "email": payload.get("email"), "role": payload.get("role", "user")}


async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        return None
    try:
        payload = decode_token(credentials.credentials)
        return {"id": int(payload.get("sub")), "email": payload.get("email"), "role": payload.get("role", "user")}
    except HTTPException:
        return None
