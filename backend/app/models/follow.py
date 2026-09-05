from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Follow(Base):
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    following_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint("follower_id", "following_id", name="uk_follower_following"),
    )

    # Relationships
    follower = relationship("User", foreign_keys=[follower_id], back_populates="following_rel")
    following = relationship("User", foreign_keys=[following_id], back_populates="followers_rel")
