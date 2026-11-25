import { Link, NavLink } from 'react-router-dom';
export default function NavBar({  }) {
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

          {/*Favourites button will go here in future, Account Button and Maybe Reviews */}
        </ul>

      </nav>
    </header>
  );
}