import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Package } from 'lucide-react';

/**
 * ResourcesTabNavigation Component
 * Tab buttons with optional Add Resources button for National Stock tab
 * Shows dropdown on mobile for better UX
 */
const ResourcesTabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  showAddButton,
  onAddResources,
}) => {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="ndma-tabs">
      {isMobile ? (
        // Mobile: Dropdown selector
        <div className="ndma-mobile-tab-selector">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="ndma-tab-dropdown"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        // Desktop: Button tabs
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`ndma-tab ${activeTab === tab.id ? 'ndma-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      {showAddButton && (
        <button
          onClick={onAddResources}
          className="resources-add-btn"
        >
          <Package className="w-4 h-4" />
          {isMobile ? 'Add' : 'Add Resources'}
        </button>
      )}
    </div>
  );
};

ResourcesTabNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  showAddButton: PropTypes.bool,
  onAddResources: PropTypes.func,
};

ResourcesTabNavigation.defaultProps = {
  showAddButton: false,
  onAddResources: () => { },
};

export default ResourcesTabNavigation;

