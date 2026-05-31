import "./styles/ConfirmModal.css";

function ConfirmRecordEdit({
	isOpen,
	title,
	artist,
	onCancel,
	onConfirm,
	isSubmitting,
}) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="confirm-overlay">
			<div className="confirm-modal">
				<h2>Save record changes?</h2>

				<p>
					Confirm updating this record?
				</p>

				<div className="confirm-actions">
					<button
						type="button"
						className="secondary-button"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Continue editing
					</button>

					<button
						type="button"
						className="primary-button"
						onClick={onConfirm}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save changes"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmRecordEdit;
