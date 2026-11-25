
import { useState } from 'react';
import NavBar from './components/NavBar';
import SongList from './components/SongList';
import SongDetail from './components/SongDetail';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import SortControl from './components/SortControl';
import FavouritesPage from './components/FavouritesPage';
import useFavourites from './hooks/useFavourites';
import useSongSearch, { TOP_SONGS } from './hooks/useSongSearch';
import { getGenreOptions, filterByGenre, sortSongs } from './utils/songs';

export default function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  const [page, setPage] = useState('songs');

  const {
    favourites,
    isFavourite,
    toggleFavourite
  } = useFavourites();

  // Load songs from the iTunes API
  const { query, songs, loading, error, retry } = useSongSearch(searchTerm);

  function goHome() {
    setSelectedSong(null);
    setPage('songs');
  }

  function showFavourites() {
    setSelectedSong(null);
    setPage('favourites');
  }

  // Genres come from the API results
  const genres = getGenreOptions(songs);

  const activeGenre = genres.some(
    (genre) => genre.name === selectedGenre
  ) ? selectedGenre : 'All';

  // Filter and sort the songs
  const visibleSongs = sortSongs(
    filterByGenre(songs, activeGenre),
    sortOrder
  );

  const isTopSongs = query === TOP_SONGS;

  const heading = isTopSongs
    ? 'Top Songs in Canada'
    : `Results for “${query}”`;

  return (
    <div className="app">
      <NavBar
        onHome={goHome}
        onFavourites={showFavourites}
        favouriteCount={favourites.length}
      />

      <main>
        {selectedSong ? (
          <SongDetail
            song={selectedSong}
            onBack={goHome}
          />
        ) : page === 'favourites' ? (
          <FavouritesPage
            favourites={favourites}
            onOpen={setSelectedSong}
            isFavourite={isFavourite}
            onToggleFavourite={toggleFavourite}
          />
        ) : (
          <div className="catalog">
            <h1>Discover New Music</h1>

            <p className="opener">
              Explore the latest tracks, albums, and artists from around the world.
            </p>

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

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

            <div
              role="status"
              aria-live="polite"
              className="status-area"
            >
              {loading && (
                <p className="status-message">
                  Loading songs…
                </p>
              )}

              {!loading && !error && songs.length === 0 && (
                <p className="no-results">
                  {isTopSongs
                    ? 'No songs found.'
                    : `No songs found for “${query}”.`}
                  {' '}Try another search.
                </p>
              )}
            </div>

            {error && (
              <div role="alert" className="error-message">
                <p>{error}</p>
                <button
                  type="button"
                  className="button secondary"
                  onClick={retry}
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && songs.length > 0 && (
              <SongList
                heading={heading}
                songs={visibleSongs}
                onOpen={setSelectedSong}
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}