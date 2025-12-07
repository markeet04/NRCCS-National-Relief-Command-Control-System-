import { useState, useEffect } from 'react';
import { INITIAL_SHELTER_FILTERS } from '../constants';

const useShelterFilters = (shelters, searchQuery) => {
  const [filters, setFilters] = useState(INITIAL_SHELTER_FILTERS);
  const [filteredShelters, setFilteredShelters] = useState([]);

  useEffect(() => {
    let filtered = [...shelters];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (shelter) =>
          shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Distance filter
    filtered = filtered.filter((shelter) => shelter.distance <= filters.maxDistance);

    // Capacity filter
    filtered = filtered.filter((shelter) => shelter.capacity.available >= filters.minCapacity);

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((shelter) => shelter.status === filters.status);
    }

    // Facilities filter
    if (filters.facilities.length > 0) {
      filtered = filtered.filter((shelter) =>
        filters.facilities.every((f) => shelter.facilities.includes(f))
      );
    }

    setFilteredShelters(filtered);
  }, [searchQuery, filters, shelters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFacilityFilter = (facility) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    count += filters.facilities.length;
    return count;
  };

  return {
    filters,
    filteredShelters,
    handleFilterChange,
    toggleFacilityFilter,
    getActiveFilterCount,
  };
};

export default useShelterFilters;
