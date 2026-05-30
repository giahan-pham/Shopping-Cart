export function filterUsers(userCarts, searchTerm) {
	if (!Array.isArray(userCarts)) {
		return [];
	}

	const normalisedSearch = (searchTerm || "").trim().toLowerCase();
	if (!normalisedSearch) {
		return userCarts;
	}

	return userCarts.filter((userCart) =>
		String(userCart?.username || "")
			.toLowerCase()
			.includes(normalisedSearch)
	);
}
