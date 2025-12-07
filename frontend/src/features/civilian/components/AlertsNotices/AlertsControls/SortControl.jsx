import { SORT_OPTIONS } from '../../../constants';

const SortControl = ({ sortBy, onSortChange }) => {
  return (
    <div className="sort-control">
      <label htmlFor="sort">Sort by:</label>
      <select id="sort" value={sortBy} onChange={onSortChange}>
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortControl;
