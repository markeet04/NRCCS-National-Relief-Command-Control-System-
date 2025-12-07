import { SearchControls } from '../SearchControls';
import { ResultsInfo } from '../ResultsInfo';
import { PersonsGrid } from '../PersonsGrid';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';

const SearchTab = ({
  loading,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  filteredPersons,
  onPersonClick,
  getDaysAgo,
}) => {
  return (
    <div className="search-tab">
      <SearchControls
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <ResultsInfo count={filteredPersons.length} />

      {loading ? (
        <LoadingState />
      ) : filteredPersons.length === 0 ? (
        <EmptyState />
      ) : (
        <PersonsGrid
          persons={filteredPersons}
          onPersonClick={onPersonClick}
          getDaysAgo={getDaysAgo}
        />
      )}
    </div>
  );
};

export default SearchTab;
