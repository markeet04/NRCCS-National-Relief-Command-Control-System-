/**
 * SearchFilterBar Component
 * Reusable search input and filter dropdown combination
 */

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  colors,
  isLight = false,
  children // For additional buttons like Add New
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    background: colors?.inputBg || (isLight ? '#f9fafb' : '#111827'),
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    borderRadius: '10px',
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const dropdownButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: colors?.inputBg || (isLight ? '#f9fafb' : '#111827'),
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    borderRadius: '10px',
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    fontSize: '14px',
    cursor: 'pointer',
    minWidth: '150px',
    justifyContent: 'space-between'
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    background: colors?.cardBg || (isLight ? '#ffffff' : '#1f2937'),
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    borderRadius: '10px',
    overflow: 'hidden',
    zIndex: 100,
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  };

  const dropdownItemStyle = (isSelected) => ({
    width: '100%',
    padding: '10px 16px',
    background: isSelected ? (colors?.inputBg || (isLight ? '#f9fafb' : '#111827')) : 'transparent',
    border: 'none',
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer'
  });

  const currentStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || 'All';

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
          <Search 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: colors?.textMuted || (isLight ? '#9ca3af' : '#6b7280'),
              width: '18px',
              height: '18px'
            }} 
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Status Filter Dropdown */}
        {statusOptions.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={dropdownButtonStyle}
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
              <div style={dropdownMenuStyle}>
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusFilterChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    style={dropdownItemStyle(statusFilter === option.value)}
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
