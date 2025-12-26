/**
 * SearchFilterBar Component
 * Reusable search input and filter dropdown combination
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '@styles/css/main.css';

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  children // For additional buttons like Add New
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || 'All';

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        {/* Search Input */}
        <div className="search-input">
          <Search className="search-input__icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      <div className="filter-bar__filters">
        {/* Status Filter Dropdown */}
        {statusOptions.length > 0 && (
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
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusFilterChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-primary transition"
                    style={{
                      background: statusFilter === option.value ? 'var(--dropdown-hover-bg)' : 'transparent'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional actions (Add button, etc.) */}
      {children}
    </div>
  );
};

export default SearchFilterBar;

