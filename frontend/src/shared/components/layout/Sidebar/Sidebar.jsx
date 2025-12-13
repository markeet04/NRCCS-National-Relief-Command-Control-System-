import { useState } from 'react';
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
  Zap
} from 'lucide-react';

/**
 * Sidebar Component
 * Reusable navigation sidebar for all dashboard types
 * @param {Object} props - Component props
 * @param {Array} props.menuItems - Navigation menu items
 * @param {string} props.activeRoute - Currently active route
 * @param {Function} props.onNavigate - Navigation handler
 * @param {string} props.userRole - User role (NDMA, PDMA, District)
 * @param {string} props.userName - User name for display
 */
const Sidebar = ({ menuItems, activeRoute, onNavigate, userRole, userName = 'Admin' }) => {
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
  };

  // Get the current base path to determine navigation context
  const getNavigationPath = (route) => {
    const basePath = location.pathname.split('/')[1];
    if (route === 'dashboard' || route === 'home') {
      return `/${basePath}`;
    }
    return `/${basePath}/${route}`;
  };

  return (
    <div 
      className="fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300"
      style={{ 
        width: '260px', 
        minWidth: '260px', 
        maxWidth: '260px',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >

      {/* Logo Section */}
      <div style={{ padding: '24px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center" style={{ gap: '14px', justifyContent: 'flex-start' }}>
          <div className="rounded-lg flex items-center justify-center" style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
            <Shield className="text-white" style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <h1 className="text-white font-bold" style={{ fontSize: '17px', letterSpacing: '0.02em' }}>NRCCS</h1>
            <p className="uppercase tracking-wider" style={{ fontSize: '11px', color: '#86efac', marginTop: '2px' }}>{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '20px 14px' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                  className="w-full flex items-center rounded-lg transition-all duration-200 text-left relative"
                  style={{
                    padding: '12px 14px',
                    color: '#ffffff',
                    backgroundColor: isActive ? 'rgba(134, 239, 172, 0.15)' : (isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent'),
                    fontWeight: '500',
                    fontSize: '15px',
                    justifyContent: 'flex-start',
                    gap: '14px',
                    border: isActive ? '1px solid rgba(134, 239, 172, 0.2)' : '1px solid transparent'
                  }}
                  title={item.label}
                >
                  <Icon 
                    className="flex-shrink-0" 
                    style={{ 
                      width: '22px', 
                      height: '22px'
                    }} 
                  />
                  <>
                    <span className="flex-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.label}</span>
                    {item.badge && (
                      <span className="text-white font-semibold" style={{ fontSize: '12px', backgroundColor: '#ef4444', padding: '3px 9px', borderRadius: '12px', minWidth: '22px', textAlign: 'center' }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center" style={{ padding: '10px', gap: '14px', justifyContent: 'flex-start' }}>
          <div className="rounded-full flex items-center justify-center text-white font-semibold" style={{ width: '40px', height: '40px', fontSize: '16px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium" style={{ fontSize: '14px' }}>{userName}</p>
            <p className="uppercase tracking-wide" style={{ fontSize: '11px', color: '#86efac', marginTop: '2px' }}>{userRole}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="transition-colors" 
            style={{ color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', padding: '4px' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            title="Logout"
          >
            <LogOut style={{ width: '20px', height: '20px' }} />
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
};

export default Sidebar;
