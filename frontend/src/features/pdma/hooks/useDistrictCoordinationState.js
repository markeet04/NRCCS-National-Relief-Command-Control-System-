// useDistrictCoordinationState Hook
// Manages state for DistrictCoordination component
import { useState, useEffect } from 'react';
import { pdmaApi } from '../services';
import { useNotification } from '@shared/hooks';

const useDistrictCoordinationState = () => {
  const [activeRoute, setActiveRoute] = useState('districts');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  
  // Data states
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch districts
  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pdmaApi.getAllDistricts();
      setDistricts(data);
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const filteredDistricts = districts.filter(district =>
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
    filteredDistricts,
    districts,
    loading,
    error,
  };
};

export default useDistrictCoordinationState;
