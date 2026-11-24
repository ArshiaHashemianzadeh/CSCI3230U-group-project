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
