// AI-assisted - see AI-USAGE.md #1
import { vi } from 'vitest'
import {
  buildSearchUrl,
  buildChartUrl,
  getTopSongs,
  chartIds,
  largeArtwork,
  mapTrack,
  searchSongs,
  resetRateLimit,
  RateLimitError,
  MAX_CALLS_PER_MINUTE,
} from './itunes'
import { itunesResults, mockItunesFetch, mockFetchStatus } from '../test/mockItunes'
import { getGenreOptions, sortSongs } from '../utils/songs'

beforeEach(() => resetRateLimit())
afterEach(() => vi.unstubAllGlobals())

test('builds a music-only search URL', () => {
  const url = new URL(buildSearchUrl('  the weeknd '))
  expect(url.origin + url.pathname).toBe('https://itunes.apple.com/search')
  expect(url.searchParams.get('term')).toBe('the weeknd')
  expect(url.searchParams.get('media')).toBe('music')
  expect(url.searchParams.get('entity')).toBe('song')
  expect(url.searchParams.get('country')).toBe('ca')
})

test('uses the Canadian Top Songs chart', () => {
  expect(buildChartUrl()).toBe('https://itunes.apple.com/ca/rss/topsongs/limit=50/json')
})

test('reads song ids from the chart feed', () => {
  expect(chartIds({ feed: { entry: [{ id: { attributes: { 'im:id': '42' } } }] } })).toEqual(['42'])
  // a chart with one song comes back as an object, not a list
  expect(chartIds({ feed: { entry: { id: { attributes: { 'im:id': '7' } } } } })).toEqual(['7'])
  expect(chartIds({})).toEqual([])
})

test('top songs come back in chart order', async () => {
  vi.stubGlobal('fetch', mockItunesFetch())
  const songs = await getTopSongs()
  expect(songs.map((s) => s.id)).toEqual(itunesResults.map((r) => r.trackId))
})

test('falls back to a normal search if the chart fails', async () => {
  vi.stubGlobal('fetch', mockItunesFetch({ chartFails: true }))
  const songs = await getTopSongs()
  const lastUrl = new URL(fetch.mock.calls.at(-1)[0])
  expect(lastUrl.pathname).toBe('/search')
  expect(lastUrl.searchParams.get('term')).toBe('pop')
  expect(Array.isArray(songs)).toBe(true)
})

test('asks for bigger artwork', () => {
  expect(largeArtwork('https://x.com/a/100x100bb.jpg')).toBe('https://x.com/a/600x600bb.jpg')
  expect(largeArtwork(undefined)).toBeNull()
})

test('turns an iTunes result into our song shape', () => {
  expect(mapTrack(itunesResults[0])).toEqual({
    id: 1000,
    title: 'Out of Time',
    artist: 'The Weeknd',
    album: 'Dawn FM',
    genre: 'R&B',
    releaseDate: '2022-01-07',
    durationMs: 200000,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/0/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/preview0.m4a',
    appleMusicUrl: 'https://music.apple.com/ca/album/0',
    explicit: false,
  })
})

test('fills in missing fields', () => {
  const song = mapTrack({ trackId: 1, trackName: 'X', artistName: 'Y', kind: 'song' })
  expect(song.album).toBe('Single')
  expect(song.genre).toBe('Other')
  expect(song.releaseDate).toBeNull()
  expect(song.previewUrl).toBeNull()
})

test('skips results that are not songs and removes duplicates', async () => {
  const results = [itunesResults[0], itunesResults[0], { kind: 'music-video', trackId: 5 }]
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ results }) })))
  const songs = await searchSongs('x')
  expect(songs).toHaveLength(1)
})

test('a 403 from Apple becomes a RateLimitError', async () => {
  vi.stubGlobal('fetch', mockFetchStatus(403))
  await expect(searchSongs('drake')).rejects.toBeInstanceOf(RateLimitError)
})

test('other server errors are reported', async () => {
  vi.stubGlobal('fetch', mockFetchStatus(500))
  await expect(searchSongs('drake')).rejects.toThrow('(500)')
})

test('stops itself before going over the rate limit', async () => {
  vi.stubGlobal('fetch', mockItunesFetch())
  for (let i = 0; i < MAX_CALLS_PER_MINUTE; i++) await searchSongs(`song ${i}`)
  await expect(searchSongs('one more')).rejects.toBeInstanceOf(RateLimitError)
  expect(fetch).toHaveBeenCalledTimes(MAX_CALLS_PER_MINUTE)
})

test('genre options are counted and sorted', () => {
  const songs = [{ genre: 'Pop' }, { genre: 'Dance' }, { genre: 'Pop' }]
  expect(getGenreOptions(songs)).toEqual([
    { name: 'Dance', count: 1 },
    { name: 'Pop', count: 2 },
  ])
})

test('sorts by artist then title', () => {
  const songs = [
    { title: 'B', artist: 'Zed' },
    { title: 'B', artist: 'Abba' },
    { title: 'A', artist: 'Abba' },
  ]
  expect(sortSongs(songs, 'artist').map((s) => `${s.artist} ${s.title}`)).toEqual([
    'Abba A',
    'Abba B',
    'Zed B',
  ])
})
// no internet error message
test('no internet gives a helpful message', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
  await expect(searchSongs('drake')).rejects.toThrow(/internet connection/)
})
// Apple servers are down
test('a 500 tells the user to try again later', async () => {
  vi.stubGlobal('fetch', mockFetchStatus(500))
  await expect(searchSongs('drake')).rejects.toThrow(/try again later/)
})
// a request was canceled 
test('a cancelled request is not turned into an error message', async () => {
  const abort = new DOMException('aborted', 'AbortError')
  vi.stubGlobal('fetch', vi.fn(async () => { throw abort }))
  await expect(searchSongs('drake')).rejects.toBe(abort)
})