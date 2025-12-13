/**
 * useRescueTeamData Hook
 * Manages rescue team data, filtering, calculations, and CRUD operations
 * Ready for backend integration
 */

import { useState, useCallback, useMemo } from 'react';

// Initial team data - will be replaced with API calls
const INITIAL_TEAMS = [
  {
    id: 'RT-001',
    name: 'Team Alpha',
    type: 'Rescue 1122',
    leader: 'Captain Ahmed Raza',
    contact: '+92-300-1234567',
    members: 8,
    status: 'available',
    location: 'Sukkur Central Station',
    coordinates: '27.7056, 68.8575',
    equipment: ['Boat', 'Medical Kit', 'Ropes', 'Life Jackets'],
    notes: 'Fully equipped water rescue team',
    lastUpdated: '5 mins ago',
    composition: { medical: 2, rescue: 4, support: 2 }
  },
  {
    id: 'RT-002',
    name: 'Team Bravo',
    type: 'Rescue 1122',
    leader: 'Lt. Hassan Ali',
    contact: '+92-301-9876543',
    members: 6,
    status: 'deployed',
    location: 'Rohri Flood Zone',
    coordinates: '27.6922, 68.8947',
    equipment: ['Boat', 'Medical Kit', 'Communication Radio'],
    notes: 'Currently assisting flood victims',
    lastUpdated: '12 mins ago',
    composition: { medical: 1, rescue: 4, support: 1 }
  },
  {
    id: 'RT-003',
    name: 'Team Charlie',
    type: 'Civil Defense',
    leader: 'Major Tariq Mahmood',
    contact: '+92-333-5551234',
    members: 10,
    status: 'on-mission',
    location: 'Saleh Pat Region',
    coordinates: '27.7500, 68.9000',
    equipment: ['Trucks', 'Heavy Equipment', 'Medical Supplies'],
    notes: 'Infrastructure support team - Mission in progress',
    lastUpdated: '8 mins ago',
    composition: { medical: 2, rescue: 5, support: 3 }
  },
  {
    id: 'RT-004',
    name: 'Team Delta',
    type: 'Medical Response',
    leader: 'Dr. Ayesha Siddiqui',
    contact: '+92-321-1112233',
    members: 4,
    status: 'available',
    location: 'District Hospital',
    coordinates: '27.7100, 68.8600',
    equipment: ['Ambulance', 'Medical Equipment', 'First Aid'],
    notes: 'Medical emergency response unit',
    lastUpdated: '3 mins ago',
    composition: { medical: 3, rescue: 0, support: 1 }
  },
  {
    id: 'RT-005',
    name: 'Team Echo',
    type: 'Rescue 1122',
    leader: 'Inspector Rashid Khan',
    contact: '+92-321-4445566',
    members: 7,
    status: 'on-mission',
    location: 'Pano Aqil',
    coordinates: '27.8500, 69.1000',
    equipment: ['Boat', 'Rescue Gear', 'Communication Radio'],
    notes: 'Evacuation in progress',
    lastUpdated: '15 mins ago',
    composition: { medical: 1, rescue: 5, support: 1 }
  },
  {
    id: 'RT-006',
    name: 'Team Foxtrot',
    type: 'Civil Defense',
    leader: 'Sergeant Zafar Iqbal',
    contact: '+92-333-9998877',
    members: 9,
    status: 'unavailable',
    location: 'Base Camp',
    coordinates: '27.7056, 68.8575',
    equipment: ['Communication Equipment', 'First Aid'],
    notes: 'Under maintenance - Expected available in 2 hours',
    lastUpdated: '20 mins ago',
    composition: { medical: 2, rescue: 4, support: 3 }
  }
];

// Status options for filtering
export const TEAM_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'on-mission', label: 'On Mission' },
  { value: 'unavailable', label: 'Unavailable' }
];

export const useRescueTeamData = () => {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Helper functions
  const getStatusInfo = useCallback((status) => {
    if (status === 'available') return { label: 'Available', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' };
    if (status === 'deployed') return { label: 'Deployed', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)' };
    if (status === 'on-mission') return { label: 'On Mission', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'Unavailable', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
  }, []);

  const getCompositionData = useCallback((composition) => {
    return [
      { name: 'Medical', value: composition.medical, fill: '#10b981' },
      { name: 'Rescue', value: composition.rescue, fill: '#3b82f6' },
      { name: 'Support', value: composition.support, fill: '#f59e0b' }
    ].filter(d => d.value > 0);
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
    try {
      // TODO: Replace with API call
      const newTeam = {
        id: `RT-${String(teams.length + 1).padStart(3, '0')}`,
        type: teamData.type || 'Rescue 1122',
        equipment: teamData.equipment || [],
        notes: teamData.notes || '',
        lastUpdated: 'Just now',
        composition: teamData.composition || { medical: 2, rescue: 4, support: 2 },
        ...teamData
      };
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [teams.length]);

  const updateTeam = useCallback(async (teamId, teamData) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setTeams(prev => 
        prev.map(t => t.id === teamId ? { ...t, ...teamData, lastUpdated: 'Just now' } : t)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTeam = useCallback(async (teamId) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setTeams(prev => prev.filter(t => t.id !== teamId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeamStatus = useCallback(async (teamId, newStatus) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setTeams(prev => 
        prev.map(t => t.id === teamId ? { ...t, status: newStatus, lastUpdated: 'Just now' } : t)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setTeams(INITIAL_TEAMS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
