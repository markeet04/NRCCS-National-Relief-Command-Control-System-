/**
 * useShelterData Hook
 * Manages shelter data, filtering, calculations, and CRUD operations
 * Fully integrated with backend API - no hardcoded data
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import districtApi from '../services/districtApi';
import { useNotification } from '../../../shared/hooks';

// Status options for filtering
export const SHELTER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'near-full', label: 'Near Full' },
  { value: 'full', label: 'Full' }
];

export const useShelterData = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification?.() || null;
  const showSuccess = notification?.success || console.log;
  const showError = notification?.error || console.error;

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch shelters from API
  const fetchShelters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await districtApi.getAllShelters();
      const data = response.data || response || [];

      // Transform API data to match component expectations
      setShelters(data.map(shelter => ({
        id: shelter.id,
        name: shelter.name,
        address: shelter.address || shelter.location || 'Unknown location',
        capacity: shelter.capacity || 0,
        occupancy: shelter.occupancy || shelter.currentOccupancy || 0,
        contactPerson: shelter.managerName || shelter.contactPerson || 'Not assigned',
        contactPhone: shelter.managerPhone || shelter.contactPhone || 'N/A',
        resources: {
          food: shelter.supplyFood ?? shelter.foodSupplyLevel ?? shelter.supplies?.food ?? 0,
          water: shelter.supplyWater ?? shelter.waterSupplyLevel ?? shelter.supplies?.water ?? 0,
          medical: shelter.supplyMedical ?? shelter.medicalSupplyLevel ?? shelter.supplies?.medical ?? 0,
          tents: shelter.supplyTents ?? shelter.tentSupplyLevel ?? shelter.supplies?.tents ?? 0,
        },
        amenities: shelter.amenities || [],
        status: shelter.status,
        coordinates: shelter.coordinates || { lat: shelter.lat, lng: shelter.lng },
      })));
    } catch (err) {
      console.error('Failed to fetch shelters:', err);
      setError(err.message || 'Failed to fetch shelters');
      showError('Failed to load shelters');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Initial fetch
  useEffect(() => {
    fetchShelters();
  }, [fetchShelters]);

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
    const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalOccupancy = shelters.reduce((sum, s) => sum + (s.occupancy || 0), 0);
    const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    const availableShelters = shelters.filter(s => s.capacity > 0 && (s.occupancy / s.capacity) < 0.9).length;
    const nearFullShelters = shelters.filter(s => s.capacity > 0 && (s.occupancy / s.capacity) >= 0.9 && (s.occupancy / s.capacity) < 1).length;
    const fullShelters = shelters.filter(s => s.capacity > 0 && (s.occupancy / s.capacity) >= 1).length;

    return {
      totalShelters,
      totalCapacity,
      totalOccupancy,
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
    setError(null);
    try {
      await districtApi.createShelter(shelterData);
      showSuccess('Shelter created successfully');

      // Refetch to get updated list from backend
      await fetchShelters();
    } catch (err) {
      console.error('Failed to create shelter:', err);
      setError(err.message);
      showError(err.message || 'Failed to create shelter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchShelters]);

  const updateShelter = useCallback(async (shelterId, shelterData) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateShelter(shelterId, shelterData);
      showSuccess('Shelter updated successfully');

      // Refetch to get updated status and fields from backend
      await fetchShelters();
    } catch (err) {
      console.error('Failed to update shelter:', err);
      setError(err.message);
      showError(err.message || 'Failed to update shelter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchShelters]);

  const updateShelterSupplies = useCallback(async (shelterId, supplies) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateShelterSupplies(shelterId, supplies);
      setShelters(prev =>
        prev.map(s => s.id === shelterId ? {
          ...s,
          resources: { ...s.resources, ...supplies }
        } : s)
      );
      showSuccess('Shelter supplies updated');
    } catch (err) {
      console.error('Failed to update supplies:', err);
      setError(err.message);
      showError(err.message || 'Failed to update supplies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const updateShelterOccupancy = useCallback(async (shelterId, occupancy) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.updateShelterOccupancy(shelterId, occupancy);
      showSuccess('Shelter occupancy updated');

      // Refetch to get updated status (backend auto-updates status based on occupancy)
      await fetchShelters();
    } catch (err) {
      console.error('Failed to update occupancy:', err);
      setError(err.message);
      showError(err.message || 'Failed to update occupancy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchShelters]);

  const deleteShelter = useCallback(async (shelterId) => {
    setLoading(true);
    setError(null);
    try {
      await districtApi.deleteShelter(shelterId);
      showSuccess('Shelter deleted successfully');

      // Refetch to get updated list from backend
      await fetchShelters();
    } catch (err) {
      console.error('Failed to delete shelter:', err);
      setError(err.message);
      showError(err.message || 'Failed to delete shelter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchShelters]);

  const refresh = useCallback(async () => {
    await fetchShelters();
  }, [fetchShelters]);

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
    updateShelterSupplies,
    updateShelterOccupancy,
    deleteShelter,
    refresh,

    // Loading state
    loading,
    error
  };
};

export default useShelterData;
