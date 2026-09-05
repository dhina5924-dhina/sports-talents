from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from backend.app.database import get_db
from backend.app.models.post import Post
from backend.app.models.comment import Comment
from backend.app.models.user import User
from backend.app.schemas.comment import CommentCreate, CommentResponse
from backend.app.schemas.user import SimpleUserResponse
from backend.app.auth.dependencies import get_current_user
from backend.app.services.notification_service import create_notification

router = APIRouter(tags=["Comments"])

@router.get("/api/posts/{post_id}/comments", response_model=List[CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()

    res = []
    for c in comments:
        res.append(CommentResponse(
            id=c.id,
            user_id=c.user_id,
            post_id=c.post_id,
            user=SimpleUserResponse.from_orm(c.user),
            content=c.content,
            created_at=c.created_at
        ))
    return res

@router.post("/api/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    post_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not comment_data.content or not comment_data.content.strip():
        raise HTTPException(status_code=400, detail="Comment content cannot be empty")

    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        user_id=current_user.id,
        post_id=post_id,
        content=comment_data.content.strip()
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    # Trigger notification
    create_notification(
        db=db,
        recipient_id=post.user_id,
        actor_id=current_user.id,
        notification_type="comment",
        post_id=post_id
    )

    return CommentResponse(
        id=new_comment.id,
        user_id=new_comment.user_id,
        post_id=new_comment.post_id,
        user=SimpleUserResponse.from_orm(current_user),
        content=new_comment.content,
        created_at=new_comment.created_at
    )

@router.delete("/api/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Author of comment, post author, or admin can delete
    if comment.user_id != current_user.id and comment.post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()
    return None
