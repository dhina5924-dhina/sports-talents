from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.post import Post
from backend.app.models.like import Like
from backend.app.models.comment import Comment
from backend.app.models.report import Report
from backend.app.schemas.admin import AdminStatsResponse
from backend.app.schemas.user import UserResponse
from backend.app.auth.dependencies import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_platform_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    total_users = db.query(User).count()
    total_posts = db.query(Post).count()
    total_likes = db.query(Like).count()
    total_comments = db.query(Comment).count()
    pending_reports = db.query(Report).filter(Report.status == "pending").count()

    return AdminStatsResponse(
        total_users=total_users,
        total_posts=total_posts,
        total_likes=total_likes,
        total_comments=total_comments,
        pending_reports=pending_reports
    )

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    users = db.query(User).order_by(desc(User.created_at)).all()
    res = []
    for u in users:
        ur = UserResponse.from_orm(u)
        ur.followers_count = len(u.followers_rel)
        ur.following_count = len(u.following_rel)
        ur.total_posts = len(u.posts)
        ur.total_likes = sum(len(p.likes) for p in u.posts)
        res.append(ur)
    return res

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if target_user.is_admin:
        raise HTTPException(status_code=400, detail="Cannot delete administrator account")

    db.delete(target_user)
    db.commit()
    return None
