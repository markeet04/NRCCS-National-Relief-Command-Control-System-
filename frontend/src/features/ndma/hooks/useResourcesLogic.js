import { useState, useMemo, useCallback, useEffect } from 'react';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useBadge } from '@shared/contexts/BadgeContext';
import { NotificationService } from '@services/NotificationService';
import NdmaApiService from '@shared/services/NdmaApiService';
import {
  INITIAL_NATIONAL_STOCK,
  INITIAL_PROVINCIAL_ALLOCATIONS,
  RESOURCE_CATEGORIES,
  RESOURCE_STATUS_LEVELS,
} from '../constants';

/**
 * Initial mock data for provincial requests - fallback only
 * Real data fetched from backend via NdmaApiService.getResourceRequests()
 */
const INITIAL_PROVINCIAL_REQUESTS = [];

/**
 * Initial allocation history by province
 */
const INITIAL_ALLOCATION_HISTORY = {
  'Punjab': [
    { date: '2025-01-10', items: [{ name: 'Food Supplies', quantity: 3000 }, { name: 'Water', quantity: 8000 }], status: 'approved', approvedBy: 'NDMA Admin' },
    { date: '2025-01-05', items: [{ name: 'Medical Kits', quantity: 150 }, { name: 'Shelter Tents', quantity: 50 }], status: 'approved', approvedBy: 'NDMA Admin' },
    { date: '2024-12-28', items: [{ name: 'Blankets', quantity: 1000 }, { name: 'Food Supplies', quantity: 2000 }], status: 'approved', approvedBy: 'NDMA Admin' },
  ],
  'Sindh': [
    { date: '2025-01-08', items: [{ name: 'Shelter Tents', quantity: 100 }, { name: 'Water', quantity: 5000 }], status: 'approved', approvedBy: 'NDMA Admin' },
    { date: '2025-01-01', items: [{ name: 'Food Supplies', quantity: 4000 }], status: 'approved', approvedBy: 'NDMA Admin' },
  ],
  'KPK': [
    { date: '2025-01-07', items: [{ name: 'Medical Kits', quantity: 200 }, { name: 'Emergency Medicine', quantity: 50 }], status: 'approved', approvedBy: 'NDMA Admin' },
  ],
  'Balochistan': [
    { date: '2025-01-03', items: [{ name: 'Water', quantity: 3000 }, { name: 'Food Supplies', quantity: 1500 }], status: 'approved', approvedBy: 'NDMA Admin' },
  ],
  'Gilgit Baltistan': [],
  'AJK': [],
};

/**
 * useResourcesLogic Hook
 * Manages all business logic for the NDMA Resources page
 * Fetches real data from backend API
 */
export const useResourcesLogic = () => {
  // Tab state - default to 'national' (removed 'overview')
  const [activeTab, setActiveTab] = useState('national');

  // Data state - initialized with fallback mock data
  const [nationalStock, setNationalStock] = useState(INITIAL_NATIONAL_STOCK);
  const [provincialAllocations, setProvincialAllocations] = useState([]);
  const [backendResourceStats, setBackendResourceStats] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [nationalResourcesList, setNationalResourcesList] = useState([]);

  // Provincial Requests state
  const [provincialRequests, setProvincialRequests] = useState(INITIAL_PROVINCIAL_REQUESTS);
  const [allocationHistory, setAllocationHistory] = useState(INITIAL_ALLOCATION_HISTORY);

  // Modal state
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [allocationForm, setAllocationForm] = useState({
    food: 0,
    medical: 0,
    shelter: 0,
    water: 0,
  });

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch resources data from backend API
   */
  const fetchResourcesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch resource stats and resources by province in parallel
      const [resourceStats, resourcesByProvince, allResources, resourceRequests, provincesData, nationalResources] = await Promise.all([
        NdmaApiService.getResourceStats(),
        NdmaApiService.getResourcesByProvince(),
        NdmaApiService.getAllResources(),
        NdmaApiService.getResourceRequests().catch(() => []), // Graceful fallback
        NdmaApiService.getAllProvinces().catch(() => []),
        NdmaApiService.getNationalResources().catch(() => [])
      ]);

      console.log('📦 Resources data loaded:', { resourceStats, resourcesByProvince, allResources, resourceRequests, provincesData, nationalResources });

      // Store provinces and national resources
      setProvinces(provincesData || []);
      setNationalResourcesList(nationalResources || []);

      // Store backend resource stats
      setBackendResourceStats(resourceStats);

      // Transform resources by province to provincial allocations format
      if (Array.isArray(resourcesByProvince)) {
        const allocations = resourcesByProvince.map(item => ({
          province: item.province?.name || item.provinceName || 'Unknown',
          food: item.totalQuantity || 0,
          medical: 0,
          shelter: 0,
          water: 0,
          totalQuantity: item.totalQuantity || 0,
          totalAllocated: item.totalAllocated || 0,
          availableQuantity: item.availableQuantity || 0,
          status: item.availableQuantity > 1000 ? 'adequate' : item.availableQuantity > 500 ? 'moderate' : 'low',
          lastUpdated: new Date().toISOString(),
        }));
        setProvincialAllocations(allocations.length > 0 ? allocations : INITIAL_PROVINCIAL_ALLOCATIONS);
      }

      // Update national stock from backend stats - use byType array for proper aggregation
      if (resourceStats) {
        // Normalize database types to 4 standard categories
        const normalizeType = (type) => {
          const t = (type || 'other').toLowerCase();
          // Map various database types to standard 4 categories
          if (['water', 'drinking', 'purification'].some(k => t.includes(k))) return 'water';
          if (['food', 'supplies', 'essential'].some(k => t.includes(k))) return 'food';
          if (['medical', 'medicine', 'health', 'healthcare'].some(k => t.includes(k))) return 'medical';
          if (['shelter', 'housing', 'tent', 'blanket', 'clothing'].some(k => t.includes(k))) return 'shelter';
          // Default unrecognized types to food
          return 'food';
        };

        // Create aggregated map - sum all database types into 4 standard categories
        const typeMap = {
          food: { quantity: 0, allocated: 0 },
          medical: { quantity: 0, allocated: 0 },
          shelter: { quantity: 0, allocated: 0 },
          water: { quantity: 0, allocated: 0 },
        };

        if (resourceStats.byType && Array.isArray(resourceStats.byType)) {
          resourceStats.byType.forEach(item => {
            const normalizedType = normalizeType(item.type);
            typeMap[normalizedType].quantity += parseInt(item.quantity) || 0;
            typeMap[normalizedType].allocated += parseInt(item.allocated) || 0;
          });
        }

        console.log('📊 Normalized resource types from backend:', typeMap);

        setNationalStock({
          food: {
            available: typeMap.food.quantity,
            allocated: typeMap.food.allocated,
            unit: 'units'
          },
          medical: {
            available: typeMap.medical.quantity,
            allocated: typeMap.medical.allocated,
            unit: 'kits'
          },
          shelter: {
            available: typeMap.shelter.quantity,
            allocated: typeMap.shelter.allocated,
            unit: 'units'
          },
          water: {
            available: typeMap.water.quantity,
            allocated: typeMap.water.allocated,
            unit: 'liters'
          },
        });
      }

      // Update provincial requests from backend
      if (Array.isArray(resourceRequests) && resourceRequests.length > 0) {
        const transformedRequests = resourceRequests.map(req => ({
          id: req.id,
          province: req.province?.name || 'Unknown',
          requestDate: req.createdAt,
          status: req.status,
          priority: req.priority,
          items: req.requestedItems || [],
          reason: req.reason,
          requestedBy: req.requestedByName,
        }));
        setProvincialRequests(transformedRequests);
      }

    } catch (err) {
      console.error('❌ Error fetching resources:', err);
      setError('Failed to load resources data');
      // Keep using fallback mock data
      setProvincialAllocations(INITIAL_PROVINCIAL_ALLOCATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchResourcesData();
  }, [fetchResourcesData]);

  /**
   * Calculate resource statistics
   */
  const resourceStats = useMemo(() => ({
    totalResources: Object.values(nationalStock).reduce((acc, item) => acc + item.available, 0),
    totalAllocated: Object.values(nationalStock).reduce((acc, item) => acc + item.allocated, 0),
    totalAvailable: Object.values(nationalStock).reduce((acc, item) => acc + (item.available - item.allocated), 0),
    provincesCount: provincialAllocations.length,
    utilizationRate: Math.round(
      (Object.values(nationalStock).reduce((acc, item) => acc + item.allocated, 0) /
        Object.values(nationalStock).reduce((acc, item) => acc + item.available, 0)) * 100
    ),
  }), [nationalStock, provincialAllocations]);

  /**
   * Calculate resource by category
   */
  const resourcesByCategory = useMemo(() => {
    return RESOURCE_CATEGORIES.map(category => {
      const stock = nationalStock[category.id] || { available: 0, allocated: 0 };
      return {
        ...category,
        available: stock.available,
        allocated: stock.allocated,
        remaining: stock.available - stock.allocated,
        percentage: Math.round((stock.allocated / stock.available) * 100),
      };
    });
  }, [nationalStock]);

  /**
   * Get status for a province
   */
  const getProvinceStatus = useCallback((allocation) => {
    const totalAllocated = allocation.food + allocation.medical + allocation.shelter + allocation.water;
    const avgAllocation = totalAllocated / 4;

    if (avgAllocation >= 2000) return 'adequate';
    if (avgAllocation >= 1000) return 'moderate';
    if (avgAllocation >= 500) return 'low';
    return 'critical';
  }, []);

  /**
   * Open allocation modal for a province
   */
  const openAllocationModal = useCallback((province) => {
    const existingAllocation = provincialAllocations.find(p => p.province === province);
    setSelectedProvince(province);
    setAllocationForm({
      food: existingAllocation?.food || 0,
      medical: existingAllocation?.medical || 0,
      shelter: existingAllocation?.shelter || 0,
      water: existingAllocation?.water || 0,
    });
    setIsAllocationModalOpen(true);
  }, [provincialAllocations]);

  /**
   * Close allocation modal
   */
  const closeAllocationModal = useCallback(() => {
    setIsAllocationModalOpen(false);
    setSelectedProvince(null);
    setAllocationForm({ food: 0, medical: 0, shelter: 0, water: 0 });
  }, []);

  /**
   * Handle allocation form changes
   */
  const handleAllocationChange = useCallback((field, value) => {
    setAllocationForm(prev => ({
      ...prev,
      [field]: Math.max(0, parseInt(value) || 0),
    }));
  }, []);

  /**
   * Submit allocation
   */
  const handleSubmitAllocation = useCallback(async () => {
    if (!selectedProvince) return;

    try {
      setLoading(true);

      // Update provincial allocations
      setProvincialAllocations(prev => {
        const existingIndex = prev.findIndex(p => p.province === selectedProvince);
        const newAllocation = {
          province: selectedProvince,
          ...allocationForm,
          status: getProvinceStatus(allocationForm),
          lastUpdated: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newAllocation;
          return updated;
        }
        return [...prev, newAllocation];
      });

      // Update national stock (subtract allocated amounts)
      setNationalStock(prev => ({
        ...prev,
        food: { ...prev.food, allocated: prev.food.allocated + allocationForm.food },
        medical: { ...prev.medical, allocated: prev.medical.allocated + allocationForm.medical },
        shelter: { ...prev.shelter, allocated: prev.shelter.allocated + allocationForm.shelter },
        water: { ...prev.water, allocated: prev.water.allocated + allocationForm.water },
      }));

      NotificationService.showSuccess(`Resources allocated to ${selectedProvince} successfully`);
      closeAllocationModal();
    } catch (err) {
      console.error('Error allocating resources:', err);
      NotificationService.showError('Failed to allocate resources');
    } finally {
      setLoading(false);
    }
  }, [selectedProvince, allocationForm, getProvinceStatus, closeAllocationModal]);

  /**
   * Get status config for display
   */
  const getStatusConfig = useCallback((status) => {
    return RESOURCE_STATUS_LEVELS[status] || RESOURCE_STATUS_LEVELS.adequate;
  }, []);

  /**
   * Handle approving a provincial request - uses real backend
   */
  const handleApproveRequest = useCallback(async (requestId) => {
    const request = provincialRequests.find(r => r.id === requestId);
    if (!request) return;

    try {
      setLoading(true);

      // Call backend to approve
      await NdmaApiService.reviewResourceRequest(requestId, {
        status: 'approved',
        approvedItems: request.items,
        notes: 'Approved via NDMA dashboard'
      });

      // Update local state
      setProvincialRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
      );

      NotificationService.showSuccess(`Request from ${request.province} approved`);

      // Refresh data
      fetchResourcesData();
    } catch (err) {
      console.error('Error approving request:', err);
      NotificationService.showError('Failed to approve request');
    } finally {
      setLoading(false);
    }
  }, [provincialRequests, fetchResourcesData]);

  /**
   * Handle rejecting a provincial request - uses real backend
   */
  const handleRejectRequest = useCallback(async (requestId) => {
    const request = provincialRequests.find(r => r.id === requestId);
    if (!request) return;

    try {
      setLoading(true);

      // Call backend to reject
      await NdmaApiService.reviewResourceRequest(requestId, {
        status: 'rejected',
        notes: 'Rejected via NDMA dashboard'
      });

      // Update local state
      setProvincialRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
      );

      NotificationService.showInfo(`Request from ${request.province} rejected`);
    } catch (err) {
      console.error('Error rejecting request:', err);
      NotificationService.showError('Failed to reject request');
    } finally {
      setLoading(false);
    }
  }, [provincialRequests]);

  // Get badge counts from context for global visibility
  const { activeStatusCount, provincialRequestsCount, updateProvincialRequestsCount } = useBadge();

  // Calculate and update pending provincial requests count
  useEffect(() => {
    const pendingCount = provincialRequests.filter(req => req.status === 'pending').length;
    updateProvincialRequestsCount(pendingCount);
  }, [provincialRequests, updateProvincialRequestsCount]);

  // Menu items for NDMA role - uses context badge counts for consistency across all pages
  const menuItems = useMemo(() => getMenuItemsByRole('ndma', activeStatusCount, provincialRequestsCount), [activeStatusCount, provincialRequestsCount]);
  const roleConfig = ROLE_CONFIG.ndma;

  return {
    // State
    activeTab,
    nationalStock,
    provincialAllocations,
    isAllocationModalOpen,
    selectedProvince,
    allocationForm,
    loading,
    provincialRequests,
    allocationHistory,
    provinces,
    nationalResourcesList,

    // Computed
    resourceStats,
    resourcesByCategory,
    menuItems,
    roleConfig,

    // Actions
    setActiveTab,
    openAllocationModal,
    closeAllocationModal,
    handleAllocationChange,
    handleSubmitAllocation,
    getProvinceStatus,
    getStatusConfig,
    handleApproveRequest,
    handleRejectRequest,
    refetchData: fetchResourcesData,
  };
};

export default useResourcesLogic;
