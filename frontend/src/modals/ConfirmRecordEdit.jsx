import "./styles/ConfirmRecordEdit.css";

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
		<div className="confirm-edit-overlay">
			<div className="confirm-edit-modal">
				<h2>Save record changes?</h2>

				<p>
					Confirm updating this record?
				</p>

				<div className="confirm-edit-actions">
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
