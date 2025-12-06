/**
 * useSOSRequests Hook
 * Manages SOS requests data, filtering, and actions
 * Ready for backend integration
 */

import { useState, useCallback, useMemo } from 'react';
import { STATUS_COLORS } from '../constants';

// Mock data - will be replaced with API calls
const INITIAL_SOS_REQUESTS = [
  {
    id: 'SOS-001',
    name: 'Ahmed Khan',
    phone: '+92-300-1234567',
    location: 'Rohri, Sukkur',
    people: 6,
    status: 'Pending',
    time: '2024-01-15 14:30',
    description: 'Family trapped on rooftop, water level rising rapidly',
  },
  {
    id: 'SOS-002',
    name: 'Fatima Bibi',
    phone: '+92-301-9876543',
    location: 'New Sukkur',
    people: 4,
    status: 'Assigned',
    time: '2024-01-15 13:15',
    description: 'Elderly person needs medical evacuation',
  },
  {
    id: 'SOS-003',
    name: 'Muhammad Ali',
    phone: '+92-333-5551234',
    location: 'Saleh Pat',
    people: 8,
    status: 'En-route',
    time: '2024-01-15 12:00',
    description: 'Multiple families stranded in flood waters',
  },
  {
    id: 'SOS-004',
    name: 'Ayesha Malik',
    phone: '+92-345-7778888',
    location: 'Pano Aqil',
    people: 3,
    status: 'Rescued',
    time: '2024-01-15 10:45',
    description: 'Children and elderly need immediate rescue',
  },
];

export const useSOSRequests = () => {
  const [requests, setRequests] = useState(INITIAL_SOS_REQUESTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Get status color
  const getStatusColor = useCallback((status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.default;
  }, []);

  // Computed values
  const pendingCount = useMemo(() => 
    requests.filter(req => req.status === 'Pending').length, 
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = 
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  // Actions
  const updateStatus = useCallback(async (requestId, newStatus) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      // await SOSService.updateStatus(requestId, newStatus);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignTeam = useCallback(async (requestId, teamId, teamName) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      // await SOSService.assignTeam(requestId, teamId);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'Assigned', assignedTeam: teamName, assignedTeamId: teamId } 
            : req
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRescued = useCallback(async (requestId) => {
    await updateStatus(requestId, 'Rescued');
  }, [updateStatus]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      // const data = await SOSService.getAll();
      // setRequests(data);
      
      // For now, just reset to initial
      await new Promise(resolve => setTimeout(resolve, 300));
      setRequests(INITIAL_SOS_REQUESTS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    requests: filteredRequests,
    allRequests: requests,
    pendingCount,
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
    markRescued,
    refresh,
  };
};

export default useSOSRequests;
