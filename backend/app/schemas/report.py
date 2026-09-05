from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from backend.app.schemas.user import SimpleUserResponse

class ReportCreate(BaseModel):
    target_type: str  # 'post', 'comment', 'user'
    target_id: int
    reason: str

class ReportResponse(BaseModel):
    id: int
    reporter_id: int
    reporter: SimpleUserResponse
    target_type: str
    target_id: int
    reason: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReportUpdateStatus(BaseModel):
    status: str  # 'resolved', 'dismissed'
