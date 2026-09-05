from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from backend.app.schemas.user import SimpleUserResponse

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    actor_id: int
    actor: SimpleUserResponse
    type: str
    post_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
