from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

# backend/core/upload_utils.py -> backend/
BASE_DIR = Path(__file__).resolve().parents[1]

STATIC_DIR = BASE_DIR / "media" / "static"
UPLOAD_DIR = STATIC_DIR / "records"

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}

DEFAULT_RECORD_IMAGE_URL = "/static/records/stock_default_image.jpg"
RECORDS_STATIC_PREFIX = "/static/records/"


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

# Get the file path of an uploaded image from its URL
def get_uploaded_image_path(image_url: str) -> Path | None:
    if not image_url:
        return None

    normalized_url = image_url.strip()

    # Support both relative paths and absolute URLs that contain the static path.
    if normalized_url.startswith(("http://", "https://")):
        normalized_url = urlparse(normalized_url).path or ""

    if normalized_url == DEFAULT_RECORD_IMAGE_URL:
        return None

    if not normalized_url.startswith(RECORDS_STATIC_PREFIX):
        return None

    filename = normalized_url.removeprefix(RECORDS_STATIC_PREFIX).strip()
    if not filename:
        return None

    # Prevent directory traversal by forcing a basename-only file reference.
    safe_name = Path(filename).name
    if safe_name != filename:
        return None

    candidate = (UPLOAD_DIR / safe_name).resolve()

    try:
        candidate.relative_to(UPLOAD_DIR.resolve())
    except ValueError:
        return None

    return candidate

# Delete uploaded image file if no record references it anymore
def delete_uploaded_image_file(image_url: str) -> bool:
    image_path = get_uploaded_image_path(image_url)
    if image_path is None:
        return False

    if image_path.exists() and image_path.is_file():
        image_path.unlink()
        return True

    return False