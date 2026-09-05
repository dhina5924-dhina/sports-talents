import os
from fastapi import HTTPException, UploadFile, status

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-matroska"}

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50 MB

def validate_media_file(file: UploadFile) -> str:
    """
    Validates file MIME type and returns 'photo' or 'video'.
    Throws HTTPException 400 if invalid.
    """
    content_type = file.content_type.lower() if file.content_type else ""
    filename = file.filename.lower() if file.filename else ""

    if content_type in ALLOWED_IMAGE_TYPES or filename.endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')):
        return "photo"
    elif content_type in ALLOWED_VIDEO_TYPES or filename.endswith(('.mp4', '.webm', '.mov', '.mkv')):
        return "video"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a valid Photo (JPG, PNG, WEBP, GIF) or Video (MP4, WEBM, MOV)."
        )

def validate_file_size(file_bytes: bytes, media_type: str):
    size = len(file_bytes)
    if media_type == "photo" and size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Photo size exceeds maximum allowed limit of {MAX_IMAGE_SIZE // (1024*1024)}MB."
        )
    elif media_type == "video" and size > MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Video size exceeds maximum allowed limit of {MAX_VIDEO_SIZE // (1024*1024)}MB."
        )
