from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, Dict, Any, List

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.post import Post
from backend.app.models.hashtag import Hashtag, PostHashtag
from backend.app.models.like import Like
from backend.app.schemas.user import SimpleUserResponse
from backend.app.schemas.post import PostResponse
from backend.app.routers.posts import format_post_response
from backend.app.auth.dependencies import get_optional_user

router = APIRouter(prefix="/api/search", tags=["Search"])

@router.get("", response_model=Dict[str, Any])
def search_explore(
    q: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    current_id = current_user.id if current_user else None
    
    users_res = []
    posts_res = []
    hashtags_res = []

    clean_q = q.strip() if q else ""

    # 1. Search Users
    if clean_q:
        users = db.query(User).filter(
            (User.username.ilike(f"%{clean_q}%")) | (User.email.ilike(f"%{clean_q}%"))
        ).limit(10).all()
        users_res = [SimpleUserResponse.from_orm(u) for u in users]

    # 2. Search Posts & Filter by Category
    posts_query = db.query(Post)
    if category and category != "All":
        posts_query = posts_query.filter(Post.category == category)

    if clean_q:
        if clean_q.startswith('#'):
            tag_name = clean_q.lstrip('#').lower()
            posts_query = posts_query.join(PostHashtag).join(Hashtag).filter(Hashtag.tag.ilike(f"%{tag_name}%"))
        else:
            posts_query = posts_query.filter(
                (Post.caption.ilike(f"%{clean_q}%")) | (Post.category.ilike(f"%{clean_q}%"))
            )

    matched_posts = posts_query.order_by(desc(Post.created_at)).limit(20).all()
    posts_res = [format_post_response(p, current_id) for p in matched_posts]

    # 3. Search or Trending Hashtags
    if clean_q:
        tag_term = clean_q.lstrip('#').lower()
        tags = db.query(Hashtag).filter(Hashtag.tag.ilike(f"%{tag_term}%")).limit(10).all()
        hashtags_res = [{"tag": t.tag, "count": len(t.posts)} for t in tags]
    else:
        # Trending Hashtags (top 10 by post count)
        trending = db.query(
            Hashtag.tag, func.count(PostHashtag.post_id).label("post_count")
        ).join(PostHashtag).group_by(Hashtag.id).order_by(desc("post_count")).limit(10).all()
        hashtags_res = [{"tag": t[0], "count": t[1]} for t in trending]

    # 4. Popular Posts (top liked posts)
    popular_posts = db.query(Post).outerjoin(Like).group_by(Post.id).order_by(
        desc(func.count(Like.id)), desc(Post.created_at)
    ).limit(10).all()
    popular_res = [format_post_response(p, current_id) for p in popular_posts]

    return {
        "query": clean_q,
        "category": category,
        "users": users_res,
        "posts": posts_res,
        "hashtags": hashtags_res,
        "popular_posts": popular_res
    }
