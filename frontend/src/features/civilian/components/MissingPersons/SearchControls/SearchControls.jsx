import SearchBar from './SearchBar';
import FiltersRow from './FiltersRow';

const SearchControls = ({ searchQuery, onSearchChange, filters, onFilterChange }) => {
  return (
    <div className="search-controls">
      <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <FiltersRow filters={filters} onFilterChange={onFilterChange} />
    </div>
  );
};

export default SearchControls;
