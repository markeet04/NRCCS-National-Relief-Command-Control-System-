import { FILTER_OPTIONS } from '../../../constants';

const FilterChips = ({ activeFilter, onFilterChange, alerts }) => {
  return (
    <div className="filter-chips">
      {FILTER_OPTIONS.map(filter => (
        <button
          key={filter}
          className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
          {filter !== 'All' && (
            <span className="chip-count">
              {alerts.filter(a => a.severity === filter).length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
