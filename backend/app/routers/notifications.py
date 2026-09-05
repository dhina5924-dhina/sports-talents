from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models.notification import Notification
from backend.app.models.user import User
from backend.app.schemas.notification import NotificationResponse
from backend.app.schemas.user import SimpleUserResponse
from backend.app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=Dict[str, Any])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(desc(Notification.created_at)).limit(50).all()

    unread_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()

    res_list = []
    for n in notifications:
        res_list.append(NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            actor_id=n.actor_id,
            actor=SimpleUserResponse.from_orm(n.actor),
            type=n.type,
            post_id=n.post_id,
            is_read=n.is_read,
            created_at=n.created_at
        ))

    return {
        "unread_count": unread_count,
        "notifications": res_list
    }

@router.put("/read", status_code=status.HTTP_200_OK)
def mark_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    return {"message": "All notifications marked as read"}
