/**
 * SearchFilter Component
 * Reusable search and filter bar for tables
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
import { Search, Filter } from 'lucide-react';
import '@styles/css/main.css';

const SearchFilter = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = 'Filter',
  showFilter = true,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="search-input" style={{ maxWidth: '280px' }}>
        <Search className="search-input__icon" style={{ width: '18px', height: '18px' }} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Filter Dropdown */}
      {showFilter && filterOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="text-muted" style={{ width: '18px', height: '18px' }} />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="select"
            style={{ minWidth: '150px' }}
          >
            <option value="">{filterLabel}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

SearchFilter.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  filterValue: PropTypes.string,
  onFilterChange: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  filterLabel: PropTypes.string,
  showFilter: PropTypes.bool,
};

export default SearchFilter;

