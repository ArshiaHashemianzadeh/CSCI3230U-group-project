
import { useState } from 'react';
import songs from './data/songs.json';
import NavBar from './components/NavBar';
import SongList from './components/SongList';
import SongDetail from './components/SongDetail';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';

export default function App() {

  // When a song is selected, open details.
  // When unselected, return to the catalog.
  const [selectedId, setSelectedId] = useState(null);

  // Keeps track of what the user types in the search bar
  const [searchTerm, setSearchTerm] = useState('');

  function goHome() {
    setSelectedId(null);
  }

  const selectedSong = songs.find((s) => s.id === selectedId);

  // Filter songs based on title or artist
  const filteredSongs = songs.filter((song) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      song.title.toLowerCase().includes(search) ||
      song.artist.toLowerCase().includes(search)
    );
  });

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

            {/* Display only songs matching the search */}
            <SongList
              songs={filteredSongs}
              onOpen={setSelectedId}
            />

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
