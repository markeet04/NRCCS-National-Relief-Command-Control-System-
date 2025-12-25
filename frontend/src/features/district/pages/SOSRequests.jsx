/**
 * SOSRequests Page (Enhanced Production-Ready Version)
 * Production-ready SOS management with virtual scrolling, advanced filters, and mapping
 * Features: Virtual scrolling, sortable columns, expandable rows, Leaflet map integration
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';

// Hooks
import { useSOSRequests } from '../hooks/useSOSRequests';
import { useRescueTeamData } from '../hooks/useRescueTeamData';
import { useDistrictData } from '../hooks/useDistrictData';

// Constants
import { DISTRICT_MENU_ITEMS } from '../constants';

// Modular SOS Components
import {
  SOSKPICards,
  SOSFilters,
  SOSVirtualTable,
  SOSDetailsModal,
  SOSAssignModal,
  SOSMapPanel
} from '../components/SOSRequests';

/**
 * Main SOS Requests Page Component
 */
const SOSRequests = () => {
  const navigate = useNavigate();
  const { isLight } = useSettings();
  const colors = getThemeColors(isLight);
  
  // Route state
  const [activeRoute, setActiveRoute] = useState('sos');
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // District info hook
  const { districtInfo } = useDistrictData();

  // Hooks for data
  const {
    requests,
    filteredRequests,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    pendingCount,
    assignedCount,
    enrouteCount,
    rescuedCount,
    assignTeam
  } = useSOSRequests();

  const { teams, filteredTeams } = useRescueTeamData();

  // Handlers
  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  }, []);

  const handleAssign = useCallback((request) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
  }, []);

  const handleCloseAssign = useCallback(() => {
    setShowAssignModal(false);
    setSelectedRequest(null);
  }, []);

  const handleTeamAssignment = useCallback((requestId, teamName) => {
    assignTeam(requestId, teamName);
    setShowAssignModal(false);
    setSelectedRequest(null);
  }, [assignTeam]);

  const handleMarkerClick = useCallback((request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
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

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle="SOS Requests"
      pageSubtitle="Monitor and manage emergency SOS requests in real-time"
      userRole={`District ${districtInfo?.name || 'Officer'}`}
      userName="District Officer"
      notificationCount={pendingCount}
    >
      <div style={{ padding: '24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: colors.textPrimary,
            marginBottom: '8px'
          }}>
            SOS Requests Management
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '15px' }}>
            Monitor and manage emergency SOS requests in real-time
          </p>
        </div>

        {/* KPI Cards */}
        <SOSKPICards
          totalRequests={requests.length}
          pendingCount={pendingCount}
          assignedCount={assignedCount}
          enrouteCount={enrouteCount}
          rescuedCount={rescuedCount}
          colors={colors}
          isLight={isLight}
        />

        {/* Filters */}
        <div style={{ marginTop: '24px' }}>
          <SOSFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            colors={colors}
            isLight={isLight}
          />
        </div>

        {/* Toggle Map/Table View */}
        <div style={{ 
          marginTop: '20px', 
          marginBottom: '20px',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setShowMap(false)}
            style={{
              padding: '10px 20px',
              background: !showMap ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : colors.inputBg,
              color: !showMap ? '#ffffff' : colors.textPrimary,
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Table View
          </button>
          <button
            onClick={() => setShowMap(true)}
            style={{
              padding: '10px 20px',
              background: showMap ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : colors.inputBg,
              color: showMap ? '#ffffff' : colors.textPrimary,
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Map View
          </button>
        </div>

        {/* Virtual Table or Map */}
        {showMap ? (
          <SOSMapPanel
            requests={filteredRequests}
            onMarkerClick={handleMarkerClick}
            colors={colors}
            isLight={isLight}
          />
        ) : (
          <SOSVirtualTable
            requests={filteredRequests}
            onViewDetails={handleViewDetails}
            onAssign={handleAssign}
            colors={colors}
            isLight={isLight}
          />
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <SOSDetailsModal
          request={selectedRequest}
          onClose={handleCloseDetails}
          colors={colors}
          isLight={isLight}
        />
      )}

      {showAssignModal && (
        <SOSAssignModal
          request={selectedRequest}
          teams={filteredTeams}
          onAssign={handleTeamAssignment}
          onClose={handleCloseAssign}
          colors={colors}
          isLight={isLight}
        />
      )}
    </DashboardLayout>
  );
};

export default SOSRequests;
