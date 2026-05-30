function toTimestamp(value) {
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function sortUsers(userCarts, sortOption) {
	if (!Array.isArray(userCarts)) {
		return [];
	}

	const sorted = [...userCarts];
	const selectedSort = sortOption || "username-a-z";

	if (selectedSort === "username-a-z") {
		sorted.sort((a, b) =>
			String(a?.username || "").localeCompare(String(b?.username || ""))
		);
	}

	if (selectedSort === "username-z-a") {
		sorted.sort((a, b) =>
			String(b?.username || "").localeCompare(String(a?.username || ""))
		);
	}

	if (selectedSort === "updated-new-old") {
		sorted.sort((a, b) => toTimestamp(b?.updated_at) - toTimestamp(a?.updated_at));
	}

	if (selectedSort === "updated-old-new") {
		sorted.sort((a, b) => toTimestamp(a?.updated_at) - toTimestamp(b?.updated_at));
	}

	return sorted;
}
