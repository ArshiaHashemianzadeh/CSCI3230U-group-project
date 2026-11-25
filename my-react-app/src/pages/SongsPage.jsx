
//AI-assisted (iTunes API wiring) - see AI-USAGE.md #1
//AI-assisted (transfering main.jsx components to SongPage.jswx) - see AI-USAGE.md 

import SongList from '../components/SongList';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import SortControl from '../components/SortControl';
import useSongSearch, { TOP_SONGS } from '../hooks/useSongSearch';
import { getGenreOptions, filterByGenre, sortSongs } from '../utils/songs';

export default function SongsPage({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  sortOrder,
  setSortOrder,
}) {
  // Songs come from the iTunes Search API now (debounced + cached inside the hook)
  const { query, songs, loading, error, retry } = useSongSearch(searchTerm);

  // Genres come from the results themselves, so the list grows with the data
  const genres = getGenreOptions(songs);

  // If a new search has none of the chosen genre, show everything instead of nothing
  const activeGenre = genres.some((g) => g.name === selectedGenre) ? selectedGenre : 'All';

  const visibleSongs = sortSongs(filterByGenre(songs, activeGenre), sortOrder);

  const isTopSongs = query === TOP_SONGS;
  const heading = isTopSongs ? 'Top Songs in Canada' : `Results for “${query}”`;

  return (
    <div className="catalog">

      <h1>Discover New Music</h1>

      <p className="opener">
        Explore the latest tracks, albums, and artists from around the world.
      </p>

      {/* Search bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      {/* Filter songs by genre */}
      <div className="filter-controls">
        <GenreFilter
          genres={genres}
          selectedGenre={activeGenre}
          onGenreChange={setSelectedGenre}
        />

        <SortControl
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </div>

      {/* Screen readers announce loading, errors and empty results */}
      <div role="status" aria-live="polite" className="status-area">
        {loading && <p className="status-message">Loading songs…</p>}
        {!loading && !error && songs.length === 0 && (
          <p className="no-results">
            {isTopSongs ? 'No songs found.' : `No songs found for “${query}”.`} Try another search.
          </p>
        )}
      </div>

      {error && (
        <div role="alert" className="error-message">
          <p>{error}</p>
          <button type="button" className="button secondary" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && songs.length > 0 && (
        <SongList
          heading={heading}
          songs={visibleSongs}
        />
      )}

    </div>
  );
}
