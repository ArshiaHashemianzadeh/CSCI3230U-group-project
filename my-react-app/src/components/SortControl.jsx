export default function SortControl({ sortOrder, onSortChange }) {
  return (
    <div className="sort-control">
      <label htmlFor="sort-select">Sort By:</label>

      <select
        id="sort-select"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Most relevant</option>
        <option value="az">Title (A-Z)</option>
        <option value="za">Title (Z-A)</option>
        <option value="artist">Artist (A-Z)</option>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}
