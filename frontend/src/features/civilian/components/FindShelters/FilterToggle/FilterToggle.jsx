const FilterToggle = ({ showFilters, onToggle, activeFilterCount }) => {
  return (
    <button
      className={`filter-toggle ${showFilters ? 'active' : ''}`}
      onClick={onToggle}
    >
      <span>🎚️</span>
      Filters
      {activeFilterCount > 0 && (
        <span className="filter-badge">{activeFilterCount}</span>
      )}
    </button>
  );
};

export default FilterToggle;
