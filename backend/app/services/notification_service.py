from sqlalchemy.orm import Session
from typing import Optional
from backend.app.models.notification import Notification

def create_notification(
    db: Session,
    recipient_id: int,
    actor_id: int,
    notification_type: str,
    post_id: Optional[int] = None
):
    """Create notification if actor is not the recipient themselves."""
    if recipient_id == actor_id:
        return None

    # Check for existing duplicate unread notification of same type to prevent spam
    existing = db.query(Notification).filter(
        Notification.user_id == recipient_id,
        Notification.actor_id == actor_id,
        Notification.type == notification_type,
        Notification.post_id == post_id,
        Notification.is_read == False
    ).first()

    if existing:
        return existing

    notification = Notification(
        user_id=recipient_id,
        actor_id=actor_id,
        type=notification_type,
        post_id=post_id,
        is_read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
