/**
 * useRescueTeams Hook
 * Manages rescue teams data and actions
 * Fully integrated with backend API - no hardcoded data
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import districtApi from '../services/districtApi';
import { useNotification } from '../../../shared/hooks';

export const useRescueTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification?.() || null;
  const showSuccess = notification?.success || console.log;
  const showError = notification?.error || console.error;

  // Fetch rescue teams from API
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
        leader: team.leaderName || 'Not assigned',
        contact: team.contactNumber || 'N/A',
        members: team.memberCount || team.members?.length || 0,
        status: team.status?.toLowerCase() || 'available',
        location: team.baseLocation || team.currentLocation || 'Unknown',
        equipment: team.equipment || [],
        currentMission: team.currentSosRequestId || null,
        specialization: team.specialization || null,
      })));
    } catch (err) {
      console.error('Failed to fetch rescue teams:', err);
      setError(err.message || 'Failed to fetch rescue teams');
      showError('Failed to load rescue teams');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Initial fetch
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Computed values
  const availableTeams = useMemo(() => 
    teams.filter(team => team.status === 'available'), 
    [teams]
  );

  const busyTeams = useMemo(() => 
    teams.filter(team => team.status === 'busy' || team.status === 'deployed' || team.status === 'on_mission'), 
    [teams]
  );

  const offDutyTeams = useMemo(() => 
    teams.filter(team => team.status === 'off_duty'), 
    [teams]
  );

  const teamCounts = useMemo(() => ({
    total: teams.length,
    available: availableTeams.length,
    busy: busyTeams.length,
    offDuty: offDutyTeams.length,
  }), [teams, availableTeams, busyTeams, offDutyTeams]);

  // Actions
  const createTeam = useCallback(async (teamData) => {
    setLoading(true);
    setError(null);
    try {
      const newTeam = await districtApi.createRescueTeam(teamData);
      setTeams(prev => [...prev, {
        id: newTeam.id,
        name: newTeam.name,
        leader: newTeam.leaderName || 'Not assigned',
        contact: newTeam.contactNumber || 'N/A',
        members: newTeam.memberCount || 0,
        status: newTeam.status?.toLowerCase() || 'available',
        location: newTeam.baseLocation || 'Unknown',
        equipment: newTeam.equipment || [],
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

  const updateTeam = useCallback(async (teamId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateRescueTeam(teamId, updateData);
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId ? { ...team, ...updateData } : team
        )
      );
      showSuccess('Team updated successfully');
    } catch (err) {
      console.error('Failed to update team:', err);
      setError(err.message);
      showError(err.message || 'Failed to update team');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const updateTeamStatus = useCallback(async (teamId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateTeamStatus(teamId, { status: newStatus });
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId ? { ...team, status: newStatus.toLowerCase() } : team
        )
      );
      showSuccess(`Team status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update team status:', err);
      setError(err.message);
      showError(err.message || 'Failed to update team status');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const assignToMission = useCallback(async (teamId, missionId) => {
    setLoading(true);
    setError(null);
    try {
      // Update status to busy and assign mission
      await districtApi.updateTeamStatus(teamId, { 
        status: 'Busy', 
        currentLocation: 'En route to mission' 
      });
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId 
            ? { ...team, status: 'busy', currentMission: missionId } 
            : team
        )
      );
      showSuccess('Team assigned to mission');
    } catch (err) {
      console.error('Failed to assign team:', err);
      setError(err.message);
      showError(err.message || 'Failed to assign team to mission');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const completeMission = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateTeamStatus(teamId, { status: 'Available' });
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId 
            ? { ...team, status: 'available', currentMission: null } 
            : team
        )
      );
      showSuccess('Mission completed, team is now available');
    } catch (err) {
      console.error('Failed to complete mission:', err);
      setError(err.message);
      showError(err.message || 'Failed to complete mission');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const refresh = useCallback(async () => {
    await fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    availableTeams,
    busyTeams,
    offDutyTeams,
    teamCounts,
    loading,
    error,
    createTeam,
    updateTeam,
    updateTeamStatus,
    assignToMission,
    completeMission,
    refresh,
  };
};

export default useRescueTeams;
