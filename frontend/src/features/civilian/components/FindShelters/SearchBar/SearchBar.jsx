import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">
        <Search size={20} />
      </span>
      <input
        type="text"
        placeholder="Search by name or address..."
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBar;
