import SongPreview from './SongPreview';

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function SongDetail({ song, onBack }) {
  return (
    <div>
      <p>
        
        <button type="button" className="back-button" onClick={onBack}>
          Back to songs
        </button>
      </p>

      <article className="song-detail">

        <div className="cover" aria-hidden="true">
          {song.title}
        </div>

        <div>
          <h1>{song.title}</h1>

          <dl className="details">
            <dt>Artist</dt>
            <dd>{song.artist}</dd>
            <dt>Album</dt>
            <dd>{song.album}</dd>
            <dt>Release date</dt>
            <dd>{formatDate(song.releaseDate)}</dd>
            <dt>Genre</dt>
            <dd>{song.genre}</dd>
          </dl>

          <section aria-labelledby="about-heading">
            <h2 id="about-heading">About this song</h2>
            <p>{song.description}</p>
          </section>

          <SongPreview key={song.id} song={song} />

        </div>
      </article>
    </div>
  );
}