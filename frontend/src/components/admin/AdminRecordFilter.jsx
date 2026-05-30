function AdminRecordFilter({
	searchTerm,
	onSearchChange,
	sortOption,
	onSortChange,
	onAddRecord,
}) {
	return (
		<section className="admin-record-filters" aria-label="Record filter controls">
			<div className="admin-record-filters-controls">
				<input
					type="text"
					className="admin-record-search-input"
					placeholder="Search records..."
					value={searchTerm}
					onChange={(event) => onSearchChange(event.target.value)}
				/>

				{/** Sort options */}
				<select
					className="admin-record-sort-select"
					value={sortOption}
					onChange={(event) => onSortChange(event.target.value)}
				>
					<option value="title-a-z">Title: A to Z</option>
					<option value="title-z-a">Title: Z to A</option>
					<option value="artist-a-z">Artist: A to Z</option>
					<option value="artist-z-a">Artist: Z to A</option>
					<option value="price-low-high">Price: low to high</option>
					<option value="price-high-low">Price: high to low</option>
					<option value="year-new-old">Release year: new to old</option>
					<option value="year-old-new">Release year: old to new</option>
				</select>

				<button
					type="button"
					className="add-record-button"
					onClick={onAddRecord}
				>
					Add Record
				</button>
			</div>
		</section>
	);
}

export default AdminRecordFilter;
