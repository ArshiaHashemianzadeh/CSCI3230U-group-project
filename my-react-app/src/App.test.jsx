import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

// the songs show up when the app first loads
test('shows songs on the page', () => {
  render(<App />)
  expect(screen.getByText('Out of Time')).toBeTruthy()
  expect(screen.getByText('Hotline Bling')).toBeTruthy()
})

// searching for a song hides the ones that don't match
test('search finds a song by its title', () => {
  render(<App />)
  const searchBox = screen.getByPlaceholderText('Search songs or artists...')
  fireEvent.change(searchBox, { target: { value: 'hotline' } })

  expect(screen.queryByText('Hotline Bling')).toBeTruthy()
  expect(screen.queryByText('Out of Time')).toBeNull()
})

// searching works with the artist's name too
test('search finds a song by its artist', () => {
  render(<App />)
  const searchBox = screen.getByPlaceholderText('Search songs or artists...')
  fireEvent.change(searchBox, { target: { value: 'radiohead' } })

  expect(screen.queryByText('Just')).toBeTruthy()
  expect(screen.queryByText('Hotline Bling')).toBeNull()
})

// picking a genre only shows songs from that genre
test('genre filter hides other genres', () => {
  render(<App />)
  const genreDropdown = screen.getByLabelText('Filter by Genre:')
  fireEvent.change(genreDropdown, { target: { value: 'Hip-Hop' } })

  expect(screen.queryByText('Hotline Bling')).toBeTruthy()
  expect(screen.queryByText('Out of Time')).toBeNull()
})

// sorting A-Z puts the songs in alphabetical order
test('sort A-Z puts titles in order', () => {
  render(<App />)
  const sortDropdown = screen.getByLabelText('Sort By:')
  fireEvent.change(sortDropdown, { target: { value: 'az' } })

  const titles = screen.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)
// localeCompare sorts the way people expect (ignores capital letters)
  const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b))
  expect(titles).toEqual(sortedTitles)
})

/// View details works
test('opens a song page', () => {
  render(<App />)
  const buttons = screen.getAllByText('View Details')
  fireEvent.click(buttons[0])

  expect(screen.getByText('Back to songs')).toBeTruthy()
  expect(screen.getByText('About this song')).toBeTruthy()
})

// the back button takes you back to the song list
test('back button goes back to the list', () => {
  render(<App />)
  fireEvent.click(screen.getAllByText('View Details')[0])
  fireEvent.click(screen.getByText('Back to songs'))

  expect(screen.getByText('Discover New Music')).toBeTruthy()
})

/// the preview button changes from Play to Pause and back
test('preview button plays and pauses', () => {
  render(<App />)
  fireEvent.click(screen.getAllByText('View Details')[0])

  fireEvent.click(screen.getByText('Play Preview'))
  expect(screen.getByText('Pause Preview')).toBeTruthy()

  fireEvent.click(screen.getByText('Pause Preview'))
  expect(screen.getByText('Play Preview')).toBeTruthy()
})