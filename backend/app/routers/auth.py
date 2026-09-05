from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.schemas.auth import UserRegister, UserLogin, Token
from backend.app.schemas.user import UserResponse
from backend.app.auth.security import hash_password, verify_password
from backend.app.auth.jwt import create_access_token
from backend.app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if username or email exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username is already taken")
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_pw = hash_password(user_data.password)
    default_avatar = user_data.profile_picture or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_data.username}"

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pw,
        profile_picture=default_avatar,
        bio=user_data.bio,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == login_data.username_or_email) | (User.email == login_data.username_or_email)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    access_token = create_access_token(data={"user_id": user.id, "username": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Populate stats
    followers_count = len(current_user.followers_rel)
    following_count = len(current_user.following_rel)
    total_posts = len(current_user.posts)
    total_likes = sum(len(p.likes) for p in current_user.posts)

    res = UserResponse.from_orm(current_user)
    res.followers_count = followers_count
    res.following_count = following_count
    res.total_posts = total_posts
    res.total_likes = total_likes
    return res
