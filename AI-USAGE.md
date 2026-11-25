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
```

### #2 - New colour palette, song card, and song details page redesign
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
  
