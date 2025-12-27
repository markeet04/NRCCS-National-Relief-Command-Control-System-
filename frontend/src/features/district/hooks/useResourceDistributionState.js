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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Data states
  const [resources, setResources] = useState([]);
  const [resourceStats, setResourceStats] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [fullShelters, setFullShelters] = useState([]); // Full shelter data with supplies
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch resources, stats, shelters, and activity logs
  const fetchResourceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resourcesData, statsData, sheltersData, fullSheltersData, logsData] = await Promise.all([
        districtApi.getAllResources(),
        districtApi.getResourceStats(),
        districtApi.getSheltersForAllocation(),
        districtApi.getAllShelters(), // Full shelter data with supplies
        districtApi.getActivityLogs(50), // Get recent activity logs
      ]);

      setResources(resourcesData);
      setResourceStats(statsData);
      setShelters(sheltersData);
      setFullShelters(fullSheltersData);
      setActivityLogs(logsData);
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

  // Handle resource allocation by type (4-level hierarchy)
  // Auto-creates resources if they don't exist
  const handleAllocateByType = async (allocationData) => {
    try {
      const result = await districtApi.allocateResourceByType({
        resourceType: allocationData.resourceType,
        shelterId: allocationData.shelterId,
        quantity: allocationData.quantity,
        purpose: allocationData.purpose || allocationData.notes,
        notes: allocationData.notes
      });
      notification.success(result.message || `Successfully allocated ${allocationData.quantity} ${allocationData.resourceType} to shelter`);
      setIsAllocateFormOpen(false);
      setSelectedResource(null);

      // Refresh data
      await fetchResourceData();
      return result;
    } catch (err) {
      notification.error(err.message);
      throw err;
    }
  };

  // Handle requesting resources from PDMA
  const handleRequestFromPdma = async (requestData) => {
    try {
      setRequestLoading(true);
      await districtApi.createResourceRequest(requestData);
      notification.success('Resource request submitted to PDMA successfully');
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
    isAllocateFormOpen,
    setIsAllocateFormOpen,
    selectedResource,
    setSelectedResource,
    showDemo,
    handleOpenAllocateForm,
    handleAllocateResource,
    allocateToShelter: handleAllocateResource, // Alias for backward compatibility
    handleAllocateByType,
    // Data
    resources,
    resourceStats,
    shelters,
    fullShelters, // Full shelter data with supplies
    activityLogs, // Activity logs from backend
    loading,
    error,
    refetch: fetchResourceData,
    // Request from PDMA
    isRequestModalOpen,
    setIsRequestModalOpen,
    requestLoading,
    handleRequestFromPdma,
  };
};

export default useResourceDistributionState;
