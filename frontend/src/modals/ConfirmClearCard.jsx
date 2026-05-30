import "./styles/ConfirmClearCart.css";

function ConfirmClearCart({
	isOpen,
	itemCount,
	onCancel,
	onConfirm,
	isSubmitting,
}) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="confirm-clear-overlay">
			<div className="confirm-clear-modal">
				<h2>Clear cart?</h2>

				<p>
					This will remove <strong>{itemCount}</strong>{" "}
					{itemCount === 1 ? "item" : "items"} from your cart.
				</p>

				<div className="confirm-clear-actions">
					<button
						type="button"
						className="secondary-button"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Keep cart
					</button>

					<button
						type="button"
						className="danger-button"
						onClick={onConfirm}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Clearing..." : "Clear cart"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmClearCart;
