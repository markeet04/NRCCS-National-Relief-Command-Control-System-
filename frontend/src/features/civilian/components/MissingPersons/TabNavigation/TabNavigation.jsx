import { Search, FileText } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      <button
        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => onTabChange('search')}
      >
        <span className="tab-icon">
          <Search size={18} />
        </span>
        Search Database
      </button>
      <button
        className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
        onClick={() => onTabChange('report')}
      >
        <span className="tab-icon">
          <FileText size={18} />
        </span>
        Report Missing
      </button>
    </div>
  );
};

export default TabNavigation;
