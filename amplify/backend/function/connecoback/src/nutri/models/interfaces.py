from bson import ObjectId
from typing import Optional
from datetime import datetime
from dataclasses import dataclass, field


@dataclass
class User:
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    _id: Optional[ObjectId] = None
    createdDate: datetime = field(default_factory=datetime.now)


@dataclass
class LoginInput:
    phone: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


@dataclass
class Output:
    msg: str = field(default_factory=lambda: '')
    data: dict = field(default_factory=lambda: {})
    status: str = field(default_factory=lambda: 'SUCCESS')
