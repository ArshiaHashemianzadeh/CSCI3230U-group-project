import SongCard from './SongCard';

function SongList({ heading = 'Popular Songs', songs, onOpen }) {
  return (

    <section aria-labelledby="songs-heading">

      <h2 id="songs-heading">
        {heading} <span className="count">({songs.length})</span>
      </h2>

      <ul className="song-list">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} onOpen={onOpen} />
        ))}
      </ul>

    </section>
  );
}

export default SongList;
