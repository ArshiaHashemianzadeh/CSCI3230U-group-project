export default function NavBar({ onHome }) {
  return (
    <header>

      <nav aria-label="Primary">

        <button type="button" className="logo" onClick={onHome}>
          Muzic
        </button>

        <ul className="nav-links">
          <li>
            <button type="button" className="nav-link" onClick={onHome}>
              Songs
            </button>
          </li>

          {/*Favourites button will go here in future, Account Button and Maybe Reviews */}
        </ul>

      </nav>
    </header>
  );
}