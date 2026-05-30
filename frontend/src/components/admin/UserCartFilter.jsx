function UserCartFilter({
	searchTerm,
	onSearchChange,
	sortOption,
	onSortChange,
}) {
	return (
		<section className="user-cart-filters" aria-label="User cart filter controls">
			<div className="user-cart-filters-controls">
				{/* Search input */}
				<input
					type="text"
					className="user-cart-search-input"
					placeholder="Search username..."
					value={searchTerm}
					onChange={(event) => onSearchChange(event.target.value)}
				/>
				{/* Sort options */}
				<select
					className="user-cart-sort-select"
					value={sortOption}
					onChange={(event) => onSortChange(event.target.value)}
				>
					<option value="username-a-z">Username: A to Z</option>
					<option value="username-z-a">Username: Z to A</option>
					<option value="updated-new-old">Updated: new to old</option>
					<option value="updated-old-new">Updated: old to new</option>
				</select>
			</div>
		</section>
	);
}

export default UserCartFilter;
