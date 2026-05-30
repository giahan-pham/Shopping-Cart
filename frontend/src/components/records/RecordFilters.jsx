import "./styles/RecordFilters.css";

function RecordFilters({
	title,
	description,
	searchTerm,
	onSearchChange,
	sortOption,
	onSortChange,
}) {
	return (
		<section className="record-filters">
			<div className="record-filters-header">
				<h1>{title}</h1>
				<p>{description}</p>
			</div>

			<div className="record-filters-controls">
				<input
					type="text"
					className="record-search-input"
					placeholder="Search by record title or artist..."
					value={searchTerm}
					onChange={(event) => onSearchChange(event.target.value)}
				/>

				<select
					className="record-sort-select"
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
			</div>
		</section>
	);
}

export default RecordFilters;
