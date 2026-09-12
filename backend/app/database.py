import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import shutil

logger = logging.getLogger("sports_platform.database")

def get_database_url():
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    # Check if running in Vercel serverless environment
    if os.getenv("VERCEL") == "1" or os.environ.get("VERCEL_ENV"):
        tmp_db = "/tmp/sports_platform.db"
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        src_db = os.path.join(root_dir, "sports_platform.db")
        if not os.path.exists(tmp_db) and os.path.exists(src_db):
            try:
                shutil.copyfile(src_db, tmp_db)
            except Exception as e:
                logger.warning(f"Failed to copy db to /tmp: {e}")
        return f"sqlite:///{tmp_db}"
    return "sqlite:///./sports_platform.db"

DATABASE_URL = get_database_url()

# Fallback to SQLite if MySQL is configured but fails to connect during startup
def get_engine(url: str):
    if url.startswith("sqlite"):
        return create_engine(
            url, connect_args={"check_same_thread": False}
        )
    else:
        try:
            engine = create_engine(url, pool_pre_ping=True)
            # Test connection
            with engine.connect() as conn:
                pass
            return engine
        except Exception as e:
            logger.warning(f"Could not connect to database at {url}: {e}. Falling back to local SQLite database.")
            fallback_db = "/tmp/sports_platform.db" if (os.getenv("VERCEL") == "1" or os.environ.get("VERCEL_ENV")) else "./sports_platform.db"
            return create_engine(f"sqlite:///{fallback_db}", connect_args={"check_same_thread": False})

engine = get_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
