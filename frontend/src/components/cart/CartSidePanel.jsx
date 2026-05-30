import { useEffect, useState } from "react";

import {
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../../api/cartApi";

import CartItemCard from "./CartItemCard";
import CartSummary from "./CartSummary";

import ConfirmClearCard from "../../modals/ConfirmClearCard";
import ConfirmCartItemRemove from "../../modals/ConfirmCartItemRemove";

import "./styles/CartSidePanel.css";

function CartSidePanel({
  isOpen,
  cart,
  setCart,
  showToast,
  onClose,
}) {
  const [isCartUpdating, setIsCartUpdating] = useState(false);

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [itemPendingRemove, setItemPendingRemove] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setIsClearConfirmOpen(false);
      setItemPendingRemove(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const items = cart?.items || [];
  const total = cart?.total || 0;

  //Refresh cart after update, delete item, or clear cart
  async function refreshCart() {
    const updatedCart = await getCart();
    setCart(updatedCart);
  }

  //Handle quantity changes with validation and error handling
  async function changeQuantity(item, quantity) {
    if (isCartUpdating || quantity < 1 || quantity === item.quantity) {
      return;
    }

    try {
      setIsCartUpdating(true);

      await updateCartItem(item.id, quantity);
      await refreshCart();
      showToast?.(`Updated ${item.title} quantity`, "success");
    } catch (error) {
      showToast?.(error.message, "error");
    } finally {
      setIsCartUpdating(false);
    }
  }

  //Handle decrease, increase, and set quantity with validation
  function handleDecrease(item) {
    if (item.quantity <= 1) {
      setItemPendingRemove(item);
      return;
    }

    void changeQuantity(item, item.quantity - 1);
  }

  function handleIncrease(item) {
    void changeQuantity(item, item.quantity + 1);
  }

  function handleSetQuantity(item, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      const message = "Quantity must be at least 1.";
      showToast?.(message, "error");
      return;
    }

    void changeQuantity(item, quantity);
  }

  function handleDeleteRequest(item) {
    setItemPendingRemove(item);
  }

  //Handle delete item confirmation and error handling
  async function handleDeleteConfirm() {
    if (!itemPendingRemove) {
      return;
    }

    try {
      setIsCartUpdating(true);

      await deleteCartItem(itemPendingRemove.id);
      await refreshCart();
      showToast?.(`${itemPendingRemove.title} removed from cart`, "success");
      setItemPendingRemove(null);
    } catch (error) {
      showToast?.(error.message, "error");
    } finally {
      setIsCartUpdating(false);
    }
  }

  //Handle clear cart confirmation and error handling
  function handleClearRequest() {
    setIsClearConfirmOpen(true);
  }

  async function handleClearConfirm() {
    try {
      setIsCartUpdating(true);

      await clearCart();
      await refreshCart();
      showToast?.("Cart cleared", "success");
      setIsClearConfirmOpen(false);
    } catch (error) {
      showToast?.(error.message, "error");
    } finally {
      setIsCartUpdating(false);
    }
  }

  return (
    <>
      <div className="cart-panel-overlay" onClick={onClose}>
        <aside
          className="cart-side-panel"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="cart-panel-header">
            <h2>Your Cart</h2>

            <button
              type="button"
              className="cart-panel-close"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          {items.length === 0 && (
            <p className="cart-empty-message">Your cart is empty.</p>
          )}

          {items.length > 0 && (
            <div className="cart-items">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isCartUpdating={isCartUpdating}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onSetQuantity={handleSetQuantity}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}

          <div className="cart-panel-footer">
            <CartSummary
              total={total}
              canClear={items.length > 0}
              isCartUpdating={isCartUpdating}
              onContinueBrowsing={onClose}
              onClearCart={handleClearRequest}
              showClearButton={items.length > 0}
            />
          </div>
        </aside>
      </div>

      <ConfirmClearCard
        isOpen={isClearConfirmOpen}
        itemCount={items.length}
        onCancel={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearConfirm}
        isSubmitting={isCartUpdating}
      />

      <ConfirmCartItemRemove
        item={itemPendingRemove}
        onCancel={() => setItemPendingRemove(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isCartUpdating}
      />
    </>
  );
}

export default CartSidePanel;