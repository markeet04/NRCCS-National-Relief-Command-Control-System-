import { useState } from 'react';
import PropTypes from 'prop-types';
import { Settings, Menu } from 'lucide-react';
import SettingsModal from '../SettingsModal';

/**
 * Header Component
 * Top navigation bar with NRCCS branding and page info
 * @param {Object} props - Component props
 * @param {string} props.title - Page title (shown on page, not in header)
 * @param {string} props.subtitle - Page subtitle/description
 * @param {React.ElementType} props.icon - Icon component
 * @param {string} props.iconColor - Icon color
 * @param {string} props.userRole - User role (pdma, ndma, district)
 * @param {number} props.notificationCount - Number of unread notifications
 * @param {Function} props.onToggleMobileMenu - Mobile menu toggle handler
 */
const Header = ({ title, subtitle, icon: IconComponent, iconColor, userRole, notificationCount = 0, onToggleMobileMenu }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get authority name based on role
  const getAuthorityName = () => {
    switch (userRole?.toLowerCase()) {
      case 'pdma':
        return 'Provincial Disaster Management Authority';
      case 'ndma':
        return 'National Disaster Management Authority';
      case 'district':
        return 'District Disaster Management Authority';
      default:
        return 'Disaster Management Authority';
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-40"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle + Title Section */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile */}
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="mobile-menu-toggle p-2 rounded-lg transition-colors hover:bg-opacity-10"
                style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}
                title="Open Menu"
              >
                <Menu size={24} />
              </button>
            )}
            {IconComponent && (
              <div className={`header-icon-wrapper ${iconColor === '#ef4444' ? 'header-icon-wrapper--urgent' : ''}`}>
                <IconComponent size={20} color={iconColor || 'var(--text-primary)'} />
              </div>
            )}
            <div>
              {/* Main NRCCS Branding */}
              <h1 className="font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.2 }}>
                National Rescue & Crisis Coordination System
              </h1>
              {/* Authority Name + Page Subtitle */}
              <p className="mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.3 }}>
                {getAuthorityName()}{subtitle ? ` — ${subtitle}` : ''}
              </p>
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ backgroundColor: 'transparent', color: 'var(--text-muted)' }}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  userRole: PropTypes.string,
  notificationCount: PropTypes.number,
  onToggleMobileMenu: PropTypes.func,
};

export default Header;
