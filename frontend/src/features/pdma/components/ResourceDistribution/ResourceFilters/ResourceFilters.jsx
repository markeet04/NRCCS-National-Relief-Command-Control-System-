import { RESOURCE_DISTRIBUTION_FILTERS } from '../../../constants';

const ResourceFilters = ({ selectedFilter, onFilterChange, colors }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
      <div className="pdma-filter-group">
        {RESOURCE_DISTRIBUTION_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`pdma-filter-button ${selectedFilter === filter ? 'active' : ''}`}
            style={{
              background: selectedFilter === filter ? '#667eea' : colors.cardBg,
              color: selectedFilter === filter ? '#fff' : colors.textPrimary,
              borderColor: selectedFilter === filter ? '#667eea' : colors.border
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
        <span>Resources allocated from NDMA</span>
      </div>
    </div>
  );
};

export default ResourceFilters;
