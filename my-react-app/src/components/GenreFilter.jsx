export default function GenreFilter({ selectedGenre, onGenreChange }) {
  return (
    <div className="genre-filter">
      <label htmlFor="genre-select">Filter by Genre:</label>

      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="All">All Genres</option>
        <option value="Pop">Pop</option>
        <option value="Hip-Hop">Hip-Hop</option>
        <option value="R&B">R&B</option>
        <option value="Alternative">Alternative</option>
      </select>
    </div>
  );
}
