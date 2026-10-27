export default function SongCard({ song, onOpen }) {
  return (

    <li className="song">

      <h3>{song.title}</h3>

      <span className="tag">{song.genre}</span>

      <p className="artist">{song.artist}</p>

      <button type="button" className="button" onClick={() => onOpen(song.id)}>
        View Details
      </button>
      
    </li>
  );
}