// AI-assisted - see AI-USAGE.md #1

// Build the genre dropdown from the songs we actually got back,
// e.g. [{ name: 'Dance', count: 7 }, { name: 'Pop', count: 21 }]
export function getGenreOptions(songs) {
  const counts = new Map();
  for (const song of songs) {
    counts.set(song.genre, (counts.get(song.genre) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function filterByGenre(songs, genre) {
  if (genre === 'All') return songs;
  return songs.filter((song) => song.genre === genre);
}

// dates are "YYYY-MM-DD" strings, so comparing them as text sorts them by date
const byDate = (a, b) => (a.releaseDate ?? '').localeCompare(b.releaseDate ?? '');

export function sortSongs(songs, sortOrder) {
  const sorted = [...songs];
  switch (sortOrder) {
    case 'az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'za':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'artist':
      return sorted.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
    case 'newest':
      return sorted.sort((a, b) => byDate(b, a));
    case 'oldest':
      return sorted.sort(byDate);
    default:
      return sorted; // "Default" keeps the API's relevance order
  }
}
