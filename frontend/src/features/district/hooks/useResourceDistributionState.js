// useResourceDistributionState Hook
// Manages state for District ResourceDistribution component
import { useState, useEffect } from 'react';
import { districtApi } from '../services';
import { useNotification } from '@shared/hooks';

const useResourceDistributionState = () => {
  const [activeRoute, setActiveRoute] = useState('resources');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isAllocateFormOpen, setIsAllocateFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
  // Data states
  const [resources, setResources] = useState([]);
  const [resourceStats, setResourceStats] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch resources, stats, and shelters
  const fetchResourceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resourcesData, statsData, sheltersData] = await Promise.all([
        districtApi.getAllResources(),
        districtApi.getResourceStats(),
        districtApi.getSheltersForAllocation(),
      ]);
      
      setResources(resourcesData);
      setResourceStats(statsData);
      setShelters(sheltersData);
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceData();
  }, []);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  // Open allocate form for a resource
  const handleOpenAllocateForm = (resource) => {
    setSelectedResource(resource);
    setIsAllocateFormOpen(true);
  };

  // Handle resource allocation to shelter
  const handleAllocateResource = async (allocationData) => {
    try {
      await districtApi.allocateResourceToShelter(allocationData.resourceId, {
        shelterId: allocationData.shelterId,
        quantity: allocationData.quantity,
        notes: allocationData.notes
      });
      notification.success(`Successfully allocated ${allocationData.quantity} units to shelter`);
      setIsAllocateFormOpen(false);
      setSelectedResource(null);
      
      // Refresh data
      await fetchResourceData();
    } catch (err) {
      notification.error(err.message);
    }
  };

  return {
    activeRoute,
    setActiveRoute,
    selectedFilter,
    setSelectedFilter,
    demoModal,
    setDemoModal,
    isAllocateFormOpen,
    setIsAllocateFormOpen,
    selectedResource,
    setSelectedResource,
    showDemo,
    handleOpenAllocateForm,
    handleAllocateResource,
    // Data
    resources,
    resourceStats,
    shelters,
    loading,
    error,
    refetch: fetchResourceData,
  };
};

export default useResourceDistributionState;
