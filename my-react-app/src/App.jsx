
import { useState } from 'react';
import songs from './data/songs.json';
import NavBar from './components/NavBar';
import SongList from './components/SongList';
import SongDetail from './components/SongDetail';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import SortControl from './components/SortControl';


export default function App() {

  // When a song is selected, open details.
  // When unselected, return to the catalog.
  const [selectedId, setSelectedId] = useState(null);

  // Keeps track of what the user types in the search bar
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  function goHome() {
    setSelectedId(null);
  }

  const selectedSong = songs.find((s) => s.id === selectedId);

// Filter songs based on search term and selected genre
const filteredSongs = songs.filter((song) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    song.title.toLowerCase().includes(search) ||
    song.artist.toLowerCase().includes(search);

  const matchesGenre =
    selectedGenre === 'All' || song.genre === selectedGenre;

  return matchesSearch && matchesGenre;
});
const sortedSongs = [...filteredSongs];

if (sortOrder === 'az') {
  sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
} else if (sortOrder === 'za') {
  sortedSongs.sort((a, b) => b.title.localeCompare(a.title));
}

  return (
    <div className="app">
      <NavBar onHome={goHome} />

      <main>
        {selectedSong ? (
          <SongDetail song={selectedSong} onBack={goHome} />
        ) : (

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
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />

            <SortControl
             sortOrder={sortOrder}
             onSortChange={setSortOrder}
             />
          </div>

            {/* Display only songs matching the search */}
            <SongList
              songs={sortedSongs}
              onOpen={setSelectedId}
            />

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
