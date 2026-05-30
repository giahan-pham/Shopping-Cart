import { formatCurrency } from "../../utils/formatCurrency";

import "./styles/CartSummary.css";

function CartSummary({
	total,
	canClear,
	isCartUpdating,
	onClearCart,
	onContinueBrowsing,
	showClearButton = true,
}) {
	return (
		<div className="cart-summary">
			<div className="cart-summary-total-row">
				<span>Total</span>
				<strong>{formatCurrency(total)}</strong>
			</div>

			<div className="cart-summary-actions">

				{/* Only show the clear button if there are items in the cart or if the cart is updating */}
				{showClearButton && (
					<button
						type="button"
						className="cart-clear-button"
						onClick={onClearCart}
						disabled={!canClear || isCartUpdating}
					>
						Clear cart
					</button>
				)}

				<button
					type="button"
					className="cart-continue-button"
					onClick={onContinueBrowsing}
				>
					Continue browsing
				</button>
			</div>
		</div>
	);
}

export default CartSummary;
