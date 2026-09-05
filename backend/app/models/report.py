from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_type = Column(String(20), nullable=False)  # 'post', 'comment', 'user'
    target_id = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(20), default="pending", index=True)  # 'pending', 'resolved', 'dismissed'
    created_at = Column(DateTime, default=func.now())

    # Relationship
    reporter = relationship("User")
