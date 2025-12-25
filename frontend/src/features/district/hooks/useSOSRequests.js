/**
 * useSOSRequests Hook
 * Manages SOS requests data, filtering, and actions
 * Fully integrated with backend API - no hardcoded data
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { STATUS_COLORS } from '../constants';
import districtApi from '../services/districtApi';
import { useNotification } from '../../../shared/hooks';

export const useSOSRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification?.() || null;
  const showSuccess = notification?.success || console.log;
  const showError = notification?.error || console.error;
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch SOS requests from API
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await districtApi.getAllSosRequests();
      const data = response.data || response || [];
      
      // Transform API data to match component expectations
      setRequests(data.map(sos => ({
        id: sos.id,
        name: sos.reporterName || sos.user?.name || 'Unknown',
        phone: sos.contactNumber || sos.user?.phone || 'N/A',
        location: sos.locationAddress || sos.location || 'Unknown location',
        coordinates: sos.locationCoordinates,
        people: sos.numberOfPeople || 1,
        status: sos.status,
        time: sos.createdAt,
        description: sos.description || '',
        assignedTeam: sos.rescueTeam?.name || null,
        assignedTeamId: sos.rescueTeamId || null,
        priority: sos.priority || 'Medium',
        timeline: sos.timeline || [],
      })));
    } catch (err) {
      console.error('Failed to fetch SOS requests:', err);
      setError(err.message || 'Failed to fetch SOS requests');
      showError('Failed to load SOS requests');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Get status color
  const getStatusColor = useCallback((status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.default;
  }, []);

  // Computed values
  const pendingCount = useMemo(() => 
    requests.filter(req => req.status === 'Pending').length, 
    [requests]
  );

  const assignedCount = useMemo(() => 
    requests.filter(req => req.status === 'Assigned').length, 
    [requests]
  );

  const enrouteCount = useMemo(() => 
    requests.filter(req => req.status === 'En-route').length, 
    [requests]
  );

  const rescuedCount = useMemo(() => 
    requests.filter(req => req.status === 'Rescued').length, 
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = 
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(request.id).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  // Actions
  const updateStatus = useCallback(async (requestId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateSosStatus(requestId, { status: newStatus });
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      showSuccess(`SOS request status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.message);
      showError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const assignTeam = useCallback(async (requestId, teamId, teamName) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.assignTeamToSos(requestId, { rescueTeamId: teamId });
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'Assigned', assignedTeam: teamName, assignedTeamId: teamId } 
            : req
        )
      );
      showSuccess(`Team "${teamName}" assigned to SOS request`);
    } catch (err) {
      console.error('Failed to assign team:', err);
      setError(err.message);
      showError(err.message || 'Failed to assign team');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const addTimelineEntry = useCallback(async (requestId, action, notes) => {
    try {
      await districtApi.addSosTimelineEntry(requestId, { action, notes });
      showSuccess('Timeline entry added');
      // Refresh to get updated timeline
      await fetchRequests();
    } catch (err) {
      console.error('Failed to add timeline entry:', err);
      showError(err.message || 'Failed to add timeline entry');
    }
  }, [fetchRequests, showSuccess, showError]);

  const markRescued = useCallback(async (requestId) => {
    await updateStatus(requestId, 'Rescued');
  }, [updateStatus]);

  const refresh = useCallback(async () => {
    await fetchRequests();
  }, [fetchRequests]);

  return {
    // Data
    requests,
    filteredRequests,
    allRequests: requests,
    pendingCount,
    assignedCount,
    enrouteCount,
    rescuedCount,
    loading,
    error,
    
    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    
    // Helpers
    getStatusColor,
    
    // Actions
    updateStatus,
    assignTeam,
    addTimelineEntry,
    markRescued,
    refresh,
  };
};

export default useSOSRequests;
