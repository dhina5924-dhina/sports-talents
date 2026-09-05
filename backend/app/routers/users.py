from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.follow import Follow
from backend.app.schemas.user import UserResponse, UserUpdate, SimpleUserResponse
from backend.app.auth.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/{username}", response_model=UserResponse)
def get_user_profile(
    username: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=444, detail="User not found")

    followers_count = len(user.followers_rel)
    following_count = len(user.following_rel)
    total_posts = len(user.posts)
    total_likes = sum(len(p.likes) for p in user.posts)

    is_following = False
    if current_user:
        is_following = db.query(Follow).filter(
            Follow.follower_id == current_user.id,
            Follow.following_id == user.id
        ).first() is not None

    res = UserResponse.from_orm(user)
    res.followers_count = followers_count
    res.following_count = following_count
    res.total_posts = total_posts
    res.total_likes = total_likes
    res.is_following = is_following
    return res

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.username and profile_data.username != current_user.username:
        existing = db.query(User).filter(User.username == profile_data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username is already taken")
        current_user.username = profile_data.username

    if profile_data.bio is not None:
        current_user.bio = profile_data.bio

    if profile_data.profile_picture is not None:
        current_user.profile_picture = profile_data.profile_picture

    db.commit()
    db.refresh(current_user)

    res = UserResponse.from_orm(current_user)
    res.followers_count = len(current_user.followers_rel)
    res.following_count = len(current_user.following_rel)
    res.total_posts = len(current_user.posts)
    res.total_likes = sum(len(p.likes) for p in current_user.posts)
    return res

@router.get("/{user_id}/followers", response_model=List[SimpleUserResponse])
def get_followers(user_id: int, db: Session = Depends(get_db)):
    follows = db.query(Follow).filter(Follow.following_id == user_id).all()
    followers = [f.follower for f in follows]
    return [SimpleUserResponse.from_orm(u) for u in followers]

@router.get("/{user_id}/following", response_model=List[SimpleUserResponse])
def get_following(user_id: int, db: Session = Depends(get_db)):
    follows = db.query(Follow).filter(Follow.follower_id == user_id).all()
    following = [f.following for f in follows]
    return [SimpleUserResponse.from_orm(u) for u in following]
