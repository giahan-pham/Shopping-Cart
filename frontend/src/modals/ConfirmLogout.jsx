import "./styles/ConfirmModal.css";

function ConfirmLogout({ isOpen, onCancel, onConfirm }) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="confirm-overlay">
			<div className="confirm-modal confirm-modal-compact">
				<h2>Confirm logout</h2>

				<p>Are you sure you want to log out of your account?</p>

				<div className="confirm-actions">
					<button
						type="button"
						className="secondary-button"
						onClick={onCancel}
					>
						Cancel
					</button>

					<button type="button" className="danger-button" onClick={onConfirm}>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmLogout;
