/**
 * SOSRequests Page (Enhanced Production-Ready Version)
 * Production-ready SOS management with virtual scrolling, advanced filters, and mapping
 * Features: Virtual scrolling, sortable columns, expandable rows, Leaflet map integration
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/components/layout';
import '@styles/css/main.css';

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

  const { filteredTeams } = useRescueTeamData();

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
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="page-title">SOS Requests Management</h1>
          <p className="page-subtitle">
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
        />

        {/* Filters */}
        <div className="mt-6">
          <SOSFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Toggle Map/Table View */}
        <div className="mt-5 mb-5 flex gap-3">
          <button
            onClick={() => setShowMap(false)}
            className={`btn ${!showMap ? 'btn--primary' : 'btn--secondary'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`btn ${showMap ? 'btn--primary' : 'btn--secondary'}`}
          >
            Map View
          </button>
        </div>

        {/* Virtual Table or Map */}
        {showMap ? (
          <SOSMapPanel
            requests={filteredRequests}
            onMarkerClick={handleMarkerClick}
          />
        ) : (
          <SOSVirtualTable
            requests={filteredRequests}
            onViewDetails={handleViewDetails}
            onAssign={handleAssign}
          />
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <SOSDetailsModal
          request={selectedRequest}
          onClose={handleCloseDetails}
        />
      )}

      {showAssignModal && (
        <SOSAssignModal
          request={selectedRequest}
          teams={filteredTeams}
          onAssign={handleTeamAssignment}
          onClose={handleCloseAssign}
        />
      )}
    </DashboardLayout>
  );
};

export default SOSRequests;

