import { useState, useMemo, useCallback } from 'react';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { NotificationService } from '@services/NotificationService';
import { 
  INITIAL_NATIONAL_STOCK, 
  INITIAL_PROVINCIAL_ALLOCATIONS,
  RESOURCE_CATEGORIES,
  RESOURCE_STATUS_LEVELS,
} from '../constants';

/**
 * useResourcesLogic Hook
 * Manages all business logic for the NDMA Resources page
 */
export const useResourcesLogic = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data state
  const [nationalStock, setNationalStock] = useState(INITIAL_NATIONAL_STOCK);
  const [provincialAllocations, setProvincialAllocations] = useState(INITIAL_PROVINCIAL_ALLOCATIONS);
  
  // Modal state
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [allocationForm, setAllocationForm] = useState({
    food: 0,
    medical: 0,
    shelter: 0,
    water: 0,
  });
  
  // Loading state
  const [loading, setLoading] = useState(false);

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

  // Menu items for NDMA role
  const menuItems = useMemo(() => getMenuItemsByRole('ndma', 0), []);
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
  };
};

export default useResourcesLogic;
