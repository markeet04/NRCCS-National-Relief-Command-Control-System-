import { useState } from 'react';
import PropTypes from 'prop-types';
import { Settings } from 'lucide-react';
import SettingsModal from '../SettingsModal';

/**
 * Header Component
 * Top navigation bar with title, subtitle, and action buttons
 * @param {Object} props - Component props
 * @param {string} props.title - Main page title
 * @param {string} props.subtitle - Page subtitle/description
 * @param {React.ElementType} props.icon - Icon component to display with title
 * @param {string} props.iconColor - Icon color
 * @param {number} props.notificationCount - Number of unread notifications
 */
const Header = ({ title, subtitle, icon: IconComponent, iconColor, notificationCount = 0 }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Title Section with Icon */}
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                }}
              >
                <IconComponent size={20} color={iconColor || 'var(--text-primary)'} />
              </div>
            )}
            <div>
              <h1 className="font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontSize: '1.3rem', lineHeight: 1.1 }}>{title}</h1>
              {subtitle && (
                <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.2 }}>{subtitle}</p>
              )}
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
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  notificationCount: PropTypes.number,
};

export default Header;
