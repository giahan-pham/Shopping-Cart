import "./styles/LoginWarning.css";

function LoginWarning({ isOpen, onLogin, onContinue }) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="login-warning-overlay">
			<div className="login-warning-modal">
				<h2>Login required</h2>
				<p>You need an account to add records to your cart.</p>

				<div className="login-warning-actions">
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
