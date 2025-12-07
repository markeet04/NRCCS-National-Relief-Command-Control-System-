import React from 'react';
import { Search } from 'lucide-react';
import './NoResults.css';

export const NoResults = ({ onReset }) => {
  return (
    <div className="no-results">
      <span className="no-results-icon">
        <Search size={48} />
      </span>
      <h3>No results found</h3>
      <p>Try adjusting your search or browse by category</p>
      <button className="reset-btn" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
};
