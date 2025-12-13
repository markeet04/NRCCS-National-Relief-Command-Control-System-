/**
 * SOSVirtualTable Component  
 * High-performance table for handling SOS requests with pagination
 * Native scrolling implementation - no external dependencies
 */

import { useState, useMemo } from 'react';
import { Eye, Users, MapPin, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const SOSVirtualTable = ({ 
  requests = [], 
  onViewDetails, 
  onAssign,
  colors, 
  isLight 
}) => {
  // Default colors fallback
  const safeColors = colors || {
    cardBg: '#ffffff',
    border: '#e5e7eb',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    inputBg: '#f3f4f6'
  };

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

  const tableHeaderStyle = {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 1fr 100px 120px 150px 180px',
    gap: '16px',
    padding: '16px 20px',
    background: safeColors.cardBg,
    borderBottom: `2px solid ${safeColors.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    fontSize: '13px',
    fontWeight: '600',
    color: safeColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  // If no requests, show empty state
  if (safeRequests.length === 0) {
    return (
      <div style={{
        background: safeColors.cardBg,
        border: `1px solid ${safeColors.border}`,
        borderRadius: '16px',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '16px', color: safeColors.textMuted, marginBottom: '8px' }}>
          No SOS requests found
        </p>
        <p style={{ fontSize: '14px', color: safeColors.textMuted }}>
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: safeColors.cardBg,
        border: `1px solid ${safeColors.border}`,
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={tableHeaderStyle}>
          <div 
            onClick={() => handleSort('id')} 
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            ID<SortIcon columnKey="id" />
          </div>
          <div onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Name<SortIcon columnKey="name" />
          </div>
          <div onClick={() => handleSort('location')} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Location<SortIcon columnKey="location" />
          </div>
          <div onClick={() => handleSort('time')} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Time<SortIcon columnKey="time" />
          </div>
          <div onClick={() => handleSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Status<SortIcon columnKey="status" />
          </div>
          <div>Assigned Team</div>
          <div>Actions</div>
        </div>

        {/* Table Body with native scrolling */}
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {paginatedRequests.map((request, index) => {
            const isExpanded = expandedRows.has(request.id);
            const statusStyle = getStatusStyle(request.status);
            const isEven = index % 2 === 0;

            return (
              <div 
                key={request.id}
                style={{
                  background: isEven 
                    ? safeColors.cardBg 
                    : (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'),
                  borderBottom: `1px solid ${safeColors.border}`,
                  transition: 'background 0.2s ease'
                }}
              >
                {/* Row Content */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '100px 1fr 1fr 100px 120px 150px 180px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '16px 20px',
                  fontSize: '14px'
                }}>
                  {/* ID with expand button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => toggleExpand(request.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: safeColors.textMuted,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <span style={{ color: safeColors.textPrimary, fontWeight: '600' }}>
                      {request.id}
                    </span>
                  </div>

                  {/* Name & Phone */}
                  <div>
                    <div style={{ color: safeColors.textPrimary, fontWeight: '500', marginBottom: '4px' }}>
                      {request.name}
                    </div>
                    <div style={{ color: safeColors.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} />
                      {request.phone}
                    </div>
                  </div>

                  {/* Location & People */}
                  <div>
                    <div style={{ color: safeColors.textPrimary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color={safeColors.textMuted} />
                      {request.location}
                    </div>
                    <div style={{ color: safeColors.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} />
                      {request.people} people
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{ color: safeColors.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {new Date(request.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}30`,
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {request.status}
                    </span>
                  </div>

                  {/* Assigned Team */}
                  <div style={{ color: safeColors.textSecondary, fontSize: '13px' }}>
                    {request.assignedTeam || '—'}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onViewDetails && onViewDetails(request)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                    {request.status === 'Pending' && (
                      <button
                        onClick={() => onAssign && onAssign(request)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{
                    padding: '16px 20px',
                    background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                    borderTop: `1px solid ${safeColors.border}`
                  }}>
                    <p style={{ color: safeColors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>
                      Description:
                    </p>
                    <p style={{ color: safeColors.textPrimary, fontSize: '14px', lineHeight: '1.6' }}>
                      {request.description || 'No description available.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        padding: '16px',
        background: safeColors.cardBg,
        border: `1px solid ${safeColors.border}`,
        borderRadius: '12px'
      }}>
        <div style={{ color: safeColors.textSecondary, fontSize: '14px' }}>
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedRequests.length)} of {sortedRequests.length} requests
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              background: currentPage === 1 ? safeColors.inputBg : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: currentPage === 1 ? safeColors.textMuted : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 16px',
            color: safeColors.textPrimary,
            fontWeight: '600'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              background: currentPage === totalPages ? safeColors.inputBg : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: currentPage === totalPages ? safeColors.textMuted : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSVirtualTable;
