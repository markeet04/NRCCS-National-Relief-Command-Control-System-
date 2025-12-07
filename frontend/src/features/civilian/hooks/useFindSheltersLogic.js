import { useState, useEffect } from 'react';
import { MOCK_SHELTERS } from '../constants';
import useUserLocation from './useUserLocation';
import useShelterFilters from './useShelterFilters';

const useFindSheltersLogic = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const userLocation = useUserLocation();
  const {
    filters,
    filteredShelters,
    handleFilterChange,
    toggleFacilityFilter,
    getActiveFilterCount,
  } = useShelterFilters(shelters, searchQuery);

  // Simulate fetching shelters
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setShelters(MOCK_SHELTERS);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
    shelters: filteredShelters,
    searchQuery,
    selectedShelter,
    userLocation,
    filters,
    showFilters,
    activeFilterCount: getActiveFilterCount(),
    handleSearch,
    handleFilterChange,
    toggleFacilityFilter,
    setShowFilters,
    handleShelterClick,
    handleGetDirections,
  };
};

export default useFindSheltersLogic;
