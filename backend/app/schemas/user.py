from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    is_admin: bool = False

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    followers_count: int = 0
    following_count: int = 0
    total_posts: int = 0
    total_likes: int = 0
    is_following: Optional[bool] = False

    class Config:
        from_attributes = True

class SimpleUserResponse(BaseModel):
    id: int
    username: str
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True
