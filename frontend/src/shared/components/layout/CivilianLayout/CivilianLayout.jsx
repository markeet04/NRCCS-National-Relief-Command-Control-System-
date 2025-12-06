import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './civilian-layout.css';

const CivilianLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/civilian', label: 'Home', exact: true },
    { path: '/civilian/shelters', label: 'Shelters' },
    { path: '/civilian/alerts', label: 'Alerts' },
    { path: '/civilian/missing', label: 'Missing Persons' },
    { path: '/civilian/track', label: 'Track Status' },
    { path: '/civilian/help', label: 'Help' },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="civilian-scope">
      {/* Civilian Navbar */}
      <nav className="civilian-navbar">
        <div className="civilian-navbar-container">
          <Link to="/civilian" className="civilian-brand" onClick={handleLinkClick}>
            <div className="civilian-brand-icon">🛡️</div>
            <span>NRCCS Civilian</span>
          </Link>

          {/* Hamburger Menu Button */}
          <button 
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>

          {/* Navigation Links - Mobile Drawer */}
          <div className={`civilian-nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button 
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`civilian-nav-link ${
                      isActive(link.path, link.exact) ? 'active' : ''
                    }`}
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/civilian/sos" className="civilian-nav-cta" onClick={handleLinkClick}>
                  <span className="sos-icon">🚨</span>
                  <span>SOS</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="civilian-main">{children}</main>

      {/* Footer */}
      <footer className="civilian-footer">
        <div className="civilian-footer-content">
          <div className="footer-brand">
            <div className="footer-logo">🛡️</div>
            <div>
              <h3>NRCCS</h3>
              <p>National Relief Command & Control System</p>
            </div>
          </div>
     
          <p className="civilian-footer-text">
            © 2025 NRCCS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CivilianLayout;
