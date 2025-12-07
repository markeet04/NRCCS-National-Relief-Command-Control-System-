const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search by name, location, or case number..."
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBar;
