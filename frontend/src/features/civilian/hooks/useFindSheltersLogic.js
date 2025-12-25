import { useState, useEffect } from 'react';
import civilianApi from '../services/civilianApi';
import { STATUS_CONFIG } from '../constants/findSheltersConstants';
import useUserLocation from './useUserLocation';

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
          distance: shelter.distance || 0,
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

  // Filter and sort shelters
  const filteredShelters = shelters
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
