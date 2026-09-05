from pydantic import BaseModel

class AdminStatsResponse(BaseModel):
    total_users: int
    total_posts: int
    total_likes: int
    total_comments: int
    pending_reports: int
