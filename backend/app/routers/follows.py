from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.follow import Follow
from backend.app.auth.dependencies import get_current_user
from backend.app.services.notification_service import create_notification

router = APIRouter(prefix="/api/users", tags=["Follows"])

@router.post("/{user_id}/follow", status_code=status.HTTP_201_CREATED)
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    if existing:
        followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
        return {"message": "Already following user", "followers_count": followers_count, "is_following": True}

    new_follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.add(new_follow)
    db.commit()

    # Trigger notification
    create_notification(
        db=db,
        recipient_id=user_id,
        actor_id=current_user.id,
        notification_type="follow"
    )

    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    return {"message": "Successfully followed user", "followers_count": followers_count, "is_following": True}

@router.delete("/{user_id}/follow", status_code=status.HTTP_200_OK)
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    if not existing:
        followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
        return {"message": "Not following user", "followers_count": followers_count, "is_following": False}

    db.delete(existing)
    db.commit()

    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    return {"message": "Successfully unfollowed user", "followers_count": followers_count, "is_following": False}
