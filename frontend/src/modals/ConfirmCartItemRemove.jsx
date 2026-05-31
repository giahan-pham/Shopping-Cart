import "./styles/ConfirmModal.css";

function ConfirmCartItemRemove({ item, onCancel, onConfirm, isSubmitting }) {
	if (!item) {
		return null;
	}

	return (
		<div className="confirm-overlay">
			<div className="confirm-modal confirm-modal-compact">
				<h2>Remove item?</h2>

				<p>
					Remove <strong>{item.title}</strong> from your cart?
				</p>

				<div className="confirm-actions">
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
