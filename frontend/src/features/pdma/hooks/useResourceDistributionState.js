// useResourceDistributionState Hook
// Manages state for ResourceDistribution component
import { useState, useEffect, useCallback } from 'react';
import { pdmaApi } from '../services';
import { useNotification } from '@shared/hooks';

const useResourceDistributionState = () => {
  const [activeRoute, setActiveRoute] = useState('resources');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [isShelterFormOpen, setIsShelterFormOpen] = useState(false);
  const [isAllocateFormOpen, setIsAllocateFormOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Data states
  const [resources, setResources] = useState([]);
  const [resourceStats, setResourceStats] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [districtResources, setDistrictResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch resources, stats, and districts
  const fetchResourceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [resourcesData, statsData, districtsData, logsData] = await Promise.all([
        pdmaApi.getAllResources(),
        pdmaApi.getResourceStats(),
        pdmaApi.getDistricts(),
        pdmaApi.getActivityLogs(100), // Fetch more logs for history
      ]);

      setResources(resourcesData);
      setResourceStats(statsData);
      setDistricts(districtsData);
      setActivityLogs(logsData || []);
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [notification]);

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

  // Handle resource allocation
  const handleAllocateResource = async (allocationData) => {
    try {
      console.log('🚀 Attempting to allocate resource:', allocationData);
      
      // Ensure resourceType is set from the allocationData
      const resourceType = allocationData.resourceType || 
                          selectedResource?.type || 
                          selectedResource?.resourceType || 
                          selectedResource?.category ||
                          selectedResource?.name?.toLowerCase();
      
      if (!resourceType) {
        notification.error('Unable to determine resource type');
        console.error('❌ No resource type found in:', { allocationData, selectedResource });
        return;
      }
      
      // Use allocateResourceByType which auto-creates province resources if needed
      await pdmaApi.allocateResourceByType({
        resourceType: resourceType,
        districtId: allocationData.districtId,
        quantity: allocationData.quantity,
        purpose: allocationData.purpose || allocationData.notes
      });
      notification.success(`Successfully allocated ${allocationData.quantity} units`);
      setIsAllocateFormOpen(false);
      setSelectedResource(null);

      // Refresh data
      await fetchResourceData();
    } catch (err) {
      console.error('❌ Allocation error:', err);
      console.error('❌ Error response:', err.response?.data);
      notification.error(err.response?.data?.message || 'Failed to allocate resource');
    }
  };

  const handleResourceFormSubmit = async (formData) => {
    try {
      await pdmaApi.createResource(formData);
      notification.success(`Resource "${formData.name}" added successfully`);
      setIsResourceFormOpen(false);

      // Refresh data
      await fetchResourceData();
    } catch (err) {
      notification.error(err.message);
    }
  };

  const handleShelterFormSubmit = async (formData) => {
    try {
      await pdmaApi.createShelter(formData);
      notification.success(`Shelter "${formData.name}" registered successfully`);
      setIsShelterFormOpen(false);
    } catch (err) {
      notification.error(err.message);
    }
  };

  // Handle requesting resources from NDMA
  const handleRequestFromNdma = async (requestData) => {
    try {
      setRequestLoading(true);
      await pdmaApi.createResourceRequest(requestData);
      notification.success('Resource request submitted to NDMA successfully');
      setIsRequestModalOpen(false);
    } catch (err) {
      notification.error(err.message || 'Failed to submit request');
    } finally {
      setRequestLoading(false);
    }
  };

  return {
    activeRoute,
    setActiveRoute,
    selectedFilter,
    setSelectedFilter,
    demoModal,
    setDemoModal,
    isResourceFormOpen,
    setIsResourceFormOpen,
    isShelterFormOpen,
    setIsShelterFormOpen,
    isAllocateFormOpen,
    setIsAllocateFormOpen,
    selectedResource,
    setSelectedResource,
    showDemo,
    handleResourceFormSubmit,
    handleShelterFormSubmit,
    handleOpenAllocateForm,
    handleAllocateResource,
    // Data
    resources,
    resourceStats,
    districts,
    activityLogs,
    loading,
    error,
    // Refresh function
    refreshData: fetchResourceData,
    // Request from NDMA
    isRequestModalOpen,
    setIsRequestModalOpen,
    requestLoading,
    handleRequestFromNdma,
  };
};

export default useResourceDistributionState;

