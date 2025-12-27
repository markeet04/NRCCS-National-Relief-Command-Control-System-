import PropTypes from 'prop-types';
import { Package } from 'lucide-react';

/**
 * ResourcesTabNavigation Component
 * Tab buttons with optional Add Resources button for National Stock tab
 */
const ResourcesTabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  showAddButton,
  onAddResources,
}) => {
  return (
    <div className="ndma-tabs">
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
      {showAddButton && (
        <button
          onClick={onAddResources}
          className="resources-add-btn"
        >
          <Package className="w-4 h-4" />
          Add Resources
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
  onAddResources: () => {},
};

export default ResourcesTabNavigation;
