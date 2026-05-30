import { useEffect, useState } from "react";

import RecordImage from "../components/records/RecordImage";
import { formatCurrency } from "../utils/formatCurrency";

import "./styles/RecordDetails.css";

//modal showing record details when user click on the card
function RecordDetails({ record, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (record) {
      setQuantity(1);
    }
  }, [record]);

  if (!record) {
    return null;
  }

  const stock = Number(record.stock) || 0;
  const isOutOfStock = stock <= 0;

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

            <p>
              <strong>Genre:</strong> {record.genre}
            </p>

            <p>
              <strong>Release year:</strong> {record.release_year}
            </p>

            <p>
              <strong>Stock:</strong> {record.stock}
            </p>

            <p className="record-details-price">{formatCurrency(record.price)}</p>

            {record.description && (
              <p className="record-details-description">
                {record.description}
              </p>
            )}

            {!isOutOfStock && (
              <div className="record-details-quantity-row">
                <span className="record-details-quantity-label">Quantity:</span>

                {/*User quantity set (increase/decrease/manual input)*/}
                <div className="record-details-quantity-controls">
                  <button
                    type="button"
                    onClick={() => setQuantity((currentValue) => Math.max(1, currentValue - 1))}
                    disabled={quantity <= 1}
                    aria-label={`Decrease quantity for ${record.title}`}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={stock}
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(Math.min(stock, Math.max(1, Number(event.target.value))));
                    }}
                    onBlur={() => {
                      setQuantity((currentValue) => Math.min(stock, Math.max(1, currentValue)));
                    }}
                    aria-label={`Quantity for ${record.title}`}
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity((currentValue) => Math.min(stock, Math.max(1, currentValue + 1)))}
                    disabled={quantity >= stock}
                    aria-label={`Increase quantity for ${record.title}`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className={`record-details-add-button${isOutOfStock ? " record-details-add-button-disabled" : ""}`}
              onClick={() => onAddToCart(record, quantity)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordDetails;