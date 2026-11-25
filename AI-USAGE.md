# AI-USAGE.md

This file logs every time an AI tool contributed to submitted code in this project.
Add an entry before you commit the AI-assisted code. (Using AI only to learn -
explanations, error messages, design talk - does not need an entry.) See the course AI
policy (`ai-policy.md`).

Code markers: `// AI-assisted - see AI-USAGE.md #<n>`.

---

## Log

### #1 - Connect the iTunes Search API (replace mock JSON), cover art, genres, previews
- **Date:** 2026-11-24
- **Member:** Himmat Basra
- **Tool / model:** Claude 
- **Files:**
  - new: `my-react-app/src/api/itunes.js`, `my-react-app/src/hooks/useSongSearch.js`,
    `my-react-app/src/utils/songs.js`, `my-react-app/src/test/mockItunes.js`,
    `my-react-app/src/api/itunes.test.js`
  - changed: `my-react-app/src/App.jsx`, `my-react-app/src/App.test.jsx`,
    `my-react-app/src/components/GenreFilter.jsx`, `SortControl.jsx`, `SongList.jsx`,
    `SongCard.jsx`, `SongDetail.jsx`, `SongPreview.jsx`, `my-react-app/src/index.css`
  - moved: `my-react-app/src/data/songs.json` → `my-react-app/src/test/songs.json` (now test data only)
- **Prompt (verbatim):**

  ```
  https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project

  this is my github repo for my web dev project. I need to implement the api live itunes.

  * Connect the ITUNEs API, which will replace our mock JSON.
  * The risk is handling API Keys, and rate limits
  * Adding cover images using API
  * Improving genre sort, using extra genres given by API.

Show me how I have to implement this step by step and how it works. I don't have much API Experince so be as detailed as possible and teach me important concepts as well. 
  ```

- **What it produced & what I changed:**
  - `api/itunes.js` calls `https://itunes.apple.com/search` (music, songs, limit 50) and maps
    each result to our existing song shape. No API key is needed (public API). A 403/429 from
    Apple becomes a friendly "too many searches" error, and the app refuses to send more than
    18 calls/minute itself (Apple's limit is ~20/min).
  - `useSongSearch` debounces typing by 500 ms, needs 2+ characters, caches every query,
    and cancels stale requests. First load searches "top hits".
  - Artwork uses `artworkUrl100` resized to 600×600. Genre dropdown is built from the
    genres in the results (with counts). New sorts: Artist, Newest, Oldest.
  - Song preview plays the real 30-second `previewUrl` audio.
  - Follow-up prompt: "it works but why is it all brown music" / "like all ounjabi and latin".
    The "top hits" keyword search matched compilation albums, so the home page now shows
    Apple's real Canadian Top Songs chart (`/ca/rss/topsongs` feed → one `/lookup` call),
    searches use the Canadian store (`country=ca`), and if the chart fails it falls back to
    searching "pop".
  - Tests use a fake `fetch` (no real network). Also fixed 3 tests that were already failing
    because they clicked a "View Details" button that no longer existed.
  - <FILL IN: what you reviewed/changed yourself and why you believe it is correct>

### #2 - Split App.jsx into SongsPage and a routed App (React Router)
- **Date:** 2026-11-25
- **Member:** Arshia Hashemianzadeh
- **Tool / model:** ChatGPT (free tier)
- **Files:**
  - new: `my-react-app/src/pages/SongsPage.jsx`
  - changed: `my-react-app/src/App.jsx`
- **Prompt (verbatim):**

  ```
  1. src/pages/SongsPage.jsx (the list page at "/")
  - move the useSongSearch call, genres, activeGenre, visibleSongs, isTopSongs, heading
    and everything inside the "catalog" div into it
  - searchTerm, selectedGenre and sortOrder should NOT be useState in here. they come
    in as props called searchTerm, setSearchTerm, selectedGenre, setSelectedGenre,
    sortOrder, setSortOrder
  - take onOpen={setSelectedSong} off SongList since the cards will be Links later
  - it's in a pages folder so imports need ../

  2. the new src/App.jsx
  - keep the searchTerm, selectedGenre and sortOrder useState here (so the search
    doesn't reset when you open a song and come back) and pass them to SongsPage
  - delete selectedSong, goHome and the selectedSong ? ... : ... switch, the URL
    handles that now
  - inside <main>, use <Routes> with three routes:
    "/" -> SongsPage, "/songs/:id" -> SongDetailPage, "*" -> NotFound
  - import SongsPage, SongDetailPage and NotFound from ./pages/ (I'll make the last
    two myself)
  - NavBar is just <NavBar /> with no props now, Footer stays the same
  - BrowserRouter is already in main.jsx, so DON'T add it to App

  keep my class names, text and comments the same, I don't want the look to change.
  here's my App.jsx right now:
  [my full App.jsx pasted here]
  ```

- **What it produced & what I changed:**
  - `SongsPage.jsx` is the old catalog JSX moved into its own page, with search/genre/sort
    state coming in as props. `App.jsx` now only holds that state plus the `<Routes>`.
  - Kept both. I checked the prop names matched, the imports used `../`, and that App had
    no `BrowserRouter` (it lives in `main.jsx`).
  - Later added the favourites props to both while merging my teammate's work (#4).

### #3 - SongDetailPage: load a song by id from the URL
- **Date:** 2026-11-25
- **Member:** Arshia Hashemianzadeh
- **Tool / model:** ChatGPT (free tier)
- **Files:**
  - new: `my-react-app/src/pages/SongDetailPage.jsx`
- **Prompt (verbatim):**

  ```
  I added getSong(id, { signal }) to ../api/itunes. it returns the song, or null if it
  doesn't exist.

  can you rewrite src/pages/SongDetailPage.jsx so it:
  - gets id from useParams (it's a string, my ids are numbers)
  - uses the state song if it matches the id, otherwise fetches with getSong in a
    useEffect with an AbortController + cleanup
  - shows loading, error, "Song not found", or <SongDetail song={song} />
  - has a <Link to="/">Back to songs</Link> on the error/not found screens

  just useState and useEffect please. here's my file:
  [my SongDetailPage.jsx pasted here]
  ```

- **What it produced & what I changed:**
  - Kept the `useParams` + navigation state + `getSong` + `AbortController` logic. It
    compares `String(stateSong.id) === id` because URL params are strings.
  - **Rejected** its generic "Something went wrong while loading the song." message and used
    `err.message` instead, so users see the real reason (no internet, rate limit, etc.).
  - Added `role="status"` to the loading text and `role="alert"` to the error box for screen
    readers, and changed the not-found text to "This song doesn't exist or isn't available
    in Canada."
  - Checked by refreshing a song page and opening `/songs/1`.

### #4 - Resolve the App.jsx merge conflict (routing + favourites)
- **Date:** 2026-11-25
- **Member:** Arshia Hashemianzadeh
- **Tool / model:** ChatGPT (free tier)
- **Files:**
  - changed: `my-react-app/src/App.jsx`
- **Prompt (verbatim):**

  ```
  merge conflict in my App.jsx. HEAD = my react router version, origin/main = teammate's
  favourites. merge them: keep my Routes and pages, call useFavourites in App, pass
  favouriteCount to NavBar, pass isFavourite + onToggleFavourite to SongsPage, add a
  /favourites route. no selectedSong, page state or onOpen.

  [App.jsx with the conflict markers pasted here]
  ```

- **What it produced & what I changed:**
  - Kept it. It keeps my `<Routes>`, calls `useFavourites()` once in App, passes the count to
    NavBar and the favourite props to SongsPage, and adds the `/favourites` route.
  - Resolved the other conflicted files (`NavBar.jsx`, `SongCard.jsx`, `index.css`) myself and
    removed `onOpen` from `SongList.jsx` and `FavouritesPage.jsx`.
  - Checked by favouriting a song, opening /favourites and refreshing a song page.

### #5 - Update App tests for React Router
- **Date:** 2026-11-25
- **Member:** Arshia Hashemianzadeh
- **Tool / model:** ChatGPT (free tier)
- **Files:**
  - changed: `my-react-app/src/App.test.jsx`
- **Prompt (verbatim):**

  ```
  I added react router to my app. update App.test.jsx: wrap App in MemoryRouter with a
  renderApp(url = '/') helper, song titles are links now (getByRole('link') not
  'button'), keep all my tests. add 2 tests: '/songs/1001' shows the "Hotline Bling"
  h1, '/nope' shows "Page not found".

  [my full App.test.jsx pasted here]
  ```

- **What it produced & what I changed:**
  - Kept it as-is. The 15 original tests are unchanged except that `render(<App />)` became
    `renderApp()` and the song title is now found as a link. It also added 2 routing tests
    (a direct song URL and the 404 page).
  - Ran `npm test`: all 17 App tests pass.

### #6 - Update Favourites tests for React Router
- **Date:** 2026-11-25
- **Member:** Arshia Hashemianzadeh
- **Tool / model:** ChatGPT (free tier)
- **Files:**
  - changed: `my-react-app/src/Favourites.test.jsx`
- **Prompt (verbatim):**

  ```
  [teammate's full Favourites.test.jsx pasted here]
  ```
  ```
  remember this as a rejection and fix

  missed one thing: the "Favourites (n)" nav item is a NavLink now, not a button. Everything else is right.
  ```
  ```
  give me the whole file again
  ```
  ```
  with comments at top of each
  ```

- **What it produced & what I changed:**
  - **Rejected** the first version: it still looked for the "Favourites (n)" nav item as a
    button, but it's a `NavLink` now, so 3 tests failed.
  - Kept the fixed version: song titles and the nav are found as links, the heart stays a
    button, and each test has a comment saying what it checks.
  - Ran `npm test`: all 4 pass.

### #7 - Clear error messages in fetchJson
- **Date:** 2026-11-25
- **Member:** Arshia Hashemianzadeh
- **Tool / model:** ChatGPT (free tier)
- **Files:**
  - changed: `my-react-app/src/api/itunes.js`
- **Prompt (verbatim):**

  ```
  [my old fetchJson function pasted here]

  rewrite this fetchJson so every error says what happened and what to do next:
  - fetch fails (no internet) -> can't reach Apple Music, check your connection
  - AbortError -> rethrow it unchanged
  - keep RateLimitError for 403/429
  - 404 -> couldn't find that; 500+ -> Apple is having problems, try again later;
    other -> request not accepted, try again. keep the status code like "(500)"
  - bad json -> got data we couldn't read
  ```

- **What it produced & what I changed:**
  - Kept it as-is. Network failures, 404, 500+, other HTTP errors and bad JSON each get a
    message saying what happened and what to do. The status code stays in the message,
    `RateLimitError` is unchanged, and `AbortError` is rethrown so cancelled requests stay silent.
  - **Rejected** an earlier attempt from a different prompt: it treated 404 like every other
    error and said "the music server" instead of naming Apple Music.
  - Updated my 500 test to look for "try again later" to match its wording.
  - Ran `npm test`: all tests pass, including the existing "(500)" test.

### #8 - New colour palette, song card, and song details page redesign
- **Date:** 2026-11-23
- **Member:** Akash Sayanthan
- **Tool / model:** Claude
- **Files:**
  - changed: `my-react-app/src/index.css`, `my-react-app/src/components/SongCard.jsx`,
    `my-react-app/src/components/SongDetail.jsx`, `my-react-app/src/components/SongPreview.jsx`,
    `my-react-app/src/App.test.jsx`
- **Prompt (verbatim):**

  ```
  i have decided on this colour palette in the picture provided. What adjustments would you recommend in order to implement this? Take me step by step please.
  ```

  Follow-up prompts, in order:
  ```
  I want to adjust my songcard to behave similarily to my movie catalog, what things would i need to change from my moviecard.jsx and moviedetails.jsx to fit this. 
  ```

- **What it produced & what I changed:**
  - `index.css`: replaced the mixed light/dark styles with one dark "Midnight vinyl" palette
    using CSS variables.
  - `SongCard.jsx`: streaming-style card. The whole card is clickable (the title button
    stretches over the card), with a genre tag on the cover and a play hint on hover. 
  - `SongDetail.jsx`: "album hero" layout with a tinted header (cover, title, artist · album ·
    year · length), the preview player under it, and the description and details below.
  - `SongPreview.jsx`: restyled the simulated preview into a player bar with a round
    play/pause button, progress bar and restart button. 
  - `App.test.jsx`: updated the tests that clicked "View Details" to click the song card
    instead. 
  - I reviewed all changes and adjusted minor details AI provided.