import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  LayoutDashboard,
  AlertTriangle,
  Package,
  Map,
  MessageSquare,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  Users,
  Settings,
  Zap,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Home,
  Search,
  X
} from 'lucide-react';

/**
 * Sidebar Component
 * Reusable navigation sidebar for all dashboard types
 * Features glowing active state indicator and collapsible functionality
 * @param {Object} props - Component props
 * @param {Array} props.menuItems - Navigation menu items
 * @param {string} props.activeRoute - Currently active route
 * @param {Function} props.onNavigate - Navigation handler
 * @param {string} props.userRole - User role (NDMA, PDMA, District)
 * @param {string} props.userName - User name for display
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {Function} props.onToggleCollapse - Handler to toggle collapse state
 * @param {boolean} props.isMobileOpen - Whether mobile sidebar is open
 * @param {Function} props.onMobileClose - Handler to close mobile sidebar
 */
const Sidebar = ({
  menuItems,
  activeRoute,
  onNavigate,
  userRole,
  userName = 'Admin',
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    window.location.href = '/';
  };

  const handleMenuClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }

    // Navigate using the helper function
    navigate(getNavigationPath(route));

    // Close mobile menu after navigation
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const iconMap = {
    dashboard: LayoutDashboard,
    alerts: AlertTriangle,
    resources: Package,
    map: Map,
    users: Users,
    provinces: Map,
    settings: Settings,
    api: Zap,
    home: Home,
    search: Search,
  };

  // Get the current base path to determine navigation context
  const getNavigationPath = (route) => {
    const basePath = location.pathname.split('/')[1];
    if (route === 'dashboard' || route === 'home') {
      return `/${basePath}`;
    }
    return `/${basePath}/${route}`;
  };

  // Build sidebar container classes
  const sidebarClasses = [
    'sidebar-container',
    isCollapsed ? 'sidebar-collapsed' : '',
    isMobileOpen ? 'sidebar-mobile-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={sidebarClasses}>
      {/* Mobile close button */}
      <button
        onClick={onMobileClose}
        className="sidebar-mobile-close show-mobile-only"
        title="Close Menu"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 51,
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          display: 'none'
        }}
      >
        <X size={24} />
      </button>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="sidebar-toggle-btn"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? (
          <PanelLeft className="sidebar-toggle-icon" />
        ) : (
          <PanelLeftClose className="sidebar-toggle-icon" />
        )}
      </button>

      {/* Logo Section */}
      <div className="sidebar-logo-section">
        <div className="sidebar-logo-wrapper">
          <div className="sidebar-logo-icon">
            <Shield className="text-white" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="sidebar-logo-text">
              <h1 className="sidebar-logo-title">NRCCS</h1>
              <p className="sidebar-logo-role">{userRole}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeRoute === item.route;
            const isHovered = hoveredItem === item.route;

            return (
              <li key={item.route}>
                <button
                  onClick={() => handleMenuClick(item.route)}
                  onMouseEnter={() => setHoveredItem(item.route)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`sidebar-nav-btn ${isActive ? 'sidebar-nav-item-active' : ''} ${isHovered ? 'sidebar-nav-item-hovered' : ''}`}
                  title={item.label}
                >
                  <Icon
                    className={`sidebar-nav-icon ${isActive ? 'sidebar-icon-glow' : ''}`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <>
                      <span className="sidebar-nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="sidebar-nav-badge">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="sidebar-active-dot" />
                      )}
                    </>
                  )}
                  {isCollapsed && !isMobileOpen && item.badge && (
                    <span className="sidebar-nav-badge-collapsed">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="sidebar-user-section">
        <div className="sidebar-user-wrapper">
          <div className="sidebar-user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{userName}</p>
              <p className="sidebar-user-role">{userRole}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-logout-btn ${isCollapsed ? 'sidebar-logout-collapsed' : ''}`}
            title="Logout"
          >
            <LogOut className="sidebar-logout-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  activeRoute: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
  userName: PropTypes.string,
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  isMobileOpen: PropTypes.bool,
  onMobileClose: PropTypes.func,
};

export default Sidebar;
