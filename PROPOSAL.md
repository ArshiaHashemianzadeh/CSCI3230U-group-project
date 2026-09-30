# Muzic

## Project Overview

Muzic is a single-page React song catalog application designed for casual music listeners who want a simple way to browse, search, and discover music. Users can search for songs and artists and view information such as the song title, artist, album, genre, release date, artwork, and an audio preview. The application uses the iTunes Search API to retrieve music data dynamically and display it through a clean and easy-to-use interface.

---

## Team Information

**Team Name:** muzic

| Team Member | Role / Interest |
|---|---|
| Akash | Frontend Development - UI design and catalog layout |
| Himmat | Backend / API Integration - Retrieving and processing music data |
| Usman | User Features - Search, filtering, and favourites |
| Arshia | Song Preview, Testing, and Accessibility |

---

## Domain

**Domain:** Music

Muzic focuses on music discovery and provides users with an easy way to search and browse songs through a simple single-page interface.

---

## Data Source

**API:** iTunes Search API

**Documentation:**  
https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html

The iTunes Search API allows us to search Apple's music catalog and retrieve information about songs, artists, albums, genres, release dates, artwork, and audio previews.

### Sample API Response

```json
{
  "resultCount": 1,
  "results": [
    {
      "trackId": 1499378108,
      "trackName": "Blinding Lights",
      "artistName": "The Weeknd",
      "collectionName": "After Hours",
      "primaryGenreName": "R&B/Soul",
      "releaseDate": "2019-11-29T12:00:00Z",
      "trackTimeMillis": 200040,
      "artworkUrl100": "https://example.com/artwork.jpg",
      "previewUrl": "https://example.com/preview.m4a"
    }
  ]
}
```

### Fields We Will Use

- `trackId` - Unique ID for each song
- `trackName` - Song title
- `artistName` - Artist name
- `collectionName` - Album name
- `primaryGenreName` - Genre
- `releaseDate` - Song release date
- `trackTimeMillis` - Length of the song
- `artworkUrl100` - Album artwork
- `previewUrl` - Audio preview of the song

---

## Comparators

### Spotify

Spotify allows users to search for songs, artists, and albums and stream music. Muzic differs from Spotify because it focuses on providing a simple song catalog and music discovery experience rather than being a complete music streaming service.

### Apple Music

Apple Music allows users to search for music, browse albums and artists, create playlists, and stream full songs. Muzic provides a simpler single-page interface focused specifically on searching, browsing, and viewing information about songs.


---

## Scaled Feature Plan

### Baseline Features

The baseline version of Muzic will include:

- Single-page React application
- Integration with the iTunes Search API
- Display a catalog of songs
- Display song title, artist, album, genre, and artwork
- Search for songs and artists
- Play available audio previews
- Loading and error states
- Responsive design
- Basic accessibility

### Akash - Frontend / Catalog UI

Akash will be responsible for the main user interface and catalog layout.

**Features:**

- Create the main song catalog layout
- Create reusable song card components
- Display album artwork and song information
- Create the search bar and page layout
- Make the interface responsive
- Style the application

### Himmat - API Integration / Music Data

Himmat will be responsible for retrieving and processing music data from the iTunes Search API.

**Features:**

- Connect the React application to the iTunes Search API
- Send API requests based on user searches
- Process JSON responses from the API
- Extract the required song information
- Provide API data to React components
- Handle API errors and empty results

### Usman - Search / User Features

Usman will be responsible for the main user interactions with the catalog.

**Features:**

- Implement song and artist searching
- Add filtering or sorting functionality
- Allow users to favourite songs
- Allow users to view their favourite songs
- Manage user interactions with the catalog

### Arshia - Song Preview / Accessibility

Arshia will be responsible for song previews, testing, and accessibility.

**Features:**

- Implement audio previews using `previewUrl`
- Allow users to play and pause song previews
- Add accessible labels and alt text
- Ensure buttons and controls can be used with a keyboard
- Test the interface for usability
- Test completed features and help resolve issues

---

## Wireframes

Muzic will use a single-page layout. Users will be able to search for music, browse results, play previews, and favourite songs without navigating to another page.

### Main Page

```text
+----------------------------------------------------------+
|                         MUZIC                            |
|                Discover your next song                   |
|                                                          |
|   [ Search songs or artists...                  ] [ 🔍 ] |
+----------------------------------------------------------+

        Genre [ All ▼ ]               Sort [ A-Z ▼ ]

+----------------------------------------------------------+
| [ARTWORK]   Blinding Lights                        [▶]   |
|             The Weeknd                                   |
|             After Hours                                  |
|             R&B/Soul                        [♡ Favourite] |
+----------------------------------------------------------+

+----------------------------------------------------------+
| [ARTWORK]   Die For You                            [▶]   |
|             The Weeknd                                   |
|             Starboy                                      |
|             R&B/Soul                        [♡ Favourite] |
+----------------------------------------------------------+

+----------------------------------------------------------+
| [ARTWORK]   Song Name                              [▶]   |
|             Artist                                       |
|             Album                                        |
|             Genre                           [♡ Favourite] |
+----------------------------------------------------------+

                     [ Load More ]

+----------------------------------------------------------+
```

### User Interaction

1. The user enters a song or artist into the search bar.
2. Muzic sends a request to the iTunes Search API.
3. Matching songs are displayed in the catalog.
4. Each result displays artwork, song title, artist, album, and genre.
5. The user can play an available audio preview.
6. The user can favourite songs they are interested in.
7. The user can filter or sort the displayed songs.
8. All interactions occur on the same page without navigating to another page.
