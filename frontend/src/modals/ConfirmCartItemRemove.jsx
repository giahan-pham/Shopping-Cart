import "./styles/ConfirmCartItemRemove.css";

function ConfirmCartItemRemove({ item, onCancel, onConfirm, isSubmitting }) {
	if (!item) {
		return null;
	}

	return (
		<div className="confirm-remove-overlay">
			<div className="confirm-remove-modal">
				<h2>Remove item?</h2>

				<p>
					Remove <strong>{item.title}</strong> from your cart?
				</p>

				<div className="confirm-remove-actions">
					<button
						type="button"
						className="secondary-button"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancel
					</button>

					<button
						type="button"
						className="danger-button"
						onClick={onConfirm}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Removing..." : "Remove"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmCartItemRemove;
