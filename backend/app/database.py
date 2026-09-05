import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger("sports_platform.database")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sports_platform.db")

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
            sqlite_url = "sqlite:///./sports_platform.db"
            return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
