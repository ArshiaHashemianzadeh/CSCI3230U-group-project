# Muzic
 
Muzic is a music discovery app built with React and Vite for CSCI 3230U. Users can browse a catalog of songs, search, filter by genre, sort the list, and open any song to see its details and play a preview.
 
## Running the app
 
You need [Node.js](https://nodejs.org) installed.
 
```bash
cd my-react-app
npm install
npm run dev
```
 
Then open the link shown in the terminal (usually http://localhost:5173).
Press `Ctrl + C` in the terminal to stop the server.
 
## Features
 
- Browse a catalog of songs, shown as cards
- **Search** songs by name or artist
- **Filter** the catalog by genre
- **Sort** the song list
- Open a song to see its details (artist, album, release date, genre, description)
- **Song preview** on the details page (works on mock data, without an API)
- Go back to the catalog with the "Back to songs" button or the nav bar
## Project structure
 
```
my-react-app/
├── index.html            the single HTML page React renders into
├── package.json          dependencies and npm scripts
├── vite.config.js        Vite settings
└── src/
    ├── main.jsx          entry point, renders <App /> into #root
    ├── App.jsx           main component, holds the app's state
    ├── index.css         all styles
    ├── data/
    │   └── songs.json    mock song data
    └── components/
        ├── NavBar.jsx
        ├── SongList.jsx
        ├── SongCard.jsx
        ├── SongDetail.jsx
        ├── GenreFilter.jsx
        ├── SortControl.jsx
        ├── SearchBar.jsx
        └── Footer.jsx
        
```
 
## Components
 
| Component | What it does | Props |
|---|---|---|
| `App` | Holds the state and decides whether to show the catalog or a song's details | none |
| `NavBar` | Top bar with the logo and a "Songs" link back to the catalog | `onHome` |
| `SongList` | Shows the song count and uses `.map()` to render a `SongCard` for each song (keyed by `song.id`) | `songs`, `onOpen` |
| `SongCard` | One song's title, genre and artist, plus a "View Details" button | `song`, `onOpen` |
| `SongDetail` | Full details for the selected song and a "Back to songs" button | `song`, `onBack` |
| `Footer` | Copyright line | none |
| `SearchBar` | Search input, genre filter and sort controls | `searchTerm`, `onSearchChange` |
| `Preview component` | Plays the song preview on the details page | `song` |
 

## Mock data
 
Songs live in `src/data/songs.json`. Each song looks like this:
 
```json
{
  "id": "out-of-time",
  "title": "Out of Time",
  "artist": "The Weeknd",
  "album": "Dawn FM",
  "genre": "R&B",
  "releaseDate": "2022-01-07",
  "description": "..."
}
```
 
To add a song, add another object to the array with a **unique `id`**.
 
