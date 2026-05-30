import RecordImage from "../records/RecordImage";

import "./styles/AdminRecordRow.css";

function AdminRecordRow({
	record,
	isHighlighted,
	setRowRef,
	onEdit,
	onDelete,
}) {
	const isOutOfStock = Number(record.stock) <= 0;

	return (
		<article
			ref={setRowRef}
			className={`admin-record-card${isHighlighted ? " admin-record-card--highlight" : ""}`}
		>
			<div className="admin-record-left">
				<div className="admin-record-image-wrapper">
					<RecordImage
						imageUrl={record.image_url}
						alt={`${record.title} cover`}
						className="admin-record-image"
					/>
				</div>

				<div>
					<h3>{record.title}</h3>
					<p>{record.artist}</p>
					<p>
						{record.genre} · {record.release_year}
					</p>
				</div>
			</div>

			<div className="admin-record-meta">
				<p>€{Number(record.price).toFixed(2)}</p>
				<p>Stock: {record.stock}</p>
				<p
					className={`admin-record-stock-status${isOutOfStock ? " out-stock" : " in-stock"}`}
				>
					{isOutOfStock ? "Out of stock" : "In stock"}
				</p>

				<div className="admin-record-buttons">
					<button type="button" onClick={onEdit}>
						Edit
					</button>

					<button type="button" className="danger-button" onClick={onDelete}>
						Delete
					</button>
				</div>
			</div>
		</article>
	);
}

export default AdminRecordRow;
