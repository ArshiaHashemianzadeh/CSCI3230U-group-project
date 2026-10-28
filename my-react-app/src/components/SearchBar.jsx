
export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-container">
      <input
        type="search"
        className="search-input"
        placeholder="Search songs or artists..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search songs or artists"
      />
    </div>
  );
}
