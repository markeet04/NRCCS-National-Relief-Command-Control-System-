import React from 'react';
import { FILTER_TABS } from '../../../constants/trackStatusConstants';
import './FilterTabs.css';

export const FilterTabs = ({ activeFilter, setActiveFilter, requests }) => {
  const getFilterCount = (filter) => {
    if (filter === 'All') return requests.length;
    return requests.filter((r) => r.status === filter).length;
  };

  return (
    <div className="filter-tabs">
      {FILTER_TABS.map((filter) => (
        <button
          key={filter}
          className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
          onClick={() => setActiveFilter(filter)}
        >
          <span>{filter}</span>
          <span className="filter-count">{getFilterCount(filter)}</span>
        </button>
      ))}
    </div>
  );
};
