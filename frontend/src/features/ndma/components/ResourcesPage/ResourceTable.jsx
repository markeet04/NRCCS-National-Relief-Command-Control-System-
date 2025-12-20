import PropTypes from 'prop-types';
import { Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';
import { useState } from 'react';

/**
 * ResourceTable Component
 * Displays provincial resource allocations in a sortable table
 */
const ResourceTable = ({ allocations, onEdit, getStatusConfig, isLight }) => {
  const [sortField, setSortField] = useState('province');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAllocations = [...allocations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const columns = [
    { key: 'province', label: 'Province', sortable: true },
    { key: 'food', label: 'Food (tons)', sortable: true },
    { key: 'medical', label: 'Medical Kits', sortable: true },
    { key: 'shelter', label: 'Shelter Units', sortable: true },
    { key: 'water', label: 'Water (L)', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:bg-opacity-80' : ''
                  }`}
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon field={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAllocations.map((allocation, index) => {
              const statusConfig = getStatusConfig(allocation.status);
              return (
                <tr
                  key={allocation.province}
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor:
                      index % 2 === 0
                        ? 'transparent'
                        : 'var(--bg-tertiary)',
                  }}
                >
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {allocation.province}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                    {formatNumber(allocation.food)}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                    {formatNumber(allocation.medical)}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                    {formatNumber(allocation.shelter)}
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                    {formatNumber(allocation.water)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color,
                      }}
                    >
                      {allocation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEdit(allocation.province)}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                      }}
                      title="Edit allocation"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {allocations.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-muted)' }}>
            No resource allocations found
          </p>
        </div>
      )}
    </div>
  );
};

ResourceTable.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      province: PropTypes.string.isRequired,
      food: PropTypes.number.isRequired,
      medical: PropTypes.number.isRequired,
      shelter: PropTypes.number.isRequired,
      water: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  getStatusConfig: PropTypes.func.isRequired,
  isLight: PropTypes.bool,
};

ResourceTable.defaultProps = {
  isLight: false,
};

export default ResourceTable;
