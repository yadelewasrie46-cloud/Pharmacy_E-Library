import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ username }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header" id="head">
      {/* Logo + username (always visible) */}
      <div className="left-section">
        <Link to="/" onClick={closeMenu}>
          <img
            src="https://media.istockphoto.com/id/1448745004/vector/pharmacy-logo-design-vector-medical-logo-vector.jpg?s=1024x1024&w=is&k=20&c=OEfxY_JS3qFUdRFKUg4JsE5QgtM6kSuU2dIPQSZURaI="
            alt="Pharmacy logo"
            className="pharmacy-logo"
          />
        </Link>
        {username && <span className="userName">👤 {username}</span>}
      </div>

      {/* Search (always visible) */}
      <div className="mid-section">
        <input
          type="search"
          placeholder="Search..."
          className="input"
          id="inputs"
        />
      </div>

      {/* Desktop links + signout + hamburger */}
      <div className="right-section">
        <Link to="/"            className="desktop-link" onClick={closeMenu}>Home</Link>
        <Link to="/Videos"      className="desktop-link" onClick={closeMenu}>Videos</Link>
        <Link to="/Notes"       className="desktop-link" onClick={closeMenu}>Notes</Link>
        <Link to="/dashboard"   className="desktop-link" onClick={closeMenu}>Dashboard</Link>
        <button className="signin-button" onClick={handleLogout}>Sign Out</button>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <nav className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/"                    onClick={closeMenu}>🏠 Home</Link>
        <Link to="/Videos"              onClick={closeMenu}>🎬 Videos</Link>
        <Link to="/Notes"               onClick={closeMenu}>📝 Notes</Link>
        <Link to="/dashboard"           onClick={closeMenu}>📊 Dashboard</Link>
        <Link to="/About us"            onClick={closeMenu}>ℹ️ About Us</Link>
        <Link to="/Terms of Service"    onClick={closeMenu}>📜 Terms of Service</Link>
        {username && <div className="mobile-username">👤 {username}</div>}
        <button className="mobile-signout" onClick={handleLogout}>Sign Out</button>
      </nav>
    </header>
  );
}

export default Header;