import { Link } from 'react-router-dom';

export default function SongCard({ song }) {
  return (
    <li className="song">
      <div className="cover-slot">
        {song.artwork ? (
          <img src={song.artwork} alt={`${song.album} album cover`} loading="lazy" />
        ) : (
          <span className="cover-placeholder" aria-hidden="true">♪</span>
        )}

        <span className="tag cover-tag">{song.genre}</span>

        <span className="play-hint" aria-hidden="true">▶</span>
      </div>

      <h3>
        {/* The button stretches over the whole card*/}
        <Link to={`/songs/${song.id}`} state={{ song }} className="song-open">
          {song.title}
        </Link>
      </h3>

      <p className="artist">
        {song.artist}
        <span className="album"> · {song.album}</span>
      </p>
    </li>
  );
}