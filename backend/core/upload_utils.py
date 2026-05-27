from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

UPLOAD_DIR = Path("media/static/records")
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


async def save_upload_image(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG, and WEBP images are allowed",
        )

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be 5MB or smaller",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    try:
        with Image.open(BytesIO(content)) as original:
            image = ImageOps.exif_transpose(original)
            image.thumbnail((600, 600))

            if image.mode in ("RGBA", "LA", "P"):
                image = image.convert("RGB")

            filename = f"{uuid4().hex}.jpg"
            filepath = UPLOAD_DIR / filename

            image.save(filepath, "JPEG", quality=85, optimize=True)

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file",
        )

    return f"/static/records/{filename}"