import { useState } from 'react';
import songs from './data/songs.json';
import NavBar from './components/NavBar';
import SongList from './components/SongList';
import SongDetail from './components/SongDetail';
import Footer from './components/Footer';

export default function App() {

  //Plan here is that when song is selected, we open details and when unselected, takes us back to catalog
  const [selectedId, setSelectedId] = useState(null);

  function goHome() {
    setSelectedId(null);
  }

  const selectedSong = songs.find((s) => s.id === selectedId);

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

            <SongList songs={songs} onOpen={setSelectedId} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}