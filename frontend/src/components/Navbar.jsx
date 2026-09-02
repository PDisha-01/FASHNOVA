import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img
          src="/logo.png"
          alt="FASHNOVA logo"
          className="brand-logo"
        />

        <div className="brand-text">
          <span>FASHNOVA</span>
          <small>FASHION MEETS INTELLIGENCE</small>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/vision">
          Vision
        </NavLink>

        <NavLink to="/trends">
          Trends
        </NavLink>

        <NavLink to="/studio">
          Studio
        </NavLink>
      </nav>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "profile-button active" : "profile-button"
        }
      >
        Profile
      </NavLink>
    </header>
  );
}

export default Navbar;