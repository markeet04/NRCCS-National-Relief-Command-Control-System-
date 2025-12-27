/**
 * useRescueTeamData Hook
 * Manages rescue team data, filtering, calculations, and CRUD operations
 * Fully integrated with backend API - no hardcoded data
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import districtApi from '../services/districtApi';
import { useNotification } from '../../../shared/hooks';

// Status options for filtering
export const TEAM_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'on-mission', label: 'On Mission' },
  { value: 'unavailable', label: 'Unavailable' }
];

export const useRescueTeamData = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification?.() || null;
  const showSuccess = notification?.success || console.log;
  const showError = notification?.error || console.error;

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch teams from API
  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await districtApi.getAllRescueTeams();
      const data = response.data || response || [];

      // Transform API data to match component expectations
      setTeams(data.map(team => ({
        id: team.id,
        name: team.name,
        type: team.specialization || team.type || team.teamType || 'Rescue 1122',
        leader: team.leaderName || 'Not assigned',
        contact: team.contactNumber || 'N/A',
        members: team.memberCount || team.members?.length || 0,
        status: team.status?.toLowerCase().replace('_', '-') || 'available',
        location: team.currentLocation || team.baseLocation || 'Unknown',
        coordinates: team.coordinates || null,
        equipment: team.equipment || [],
        notes: team.notes || '',
        lastUpdated: getTimeAgo(team.updatedAt),
        composition: {
          medical: team.compositionMedical || 0,
          rescue: team.compositionRescue || 0,
          support: team.compositionSupport || 0
        }
      })));
    } catch (err) {
      console.error('Failed to fetch rescue teams:', err);
      setError(err.message || 'Failed to fetch rescue teams');
      showError('Failed to load rescue teams');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Helper to get time ago string
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  // Initial fetch
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Helper functions
  const getStatusInfo = useCallback((status) => {
    if (status === 'available') return { label: 'Available', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' };
    if (status === 'deployed') return { label: 'Deployed', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)' };
    if (status === 'on-mission') return { label: 'On Mission', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'Unavailable', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
  }, []);

  const getCompositionData = useCallback((composition) => {
    return [
      { name: 'Medical', value: composition.medical || 0, fill: '#10b981' },
      { name: 'Rescue', value: composition.rescue || 0, fill: '#3b82f6' },
      { name: 'Support', value: composition.support || 0, fill: '#f59e0b' }
    ];
  }, []);

  // Computed statistics
  const stats = useMemo(() => {
    const totalTeams = teams.length;
    const availableTeams = teams.filter(t => t.status === 'available').length;
    const deployedTeams = teams.filter(t => t.status === 'deployed' || t.status === 'on-mission').length;
    const unavailableTeams = teams.filter(t => t.status === 'unavailable').length;
    const availablePercent = Math.round((availableTeams / totalTeams) * 100);
    const totalMembers = teams.reduce((sum, t) => sum + t.members, 0);

    return {
      totalTeams,
      availableTeams,
      deployedTeams,
      unavailableTeams,
      availablePercent,
      totalMembers
    };
  }, [teams]);

  // Chart data
  const statusPieData = useMemo(() => {
    return [
      { name: 'Available', value: stats.availableTeams, color: '#10b981' },
      { name: 'Deployed', value: stats.deployedTeams, color: '#f59e0b' },
      { name: 'Unavailable', value: stats.unavailableTeams, color: '#ef4444' }
    ].filter(d => d.value > 0);
  }, [stats]);

  const availableRingData = useMemo(() => {
    return [
      { name: 'Available', value: stats.availablePercent, fill: '#10b981' },
      { name: 'Others', value: 100 - stats.availablePercent, fill: '#e5e7eb' }
    ];
  }, [stats]);

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.location.toLowerCase().includes(searchQuery.toLowerCase());
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && team.status === statusFilter;
    });
  }, [teams, searchQuery, statusFilter]);

  // CRUD Actions
  const addTeam = useCallback(async (teamData) => {
    setLoading(true);
    setError(null);
    try {
      const totalMembers = (parseInt(teamData.medical) || 0) + (parseInt(teamData.rescue) || 0) + (parseInt(teamData.support) || 0);

      const payload = {
        name: teamData.name,
        leaderName: teamData.leader,
        contactNumber: teamData.contact,
        memberCount: totalMembers,
        compositionMedical: parseInt(teamData.medical) || 0,
        compositionRescue: parseInt(teamData.rescue) || 0,
        compositionSupport: parseInt(teamData.support) || 0,
        specialization: teamData.type,
        baseLocation: teamData.location,
        equipment: teamData.equipment || [],
        notes: teamData.notes || '',
      };

      const newTeam = await districtApi.createRescueTeam(payload);

      setTeams(prev => [...prev, {
        id: newTeam.id,
        name: newTeam.name,
        type: newTeam.specialization || teamData.type || 'Rescue 1122',
        leader: newTeam.leaderName || teamData.leader,
        contact: newTeam.contactNumber || teamData.contact,
        members: newTeam.memberCount || totalMembers,
        status: 'available',
        location: newTeam.baseLocation || teamData.location,
        equipment: newTeam.equipment || [],
        notes: newTeam.notes || '',
        lastUpdated: 'Just now',
        composition: {
          medical: newTeam.compositionMedical || parseInt(teamData.medical) || 0,
          rescue: newTeam.compositionRescue || parseInt(teamData.rescue) || 0,
          support: newTeam.compositionSupport || parseInt(teamData.support) || 0
        }
      }]);
      showSuccess(`Team "${teamData.name}" created successfully`);
      return newTeam;
    } catch (err) {
      console.error('Failed to create team:', err);
      setError(err.message);
      showError(err.message || 'Failed to create team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const updateTeam = useCallback(async (teamId, teamData) => {
    setLoading(true);
    setError(null);
    try {
      // Update basic team info
      await districtApi.updateRescueTeam(teamId, {
        name: teamData.name,
        leaderName: teamData.leader,
        contactNumber: teamData.contact,
        memberCount: teamData.members,
        specialization: teamData.type,
        baseLocation: teamData.location,
        currentLocation: teamData.location,
        equipment: teamData.equipment,
        notes: teamData.notes,
      });

      // If status changed, update it separately
      if (teamData.status) {
        const apiStatus = teamData.status.toLowerCase();
        await districtApi.updateTeamStatus(teamId, apiStatus);
      }

      showSuccess('Team updated successfully');

      // Refetch to get latest data from backend
      await fetchTeams();
    } catch (err) {
      console.error('Failed to update team:', err);
      setError(err.message);
      showError(err.message || 'Failed to update team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchTeams]);

  const deleteTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.deleteRescueTeam(teamId);
      setTeams(prev => prev.filter(t => t.id !== teamId));
      showSuccess('Team deleted successfully');
    } catch (err) {
      console.error('Failed to delete team:', err);
      setError(err.message);
      showError(err.message || 'Failed to delete team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const updateTeamStatus = useCallback(async (teamId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      // Convert status to API format - backend expects lowercase with hyphens
      // e.g., 'available', 'busy', 'deployed', 'on-mission', 'unavailable', 'resting'
      const apiStatus = newStatus.toLowerCase();

      await districtApi.updateTeamStatus(teamId, apiStatus);

      showSuccess(`Team status updated to ${apiStatus}`);

      // Refetch to ensure we have the latest data from backend
      await fetchTeams();
    } catch (err) {
      console.error('Failed to update team status:', err);
      setError(err.message);
      showError(err.message || 'Failed to update team status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchTeams]);

  const refresh = useCallback(async () => {
    await fetchTeams();
  }, [fetchTeams]);

  return {
    // Data
    teams,
    filteredTeams,
    stats,
    statusPieData,
    availableRingData,

    // Filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,

    // Helper functions
    getStatusInfo,
    getCompositionData,

    // Actions
    addTeam,
    updateTeam,
    deleteTeam,
    updateTeamStatus,
    refresh,

    // Loading state
    loading,
    error
  };
};

export default useRescueTeamData;
