import os
import uuid
import aiofiles
from fastapi import UploadFile

is_vercel = os.getenv("VERCEL") == "1" or os.environ.get("VERCEL_ENV") is not None
UPLOAD_DIR = "/tmp/uploads" if is_vercel else os.getenv("MEDIA_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class StorageService:
    @staticmethod
    async def save_file(file: UploadFile, media_type: str) -> str:
        """
        Saves media file to local uploads directory or cloud storage.
        Returns the accessible media URL.
        """
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
        if not file_ext:
            file_ext = ".jpg" if media_type == "photo" else ".mp4"

        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # Read file content
        content = await file.read()
        await file.seek(0)

        # Write to disk
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(content)

        # Return public URL path
        return f"/uploads/{unique_filename}"
