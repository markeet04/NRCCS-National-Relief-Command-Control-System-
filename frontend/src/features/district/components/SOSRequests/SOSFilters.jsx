/**
 * SOSFilters Component
 * Search and filter controls for SOS requests
 */

import { Search, ChevronDown, Download, Plus } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Assigned', 'En-route', 'Rescued'];

const SOSFilters = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  statusOptions = STATUS_OPTIONS,
  onExport,
  onCreateNew,
  colors, 
  isLight 
}) => {
  const handleExport = () => {
    if (onExport) onExport();
    else console.log('Export to CSV clicked');
  };

  const handleCreateNew = () => {
    if (onCreateNew) onCreateNew();
    else console.log('Create New SOS clicked');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: colors.textMuted,
              width: '18px',
              height: '18px'
            }} 
          />
          <input
            type="text"
            placeholder="Search by name, location, or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              background: colors.inputBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              color: colors.textPrimary,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter || 'All'}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          style={{
            padding: '12px 36px 12px 16px',
            background: colors.inputBg,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            color: colors.textPrimary,
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '150px',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center'
          }}
        >
          <option value="All">All Statuses</option>
          {(statusOptions || STATUS_OPTIONS).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleExport}
          className="hover:scale-105"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: isLight ? '#f3f4f6' : 'rgba(75, 85, 99, 0.3)',
            color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Download style={{ width: '18px', height: '18px' }} />
          Export CSV
        </button>

        <button
          onClick={handleCreateNew}
          className="hover:scale-105"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Create New SOS
        </button>
      </div>
    </div>
  );
};

export default SOSFilters;
