// AI-assisted - see AI-USAGE.md #1
import { useEffect, useState } from 'react';
import { searchSongs, getTopSongs } from '../api/itunes';

// With no search typed, we show Apple's Top Songs chart instead of searching
export const TOP_SONGS = 'top-songs';
export const MIN_SEARCH_LENGTH = 2;
export const DEBOUNCE_MS = 500;

// Results we already fetched, so the same search never costs another API call.
const cache = new Map();

export function clearSearchCache() {
  cache.clear();
}

// Waits until the value has stopped changing for `delay` ms.
// Typing "radiohead" becomes 1 API call instead of 9.
export function useDebouncedValue(value, delay = DEBOUNCE_MS) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// What we actually send to the API for what the user typed.
export function queryFor(searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  return term.length >= MIN_SEARCH_LENGTH ? term : TOP_SONGS;
}

export default function useSongSearch(searchTerm) {
  const query = queryFor(useDebouncedValue(searchTerm));
  const [result, setResult] = useState({ query: null, songs: [], error: null });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (cache.has(query)) {
      setResult({ query, songs: cache.get(query), error: null });
      return;
    }

    // Cancel this request if the user searches for something else first,
    // so an old, slow answer can't replace newer results.
    const controller = new AbortController();

    const request = query === TOP_SONGS
      ? getTopSongs({ signal: controller.signal })
      : searchSongs(query, { signal: controller.signal });

    request
      .then((songs) => {
        cache.set(query, songs);
        setResult({ query, songs, error: null });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setResult({ query, songs: [], error: err.message || 'Something went wrong.' });
      });

    return () => controller.abort();
  }, [query, retryCount]);

  const loading = result.query !== query;

  return {
    query,
    songs: loading ? [] : result.songs,
    loading,
    error: loading ? null : result.error,
    retry: () => {
      setResult((prev) => ({ ...prev, query: null }));
      setRetryCount((n) => n + 1);
    },
  };
}
