from typing import List
from fastapi import APIRouter, HTTPException, Depends, Response, status
from sqlmodel import Session, select
from core.database import get_session
from models import User, Record, Cart, CartItem
from schema import AdminCartItemRead, AdminCartRead
from core.security import admin_required
from decimal import Decimal

router = APIRouter(prefix="/admin", tags=["admin"])

#endpoint to get all carts with their items for admin view
@router.get("/user_carts", response_model=List[AdminCartRead])
def get_all__user_carts(admin_user: User = Depends(admin_required), 
                        session: Session = Depends(get_session)):
    
    # join all tables to get all details for admin view (include Cart to access totals)
    cart_data = session.exec(
        select(User, Cart, CartItem, Record)
        .join(Cart, Cart.user_id == User.id)
        .join(CartItem, CartItem.cart_id == Cart.id)
        .join(Record, Record.id == CartItem.record_id)
    ).all()

    all_users_carts = {}

    for user, cart, cart_item, record in cart_data:
        if user.id not in all_users_carts:
            all_users_carts[user.id] = AdminCartRead(
                user_id=user.id,
                username=user.username,
                role=user.role,
                items=[],
                total=Decimal(0),
                updated_at=cart.updated_at,
            )

        all_users_carts[user.id].items.append(
            AdminCartItemRead(
                cart_item_id=cart_item.id,
                record_id=record.id,
                title=record.title,
                artist=record.artist,
                price=record.price,
                quantity=cart_item.quantity,
                subtotal=record.price * cart_item.quantity,
            )
        )
        total = sum((item.subtotal for item in all_users_carts[user.id].items), Decimal(0))
        all_users_carts[user.id].total = total

    return list(all_users_carts.values())