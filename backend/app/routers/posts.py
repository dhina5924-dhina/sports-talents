import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from backend.app.database import get_db
from backend.app.models.post import Post
from backend.app.models.media import Media
from backend.app.models.hashtag import Hashtag, PostHashtag
from backend.app.models.like import Like
from backend.app.models.user import User
from backend.app.schemas.post import PostResponse, MediaResponse
from backend.app.schemas.user import SimpleUserResponse
from backend.app.auth.dependencies import get_current_user, get_optional_user
from backend.app.utils.file_validation import validate_media_file, validate_file_size
from backend.app.services.storage_service import StorageService

router = APIRouter(prefix="/api/posts", tags=["Posts"])

SPORTS_CATEGORIES = [
    "Cricket", "Football", "Basketball", "Volleyball", 
    "Tennis", "Badminton", "Athletics", "Other"
]

def format_post_response(post: Post, current_user_id: Optional[int] = None) -> PostResponse:
    author_simple = SimpleUserResponse.from_orm(post.author)
    media_list = [MediaResponse.from_orm(m) for m in post.media]
    hashtag_tags = [ph.hashtag.tag for ph in post.hashtags if ph.hashtag]
    
    likes_count = len(post.likes)
    comments_count = len(post.comments)
    is_liked = False
    if current_user_id:
        is_liked = any(like.user_id == current_user_id for like in post.likes)

    return PostResponse(
        id=post.id,
        user_id=post.user_id,
        author=author_simple,
        caption=post.caption,
        category=post.category,
        created_at=post.created_at,
        updated_at=post.updated_at,
        media=media_list,
        hashtags=hashtag_tags,
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked=is_liked
    )

@router.get("", response_model=List[PostResponse])
def get_posts(
    category: Optional[str] = None,
    hashtag: Optional[str] = None,
    user_id: Optional[int] = None,
    username: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(Post)

    if category and category.strip() and category != "All":
        query = query.filter(Post.category == category.strip())

    if user_id:
        query = query.filter(Post.user_id == user_id)

    if username:
        user = db.query(User).filter(User.username == username).first()
        if user:
            query = query.filter(Post.user_id == user.id)

    if hashtag:
        clean_tag = hashtag.strip().lstrip('#').lower()
        query = query.join(PostHashtag).join(Hashtag).filter(Hashtag.tag == clean_tag)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(Post.caption.ilike(search_term))

    posts = query.order_by(desc(Post.created_at)).offset(skip).limit(limit).all()
    current_id = current_user.id if current_user else None

    return [format_post_response(p, current_id) for p in posts]

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    file: UploadFile = File(...),
    caption: Optional[str] = Form(None),
    category: str = Form("Other"),
    hashtags: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate category
    if category not in SPORTS_CATEGORIES:
        category = "Other"

    # Validate file format and size
    media_type = validate_media_file(file)
    file_bytes = await file.read()
    validate_file_size(file_bytes, media_type)
    await file.seek(0)

    # Upload & save file
    media_url = await StorageService.save_file(file, media_type)

    # Create post
    new_post = Post(
        user_id=current_user.id,
        caption=caption,
        category=category
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Create media record
    new_media = Media(
        post_id=new_post.id,
        media_url=media_url,
        media_type=media_type,
        file_size=len(file_bytes)
    )
    db.add(new_media)

    # Parse and add hashtags
    tags_to_add = set()
    if hashtags:
        raw_tags = re.findall(r'#?\w+', hashtags)
        for t in raw_tags:
            tags_to_add.add(t.lstrip('#').lower())
    if caption:
        caption_tags = re.findall(r'#(\w+)', caption)
        for t in caption_tags:
            tags_to_add.add(t.lower())

    for tag_name in tags_to_add:
        if not tag_name:
            continue
        hashtag_obj = db.query(Hashtag).filter(Hashtag.tag == tag_name).first()
        if not hashtag_obj:
            hashtag_obj = Hashtag(tag=tag_name)
            db.add(hashtag_obj)
            db.commit()
            db.refresh(hashtag_obj)
        
        post_hashtag = PostHashtag(post_id=new_post.id, hashtag_id=hashtag_obj.id)
        db.add(post_hashtag)

    db.commit()
    db.refresh(new_post)

    return format_post_response(new_post, current_user.id)

@router.get("/{post_id}", response_model=PostResponse)
def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    current_id = current_user.id if current_user else None
    return format_post_response(post, current_id)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Author or Admin check
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()
    return None
