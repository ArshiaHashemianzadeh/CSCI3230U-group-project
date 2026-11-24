import SongPreview from './SongPreview';

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// the API gives song length in milliseconds
function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function SongDetail({ song, onBack }) {
  const year = song.releaseDate.slice(0, 4);

  return (
    <div className="detail-page">
      <p>
        <button type="button" className="back-button" onClick={onBack}>
          Back to songs
        </button>
      </p>

      <article className="song-detail">
        {/* Hero: cover + title. API artwork replaces the placeholder when song.artwork exists */}
        <div className="detail-hero">
          <div className="cover-slot detail-cover">
            {song.artwork ? (
              <img src={song.artwork} alt={`${song.album} album cover`} />
            ) : (
              <span className="cover-placeholder" aria-hidden="true">♪</span>
            )}
          </div>

          <div className="hero-text">
            <p className="eyebrow">Song</p>
            <h1>{song.title}</h1>
            <p className="hero-meta">
              <span className="hero-artist">{song.artist}</span>
              {' · '}{song.album}
              {' · '}{year}
              {song.durationMs && <>{' · '}{formatDuration(song.durationMs)}</>}
            </p>
          </div>
        </div>

        <SongPreview key={song.id} song={song} />

        <div className="detail-body">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading">About this song</h2>
            <p>{song.description}</p>
          </section>

          <dl className="details">
            <div>
              <dt>Artist</dt>
              <dd>{song.artist}</dd>
            </div>
            <div>
              <dt>Album</dt>
              <dd>{song.album}</dd>
            </div>
            <div>
              <dt>Release date</dt>
              <dd>{formatDate(song.releaseDate)}</dd>
            </div>
            <div>
              <dt>Genre</dt>
              <dd><span className="tag">{song.genre}</span></dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}