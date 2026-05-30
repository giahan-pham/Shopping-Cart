import { useEffect, useState } from "react";

import RecordImage from "../records/RecordImage";
import { formatCurrency } from "../../utils/formatCurrency";

import "./styles/CartItemCard.css";

function CartItemCard({
	item,
	isCartUpdating,
	onIncrease,
	onDecrease,
	onSetQuantity,
	onDelete,
}) {
	const [quantityInput, setQuantityInput] = useState(String(item.quantity));

	useEffect(() => {
		setQuantityInput(String(item.quantity));
	}, [item.quantity]);

	// Handle quantity input change, blur non numeric values
	function handleQuantityInputChange(event) {
		const nextValue = event.target.value;

		if (/^\d*$/.test(nextValue)) {
			setQuantityInput(nextValue);
		}
	}

	// Validate input, and reset to current quantity if invalid
	function commitQuantityChange() {
		const parsedQuantity = Number.parseInt(quantityInput, 10);

		if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
			setQuantityInput(String(item.quantity));
			return;
		}

		if (parsedQuantity !== item.quantity) {
			onSetQuantity(item, parsedQuantity);
		}
	}

	return (
		<article className="cart-item-card">
			<div className="cart-item-image-wrapper">
				<RecordImage
					imageUrl={item.image_url}
					alt={`${item.title} cover`}
					className="cart-item-image"
				/>
			</div>

			<div className="cart-item-main">
				<div className="cart-item-header-row">
					<h3 className="cart-item-title">{item.title}</h3>

					<button
						type="button"
						className="cart-item-delete"
						onClick={() => onDelete(item)}
						disabled={isCartUpdating}
						aria-label={`Remove ${item.title} from cart`}
						title={`Remove ${item.title}`}
					>
						×
					</button>
				</div>

				<p className="cart-item-artist">{item.artist}</p>
				<p className="cart-item-price-line">{formatCurrency(item.price)}</p>

				<div className="cart-item-controls">
					<div className="cart-quantity-controls">
						<span className="cart-quantity-label">Quantity:</span>

						<button
							type="button"
							onClick={() => onDecrease(item)}
							disabled={isCartUpdating}
							aria-label={`Decrease quantity for ${item.title}`}
						>
							−
						</button>

						<input
							type="number"
							className="cart-item-quantity-input"
							value={quantityInput}
							min="1"
							step="1"
							inputMode="numeric"
							aria-label={`Quantity for ${item.title}`}
							onChange={handleQuantityInputChange}
							onBlur={commitQuantityChange}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									event.currentTarget.blur();
								}

								if (event.key === "Escape") {
									setQuantityInput(String(item.quantity));
									event.currentTarget.blur();
								}
							}}
							disabled={isCartUpdating}
						/>

						<button
							type="button"
							onClick={() => onIncrease(item)}
							disabled={isCartUpdating}
							aria-label={`Increase quantity for ${item.title}`}
						>
							+
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}

export default CartItemCard;
