// useShelterManagementState Hook
// Manages state for ShelterManagement component
import { useState, useEffect } from 'react';
import { pdmaApi } from '../services';
import { useNotification } from '@shared/hooks';

const useShelterManagementState = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isShelterFormOpen, setIsShelterFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  
  // Data states
  const [shelters, setShelters] = useState([]);
  const [shelterStats, setShelterStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch shelters and stats
  const fetchShelterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [sheltersData, statsData] = await Promise.all([
        pdmaApi.getAllShelters(),
        pdmaApi.getShelterStats(),
      ]);
      
      setShelters(sheltersData);
      setShelterStats(statsData);
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelterData();
  }, []);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const handleShelterFormSubmit = async (formData) => {
    try {
      await pdmaApi.createShelter(formData);
      notification.success(`Shelter "${formData.name}" registered successfully`);
      setIsShelterFormOpen(false);
      
      // Refresh data
      await fetchShelterData();
    } catch (err) {
      notification.error(err.message);
    }
  };

  // Open edit form for a shelter
  const handleOpenEditForm = (shelterId) => {
    const shelter = shelters.find(s => s.id === shelterId);
    if (shelter) {
      setEditingShelter(shelter);
      setIsEditFormOpen(true);
    }
  };

  // Handle shelter update
  const handleShelterUpdate = async (formData) => {
    try {
      await pdmaApi.updateShelter(formData.id, formData);
      notification.success(`Shelter "${formData.name}" updated successfully`);
      setIsEditFormOpen(false);
      setEditingShelter(null);
      
      // Refresh data
      await fetchShelterData();
    } catch (err) {
      notification.error(err.message);
    }
  };

  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shelter.address && shelter.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCapacity = shelterStats?.totalCapacity || 0;
  const totalOccupancy = shelterStats?.currentOccupancy || 0;

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
    isEditFormOpen,
    setIsEditFormOpen,
    editingShelter,
    showDemo,
    handleShelterFormSubmit,
    handleOpenEditForm,
    handleShelterUpdate,
    shelters,
    filteredShelters,
    totalCapacity,
    totalOccupancy,
    loading,
    error,
  };
};

export default useShelterManagementState;
