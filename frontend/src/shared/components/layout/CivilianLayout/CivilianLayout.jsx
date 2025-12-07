import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';
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
            <span>NRCCS</span>
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
                <X size={24} />
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
                  <span className="sos-icon">
                    <AlertCircle size={20} />
                  </span>
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

          <div className="footer-sections">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/civilian" className="civilian-footer-link">Home</Link></li>
                <li><Link to="/civilian/shelters" className="civilian-footer-link">Find Shelters</Link></li>
                <li><Link to="/civilian/alerts" className="civilian-footer-link">Public Alerts</Link></li>
                <li><Link to="/civilian/missing" className="civilian-footer-link">Missing Persons</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/civilian/help" className="civilian-footer-link">Help Center</Link></li>
                <li><Link to="/civilian/track" className="civilian-footer-link">Track Status</Link></li>
                <li><Link to="/civilian/sos" className="civilian-footer-link">Emergency SOS</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li className="civilian-footer-link">Emergency: 115</li>
                <li className="civilian-footer-link">SMS: 8000</li>
                <li className="civilian-footer-link">help@nrccs.gov.pk</li>
              </ul>
            </div>
          </div>
     
          <p className="civilian-footer-text">
            © 2025 NRCCS. All rights reserved. | Your safety is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CivilianLayout;
