
import SongList from './SongList';

export default function FavouritesPage({
  favourites,
  isFavourite,
  onToggleFavourite
}) {
  return (
    <div className="favourites-page">
      <h1>My Favourites</h1>

      <p className="opener">
        Songs you have saved.
      </p>

      {favourites.length === 0 ? (
        <p>No favourites yet. Go back to Songs to add some.</p>
      ) : (
        <SongList
          heading="Favourite Songs"
          songs={favourites}
          isFavourite={isFavourite}
          onToggleFavourite={onToggleFavourite}
        />
      )}
    </div>
  );
}