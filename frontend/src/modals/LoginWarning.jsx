import "./styles/ConfirmModal.css";

function LoginWarning({ isOpen, onLogin, onContinue }) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="confirm-overlay">
			<div className="confirm-modal confirm-modal-compact">
				<h2>Login required</h2>
				<p>You need an account to add records to your cart.</p>

				<div className="confirm-actions">
					<button
						type="button"
						className="secondary-button"
						onClick={onContinue}
					>
						Continue browsing
					</button>

					<button
						type="button"
						className="primary-button"
						onClick={onLogin}
					>
						Login/ Register
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginWarning;
