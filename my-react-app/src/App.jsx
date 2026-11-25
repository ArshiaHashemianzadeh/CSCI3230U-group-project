
// AI-assisted - see AI-USAGE.md #1, #2, #4

import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SongsPage from './pages/SongsPage';
import SongDetailPage from './pages/SongDetailPage';
import NotFound from './pages/NotFound';
import FavouritesPage from './components/FavouritesPage';
import useFavourites from './hooks/useFavourites';

export default function App() {
  // Keeps track of what the user types in the search bar
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  // Manage favourite songs
  const {
    favourites,
    isFavourite,
    toggleFavourite
  } = useFavourites();
  // start at the top of page
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <NavBar favouriteCount={favourites.length} />

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
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
              />
            }
          />

          <Route
            path="/songs/:id"
            element={<SongDetailPage />}
          />

          <Route
            path="/favourites"
            element={
              <FavouritesPage
                favourites={favourites}
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
