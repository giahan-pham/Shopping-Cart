from sqlmodel import SQLModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import field_validator

#=============================================================
#Record schemas for request and response models
#=============================================================

class RecordCreate(SQLModel):
    """Request body used for adding a new record to the store"""
    title: str = Field(max_length=150)
    artist: str = Field(max_length=100)
    genre: str = Field(max_length=50)
    price: Decimal = Field(gt=0)
    stock: int = Field(ge=0)
    release_year: int
    description: str = Field(default="", max_length=1000)
    image_url: str = Field(default="/static/records/stock_default_image.jpg", max_length=255)

class RecordRead(SQLModel):
    """Response model for returning record details"""
    id: int
    title: str
    artist: str
    genre: str
    price: Decimal
    stock: int
    release_year: int
    created_at: datetime
    description: str
    image_url: str

class RecordUpdate(SQLModel):
    """Request body for updating record details"""
    title: Optional[str] = Field(default=None, max_length=150)
    artist: Optional[str] = Field(default=None, max_length=100)
    genre: Optional[str] = Field(default=None, max_length=50)
    price: Optional[Decimal] = None
    stock: Optional[int] = Field(default=None, ge=0)
    release_year: Optional[int] = None
    description: Optional[str] = Field(default=None, max_length=1000)
    image_url: Optional[str] = Field(default=None, max_length=255)

    @field_validator('price')
    @classmethod
    def price_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('price must be greater than 0')
        return v

#=============================================================
#Cart item schemas for request and response models
#=============================================================
class CartItemCreate(SQLModel):
    """Request body for adding an item to the cart"""
    record_id: int
    quantity: int = Field(default = 1, gt=0)

class CartItemRead(SQLModel):
    """Response model for returning cart item details"""
    id: int
    record_id: int
    title: str
    artist: str
    price: Decimal
    quantity: int
    subtotal: Decimal
    image_url: str

class CartItemUpdate(SQLModel):
    """Request body for updating cart item quantity"""
    quantity: int = Field(gt=0)

#=============================================================
#User schemas for request and response models
#=============================================================

class UserCreate(SQLModel):
    """Request body for registering a new user"""
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=3, max_length=255)

class UserLogin(SQLModel):
    """Request body for user login"""
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=3, max_length=255)

class UserRead(SQLModel):
    """Response model for returning user details"""
    id: int
    username: str
    role: str
    created_at: datetime

class TokenResponse(SQLModel):
    """Response model for returning JWT token after successful login"""
    access_token: str
    token_type: str
    user_id: int
    username: str
    role: str

#=============================================================
#Admin schema to view all user carts
#=============================================================
class AdminCartItemRead(SQLModel):
    """cart item details for admin view"""
    cart_item_id: int
    record_id: int
    title: str
    artist: str
    price: Decimal
    quantity: int
    subtotal: Decimal

class AdminCartRead(SQLModel):
    """user cart details for admin view"""
    user_id: int
    username: str
    role: str
    items: list[AdminCartItemRead]
    total: Decimal
    updated_at: datetime

#=============================================================
#Cart schema for returning user's cart details with totals
#=============================================================
class CartRead(SQLModel):
    """Response model for returning a user's cart with totals"""
    items: list[CartItemRead]
    total: Decimal
    updated_at: datetime