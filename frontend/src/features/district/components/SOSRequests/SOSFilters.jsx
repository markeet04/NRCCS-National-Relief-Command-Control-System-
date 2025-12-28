/**
 * SOSFilters Component
 * Search and filter controls for SOS requests
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '@styles/css/main.css';

const STATUS_OPTIONS = ['Pending', 'Assigned', 'En-route', 'Rescued'];

const SOSFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = STATUS_OPTIONS
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentStatusLabel = statusFilter && statusFilter !== 'All' ? statusFilter : 'All Statuses';

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
        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="btn btn--secondary"
            style={{ minWidth: '150px', justifyContent: 'space-between' }}
          >
            <span>{currentStatusLabel}</span>
            <ChevronDown
              style={{
                width: '16px',
                height: '16px',
                opacity: 0.6,
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s'
              }}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute mt-1 w-full rounded-lg overflow-hidden z-50"
              style={{
                background: 'var(--dropdown-bg)',
                border: '1px solid var(--dropdown-border)',
                boxShadow: 'var(--dropdown-shadow)'
              }}
            >
              <button
                onClick={() => {
                  onStatusChange && onStatusChange('All');
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-primary transition"
                style={{
                  background: (!statusFilter || statusFilter === 'All') ? 'var(--dropdown-hover-bg)' : 'transparent'
                }}
              >
                All Statuses
              </button>
              {(statusOptions || STATUS_OPTIONS).map(option => (
                <button
                  key={option}
                  onClick={() => {
                    onStatusChange && onStatusChange(option);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-primary transition"
                  style={{
                    background: statusFilter === option ? 'var(--dropdown-hover-bg)' : 'transparent'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSFilters;

