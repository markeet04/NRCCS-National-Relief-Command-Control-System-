/**
 * SearchFilter Component
 * Reusable search and filter bar for tables
 */

import PropTypes from 'prop-types';
import { Search, Filter } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

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
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const inputStyles = {
    backgroundColor: isLight ? '#f8fafc' : 'rgba(0, 0, 0, 0.2)',
    border: `1px solid ${colors.cardBorder}`,
    color: colors.textPrimary,
    padding: '10px 12px',
    paddingLeft: '40px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    maxWidth: '280px',
    transition: 'border-color 0.2s',
  };

  const selectStyles = {
    backgroundColor: isLight ? '#f8fafc' : 'rgba(0, 0, 0, 0.2)',
    border: `1px solid ${colors.cardBorder}`,
    color: colors.textPrimary,
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    minWidth: '150px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textMuted,
            width: '18px',
            height: '18px',
          }}
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={inputStyles}
        />
      </div>

      {/* Filter Dropdown */}
      {showFilter && filterOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter
            style={{ color: colors.textMuted, width: '18px', height: '18px' }}
          />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            style={selectStyles}
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
