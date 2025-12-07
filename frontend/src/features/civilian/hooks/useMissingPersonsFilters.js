import { useState, useEffect } from 'react';
import { INITIAL_MISSING_PERSON_FILTERS } from '../constants';

const useMissingPersonsFilters = (missingPersons, searchQuery) => {
  const [filters, setFilters] = useState(INITIAL_MISSING_PERSON_FILTERS);
  const [filteredPersons, setFilteredPersons] = useState([]);

  useEffect(() => {
    let filtered = [...missingPersons];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (person) =>
          person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.lastSeen.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender !== 'all') {
      filtered = filtered.filter((person) => person.gender === filters.gender);
    }

    // Age range filter
    if (filters.ageRange !== 'all') {
      const [min, max] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter((person) => {
        if (max) {
          return person.age >= min && person.age <= max;
        } else {
          return person.age >= min;
        }
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((person) => person.status === filters.status);
    }

    setFilteredPersons(filtered);
  }, [searchQuery, filters, missingPersons]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    filteredPersons,
    handleFilterChange,
  };
};

export default useMissingPersonsFilters;
