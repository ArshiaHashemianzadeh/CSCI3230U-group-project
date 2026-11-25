import SongCard from './SongCard';

export default function SongList({
  heading = 'Popular Songs',
  songs,
  isFavourite,
  onToggleFavourite
}) {
  return (
    <section aria-labelledby="songs-heading">
      <h2 id="songs-heading">
        {heading} <span className="count">({songs.length})</span>
      </h2>

      <ul className="song-list">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isFavourite={isFavourite(song)}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
      </ul>
    </section>
  );
}