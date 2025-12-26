/**
 * SOSFilters Component
 * Search and filter controls for SOS requests
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { Search } from 'lucide-react';
import '@styles/css/main.css';

const STATUS_OPTIONS = ['Pending', 'Assigned', 'En-route', 'Rescued'];

const SOSFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = STATUS_OPTIONS
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        {/* Search Input */}
        <div className="search-input">
          <Search className="search-input__icon" />
          <input
            type="text"
            placeholder="Search by name, location, or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div className="filter-bar__filters">
        {/* Status Filter */}
        <select
          value={statusFilter || 'All'}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          className="select"
          style={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            colorScheme: 'dark'
          }}
        >
          <option value="All" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>All Statuses</option>
          {(statusOptions || STATUS_OPTIONS).map(option => (
            <option key={option} value={option} style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SOSFilters;

