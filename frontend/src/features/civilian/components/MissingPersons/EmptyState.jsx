import { Search } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="no-results">
      <span className="no-results-icon">
        <Search size={48} />
      </span>
      <h3>No records found</h3>
      <p>Try adjusting your search or filters</p>
    </div>
  );
};

export default EmptyState;
