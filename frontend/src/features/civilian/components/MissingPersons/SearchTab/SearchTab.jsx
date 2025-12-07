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
      <div className="search-content-wrapper">
        <ResultsInfo count={filteredPersons.length} />
        
        <div className="search-layout">
          <SearchControls
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filters={filters}
            onFilterChange={onFilterChange}
          />

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
      </div>
    </div>
  );
};

export default SearchTab;
