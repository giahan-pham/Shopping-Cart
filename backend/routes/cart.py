from typing import List
from fastapi import APIRouter, HTTPException, Depends, Response, status
from sqlmodel import Session, select
from core.database import get_session
from models import Cart, CartItem, User, Record
from schema import CartItemCreate, CartItemRead, CartItemUpdate
from core.security import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])

# Helper function to build CartItemRead from CartItem
def build_cart_item_read(cart_item: CartItem, record: Record) -> CartItemRead:
    return CartItemRead(
        id=cart_item.id,
        record_id=cart_item.record_id,
        title=record.title,
        artist=record.artist,
        price=record.price,
        quantity=cart_item.quantity,
        subtotal=record.price * cart_item.quantity
    )

# Helper function to get the current user's cart
def get_user_cart(user_id: int, session: Session) -> Cart:
    cart = session.exec(select(Cart).where(Cart.user_id == user_id)).first()
    if not cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
    return cart

#endpoint to get current user's cart details
@router.get("/", response_model=List[CartItemRead])
def get_cart(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = get_user_cart(current_user.id, session)
    #join CartItem with Record using record id to get the record details for each cart item
    cart_items = session.exec(
        select(CartItem, Record).join(Record, CartItem.record_id == Record.id)
        .where(CartItem.cart_id == cart.id)
    ).all()
    return [
        build_cart_item_read(cart_item=cart_item, record=record)
        for cart_item, record in cart_items
    ]

#endpoint to add an item to the cart
@router.post("/items", response_model=CartItemRead, status_code=status.HTTP_201_CREATED)
def add_item_to_cart(cart_item_create: CartItemCreate, 
                     current_user: User = Depends(get_current_user), 
                     session: Session = Depends(get_session)):
    cart = get_user_cart(current_user.id, session)
    record = session.get(Record, cart_item_create.record_id)

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    
    #if the item already exists in the cart, then update the quantity instead of adding a new item
    existing_item = session.exec(
        select(CartItem).where(
            CartItem.cart_id == cart.id,
            CartItem.record_id == cart_item_create.record_id
        )
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + cart_item_create.quantity

        if new_quantity > record.stock:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock available")
        
        existing_item.quantity = new_quantity
        session.add(existing_item)
        session.commit()
        session.refresh(existing_item)
        return build_cart_item_read(existing_item, record)
    
    if cart_item_create.quantity > record.stock:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock available")
    
    #create a new cart item if it doesn't exist in the cart
    cart_item = CartItem(
        cart_id=cart.id,
        record_id=cart_item_create.record_id,
        quantity=cart_item_create.quantity
    )

    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return build_cart_item_read(cart_item, record)

#endpoint to update the quantity of an item in the cart
@router.patch("/items/{item_id}", response_model=CartItemRead)
def update_cart_item(cart_item_id: int, 
                     cart_item_update: CartItemUpdate, 
                     current_user: User = Depends(get_current_user), 
                     session: Session = Depends(get_session)):
    cart = get_user_cart(current_user.id, session)

    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item or cart_item.cart_id != cart.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    record = session.get(Record, cart_item.record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    if cart_item_update.quantity > record.stock:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock available")

    cart_item.quantity = cart_item_update.quantity
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return build_cart_item_read(cart_item, record)

#endpoint to remove an item from the cart
@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(cart_item_id: int, 
                     current_user: User = Depends(get_current_user), 
                     session: Session = Depends(get_session)):
    cart = get_user_cart(current_user.id, session)
    
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item or cart_item.cart_id != cart.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    session.delete(cart_item)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

#endpoint to clear the cart by deleting all items in the cart
@router.delete("/items", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = get_user_cart(current_user.id, session)
    cart_items = session.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
    for cart_item in cart_items:
        session.delete(cart_item)

    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
