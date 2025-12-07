import { FACILITY_ICONS } from '../../../constants';

const FiltersPanel = ({ 
  filters, 
  onFilterChange, 
  onFacilityToggle 
}) => {
  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label>Max Distance (km)</label>
        <input
          type="range"
          min="1"
          max="50"
          value={filters.maxDistance}
          onChange={(e) => onFilterChange('maxDistance', Number(e.target.value))}
        />
        <span className="filter-value">{filters.maxDistance} km</span>
      </div>

      <div className="filter-group">
        <label>Min Available Capacity</label>
        <input
          type="number"
          min="0"
          max="200"
          value={filters.minCapacity}
          onChange={(e) => onFilterChange('minCapacity', Number(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="full">Full</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Required Facilities</label>
        <div className="facility-chips">
          {Object.keys(FACILITY_ICONS).map((facility) => (
            <button
              key={facility}
              className={`facility-chip ${filters.facilities.includes(facility) ? 'active' : ''}`}
              onClick={() => onFacilityToggle(facility)}
            >
              <span>{FACILITY_ICONS[facility]}</span>
              {facility}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
