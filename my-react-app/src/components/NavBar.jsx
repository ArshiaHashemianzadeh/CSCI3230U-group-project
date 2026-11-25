export default function NavBar({
  onHome,
  onFavourites,
  favouriteCount
}) {
  return (
    <header>
      <nav aria-label="Primary">
        <button
          type="button"
          className="logo"
          onClick={onHome}
        >
          Muzic
        </button>

        <ul className="nav-links">
          <li>
            <button
              type="button"
              className="nav-link"
              onClick={onHome}
            >
              Songs
            </button>
          </li>

          <li>
            <button
              type="button"
              className="nav-link"
              onClick={onFavourites}
            >
              Favourites ({favouriteCount})
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}