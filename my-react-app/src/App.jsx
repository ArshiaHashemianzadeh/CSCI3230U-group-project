
// AI-assisted (iTunes API wiring) - see AI-USAGE.md #1
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SongsPage from './pages/SongsPage';
import SongDetailPage from './pages/SongDetailPage';
import NotFound from './pages/NotFound';

export default function App() {

  // Keeps track of what the user types in the search bar
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  return (
    <div className="app">
      <NavBar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <SongsPage
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            }
          />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
