import hashlib
import os
import secrets
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception:
    pwd_context = None

def hash_password(password: str) -> str:
    """Hash password using bcrypt or pbkdf2 fallback if bcrypt engine is missing."""
    if pwd_context is not None:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"pbkdf2:{salt}:{key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    if hashed_password.startswith("pbkdf2:"):
        parts = hashed_password.split(":")
        if len(parts) != 3:
            return False
        _, salt, expected_key = parts
        key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return hmac_compare(key.hex(), expected_key)
    if pwd_context is not None:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            return False
    return False

def hmac_compare(a: str, b: str) -> bool:
    return secrets.compare_digest(a, b)
