import RecordImage from "./RecordImage";
import { formatCurrency } from "../../utils/formatCurrency";

import "./styles/RecordCard.css";

function RecordCard({ record, onAddToCart, onViewDetails }) {
  const isOutOfStock = Number(record.stock) <= 0;

  return (
    <article
      className="record-card"
      onClick={() => onViewDetails(record)}
      role="button"
      tabIndex={0}
    >
      <div className="record-image-wrapper">
        <RecordImage
          imageUrl={record.image_url}
          alt={`${record.title} cover`}
          className="record-image"
        />
      </div>

      <div className="record-content">
        <h2 className="record-title">{record.title}</h2>

        <p className="record-artist">{record.artist}</p>

        <p className="record-price">{formatCurrency(record.price)}</p>

        <button
          type="button"
          className={`record-add-button${isOutOfStock ? " record-add-button-disabled" : ""}`}
          disabled={isOutOfStock}
          onClick={(event) => {
            event.stopPropagation();
            if (!isOutOfStock) {
              onAddToCart(record);
            }
          }}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default RecordCard;