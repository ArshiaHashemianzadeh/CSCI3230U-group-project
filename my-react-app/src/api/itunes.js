// AI-assisted - see AI-USAGE.md #1
//
// Everything that talks to the iTunes Search API lives in this file.
// Docs: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
//
// No API key: the iTunes Search API is public, so there is nothing secret to hide.
// Rate limit: Apple allows roughly 20 calls per minute and answers 403 when you go over.
// We stay under it by debouncing the search box (useSongSearch), caching results,
// and refusing to send more than MAX_CALLS_PER_MINUTE ourselves (below).

const BASE_URL = 'https://itunes.apple.com';
const RESULT_LIMIT = 50;

// Which Apple store to use. 'ca' = Canada, so results match what Canadians see.
export const COUNTRY = 'ca';

// Used if Apple's Top Songs chart can't be loaded
export const FALLBACK_TERM = 'pop';

// A little below Apple's ~20/min so we never get blocked.
export const MAX_CALLS_PER_MINUTE = 18;
const ONE_MINUTE = 60 * 1000;
let recentCalls = []; // timestamps of the calls made in the last minute

export class RateLimitError extends Error {
  constructor() {
    super('Too many searches in a short time. Please wait a minute and try again.');
    this.name = 'RateLimitError';
  }
}

export function buildSearchUrl(term) {
  const params = new URLSearchParams({
    term: term.trim(),
    media: 'music',
    entity: 'song',
    country: COUNTRY,
    limit: String(RESULT_LIMIT),
  });
  return `${BASE_URL}/search?${params}`;
}

// Apple's (older) Top Songs chart feed - the real most-popular songs right now
export function buildChartUrl() {
  return `${BASE_URL}/${COUNTRY}/rss/topsongs/limit=${RESULT_LIMIT}/json`;
}

// Look up many songs at once by their iTunes ids (same result shape as search)
export function buildLookupUrl(ids) {
  const params = new URLSearchParams({ id: ids.join(','), country: COUNTRY });
  return `${BASE_URL}/lookup?${params}`;
}

// iTunes gives a 100x100 image. Changing the size in the URL gives a sharper one.
export function largeArtwork(url, size = 600) {
  if (!url) return null;
  return url.replace(/\d+x\d+bb/, `${size}x${size}bb`);
}

// Turn one iTunes result into the song shape our components use.
export function mapTrack(track) {
  return {
    id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName ?? 'Single',
    genre: track.primaryGenreName ?? 'Other',
    releaseDate: track.releaseDate ? track.releaseDate.slice(0, 10) : null,
    durationMs: track.trackTimeMillis ?? null,
    artwork: largeArtwork(track.artworkUrl100),
    previewUrl: track.previewUrl ?? null,
    appleMusicUrl: track.trackViewUrl ?? null,
    explicit: track.trackExplicitness === 'explicit',
  };
}

function checkRateLimit() {
  const now = Date.now();
  recentCalls = recentCalls.filter((time) => now - time < ONE_MINUTE);
  if (recentCalls.length >= MAX_CALLS_PER_MINUTE) throw new RateLimitError();
  recentCalls.push(now);
}

// only used by the tests, so each test starts with a fresh limit
export function resetRateLimit() {
  recentCalls = [];
}

async function fetchJson(url, signal) {
  checkRateLimit();

  const response = await fetch(url, { signal });

  // Apple answers 403 (sometimes 429) when we've hit the rate limit
  if (response.status === 403 || response.status === 429) throw new RateLimitError();
  if (!response.ok) throw new Error(`The music service returned an error (${response.status}).`);

  return response.json();
}

function toSongs(results = []) {
  const seen = new Set();
  return results
    .filter((item) => item.kind === 'song' && item.trackId)
    .map(mapTrack)
    // the same song can show up twice (e.g. single + album); keep the first one
    .filter((song) => {
      if (seen.has(song.id)) return false;
      seen.add(song.id);
      return true;
    });
}

export async function searchSongs(term, { signal } = {}) {
  const data = await fetchJson(buildSearchUrl(term), signal);
  return toSongs(data.results);
}

// Pull the song ids out of the chart feed, in chart order
export function chartIds(feed) {
  const entries = feed?.feed?.entry ?? [];
  const list = Array.isArray(entries) ? entries : [entries];
  return list.map((entry) => entry?.id?.attributes?.['im:id']).filter(Boolean);
}

// Top Songs = 2 calls: the chart (ids only), then one lookup for full details.
// If the chart can't be loaded we fall back to a normal search instead of an empty page.
export async function getTopSongs({ signal } = {}) {
  try {
    const ids = chartIds(await fetchJson(buildChartUrl(), signal));
    if (ids.length === 0) throw new Error('Empty chart');

    const songs = toSongs((await fetchJson(buildLookupUrl(ids), signal)).results);
    const rank = new Map(ids.map((id, i) => [Number(id), i]));
    return songs.sort((a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999));
  } catch (err) {
    if (err.name === 'AbortError' || err instanceof RateLimitError) throw err;
    return searchSongs(FALLBACK_TERM, { signal });
  }
}
