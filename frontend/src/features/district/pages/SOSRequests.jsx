/**
 * SOSRequests Page (Refactored)
 * Manages SOS requests with modular components, hooks, and services
 * Ready for backend integration
 */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Shared Layout & Theme
import { DashboardLayout } from '../../../shared/components/layout';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';

// District-specific imports
import { useSOSRequests, useRescueTeams } from '../hooks';
import { DISTRICT_MENU_ITEMS, SOS_STATUS_OPTIONS, DEFAULT_DISTRICT_INFO } from '../constants';
import { SOSTable, SearchFilter, AssignTeamModal, StatusBadge } from '../components';

// Icons
import { Eye, Phone, MapPin, Users, Clock, CheckCircle, X } from 'lucide-react';

/**
 * Main SOS Requests Page Component
 */
const SOSRequests = () => {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Route state
  const [activeRoute, setActiveRoute] = useState('sos');
  
  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // District info
  const districtInfo = DEFAULT_DISTRICT_INFO;

  // Use custom hooks for data management (ready for backend)
  const {
    requests,
    pendingCount,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus,
    assignTeam,
    markRescued,
    loading: sosLoading,
  } = useSOSRequests(districtInfo.name);

  const {
    teams: rescueTeams,
    availableTeams,
    loading: teamsLoading,
  } = useRescueTeams(districtInfo.name);

  // Filter status options for dropdown
  const filterOptions = useMemo(() => {
    return [{ value: '', label: 'All Statuses' }, ...SOS_STATUS_OPTIONS];
  }, []);

  // Navigation handler
  const handleNavigate = useCallback((route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  }, [navigate]);

  // View Details Modal Handler
  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  }, []);

  // Close Detail Modal
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  }, []);

  // Open Assign Team Modal
  const handleOpenAssignModal = useCallback((request) => {
    setSelectedRequest(request);
    setIsAssignModalOpen(true);
  }, []);

  // Close Assign Modal
  const handleCloseAssignModal = useCallback(() => {
    setIsAssignModalOpen(false);
    setSelectedRequest(null);
  }, []);

  // Assign Team Handler
  const handleAssignTeam = useCallback((requestId, teamId) => {
    assignTeam(requestId, teamId);
    handleCloseAssignModal();
  }, [assignTeam, handleCloseAssignModal]);

  // Status Update Handler
  const handleStatusUpdate = useCallback((requestId, newStatus) => {
    updateStatus(requestId, newStatus);
    handleCloseDetailModal();
  }, [updateStatus, handleCloseDetailModal]);

  // Mark as Rescued Handler
  const handleMarkRescued = useCallback((requestId) => {
    markRescued(requestId);
    handleCloseDetailModal();
  }, [markRescued, handleCloseDetailModal]);

  // Card wrapper style
  const cardStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: isLight ? colors.cardShadow : 'none',
  };

  // Menu items with dynamic badge
  const menuItemsWithBadge = useMemo(() => {
    return DISTRICT_MENU_ITEMS.map(item => 
      item.route === 'sos' ? { ...item, badge: pendingCount } : item
    );
  }, [pendingCount]);

  return (
    <DashboardLayout
      menuItems={menuItemsWithBadge}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="SOS Requests"
      pageSubtitle="Manage and respond to emergency requests"
      userRole={`District ${districtInfo.name}`}
      userName="District Officer"
      notificationCount={pendingCount}
    >
      {/* Main Content Card */}
      <div style={cardStyle}>
        {/* Header with Title, Search and Filter */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary }}>
              All SOS Requests
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '14px', marginTop: '4px' }}>
              {requests.length} total requests • {pendingCount} pending
            </p>
          </div>
          
          {/* Search & Filter Component */}
          <SearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by name or location..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={filterOptions}
            filterLabel="All Statuses"
          />
        </div>

        {/* SOS Table Component */}
        <SOSTable
          requests={requests}
          showActions={true}
          onView={handleViewDetails}
          onAssign={handleOpenAssignModal}
        />
      </div>

      {/* Detail View Modal */}
      {isDetailModalOpen && selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={handleCloseDetailModal}
          onStatusUpdate={handleStatusUpdate}
          onMarkRescued={handleMarkRescued}
          colors={colors}
          isLight={isLight}
        />
      )}

      {/* Assign Team Modal */}
      <AssignTeamModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        onAssign={handleAssignTeam}
        sosRequest={selectedRequest}
        availableTeams={availableTeams}
        isLoading={teamsLoading}
      />
    </DashboardLayout>
  );
};

/**
 * Detail Modal Component - View SOS Request Details
 */
const DetailModal = ({ request, onClose, onStatusUpdate, onMarkRescued, colors, isLight }) => {
  const overlayStyles = {
    position: 'fixed',
    inset: 0,
    backgroundColor: colors.modalOverlay,
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
  };

  const modalStyles = {
    backgroundColor: colors.cardBg,
    borderRadius: '16px',
    border: `1px solid ${colors.cardBorder}`,
    width: '100%',
    maxWidth: '520px',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${colors.cardBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '18px' }}>
              SOS Request Details
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '14px', marginTop: '4px' }}>
              {request.id}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px', maxHeight: 'calc(80vh - 180px)', overflowY: 'auto' }}>
          {/* Status Badge */}
          <div style={{ marginBottom: '20px' }}>
            <StatusBadge status={request.status?.toLowerCase()} type="sos" size="md" />
          </div>

          {/* Person Info */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              fontWeight: '600', 
              fontSize: '20px', 
              marginBottom: '8px' 
            }}>
              {request.name || request.requester_name}
            </h3>
            <p style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.5' }}>
              {request.description}
            </p>
          </div>

          {/* Details Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div className="flex items-center gap-2">
              <Phone size={16} style={{ color: colors.textMuted }} />
              <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                {request.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: colors.textMuted }} />
              <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                {request.people || request.people_count || 1} people
              </span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <MapPin size={16} style={{ color: colors.textMuted }} />
              <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                {request.location}
              </span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Clock size={16} style={{ color: colors.textMuted }} />
              <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                {request.time}
              </span>
            </div>
          </div>

          {/* Assigned Team (if any) */}
          {request.assignedTeam && (
            <div style={{
              padding: '16px',
              backgroundColor: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              marginBottom: '20px',
            }}>
              <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>
                Assigned Team
              </p>
              <p style={{ color: colors.textPrimary, fontWeight: '500' }}>
                {request.assignedTeam}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${colors.cardBorder}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: `1px solid ${colors.cardBorder}`,
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Close
          </button>
          
          {request.status !== 'Rescued' && request.status !== 'rescued' && (
            <button
              onClick={() => onMarkRescued(request.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#22c55e',
                color: '#ffffff',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <CheckCircle size={16} />
              Mark Rescued
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSRequests;
