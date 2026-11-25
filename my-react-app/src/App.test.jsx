// AI-assisted (updated for routing) - see AI-USAGE.md #N.

import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from './App'
import { mockItunesFetch, mockFetchStatus } from './test/mockItunes'
import { clearSearchCache } from './hooks/useSongSearch'
import { resetRateLimit } from './api/itunes'

// The app gets songs from the iTunes API now, so every test uses a fake fetch
beforeEach(() => {
  clearSearchCache()
  resetRateLimit()
  vi.stubGlobal('fetch', mockItunesFetch())
  // jsdom can't play audio, so pretend play/pause work
  vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
  vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// Render the app at a specific URL using MemoryRouter
function renderApp(url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>
  )
}

// songs load from the API and wait out the search delay
const wait = { timeout: 2000 }

async function openFirstSong() {
  renderApp()
  fireEvent.click(await screen.findByRole('link', { name: /Out of Time/ }))
}

// the songs show up when the app first loads
test('shows songs on the page', async () => {
  renderApp()
  expect(screen.getByText('Loading songs…')).toBeTruthy()
  expect(await screen.findByText('Out of Time')).toBeTruthy()
  expect(screen.getByText('Hotline Bling')).toBeTruthy()
  expect(screen.getByText('Top Songs in Canada', { exact: false })).toBeTruthy()
})

// the home page keeps Apple's chart order (1st on the chart comes first)
test('top songs stay in chart order', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const titles = screen.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)
  expect(titles[0]).toBe('Out of Time')
  expect(titles[titles.length - 1]).toBe('Mr. Brightside')
})

// covers come from the API, in the bigger size
test('shows album covers from the API', async () => {
  renderApp()
  const cover = await screen.findByAltText('Dawn FM album cover')
  expect(cover.getAttribute('src')).toContain('600x600bb')
})

// searching for a song hides the ones that don't match
test('search finds a song by its title', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const searchBox = screen.getByPlaceholderText('Search songs or artists...')
  fireEvent.change(searchBox, { target: { value: 'hotline' } })

  expect(await screen.findByText('Results for “hotline”', { exact: false }, wait)).toBeTruthy()
  expect(screen.queryByText('Hotline Bling')).toBeTruthy()
  expect(screen.queryByText('Out of Time')).toBeNull()
})

// searching works with the artist's name too
test('search finds a song by its artist', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const searchBox = screen.getByPlaceholderText('Search songs or artists...')
  fireEvent.change(searchBox, { target: { value: 'radiohead' } })

  expect(await screen.findByText('Results for “radiohead”', { exact: false }, wait)).toBeTruthy()
  expect(screen.queryByText('Just')).toBeTruthy()
  expect(screen.queryByText('Hotline Bling')).toBeNull()
})

// typing quickly only sends one request (protects the rate limit)
test('typing is debounced into one API call', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const searchBox = screen.getByPlaceholderText('Search songs or artists...')
  for (const text of ['r', 'ra', 'rad', 'radi', 'radio']) {
    fireEvent.change(searchBox, { target: { value: text } })
  }
  await screen.findByText('Results for “radio”', { exact: false }, wait)

  // 2 calls for the first load (chart + lookup) + 1 for the search
  expect(fetch).toHaveBeenCalledTimes(3)
})

// a search with no matches says so
test('shows a message when nothing is found', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  fireEvent.change(screen.getByPlaceholderText('Search songs or artists...'), {
    target: { value: 'zzzzzz' },
  })
  expect(await screen.findByText(/No songs found/, {}, wait)).toBeTruthy()
})

// Apple answers 403 when we go over the rate limit
test('shows a friendly message when rate limited', async () => {
  vi.stubGlobal('fetch', mockFetchStatus(403))
  renderApp()
  expect(await screen.findByRole('alert')).toBeTruthy()
  expect(screen.getByText(/Too many searches/)).toBeTruthy()
  expect(screen.getByText('Try again')).toBeTruthy()
})

// the genre list is built from the songs the API sent back
test('genre list comes from the API data', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const genreDropdown = screen.getByLabelText('Filter by Genre:')
  const options = within(genreDropdown).getAllByRole('option').map((o) => o.textContent)
  expect(options).toEqual([
    'All Genres',
    'Alternative (2)',
    'Hip-Hop (2)',
    'Pop (1)',
    'R&B (3)',
  ])
})

// picking a genre only shows songs from that genre
test('genre filter hides other genres', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const genreDropdown = screen.getByLabelText('Filter by Genre:')
  fireEvent.change(genreDropdown, { target: { value: 'Hip-Hop' } })

  expect(screen.queryByText('Hotline Bling')).toBeTruthy()
  expect(screen.queryByText('Out of Time')).toBeNull()
})

// sorting A-Z puts the songs in alphabetical order
test('sort A-Z puts titles in order', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  const sortDropdown = screen.getByLabelText('Sort By:')
  fireEvent.change(sortDropdown, { target: { value: 'az' } })

  const titles = screen.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)
  // localeCompare sorts the way people expect (ignores capital letters)
  const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b))
  expect(titles).toEqual(sortedTitles)
})

// newest first uses the release dates from the API
test('sort newest first', async () => {
  renderApp()
  await screen.findByText('Out of Time')
  fireEvent.change(screen.getByLabelText('Sort By:'), { target: { value: 'newest' } })

  const titles = screen.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)
  expect(titles[0]).toBe('Kill Bill')
  expect(titles[titles.length - 1]).toBe('Just')
})

/// clicking a song opens its page
test('opens a song page', async () => {
  await openFirstSong()

  expect(screen.getByText('Back to songs')).toBeTruthy()
  expect(screen.getByText('About this song')).toBeTruthy()
  expect(screen.getByText('Listen on Apple Music')).toBeTruthy()
})

// directly opening a song URL loads the correct song
test('directly opens a song by its ID', async () => {
  renderApp('/songs/1001')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Hotline Bling' })
  ).toBeTruthy()
})

// unknown URLs show the not found page
test('shows the not found page for an unknown route', () => {
  renderApp('/nope')

  expect(screen.getByText('Page not found')).toBeTruthy()
})

// the back button takes you back to the song list
test('back button goes back to the list', async () => {
  await openFirstSong()
  fireEvent.click(screen.getByText('Back to songs'))

  expect(screen.getByText('Discover New Music')).toBeTruthy()
  expect(await screen.findByText('Out of Time')).toBeTruthy()
  // coming back uses the cache instead of calling the API again (chart + lookup only)
  expect(fetch).toHaveBeenCalledTimes(2)
})

/// the preview button changes from Play to Pause and back
test('preview button plays and pauses', async () => {
  await openFirstSong()

  fireEvent.click(screen.getByText('Play Preview'))
  expect(screen.getByText('Pause Preview')).toBeTruthy()
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()

  fireEvent.click(screen.getByText('Pause Preview'))
  expect(screen.getByText('Play Preview')).toBeTruthy()
})
