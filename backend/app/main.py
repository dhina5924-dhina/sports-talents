import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.database import engine, Base, SessionLocal
from backend.app.models import User
from backend.app.auth.security import hash_password

# Import all routers
from backend.app.routers import (
    auth, users, posts, comments, likes, follows, notifications, search, reports, admin
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sports_platform")

# Initialize DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sports Platform API",
    description="Full-stack social platform API for sports enthusiasts",
    version="1.0.0"
)

# Enable CORS for local development and web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads folder exists
is_vercel = os.getenv("VERCEL") == "1" or os.environ.get("VERCEL_ENV") is not None
UPLOAD_DIR = "/tmp/uploads" if is_vercel else os.getenv("MEDIA_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(likes.router)
app.include_router(follows.router)
app.include_router(notifications.router)
app.include_router(search.router)
app.include_router(reports.router)
app.include_router(admin.router)

# Mount frontend files if available
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="frontend_static")
    css_dir = os.path.join(FRONTEND_DIR, "css")
    js_dir = os.path.join(FRONTEND_DIR, "js")
    if os.path.exists(css_dir):
        app.mount("/css", StaticFiles(directory=css_dir), name="css_static")
    if os.path.exists(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="js_static")

@app.get("/")
def read_root():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Welcome to Sports Platform API. Frontend available at /frontend/index.html"}

@app.get("/download-zip")
def download_zip():
    zip_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sports_platform.zip")
    if os.path.exists(zip_path):
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="sports_platform.zip"
        )
    return {"error": "Zip file not found"}

@app.on_event("startup")
def startup_event():
    """Create default Admin user if not exists"""
    db = SessionLocal()
    try:
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_email = os.getenv("ADMIN_EMAIL", "admin@sportsplatform.com")
        admin_pass = os.getenv("ADMIN_PASSWORD", "adminpassword123")

        existing_admin = db.query(User).filter(User.username == admin_username).first()
        if not existing_admin:
            admin_user = User(
                username=admin_username,
                email=admin_email,
                password_hash=hash_password(admin_pass),
                profile_picture=f"https://api.dicebear.com/7.x/bottts/svg?seed={admin_username}",
                bio="Platform Lead Administrator",
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            logger.info(f"Default admin created successfully: Username '{admin_username}', Password '{admin_pass}'")
    except Exception as e:
        logger.error(f"Error initializing admin user: {e}")
    finally:
        db.close()
