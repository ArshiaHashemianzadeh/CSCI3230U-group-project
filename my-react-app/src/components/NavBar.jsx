import { Link, NavLink } from 'react-router-dom';
export default function NavBar({ favouriteCount }) {
  return (
    <header>
      <nav aria-label="Primary">

        <Link to="/" className="logo">
          Muzic
        </Link>

        <ul className="nav-links">
           <li>
            <NavLink to="/" end className="nav-link">
              Songs
            </NavLink>
        </li>

          <li>
            <NavLink to="/favourites" className="nav-link">
              Favourites ({favouriteCount})
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}