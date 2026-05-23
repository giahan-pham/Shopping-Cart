from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import Column, DECIMAL
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, min_length=3, max_length=50)
    password_hash: str = Field(max_length=255)
    role: str = Field(default="user", max_length=20)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Cart(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class Record(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=150)
    artist: str = Field(max_length=100)
    genre: str = Field(max_length=50)
    price: Decimal = Field(sa_column=Column(DECIMAL(10, 2)))
    stock: int = Field(ge=0)
    release_year: int
    description: str = Field(max_length=1000)
    image_url: str = Field(default= "backend/media/static/stock_default_image.jpg", max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# association table for many-to-many relationship between Cart and Record
class CartItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    cart_id: int = Field(foreign_key="cart.id")
    record_id: int = Field(foreign_key="record.id")
    quantity: int = Field(default=1, gt=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))