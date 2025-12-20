import { useState, useMemo, useCallback } from 'react';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { 
  PROVINCE_STATUS_DATA, 
  CRITICAL_AREAS, 
  SHELTER_CAPACITY,
  FLOOD_RISK_LEVELS,
  STATUS_COLORS,
  MAP_LAYERS,
} from '../constants';

/**
 * useFloodMapLogic Hook
 * Manages all business logic for the NDMA Flood Map page
 */
export const useFloodMapLogic = () => {
  // Data state
  const [provinceStatus, setProvinceStatus] = useState(PROVINCE_STATUS_DATA);
  const [criticalAreas, setCriticalAreas] = useState(CRITICAL_AREAS);
  const [shelterCapacity, setShelterCapacity] = useState(SHELTER_CAPACITY);
  
  // Map state
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [activeLayers, setActiveLayers] = useState(
    MAP_LAYERS.filter(l => l.enabled).map(l => l.id)
  );
  const [mapType, setMapType] = useState('satellite');
  
  // Modal state
  const [isMapTypeModalOpen, setIsMapTypeModalOpen] = useState(false);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  /**
   * Calculate flood statistics
   */
  const floodStats = useMemo(() => ({
    totalAffectedDistricts: provinceStatus.reduce((acc, p) => acc + p.affectedDistricts, 0),
    totalEvacuated: provinceStatus.reduce((acc, p) => acc + p.evacuated, 0),
    criticalAreasCount: criticalAreas.filter(a => a.status === 'critical').length,
    warningAreasCount: criticalAreas.filter(a => a.status === 'warning').length,
    shelterOccupancy: Math.round(
      (shelterCapacity.reduce((acc, s) => acc + s.occupied, 0) /
      shelterCapacity.reduce((acc, s) => acc + s.total, 0)) * 100
    ),
    totalShelterCapacity: shelterCapacity.reduce((acc, s) => acc + s.capacity, 0),
  }), [provinceStatus, criticalAreas, shelterCapacity]);

  /**
   * Get provinces by status
   */
  const provincesByStatus = useMemo(() => ({
    critical: provinceStatus.filter(p => p.status === 'critical'),
    warning: provinceStatus.filter(p => p.status === 'warning'),
    normal: provinceStatus.filter(p => p.status === 'normal'),
  }), [provinceStatus]);

  /**
   * Get color config for status
   */
  const getStatusColor = useCallback((status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.normal;
  }, []);

  /**
   * Get flood risk config
   */
  const getFloodRiskConfig = useCallback((risk) => {
    return FLOOD_RISK_LEVELS[risk] || FLOOD_RISK_LEVELS.low;
  }, []);

  /**
   * Select a province on the map
   */
  const handleSelectProvince = useCallback((provinceId) => {
    const province = provinceStatus.find(p => p.id === provinceId);
    setSelectedProvince(province || null);
  }, [provinceStatus]);

  /**
   * Clear province selection
   */
  const clearProvinceSelection = useCallback(() => {
    setSelectedProvince(null);
  }, []);

  /**
   * Toggle map layer
   */
  const toggleLayer = useCallback((layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId)
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  }, []);

  /**
   * Check if layer is active
   */
  const isLayerActive = useCallback((layerId) => {
    return activeLayers.includes(layerId);
  }, [activeLayers]);

  /**
   * Open map type modal
   */
  const openMapTypeModal = useCallback(() => {
    setIsMapTypeModalOpen(true);
  }, []);

  /**
   * Close map type modal
   */
  const closeMapTypeModal = useCallback(() => {
    setIsMapTypeModalOpen(false);
  }, []);

  /**
   * Change map type
   */
  const handleMapTypeChange = useCallback((type) => {
    setMapType(type);
    closeMapTypeModal();
  }, [closeMapTypeModal]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual service calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, fetch fresh data from APIs
      // const newProvinceStatus = await FloodService.getProvinceStatus();
      // setProvinceStatus(newProvinceStatus);
      
    } catch (err) {
      console.error('Error refreshing flood data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get shelter info for a province
   */
  const getShelterInfo = useCallback((provinceName) => {
    return shelterCapacity.find(s => s.province === provinceName) || null;
  }, [shelterCapacity]);

  /**
   * Get critical areas for a province
   */
  const getCriticalAreasForProvince = useCallback((location) => {
    return criticalAreas.filter(a => a.location === location);
  }, [criticalAreas]);

  // Menu items for NDMA role
  const menuItems = useMemo(() => getMenuItemsByRole('ndma', 0), []);
  const roleConfig = ROLE_CONFIG.ndma;

  return {
    // State
    provinceStatus,
    criticalAreas,
    shelterCapacity,
    selectedProvince,
    activeLayers,
    mapType,
    isMapTypeModalOpen,
    loading,
    
    // Computed
    floodStats,
    provincesByStatus,
    menuItems,
    roleConfig,
    
    // Actions
    handleSelectProvince,
    clearProvinceSelection,
    toggleLayer,
    isLayerActive,
    openMapTypeModal,
    closeMapTypeModal,
    handleMapTypeChange,
    refreshData,
    getShelterInfo,
    getCriticalAreasForProvince,
    getStatusColor,
    getFloodRiskConfig,
  };
};

export default useFloodMapLogic;
