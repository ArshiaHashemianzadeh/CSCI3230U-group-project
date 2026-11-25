import { useState, useEffect } from 'react';

export default function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('muzic-favourites');
      const songs = saved ? JSON.parse(saved) : [];

      return Array.isArray(songs) ? songs : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'muzic-favourites',
        JSON.stringify(favourites)
      );
    } catch {
    }
  }, [favourites]);

  function isFavourite(song) {
    return favourites.some((item) => item.id === song.id);
  }

  function toggleFavourite(song) {
    setFavourites((current) => {
      const exists = current.some((item) => item.id === song.id);

      if (exists) {
        return current.filter((item) => item.id !== song.id);
      }

      return [...current, song];
    });
  }

  return { favourites, isFavourite, toggleFavourite };
}
