export function sortRecords(records, sortOption) {
	if (!Array.isArray(records)) {
		return [];
	}

	const sorted = [...records];
	const selectedSort = sortOption || "title-a-z";

	if (selectedSort === "title-a-z") {
		sorted.sort((a, b) =>
			String(a.title || "").localeCompare(String(b.title || ""))
		);
	}

	if (selectedSort === "title-z-a") {
		sorted.sort((a, b) =>
			String(b.title || "").localeCompare(String(a.title || ""))
		);
	}

	if (selectedSort === "artist-a-z") {
		sorted.sort((a, b) =>
			String(a.artist || "").localeCompare(String(b.artist || ""))
		);
	}

	if (selectedSort === "artist-z-a") {
		sorted.sort((a, b) =>
			String(b.artist || "").localeCompare(String(a.artist || ""))
		);
	}

	if (selectedSort === "price-low-high") {
		sorted.sort((a, b) => Number(a.price) - Number(b.price));
	}

	if (selectedSort === "price-high-low") {
		sorted.sort((a, b) => Number(b.price) - Number(a.price));
	}

	if (selectedSort === "year-new-old") {
		sorted.sort((a, b) => Number(b.release_year) - Number(a.release_year));
	}

	if (selectedSort === "year-old-new") {
		sorted.sort((a, b) => Number(a.release_year) - Number(b.release_year));
	}

	return sorted;
}

