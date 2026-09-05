from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.post import Post
from backend.app.models.like import Like
from backend.app.models.user import User
from backend.app.auth.dependencies import get_current_user
from backend.app.services.notification_service import create_notification

router = APIRouter(prefix="/api/posts", tags=["Likes"])

@router.post("/{post_id}/like", status_code=status.HTTP_201_CREATED)
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()

    if existing:
        return {"message": "Already liked", "likes_count": len(post.likes)}

    new_like = Like(user_id=current_user.id, post_id=post_id)
    db.add(new_like)
    db.commit()

    # Trigger notification
    create_notification(
        db=db,
        recipient_id=post.user_id,
        actor_id=current_user.id,
        notification_type="like",
        post_id=post_id
    )

    likes_count = db.query(Like).filter(Like.post_id == post_id).count()
    return {"message": "Post liked successfully", "likes_count": likes_count}

@router.delete("/{post_id}/like", status_code=status.HTTP_200_OK)
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()

    if not existing:
        likes_count = db.query(Like).filter(Like.post_id == post_id).count()
        return {"message": "Not liked yet", "likes_count": likes_count}

    db.delete(existing)
    db.commit()

    likes_count = db.query(Like).filter(Like.post_id == post_id).count()
    return {"message": "Post unliked successfully", "likes_count": likes_count}
