import PropTypes from 'prop-types';
import { Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';
import { useState } from 'react';

/**
 * ResourceTable Component
 * Displays provincial resource allocations in a sortable table
 * Uses CSS classes from global-ndma.css
 */
const ResourceTable = ({ allocations, onEdit, getStatusConfig }) => {
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
      <ChevronUp className="w-4 h-4 ndma-sort-icon" />
    ) : (
      <ChevronDown className="w-4 h-4 ndma-sort-icon" />
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

  // Map status to badge class
  const getStatusBadgeClass = (status) => {
    const classMap = {
      adequate: 'ndma-badge-adequate',
      moderate: 'ndma-badge-moderate',
      low: 'ndma-badge-low',
      critical: 'ndma-badge-critical',
    };
    return `ndma-badge ${classMap[status] || classMap.adequate}`;
  };

  return (
    <div className="ndma-table-container">
      <div className="resources-table-wrapper">
        <table className="ndma-table">
          <thead className="ndma-table-header">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon field={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="ndma-table-body">
            {sortedAllocations.map((allocation) => (
              <tr key={allocation.province}>
                <td className="ndma-table-cell-primary">
                  {allocation.province}
                </td>
                <td className="ndma-table-cell-secondary">
                  {formatNumber(allocation.food)}
                </td>
                <td className="ndma-table-cell-secondary">
                  {formatNumber(allocation.medical)}
                </td>
                <td className="ndma-table-cell-secondary">
                  {formatNumber(allocation.shelter)}
                </td>
                <td className="ndma-table-cell-secondary">
                  {formatNumber(allocation.water)}
                </td>
                <td>
                  <span className={getStatusBadgeClass(allocation.status)}>
                    {allocation.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => onEdit(allocation.province)}
                    className="ndma-btn-icon ndma-btn-icon-blue"
                    title="Edit allocation"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allocations.length === 0 && (
        <div className="ndma-table-empty">
          <p>No resource allocations found</p>
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
};

export default ResourceTable;
