from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from backend.app.schemas.user import SimpleUserResponse

class MediaResponse(BaseModel):
    id: int
    media_url: str
    media_type: str
    file_size: int
    width: Optional[int] = None
    height: Optional[int] = None

    class Config:
        from_attributes = True

class PostCreate(BaseModel):
    caption: Optional[str] = None
    category: str
    hashtags: Optional[str] = None  # Comma or space separated string

class PostResponse(BaseModel):
    id: int
    user_id: int
    author: SimpleUserResponse
    caption: Optional[str] = None
    category: str
    created_at: datetime
    updated_at: datetime
    media: List[MediaResponse] = []
    hashtags: List[str] = []
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False

    class Config:
        from_attributes = True
