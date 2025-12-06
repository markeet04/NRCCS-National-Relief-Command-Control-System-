/**
 * useRescueTeams Hook
 * Manages rescue teams data and actions
 */

import { useState, useCallback, useMemo } from 'react';

const INITIAL_RESCUE_TEAMS = [
  {
    id: 'RT-001',
    name: 'Team Alpha - Rescue 1122',
    leader: 'Captain Ahmed Raza',
    contact: '+92-300-1234567',
    members: 8,
    status: 'available',
    location: 'Sukkur Central Station',
    equipment: ['Boat', 'Medical Kit', 'Ropes', 'Life Jackets'],
  },
  {
    id: 'RT-004',
    name: 'Team Delta - Medical Response',
    leader: 'Dr. Ayesha Siddiqui',
    contact: '+92-321-1112233',
    members: 4,
    status: 'available',
    location: 'District Hospital',
    equipment: ['Ambulance', 'Medical Equipment', 'First Aid'],
  },
  {
    id: 'RT-006',
    name: 'Team Foxtrot - Rescue 1122',
    leader: 'Captain Imran Shah',
    contact: '+92-300-7778899',
    members: 8,
    status: 'busy',
    location: 'New Sukkur Base',
    equipment: ['Boat', 'Life Jackets', 'Medical Kit'],
  },
  {
    id: 'RT-009',
    name: 'Team India - Rescue 1122',
    leader: 'Major Asif Nawaz',
    contact: '+92-345-8889900',
    members: 7,
    status: 'available',
    location: 'Airport Road Station',
    equipment: ['Boat', 'Life Jackets', 'Communication Radio'],
  },
  {
    id: 'RT-011',
    name: 'Team Kilo - Rescue 1122',
    leader: 'Captain Naveed Iqbal',
    contact: '+92-300-4445566',
    members: 8,
    status: 'available',
    location: 'Sukkur South Station',
    equipment: ['Boat', 'Rescue Gear', 'Life Jackets'],
  },
];

export const useRescueTeams = () => {
  const [teams, setTeams] = useState(INITIAL_RESCUE_TEAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Computed values
  const availableTeams = useMemo(() => 
    teams.filter(team => team.status === 'available'), 
    [teams]
  );

  const busyTeams = useMemo(() => 
    teams.filter(team => team.status === 'busy'), 
    [teams]
  );

  const teamCounts = useMemo(() => ({
    total: teams.length,
    available: availableTeams.length,
    busy: busyTeams.length,
  }), [teams, availableTeams, busyTeams]);

  // Actions
  const updateTeamStatus = useCallback(async (teamId, newStatus) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId ? { ...team, status: newStatus } : team
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignToMission = useCallback(async (teamId, missionId) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId 
            ? { ...team, status: 'busy', currentMission: missionId } 
            : team
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeMission = useCallback(async (teamId) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId 
            ? { ...team, status: 'available', currentMission: null } 
            : team
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setTeams(INITIAL_RESCUE_TEAMS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teams,
    availableTeams,
    busyTeams,
    teamCounts,
    loading,
    error,
    updateTeamStatus,
    assignToMission,
    completeMission,
    refresh,
  };
};

export default useRescueTeams;
