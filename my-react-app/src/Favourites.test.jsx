
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';
import { mockItunesFetch } from './test/mockItunes';
import { clearSearchCache } from './hooks/useSongSearch';
import { resetRateLimit } from './api/itunes';

// Render the app inside MemoryRouter so React Router routes work in tests.
function renderApp(url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>
  );
}

// Reset local storage, search cache, rate limits, and mocked fetch before each test.
beforeEach(() => {
  localStorage.clear();
  clearSearchCache();
  resetRateLimit();
  vi.stubGlobal('fetch', mockItunesFetch());
});

// Restore mocked functions and globals after each test.
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// Tests that a user can add a song to favourites and remove it again.
test('user can add and remove a favourite', async () => {
  renderApp();

  await screen.findByRole('link', { name: /Out of Time/ });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Add Out of Time to favourites'
    })
  );

  fireEvent.click(
    screen.getByRole('link', { name: 'Favourites (1)' })
  );

  expect(screen.getByText('Out of Time')).toBeTruthy();

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Remove Out of Time from favourites'
    })
  );

  expect(screen.getByText(/No favourites yet/)).toBeTruthy();
});

// Tests that favourite songs are saved in localStorage and remain after reopening the app.
test('favourites stay saved after reopening the app', async () => {
  const { unmount } = renderApp();

  await screen.findByRole('link', { name: /Out of Time/ });

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

  renderApp();

  fireEvent.click(
    screen.getByRole('link', { name: 'Favourites (1)' })
  );

  expect(screen.getByText('Out of Time')).toBeTruthy();
});

// Tests that the favourites page displays a message when the user has no saved songs.
test('shows a message when favourites are empty', async () => {
  renderApp();

  await screen.findByRole('link', { name: /Out of Time/ });

  fireEvent.click(
    screen.getByRole('link', { name: 'Favourites (0)' })
  );

  expect(screen.getByText(/No favourites yet/)).toBeTruthy();
});

// Tests that the favourite button can receive keyboard focus and exposes its pressed state.
test('favourite button is accessible', async () => {
  renderApp();

  const heart = await screen.findByRole('button', {
    name: 'Add Out of Time to favourites'
  });

  heart.focus();

  expect(document.activeElement).toBe(heart);
  expect(heart.getAttribute('aria-pressed')).toBe('false');

  fireEvent.click(heart);

  const savedHeart = screen.getByRole('button', {
    name: 'Remove Out of Time from favourites'
  });

  expect(savedHeart.getAttribute('aria-pressed')).toBe('true');
});
