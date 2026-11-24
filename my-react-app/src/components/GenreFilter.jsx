// AI-assisted (genres from API data) - see AI-USAGE.md #1
// `genres` is built from the search results: [{ name: 'Pop', count: 12 }, ...]
export default function GenreFilter({ genres, selectedGenre, onGenreChange }) {
  return (
    <div className="genre-filter">
      <label htmlFor="genre-select">Filter by Genre:</label>

      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="All">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.name} value={genre.name}>
            {genre.name} ({genre.count})
          </option>
        ))}
      </select>
    </div>
  );
}
