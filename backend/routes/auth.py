from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from core.database import get_session
from core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from models import User, Cart
from schema import UserCreate, UserRead, UserLogin, TokenResponse
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])

# Endpoint for user registration
@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_create: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user_create.username)).first()

    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    
    user = User(
        username=user_create.username,
        password_hash=get_password_hash(user_create.password),
        role="user"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    # Create an empty cart for the new user
    new_cart = Cart(user_id=user.id)
    session.add(new_cart)
    session.commit()
    return user

# Endpoint for user login and JWT token generation
@router.post("/token", response_model=TokenResponse)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
    access_token = create_access_token(data={
        "sub": user.username,
        "user_id": user.id,
        "role": user.role
        })
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        role=user.role
    )

#endpoint to get current user details using the JWT token
@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user