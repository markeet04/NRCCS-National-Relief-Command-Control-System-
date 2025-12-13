/**
 * useShelterData Hook
 * Manages shelter data, filtering, calculations, and CRUD operations
 * Ready for backend integration
 */

import { useState, useCallback, useMemo } from 'react';

// Initial shelter data - will be replaced with API calls
const INITIAL_SHELTERS = [
  {
    id: 'SH-001',
    name: 'Government High School',
    address: 'Civil Lines, Sukkur',
    capacity: 500,
    occupancy: 342,
    contactPerson: 'Mr. Rashid Ahmed',
    contactPhone: '+92-300-1112233',
    resources: { food: 80, water: 60, medical: 90, tents: 40 },
    amenities: ['Electricity', 'Clean Water', 'Toilets', 'Medical Room', 'Kitchen']
  },
  {
    id: 'SH-002',
    name: 'Community Center Rohri',
    address: 'Main Road, Rohri',
    capacity: 300,
    occupancy: 285,
    contactPerson: 'Ms. Sara Khan',
    contactPhone: '+92-301-2222222',
    resources: { food: 45, water: 30, medical: 55, tents: 25 },
    amenities: ['Electricity', 'Clean Water', 'Toilets']
  },
  {
    id: 'SH-003',
    name: 'Sports Complex Shelter',
    address: 'Airport Road, Sukkur',
    capacity: 800,
    occupancy: 156,
    contactPerson: 'Mr. Hassan Ali',
    contactPhone: '+92-302-3333333',
    resources: { food: 95, water: 88, medical: 92, tents: 78 },
    amenities: ['Electricity', 'Clean Water', 'Toilets', 'Medical Room', 'Kitchen', 'Playground']
  },
  {
    id: 'SH-004',
    name: 'City Hall Emergency Center',
    address: 'Downtown, Sukkur',
    capacity: 400,
    occupancy: 400,
    contactPerson: 'Mr. Imran Shah',
    contactPhone: '+92-303-4444444',
    resources: { food: 20, water: 15, medical: 35, tents: 10 },
    amenities: ['Electricity', 'Toilets']
  },
  {
    id: 'SH-005',
    name: 'Railway Station Camp',
    address: 'Station Road, Sukkur',
    capacity: 600,
    occupancy: 420,
    contactPerson: 'Ms. Fatima Bibi',
    contactPhone: '+92-304-5555555',
    resources: { food: 65, water: 70, medical: 50, tents: 55 },
    amenities: ['Electricity', 'Clean Water', 'Toilets', 'Kitchen']
  }
];

// Status options for filtering
export const SHELTER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'near-full', label: 'Near Full' },
  { value: 'full', label: 'Full' }
];

export const useShelterData = () => {
  const [shelters, setShelters] = useState(INITIAL_SHELTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Helper functions
  const getStatus = useCallback((occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 100) return 'full';
    if (percentage >= 90) return 'near-full';
    return 'available';
  }, []);

  const getStatusInfo = useCallback((occupancy, capacity) => {
    const status = getStatus(occupancy, capacity);
    if (status === 'full') return { label: 'Full', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
    if (status === 'near-full') return { label: 'Near Full', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'Available', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' };
  }, [getStatus]);

  const getResourceColor = useCallback((value) => {
    if (value >= 80) return '#10b981';
    if (value >= 50) return '#f59e0b';
    return '#ef4444';
  }, []);

  const getResourceGaugeData = useCallback((resources) => {
    return [
      { name: 'Food', value: resources.food, fill: getResourceColor(resources.food) },
      { name: 'Water', value: resources.water, fill: getResourceColor(resources.water) },
      { name: 'Medical', value: resources.medical, fill: getResourceColor(resources.medical) },
      { name: 'Tents', value: resources.tents, fill: getResourceColor(resources.tents) }
    ];
  }, [getResourceColor]);

  const getAverageResources = useCallback((resources) => {
    const values = Object.values(resources);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, []);

  // Computed statistics
  const stats = useMemo(() => {
    const totalShelters = shelters.length;
    const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
    const currentOccupancy = shelters.reduce((sum, s) => sum + s.occupancy, 0);
    const occupancyPercent = Math.round((currentOccupancy / totalCapacity) * 100);
    
    const availableShelters = shelters.filter(s => (s.occupancy / s.capacity) < 0.9).length;
    const nearFullShelters = shelters.filter(s => (s.occupancy / s.capacity) >= 0.9 && (s.occupancy / s.capacity) < 1).length;
    const fullShelters = shelters.filter(s => (s.occupancy / s.capacity) >= 1).length;

    return {
      totalShelters,
      totalCapacity,
      currentOccupancy,
      occupancyPercent,
      availableShelters,
      nearFullShelters,
      fullShelters
    };
  }, [shelters]);

  // Chart data
  const statusPieData = useMemo(() => {
    return [
      { name: 'Available', value: stats.availableShelters, color: '#10b981' },
      { name: 'Near Full', value: stats.nearFullShelters, color: '#f59e0b' },
      { name: 'Full', value: stats.fullShelters, color: '#ef4444' }
    ].filter(d => d.value > 0);
  }, [stats]);

  const capacityRingData = useMemo(() => {
    const occupancyPercent = stats.occupancyPercent;
    return [
      { 
        name: 'Occupied', 
        value: occupancyPercent, 
        fill: occupancyPercent > 80 ? '#ef4444' : occupancyPercent > 60 ? '#f59e0b' : '#10b981' 
      },
      { name: 'Available', value: 100 - occupancyPercent, fill: '#374151' }
    ];
  }, [stats]);

  // Filtered shelters
  const filteredShelters = useMemo(() => {
    return shelters.filter(shelter => {
      const matchesSearch = shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            shelter.address.toLowerCase().includes(searchQuery.toLowerCase());
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && getStatus(shelter.occupancy, shelter.capacity) === statusFilter;
    });
  }, [shelters, searchQuery, statusFilter, getStatus]);

  // CRUD Actions
  const addShelter = useCallback(async (shelterData) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      const newShelter = {
        id: `SH-${String(shelters.length + 1).padStart(3, '0')}`,
        ...shelterData,
        amenities: shelterData.amenities || []
      };
      setShelters(prev => [...prev, newShelter]);
      return newShelter;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [shelters.length]);

  const updateShelter = useCallback(async (shelterId, shelterData) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setShelters(prev => 
        prev.map(s => s.id === shelterId ? { ...s, ...shelterData } : s)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteShelter = useCallback(async (shelterId) => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      setShelters(prev => prev.filter(s => s.id !== shelterId));
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
      setShelters(INITIAL_SHELTERS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    shelters,
    filteredShelters,
    stats,
    statusPieData,
    capacityRingData,
    
    // Filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    
    // Helper functions
    getStatus,
    getStatusInfo,
    getResourceColor,
    getResourceGaugeData,
    getAverageResources,
    
    // Actions
    addShelter,
    updateShelter,
    deleteShelter,
    refresh,
    
    // Loading state
    loading,
    error
  };
};

export default useShelterData;
