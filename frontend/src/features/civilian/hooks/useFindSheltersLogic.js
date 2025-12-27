import { useState, useEffect, useMemo } from 'react';
import civilianApi from '../services/civilianApi';
import { STATUS_CONFIG } from '../constants/findSheltersConstants';
import useUserLocation from './useUserLocation';

// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
};

const useFindSheltersLogic = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'distance',
  });

  const userLocation = useUserLocation();

  // Fetch shelters from API
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await civilianApi.getAllShelters();

        // Transform backend data to match frontend expectations
        const transformedShelters = data.map((shelter) => ({
          id: shelter.id,
          name: shelter.name,
          address: shelter.address,
          latitude: parseFloat(shelter.lat) || 0,
          longitude: parseFloat(shelter.lng) || 0,
          distance: 0, // Will be calculated when userLocation is available
          capacity: {
            total: shelter.capacity || 0,
            current: shelter.occupancy || 0,
            available: (shelter.capacity || 0) - (shelter.occupancy || 0),
          },
          facilities: shelter.facilities || [],
          contact: shelter.contactPhone || shelter.contact,
          status: shelter.status,
          rating: parseFloat(shelter.rating) || 0,
          lastUpdated: shelter.lastUpdate ? new Date(shelter.lastUpdate).toLocaleString() : 'N/A',
        }));

        setShelters(transformedShelters);
      } catch (err) {
        console.error('Failed to fetch shelters:', err);
        setError('Failed to load shelters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  // Calculate distance when user location or shelters change
  const sheltersWithDistance = useMemo(() => {
    if (!userLocation) return shelters;

    return shelters.map(shelter => ({
      ...shelter,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        shelter.latitude,
        shelter.longitude
      ) || 0
    }));
  }, [shelters, userLocation]);

  // Filter and sort shelters
  const filteredShelters = sheltersWithDistance
    .filter((shelter) => {
      // Apply search query filter
      const matchesSearch = shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shelter.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Apply status filter
      if (filters.status === 'all') return true;
      return shelter.status === filters.status;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'distance') {
        return a.distance - b.distance;
      }
      if (filters.sortBy === 'capacity') {
        return b.capacity.available - a.capacity.available;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleGetDirections = (shelter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;
    window.open(url, '_blank');
  };

  const handleShelterClick = (shelter) => {
    setSelectedShelter(selectedShelter?.id === shelter.id ? null : shelter);
  };

  return {
    loading,
    error,
    shelters: filteredShelters,
    searchQuery,
    selectedShelter,
    userLocation,
    filters,
    showFilters,
    activeFilterCount: 0,
    handleSearch,
    handleFilterChange,
    setShowFilters,
    handleShelterClick,
    handleGetDirections,
    STATUS_CONFIG,
  };
};

export default useFindSheltersLogic;
