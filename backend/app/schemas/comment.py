from pydantic import BaseModel
from datetime import datetime
from backend.app.schemas.user import SimpleUserResponse

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    user_id: int
    post_id: int
    user: SimpleUserResponse
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
