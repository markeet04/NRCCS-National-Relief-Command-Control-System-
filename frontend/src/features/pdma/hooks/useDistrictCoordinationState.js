// useDistrictCoordinationState Hook
// Manages state for DistrictCoordination component
import { useState } from 'react';
import { DISTRICT_COORDINATION_DISTRICTS } from '../constants';

const useDistrictCoordinationState = () => {
  const [activeRoute, setActiveRoute] = useState('districts');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const filteredDistricts = DISTRICT_COORDINATION_DISTRICTS.filter(district =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    activeRoute,
    setActiveRoute,
    selectedDistrict,
    setSelectedDistrict,
    searchQuery,
    setSearchQuery,
    demoModal,
    setDemoModal,
    showDemo,
    filteredDistricts
  };
};

export default useDistrictCoordinationState;
