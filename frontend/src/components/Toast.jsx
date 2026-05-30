import "./Toast.css";

//toast to show success or error messages
function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`app-toast app-toast-${toast.type || "info"}`} role="status" aria-live="polite">
      <span>{toast.message}</span>

      <button
        type="button"
        className="app-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
