# Muzic

Muzic is a music discovery app built with React and Vite for CSCI 3230U. It pulls live songs from the **iTunes Search API**, so you can browse Apple's current Top Songs chart, search any song or artist, filter by genre, sort the results, open a song on its own page to play a preview, save favourites, and rate and review songs.

**Live site:** https://csci3230u-group-project-muzic.netlify.app/
**Repository:** https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project

## Running the app

You need [Node.js](https://nodejs.org) installed.

```bash
cd my-react-app
npm install
npm run dev
```

Then open the link shown in the terminal (usually http://localhost:5173).
Press `Ctrl + C` in the terminal to stop the server.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs the tests in watch mode (Vitest) |
| `npm run test:run` | Runs the tests once |

No API key or `.env` file is needed, because the iTunes Search API is public.

## Features

- **Live data:** With the search box empty, the app shows Apple's Top Songs chart for Canada. Typing searches the full iTunes catalogue.
- **Search** by song or artist. Input is debounced, so typing "radiohead" makes 1 API call, not 9.
- **Filter** by genre. The genre list is built from the songs the API actually returned, with a count for each genre.
- **Sort** by most relevant (API order), title A–Z, title Z–A, artist, newest or oldest.
- **Song detail page** at its own URL (`/songs/:id`) with cover art, artist, album, genre, release date, length, a 30-second **preview** and a link to Apple Music.
- **Favourites:** Add or remove songs with the heart button. Favourites are saved in `localStorage` and listed on the `/favourites` page, and the nav bar shows a count.
- **Rate and review form:** A controlled form on the detail page saves a 1–5 rating and a short review per song to `localStorage`.
- **Loading and error states**, including a "Try again" button and clear error messages (no connection, rate limit, server error).
- **404 page** for unknown URLs.

## Routes

| URL | Page |
|---|---|
| `/` | Song catalogue with search, filter and sort |
| `/songs/:id` | One song's details (`id` is the iTunes track id) |
| `/favourites` | Your saved songs |
| anything else | Not found page |

Deep links work on the live site. For example, a `/songs/<id>` URL can be opened or refreshed directly, because `public/_redirects` tells Netlify to serve `index.html` for every path (the SPA fallback):

```
/*    /index.html   200
```

If the user arrives from the catalogue, the detail page uses the song it was given. If the URL is opened directly, it reads the id with `useParams` and fetches the song from the API.

## Live web service: iTunes Search API

All API code lives in `src/api/itunes.js`.

- **Endpoints used:** `/search` (searching), the Top Songs RSS feed plus `/lookup` (the default chart), and `/lookup?id=` (one song by id for the detail page).
- **Mapped at the boundary:** `mapTrack()` turns each raw iTunes result (`trackName`, `artistName`, `artworkUrl100`, and so on) into the app's own song shape (`title`, `artist`, `artwork`, and so on). Components never see the API's field names.
- **Fetch on interaction, with cancel:** `useSongSearch` (`src/hooks/useSongSearch.js`) fetches when the debounced search term changes. Each request has an `AbortController`, and an older, slower request is cancelled when a new search starts, so stale results can't replace newer ones.
- **Loading and error states:** The hook returns `loading`, `error` and `retry`, and the page shows a loading message, an error message with a "Try again" button, or the results.
- **Rate limits:** Apple allows about 20 calls per minute. The app stays under the limit by debouncing, caching results it has already fetched, and capping itself at 18 calls per minute. A 403 or 429 response shows a "please wait a minute" message.

## Accessibility and responsiveness

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a labelled primary navigation
- Every form control has a `<label>`, and the review form uses `role="status"` to announce when a review is saved
- All controls work with the keyboard, with visible focus styles
- When the page changes, the app scrolls to the top and moves focus to the song title
- Favourite buttons have descriptive labels and pressed state
- The layout is responsive, so the song grid and detail page adapt from phone to desktop widths
- Checked with Lighthouse (Accessibility score: __ / 100) and the flagged issues were fixed

## Tests

Tests use **Vitest** and **React Testing Library** with a mocked iTunes API (`src/test/mockItunes.js`), so they never make real network calls. Run them with `npm run test:run` (38 tests).

| File | What it covers | Written by |
|---|---|---|
| `src/api/itunes.test.js` | URL building, mapping iTunes results to our song shape, artwork size, de-duplication, chart order, rate limiting and error messages | Himmat |
| `src/App.test.jsx` | Loading and error states, search, genre filter, sort, routing to a song's detail page, preview, and the 404 page | Arshia |
| `src/Favourites.test.jsx` | Adding and removing favourites, the favourites page, and saving to `localStorage` | Mohammad, updated by Arshia for routing |

## Project structure

```
my-react-app/
├── index.html                 the single HTML page React renders into
├── package.json               dependencies and npm scripts
├── vite.config.js             Vite and Vitest settings
├── public/
│   └── _redirects             Netlify SPA fallback for deep links
└── src/
    ├── main.jsx               entry point, wraps <App /> in <BrowserRouter>
    ├── App.jsx                routes, plus the search/filter/sort and favourites state
    ├── index.css              all styles
    ├── api/
    │   └── itunes.js          every call to the iTunes API, plus mapTrack()
    ├── hooks/
    │   ├── useSongSearch.js   fetch with debounce, cache, AbortController, loading/error
    │   └── useFavourites.js   favourites saved in localStorage
    ├── utils/
    │   └── songs.js           genre options, genre filter, sort
    ├── pages/
    │   ├── SongsPage.jsx      the catalogue page
    │   ├── SongDetailPage.jsx /songs/:id (uses useParams)
    │   └── NotFound.jsx       404 page
    ├── components/
    │   ├── NavBar.jsx         logo, Songs and Favourites links
    │   ├── SearchBar.jsx      search input
    │   ├── GenreFilter.jsx    genre dropdown
    │   ├── SortControl.jsx    sort dropdown
    │   ├── SongList.jsx       song count and the grid of cards
    │   ├── SongCard.jsx       one song, links to its detail page
    │   ├── SongDetail.jsx     full details for one song
    │   ├── SongPreview.jsx    30-second audio preview
    │   ├── ReviewForm.jsx     controlled rating and review form
    │   ├── FavouritesPage.jsx /favourites
    │   └── Footer.jsx
    └── test/
        ├── mockItunes.js      fake API responses for tests
        └── songs.json         sample songs (test data only)
```

## Contributions

| Team member | GitHub | What they did | Pull requests |
|---|---|---|---|
| Arshia Hashemianzadeh | [@ArshiaHashemianzadeh](https://github.com/ArshiaHashemianzadeh), [@Ash329](https://github.com/Ash329) | Song preview, routing, tests, accessibility, deployment | [#12](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/12), [#15](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/15), [#25](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/25), [#26](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/26), [#27](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/27), [#28](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/28) |
| Akash Sayanthan | [@akashsayanthan](https://github.com/akashsayanthan) | React app setup, catalogue and song detail page, colour palette and redesign | [#7](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/7), [#20](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/20) |
| Mohammad Usman | [@MoUsmanCode](https://github.com/MoUsmanCode) | Genre filter, sorting, favourites, rating and review form | [#9](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/9), [#10](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/10), [#22](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/22), [#23](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/23) |
| Himmat Basra | [@Himmat16](https://github.com/Himmat16) | Project proposal, iTunes API integration, API tests | [#21](https://github.com/ArshiaHashemianzadeh/CSCI3230U-group-project/pull/21) |

Work was planned as GitHub Issues on the project board, built on branches and merged through pull requests.

## AI usage

AI was used for parts of this milestone. Every use is logged in [`AI-USAGE.md`](AI-USAGE.md) with the verbatim prompts, the files involved and what we kept or changed. Code that AI helped write is marked with `// AI-assisted - see AI-USAGE.md #<n>`.

## References

- iTunes Search API documentation (Apple): https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html
- iTunes Search API endpoint: https://itunes.apple.com/search
- React documentation: https://react.dev
- React Router documentation: https://reactrouter.com
- Vite documentation: https://vite.dev
- Vitest documentation: https://vitest.dev
- Netlify redirects (SPA fallback): https://docs.netlify.com/routing/redirects/
