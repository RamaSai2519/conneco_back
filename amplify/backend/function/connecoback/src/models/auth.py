from bson import ObjectId
from typing import Optional
from dataclasses import dataclass, field

@dataclass
class User:
    """User data structure."""
    id: str
    name: str
    password: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    partner: Optional[ObjectId] = None

    def to_dict(self) -> dict[str, any]:
        """Convert user to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'password': self.password,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def to_safe_dict(self) -> dict[str, any]:
        """Convert user to dictionary without password."""
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


@dataclass
class Output:
    """Common response structure."""
    success: bool = field(default=True)
    data: Optional[dict[str, any]] = None
    error: str = field(default_factory=lambda: '')

    def to_dict(self) -> dict[str, any]:
        """Convert to dictionary."""
        return {
            'success': self.success,
            'data': self.data,
            'error': self.error
        }
