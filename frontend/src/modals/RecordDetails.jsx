import { useEffect, useState } from "react";

import RecordImage from "../components/records/RecordImage";
import { formatCurrency } from "../utils/formatCurrency";

import "./styles/RecordDetails.css";

//modal showing record details when user click on the card
function RecordDetails({ record, onClose, onAddToCart, showToast }) {
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");

  useEffect(() => {
    if (record) {
      setQuantity(1);
      setQuantityInput("1");
    }
  }, [record]);

  function handleQuantityInputChange(event) {
    const nextValue = event.target.value;
    if (/^\d*$/.test(nextValue)) {
      setQuantityInput(nextValue);
    }
  }

  function commitQuantityChange() {
    const parsed = Number.parseInt(quantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setQuantityInput(String(quantity));
      return;
    }
    const clamped = Math.min(maxQuantity, Math.max(1, parsed));
    if (parsed > maxQuantity) {
      showToast?.(`Only ${maxQuantity} in stock`, "error");
    }
    setQuantity(clamped);
    setQuantityInput(String(clamped));
  }

  if (!record) {
    return null;
  }

  const stock = Number(record.stock) || 0;
  const isOutOfStock = stock <= 0;
  const maxQuantity = Math.max(1, stock);

  return (
    <div className="record-details-overlay" onClick={onClose}>
      <div
        className="record-details-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="record-details-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="record-details-content">
          <section className="record-details-top">
            <div className="record-details-image-wrapper">
              <RecordImage
                imageUrl={record.image_url}
                alt={`${record.title} cover`}
                className="record-details-image"
              />
            </div>

            <div className="record-details-info">
              <h2>{record.title}</h2>
              <p className="record-details-artist">{record.artist}</p>

              <p className="record-details-price">{formatCurrency(record.price)}</p>

              <div className="record-details-meta-grid">
                <p>
                  <strong>Genre:</strong> {record.genre}
                </p>

                <p>
                  <strong>Release year:</strong> {record.release_year}
                </p>
              </div>

              <p
                className={`record-details-stock${isOutOfStock ? " record-details-stock-out" : ""}`}
              >
                <strong>Stock:</strong> {record.stock}
              </p>

              <div className="record-details-quantity-row">
                <span className="record-details-quantity-label">Quantity:</span>

                <div className="record-details-quantity-controls">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, quantity - 1);
                      setQuantity(next);
                      setQuantityInput(String(next));
                    }}
                    disabled={isOutOfStock || quantity <= 1}
                    aria-label={`Decrease quantity for ${record.title}`}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    step="1"
                    inputMode="numeric"
                    value={quantityInput}
                    onChange={handleQuantityInputChange}
                    onBlur={commitQuantityChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                      }
                      if (event.key === "Escape") {
                        setQuantityInput(String(quantity));
                        event.currentTarget.blur();
                      }
                    }}
                    aria-label={`Quantity for ${record.title}`}
                    disabled={isOutOfStock}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(maxQuantity, quantity + 1);
                      setQuantity(next);
                      setQuantityInput(String(next));
                    }}
                    disabled={isOutOfStock || quantity >= maxQuantity}
                    aria-label={`Increase quantity for ${record.title}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={`record-details-add-button${isOutOfStock ? " record-details-add-button-disabled" : ""}`}
                onClick={() => onAddToCart(record, quantity)}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </section>

          <section className="record-details-bottom">
            <h3>Description / Tracklist</h3>

            <div className="record-details-description-box">
              {record.description ? (
                <p className="record-details-description">{record.description}</p>
              ) : (
                <p className="record-details-description-empty">
                  No description or tracklist available.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RecordDetails;