"""
Type definitions for authentication-related data structures.
"""
from typing import Dict, Any, Optional, TypedDict
from dataclasses import dataclass


class LoginRequest(TypedDict):
    """Login request payload."""
    password: str


class SignupRequest(TypedDict):
    """Signup request payload."""
    name: str
    password: str


class RefreshRequest(TypedDict):
    """Refresh token request payload."""
    refresh: str


@dataclass
class AuthTokens:
    """Authentication tokens."""
    access: str
    refresh: str


@dataclass
class User:
    """User data structure."""
    id: str
    name: str
    password: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'password': self.password,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def to_safe_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary without password."""
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@dataclass
class LoginResponse:
    """Login response payload."""
    user: Dict[str, Any]
    tokens: AuthTokens

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'user': self.user,
            'tokens': {
                'access': self.tokens.access,
                'refresh': self.tokens.refresh
            }
        }


@dataclass
class JWTPayload:
    """JWT payload structure."""
    user_id: str
    user_pass: str
    exp: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'user_id': self.user_id,
            'user_pass': self.user_pass,
            'exp': self.exp
        }
