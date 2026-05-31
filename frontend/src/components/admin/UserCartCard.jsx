import { useState } from "react";

import { formatCurrency } from "../../utils/formatCurrency";

import "./styles/UserCartCard.css";

function formatUpdatedAt(value) {
	// Show a fallback if the cart does not have an updated date
	if (!value) {
		return "Unknown";
	}

	const date = new Date(value);
	// If the date is invalid, show the original value instead
	if (Number.isNaN(date.getTime())) {
		return String(value);
	}

	return date.toLocaleString();
}

function UserCartCard({ userCart }) {
	const items = userCart?.items || [];
	//Control whether to expand all items or only first 2 items (for expand button)
	const [isExpanded, setIsExpanded] = useState(false);

	const visibleItems = isExpanded ? items : items.slice(0, 2);
	const hasMoreItems = items.length > 2; //item length for collapse

	return (
		<article className="user-cart-card">
			<header className="user-cart-header">
				<h2>{userCart.username}</h2>
				<p>
					User ID: {userCart.user_id} · Role: {userCart.role}
				</p>
				<p>Updated: {formatUpdatedAt(userCart.updated_at)}</p>
			</header>

			{items.length === 0 && <p>No items in this cart.</p>}

			{items.length > 0 && (
				<div className="user-cart-items">
					{visibleItems.map((item) => (
						<div className="user-cart-item-row" key={item.cart_item_id}>
							<div className="user-cart-item-info">
								<p className="user-cart-item-main-line">
									<strong>{item.title}</strong> - {item.artist}
								</p>
								<p className="user-cart-item-price-line">
									{formatCurrency(item.price)}
								</p>
							</div>

							<p className="user-cart-item-quantity-line">Qty: {item.quantity}</p>

							<p className="user-cart-item-subtotal">{formatCurrency(item.subtotal)}</p>
						</div>
					))}
				</div>
			)}
			 {/* Only show the expand button when there are more than two items */}
			{hasMoreItems && (
				<button
					type="button"
					className="user-cart-expand-button"
					onClick={() => setIsExpanded((currentValue) => !currentValue)}
				>
					{isExpanded ? "Collapse" : "Expand"}
				</button>
			)}

			<footer className="user-cart-footer">
				<strong>Total: {formatCurrency(userCart.total)}</strong>
			</footer>
		</article>
	);
}

export default UserCartCard;
