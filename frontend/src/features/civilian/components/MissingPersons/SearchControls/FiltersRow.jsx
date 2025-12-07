import { GENDER_OPTIONS, AGE_RANGE_OPTIONS, STATUS_OPTIONS } from '../../../constants';

const FiltersRow = ({ filters, onFilterChange }) => {
  return (
    <div className="filters-row">
      <select
        value={filters.gender}
        onChange={(e) => onFilterChange('gender', e.target.value)}
        className="filter-select"
      >
        {GENDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.ageRange}
        onChange={(e) => onFilterChange('ageRange', e.target.value)}
        className="filter-select"
      >
        {AGE_RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="filter-select"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltersRow;
