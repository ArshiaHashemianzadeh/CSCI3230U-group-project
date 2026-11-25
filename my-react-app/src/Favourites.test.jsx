
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { mockItunesFetch } from './test/mockItunes';
import { clearSearchCache } from './hooks/useSongSearch';
import { resetRateLimit } from './api/itunes';

beforeEach(() => {
  localStorage.clear();
  clearSearchCache();
  resetRateLimit();
  vi.stubGlobal('fetch', mockItunesFetch());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('user can add and remove a favourite', async () => {
  render(<App />);

  await screen.findByRole('button', { name: 'Out of Time' });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Add Out of Time to favourites'
    })
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'Favourites (1)' })
  );

  expect(screen.getByText('Out of Time')).toBeTruthy();

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Remove Out of Time from favourites'
    })
  );

  expect(screen.getByText(/No favourites yet/)).toBeTruthy();
});

test('favourites stay saved after reopening the app', async () => {
  const { unmount } = render(<App />);

  await screen.findByRole('button', { name: 'Out of Time' });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Add Out of Time to favourites'
    })
  );

  const saved = JSON.parse(
    localStorage.getItem('muzic-favourites')
  );

  expect(saved).toHaveLength(1);

  unmount();

  render(<App />);

  fireEvent.click(
    screen.getByRole('button', { name: 'Favourites (1)' })
  );

  expect(screen.getByText('Out of Time')).toBeTruthy();
});

test('shows a message when favourites are empty', async () => {
  render(<App />);

  await screen.findByRole('button', { name: 'Out of Time' });

  fireEvent.click(
    screen.getByRole('button', { name: 'Favourites (0)' })
  );

  expect(screen.getByText(/No favourites yet/)).toBeTruthy();
});

test('favourite button is accessible', async () => {
  render(<App />);

  const heart = await screen.findByRole('button', {
    name: 'Add Out of Time to favourites'
  });

  heart.focus();

  expect(document.activeElement).toBe(heart);
  expect(heart.getAttribute('aria-pressed')).toBe('false');

  // Saves the song
  fireEvent.click(heart);

  const savedHeart = screen.getByRole('button', {
    name: 'Remove Out of Time from favourites'
  });

  expect(savedHeart.getAttribute('aria-pressed')).toBe('true');
});
