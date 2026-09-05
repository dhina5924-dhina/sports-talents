from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Hashtag(Base):
    __tablename__ = "hashtags"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag = Column(String(100), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    posts = relationship("PostHashtag", back_populates="hashtag", cascade="all, delete-orphan")

class PostHashtag(Base):
    __tablename__ = "post_hashtags"

    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True, index=True)
    hashtag_id = Column(Integer, ForeignKey("hashtags.id", ondelete="CASCADE"), primary_key=True, index=True)

    # Relationships
    post = relationship("Post", back_populates="hashtags")
    hashtag = relationship("Hashtag", back_populates="posts")
