import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const userDisplayName =
    user?.profile?.firstName?.trim() ||
    (user?.email ? user.email.split("@")[0] : null);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
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

        {/* Desktop Navigation */}
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

        {/* Desktop Profile Button */}
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`navbar-mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>
      </header>

      {/* Mobile Drawer Overlay & Menu */}
      <div
        className={`navbar-mobile-backdrop ${mobileMenuOpen ? "visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`navbar-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="mobile-drawer-brand" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo.png" alt="FASHNOVA" />
            <div className="mobile-drawer-brand-text">
              <strong>FASHNOVA</strong>
              <small>FASHION / INTELLIGENCE</small>
            </div>
          </Link>

          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "mobile-drawer-link active" : "mobile-drawer-link"
            }
          >
            <span className="mobile-link-num">01</span>
            <span className="mobile-link-text">Home</span>
            <span className="mobile-link-arrow">↗</span>
          </NavLink>

          <NavLink
            to="/vision"
            className={({ isActive }) =>
              isActive ? "mobile-drawer-link active" : "mobile-drawer-link"
            }
          >
            <span className="mobile-link-num">02</span>
            <span className="mobile-link-text">Vision</span>
            <span className="mobile-link-arrow">↗</span>
          </NavLink>

          <NavLink
            to="/trends"
            className={({ isActive }) =>
              isActive ? "mobile-drawer-link active" : "mobile-drawer-link"
            }
          >
            <span className="mobile-link-num">03</span>
            <span className="mobile-link-text">Trends</span>
            <span className="mobile-link-arrow">↗</span>
          </NavLink>

          <NavLink
            to="/studio"
            className={({ isActive }) =>
              isActive ? "mobile-drawer-link active" : "mobile-drawer-link"
            }
          >
            <span className="mobile-link-num">04</span>
            <span className="mobile-link-text">Studio</span>
            <span className="mobile-link-arrow">↗</span>
          </NavLink>

          <NavLink
            to="/style-engine"
            className={({ isActive }) =>
              isActive ? "mobile-drawer-link active" : "mobile-drawer-link"
            }
          >
            <span className="mobile-link-num">05</span>
            <span className="mobile-link-text">Style Engine</span>
            <span className="mobile-link-arrow">↗</span>
          </NavLink>
        </nav>

        <div className="mobile-drawer-footer">
          <NavLink
            to="/profile"
            className="mobile-drawer-profile-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="profile-btn-icon">✦</span>
            <span>
              {isAuthenticated
                ? userDisplayName
                  ? `My Account (${userDisplayName})`
                  : "My Account"
                : "Sign In / Register"}
            </span>
          </NavLink>

          <div className="mobile-drawer-tagline">
            <span>AI × ML FASHION INTELLIGENCE PLATFORM</span>
            <small>© 2026 FASHNOVA</small>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
