export function filterRecords(records, searchTerm) {
	if (!Array.isArray(records)) {
		return [];
	}

	const normalisedSearch = (searchTerm || "").trim().toLowerCase();
	if (!normalisedSearch) {
		return records;
	}

	return records.filter((record) => {
		const title = (record.title || "").trim().toLowerCase();
		const artist = (record.artist || "").trim().toLowerCase();
		const combined = `${title} ${artist}`.trim();
		const combinedReverse = `${artist} ${title}`.trim();

		return (
			title.includes(normalisedSearch) ||
			artist.includes(normalisedSearch) ||
			combined.includes(normalisedSearch) ||
			combinedReverse.includes(normalisedSearch)
		);
	});
}

