import FilterChips from './FilterChips';
import SortControl from './SortControl';

const AlertsControls = ({ 
  activeFilter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  alerts 
}) => {
  return (
    <div className="alerts-controls">
      <FilterChips 
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        alerts={alerts}
      />
      <SortControl sortBy={sortBy} onSortChange={onSortChange} />
    </div>
  );
};

export default AlertsControls;
