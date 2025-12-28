/**
 * SOSVirtualTable Component  
 * High-performance table for handling SOS requests with pagination
 * Native scrolling implementation - no external dependencies
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { useState, useMemo } from 'react';
import { Eye, Users, MapPin, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import '@styles/css/main.css';

const SOSVirtualTable = ({
  requests = [],
  onViewDetails,
  onAssign
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Ensure requests is always an array
  const safeRequests = Array.isArray(requests) ? requests : [];

  // Status colors
  const getStatusStyle = (status) => {
    const styles = {
      'Pending': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '#ef4444' },
      'Assigned': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '#3b82f6' },
      'En-route': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '#f59e0b' },
      'Rescued': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '#10b981' }
    };
    return styles[status] || styles['Pending'];
  };

  // Sorting
  const sortedRequests = useMemo(() => {
    if (!sortConfig.key) return safeRequests;

    return [...safeRequests].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [safeRequests, sortConfig]);

  // Pagination
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRequests.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedRequests, currentPage]);

  const totalPages = Math.ceil(sortedRequests.length / rowsPerPage) || 1;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleExpand = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // If no requests, show empty state
  if (safeRequests.length === 0) {
    return (
      <div className="card card-body table__empty">
        <p className="text-base text-muted mb-2">No SOS requests found</p>
        <p className="text-sm text-muted">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div>
      {/* Scrollable wrapper for mobile */}
      <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="card overflow-hidden">
          {/* Table Header */}
          <div className="table__header">
            <div
              onClick={() => handleSort('id')}
              className="cursor-pointer select-none"
            >
              ID<SortIcon columnKey="id" />
            </div>
            <div onClick={() => handleSort('name')} className="cursor-pointer select-none">
              Name<SortIcon columnKey="name" />
            </div>
            <div onClick={() => handleSort('location')} className="cursor-pointer select-none">
              Location<SortIcon columnKey="location" />
            </div>
            <div onClick={() => handleSort('time')} className="cursor-pointer select-none">
              Time<SortIcon columnKey="time" />
            </div>
            <div onClick={() => handleSort('status')} className="cursor-pointer select-none">
              Status<SortIcon columnKey="status" />
            </div>
            <div>Assigned Team</div>
            <div>Actions</div>
          </div>

          {/* Table Body with native scrolling */}
          <div className="table__body overflow-y-auto">
            {paginatedRequests.map((request, index) => {
              const isExpanded = expandedRows.has(request.id);
              const statusStyle = getStatusStyle(request.status);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={request.id}
                  className={`table__row ${isEven ? '' : 'table__row--alt'}`}
                >
                  {/* Row Content */}
                  <div className="table__row-content">
                    {/* ID with expand button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(request.id)}
                        className="btn btn--icon"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <span className="font-semibold text-primary">{request.id}</span>
                    </div>

                    {/* Name & Phone */}
                    <div>
                      <div className="font-medium text-primary mb-1">{request.name}</div>
                      <div className="text-xs text-muted flex items-center gap-1">
                        <Phone size={12} />
                        {request.phone}
                      </div>
                    </div>

                    {/* Location & People */}
                    <div>
                      <div className="text-primary mb-1 flex items-center gap-1">
                        <MapPin size={14} className="text-muted" />
                        {request.location}
                      </div>
                      <div className="text-xs text-muted flex items-center gap-1">
                        <Users size={12} />
                        {request.people} people
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(request.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className="badge"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}30`
                        }}
                      >
                        {request.status}
                      </span>
                    </div>

                    {/* Assigned Team */}
                    <div className="text-sm text-secondary">
                      {request.assignedTeam || '—'}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewDetails && onViewDetails(request)}
                        className="btn btn--blue btn--sm flex-1"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      {request.status === 'Pending' && (
                        <button
                          onClick={() => onAssign && onAssign(request)}
                          className="btn btn--success btn--sm flex-1"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="table__row-expanded">
                      <p className="text-sm text-secondary font-semibold mb-2">Description:</p>
                      <p className="text-sm text-primary" style={{ lineHeight: '1.6' }}>
                        {request.description || 'No description available.'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>{/* End scrollable wrapper */}

      {/* Pagination */}
      <div className="card card-body mt-5 flex justify-between items-center">
        <div className="text-sm text-secondary">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedRequests.length)} of {sortedRequests.length} requests
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`btn ${currentPage === 1 ? 'btn--disabled' : 'btn--primary'}`}
          >
            Previous
          </button>
          <span className="flex items-center px-4 font-semibold text-primary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`btn ${currentPage === totalPages ? 'btn--disabled' : 'btn--primary'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSVirtualTable;

