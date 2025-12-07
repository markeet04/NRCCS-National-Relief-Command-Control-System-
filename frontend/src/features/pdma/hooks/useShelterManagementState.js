// useShelterManagementState Hook
// Manages state for ShelterManagement component
import { useState } from 'react';
import { SHELTER_MANAGEMENT_DATA } from '../constants';

const useShelterManagementState = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isShelterFormOpen, setIsShelterFormOpen] = useState(false);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const handleShelterFormSubmit = (formData) => {
    setDemoModal({
      isOpen: true,
      title: 'Shelter Registered Successfully',
      message: `"${formData.name}" in ${formData.location} with capacity of ${formData.capacity} has been registered and added to the shelter registry.`,
      type: 'success'
    });
    setIsShelterFormOpen(false);
  };

  const filteredShelters = SHELTER_MANAGEMENT_DATA.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCapacity = SHELTER_MANAGEMENT_DATA.reduce((sum, s) => sum + s.maxCapacity, 0);
  const totalOccupancy = SHELTER_MANAGEMENT_DATA.reduce((sum, s) => sum + s.capacity, 0);

  return {
    activeRoute,
    setActiveRoute,
    searchQuery,
    setSearchQuery,
    selectedShelter,
    setSelectedShelter,
    demoModal,
    setDemoModal,
    isShelterFormOpen,
    setIsShelterFormOpen,
    showDemo,
    handleShelterFormSubmit,
    shelters: SHELTER_MANAGEMENT_DATA,
    filteredShelters,
    totalCapacity,
    totalOccupancy
  };
};

export default useShelterManagementState;
