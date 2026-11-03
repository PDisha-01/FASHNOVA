import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, isAuthenticated } = useAuth();

  const userDisplayName =
    user?.profile?.firstName?.trim() ||
    (user?.email ? user.email.split("@")[0] : null);

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

        <NavLink to="/style-engine">
          Style Engine
        </NavLink>
      </nav>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "profile-button active" : "profile-button"
        }
      >
        {isAuthenticated
          ? userDisplayName
            ? `Profile (${userDisplayName})`
            : "Profile"
          : "Sign In"}
      </NavLink>
    </header>
  );
}

export default Navbar;
