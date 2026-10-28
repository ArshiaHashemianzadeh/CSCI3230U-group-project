export default function SortControl({ sortOrder, onSortChange }) {
  return (
    <div className="sort-control">
      <label htmlFor="sort-select">Sort By:</label>

      <select
        id="sort-select"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="az">Title (A-Z)</option>
        <option value="za">Title (Z-A)</option>
      </select>
    </div>
  );
}