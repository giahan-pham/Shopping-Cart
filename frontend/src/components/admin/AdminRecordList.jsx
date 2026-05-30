import { useEffect, useRef } from "react";

import AdminRecordRow from "./AdminRecordRow";

import "./styles/AdminRecordList.css";

function AdminRecordList({
	records,
	highlightedRecordId,
	onEditRecord,
	onDeleteRecord,
}) {
	// Store each row element so we can scroll to it later
	const rowRefs = useRef({});

	// Scroll to the record that was just added or updated
	useEffect(() => {
		if (!highlightedRecordId) {
			return;
		}

		const rowElement = rowRefs.current[highlightedRecordId];
		if (rowElement) {
			rowElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [highlightedRecordId, records]);

	return (
		<div className="admin-record-list">
			{records.map((record) => (
				<AdminRecordRow
					key={record.id}
					record={record}
					isHighlighted={record.id === highlightedRecordId}
					setRowRef={(element) => {
						if (element) {
							// Save the row element using the record ID
							rowRefs.current[record.id] = element;
						} else {
							//Remove saved row when no longer on the page
							delete rowRefs.current[record.id];
						}
					}}
					onEdit={() => onEditRecord(record)}
					onDelete={() => onDeleteRecord(record)}
				/>
			))}
		</div>
	);
}

export default AdminRecordList;
