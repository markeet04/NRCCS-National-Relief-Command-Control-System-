import { useState, useMemo, useCallback, useEffect } from 'react';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useBadge } from '@shared/contexts/BadgeContext';
import NdmaApiService from '@shared/services/NdmaApiService';
import {
  PROVINCE_STATUS_DATA,
  CRITICAL_AREAS,
  SHELTER_CAPACITY,
  FLOOD_RISK_LEVELS,
  STATUS_COLORS,
  MAP_LAYERS,
  MAP_TYPE_OPTIONS,
} from '../constants';

/**
 * useFloodMapLogic Hook
 * Manages all business logic for the NDMA Flood Map page
 * Fetches real data from backend API
 */
export const useFloodMapLogic = () => {
  // Get badge counts from context for global visibility
  const { activeStatusCount, provincialRequestsCount } = useBadge();

  // Data state - initialized with fallback mock data
  const [provinces, setProvinces] = useState(PROVINCE_STATUS_DATA);
  const [criticalAreas, setCriticalAreas] = useState(CRITICAL_AREAS);
  const [shelterCapacity, setShelterCapacity] = useState(SHELTER_CAPACITY);
  const [floodZones, setFloodZones] = useState([]);

  // Map state
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [activeLayers, setActiveLayers] = useState(
    MAP_LAYERS.filter(l => l.enabled).map(l => l.id)
  );
  const [mapView, setMapView] = useState('satellite');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extra maps for custom user sections
  const [extraMaps, setExtraMaps] = useState([]);

  // Default map options
  const defaultMaps = useMemo(() => MAP_TYPE_OPTIONS || [
    { name: 'satellite', label: 'Satellite View' },
    { name: 'terrain', label: 'Terrain View' },
    { name: 'flood-risk', label: 'Flood Risk Map' },
  ], []);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch flood map data from backend API
   */
  const fetchFloodMapData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch map data, flood zones, shelters, and province data in parallel
      const [mapData, floodZonesData, shelterStats, provinceData] = await Promise.all([
        NdmaApiService.getMapData(),
        NdmaApiService.getFloodZones(),
        NdmaApiService.getShelterStats(),
        NdmaApiService.getMapProvinceData()
      ]);

      console.log('🗺️ Flood map data loaded:', { mapData, floodZonesData, shelterStats, provinceData });

      // Update flood zones
      if (Array.isArray(floodZonesData)) {
        setFloodZones(floodZonesData);

        // Transform flood zones to critical areas format
        const criticalFromBackend = floodZonesData
          .filter(zone => zone.riskLevel === 'critical' || zone.riskLevel === 'high')
          .map(zone => ({
            id: zone.id,
            name: zone.name,
            type: 'district',
            status: zone.riskLevel === 'critical' ? 'critical' : 'warning',
            waterLevel: 0,
            threshold: 0,
            location: zone.province || 'Unknown',
            coordinates: [0, 0],
            lastUpdated: 'Just now',
          }));

        if (criticalFromBackend.length > 0) {
          setCriticalAreas(criticalFromBackend);
        }
      }

      // Update province data
      if (Array.isArray(provinceData)) {
        const provinceStatus = provinceData.map(p => ({
          id: p.code?.toLowerCase() || p.name?.toLowerCase().replace(/\s+/g, '-'),
          name: p.name,
          status: p.overallRisk === 'critical' ? 'critical' : p.overallRisk === 'high' ? 'warning' : 'normal',
          waterLevel: 0,
          floodRisk: p.overallRisk || 'low',
          affectedDistricts: p.criticalDistricts + p.highRiskDistricts,
          evacuated: 0,
          coordinates: [30, 70], // Default Pakistan center
        }));

        if (provinceStatus.length > 0) {
          setProvinces(provinceStatus);
        }
      }

      // Update shelter capacity from stats
      if (shelterStats) {
        setShelterCapacity([{
          province: 'National',
          total: shelterStats.totalShelters || 0,
          occupied: Math.round((shelterStats.currentOccupancy / shelterStats.totalCapacity) * shelterStats.totalShelters) || 0,
          capacity: shelterStats.totalCapacity || 0,
        }]);
      }

    } catch (err) {
      console.error('❌ Error fetching flood map data:', err);
      setError('Failed to load flood map data');
      // Keep using fallback mock data
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchFloodMapData();
  }, [fetchFloodMapData]);

  /**
   * Calculate flood statistics
   */
  const floodStats = useMemo(() => ({
    totalAffectedDistricts: provinces.reduce((acc, p) => acc + (p.affectedDistricts || 0), 0),
    totalEvacuated: provinces.reduce((acc, p) => acc + (p.evacuated || 0), 0),
    criticalAreasCount: criticalAreas.filter(a => a.status === 'critical').length,
    warningAreasCount: criticalAreas.filter(a => a.status === 'warning').length,
    shelterOccupancy: Math.round(
      (shelterCapacity.reduce((acc, s) => acc + (s.occupied || 0), 0) /
        shelterCapacity.reduce((acc, s) => acc + (s.total || 1), 0)) * 100
    ),
    totalShelterCapacity: shelterCapacity.reduce((acc, s) => acc + (s.capacity || 0), 0),
  }), [provinces, criticalAreas, shelterCapacity]);

  /**
   * Get provinces by status
   */
  const provincesByStatus = useMemo(() => ({
    critical: provinces.filter(p => p.status === 'critical'),
    warning: provinces.filter(p => p.status === 'warning'),
    normal: provinces.filter(p => p.status === 'normal'),
  }), [provinces]);

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
    const province = provinces.find(p => p.id === provinceId);
    setSelectedProvince(province || null);
  }, [provinces]);

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
   * Open modal
   */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Close modal
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * Delete a custom map section
   */
  const handleDeleteMapSection = useCallback((mapId) => {
    setExtraMaps(prev => prev.filter(map => map.id !== mapId));
  }, []);

  /**
   * Add a custom map section
   */
  const handleAddMapSection = useCallback((mapName) => {
    const newMap = {
      id: `custom-${Date.now()}`,
      name: mapName,
    };
    setExtraMaps(prev => [...prev, newMap]);
  }, []);

  /**
   * Change map view type
   */
  const handleMapTypeChange = useCallback((type) => {
    setMapView(type);
    closeModal();
  }, [closeModal]);

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

  // Menu items for NDMA role - uses context badge counts for consistency across all pages
  const menuItems = useMemo(() => getMenuItemsByRole('ndma', activeStatusCount, provincialRequestsCount), [activeStatusCount, provincialRequestsCount]);
  const roleConfig = ROLE_CONFIG.ndma;

  return {
    // State
    selectedProvince,
    mapView,
    searchTerm,
    isModalOpen,
    extraMaps,
    loading,
    activeLayers,

    // Data
    provinces,
    criticalAreas,
    shelterCapacity,
    menuItems,
    defaultMaps,

    // Computed
    floodStats,
    provincesByStatus,
    roleConfig,

    // Actions
    setSelectedProvince,
    setMapView,
    setSearchTerm,
    openModal,
    closeModal,
    handleDeleteMapSection,
    handleAddMapSection,
    handleSelectProvince,
    clearProvinceSelection,
    toggleLayer,
    isLayerActive,
    handleMapTypeChange,
    refreshData,
    getShelterInfo,
    getCriticalAreasForProvince,
    getStatusColor,
    getFloodRiskConfig,
  };
};

export default useFloodMapLogic;
