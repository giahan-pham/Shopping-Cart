import "./styles/ConfirmModal.css";

function ConfirmRecordDelete({ record, onCancel, onConfirm, isDeleting }) {
  if (!record) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h2>Delete confirmation</h2>

        <p>
          Are you sure you want to delete <strong>{record.title}</strong> by{" "}
          <strong>{record.artist}</strong>?
        </p>

        <p className="confirm-warning">
          This action cannot be undone. If this record is currently in a user’s
          cart, it may also be removed from that cart.
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete record"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRecordDelete;