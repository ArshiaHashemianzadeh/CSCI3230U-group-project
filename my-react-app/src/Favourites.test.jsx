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

test('favourites are saved in localStorage', async () => {
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

  // Open the app again
  render(<App />);

  fireEvent.click(
    screen.getByRole('button', { name: 'Favourites (1)' })
  );

  expect(screen.getByText('Out of Time')).toBeTruthy();
});

test('shows a message when favourites are empty', () => {
  render(<App />);

  fireEvent.click(
    screen.getByRole('button', { name: 'Favourites (0)' })
  );

  expect(screen.getByText(/No favourites yet/)).toBeTruthy();
});