// AI-assisted - see AI-USAGE.md #1
// Fake iTunes API for tests: no real network calls, so tests are fast,
// work offline, and never use up Apple's rate limit.
import { vi } from 'vitest';
import songs from './songs.json';

// Our old mock songs, dressed up the way the real API sends them
export const itunesResults = songs.map((song, i) => ({
  wrapperType: 'track',
  kind: 'song',
  trackId: 1000 + i,
  trackName: song.title,
  artistName: song.artist,
  collectionName: song.album,
  primaryGenreName: song.genre,
  releaseDate: `${song.releaseDate}T07:00:00Z`,
  trackTimeMillis: 200000 + i * 1000,
  artworkUrl100: `https://is1-ssl.mzstatic.com/image/thumb/${i}/100x100bb.jpg`,
  previewUrl: `https://audio-ssl.itunes.apple.com/preview${i}.m4a`,
  trackViewUrl: `https://music.apple.com/ca/album/${i}`,
  trackExplicitness: 'notExplicit',
}));

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

// The Top Songs chart feed only gives us ids (in chart order)
export const chartFeed = {
  feed: {
    entry: itunesResults.map((r) => ({ id: { attributes: { 'im:id': String(r.trackId) } } })),
  },
};

// Fake iTunes:
// - /rss/topsongs -> the chart (all our songs)
// - /lookup?id=... -> those songs (shuffled, to check we put them back in chart order)
// - /search?term=... -> songs whose title or artist contains the term (like the real API, roughly)
export function mockItunesFetch({ chartFails = false } = {}) {
  return vi.fn(async (url) => {
    const { pathname, searchParams } = new URL(url);

    if (pathname.includes('/rss/topsongs')) {
      return chartFails ? jsonResponse({}, 500) : jsonResponse(chartFeed);
    }

    if (pathname === '/lookup') {
      const ids = searchParams.get('id').split(',').map(Number);
      const results = itunesResults.filter((r) => ids.includes(r.trackId)).reverse();
      return jsonResponse({ resultCount: results.length, results });
    }

    const term = searchParams.get('term').toLowerCase();
    const results = itunesResults.filter(
      (r) => r.trackName.toLowerCase().includes(term) || r.artistName.toLowerCase().includes(term),
    );
    return jsonResponse({ resultCount: results.length, results });
  });
}

export function mockFetchStatus(status) {
  return vi.fn(async () => jsonResponse({}, status));
}
