import { useState, useMemo, useCallback, useEffect } from 'react';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useBadge } from '@shared/contexts/BadgeContext';
import NdmaApiService from '@shared/services/ndmaApiService.js';
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
 * Includes ML flood prediction with simulation mode
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

  // ==================== ML SIMULATION STATE (NDMA-ONLY) ====================
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState('normal');
  const [simulationScenarios, setSimulationScenarios] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [lastPredictionTime, setLastPredictionTime] = useState(null);
  const [liveWeatherData, setLiveWeatherData] = useState(null);

  // ==================== WEATHER API CONFIGURATION ====================
  const PROVINCE_COORDS = {
    1: { lat: 31.17, lon: 72.70, name: 'Punjab' },
    2: { lat: 25.89, lon: 68.52, name: 'Sindh' },
    3: { lat: 34.01, lon: 71.52, name: 'KPK' },
    4: { lat: 28.49, lon: 65.09, name: 'Balochistan' },
    5: { lat: 35.80, lon: 74.98, name: 'Gilgit-Baltistan' },
    6: { lat: 33.93, lon: 73.78, name: 'Azad Kashmir' },
  };

  /**
   * Fetch real weather data from Open-Meteo API for LIVE mode
   * @param {number} provinceId - Province ID (1-6)
   * @returns {Promise<Object>} Weather data with rainfall, temp, humidity
   */
  const fetchWeatherForProvince = useCallback(async (provinceId) => {
    const coords = PROVINCE_COORDS[provinceId] || PROVINCE_COORDS[1];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=precipitation&past_days=2&forecast_days=1&timezone=auto`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather API error');
      const data = await response.json();

      // Calculate 24h and 48h rainfall from hourly data
      const hourlyPrecip = data.hourly?.precipitation || [];
      const rainfall_24h = hourlyPrecip.slice(-24).reduce((a, b) => a + (b || 0), 0);
      const rainfall_48h = hourlyPrecip.slice(-48).reduce((a, b) => a + (b || 0), 0);

      const weatherData = {
        rainfall_24h: Math.round(rainfall_24h * 10) / 10,
        rainfall_48h: Math.round(rainfall_48h * 10) / 10,
        temperature: data.current?.temperature_2m || 28,
        humidity: data.current?.relative_humidity_2m || 70,
        provinceName: coords.name,
        fetchedAt: new Date().toISOString(),
      };

      console.log(`🌤️ Real weather data for ${coords.name}:`, weatherData);
      setLiveWeatherData(weatherData);
      return weatherData;
    } catch (error) {
      console.warn('⚠️ Weather API failed, using defaults:', error.message);
      return {
        rainfall_24h: 5,
        rainfall_48h: 10,
        temperature: 28,
        humidity: 70,
        provinceName: coords.name,
        isDefault: true,
      };
    }
  }, []);

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
        const provinceStatus = provinceData.map(p => {
          // Determine waterLevel based on risk - LOW risk shows minimal water
          const riskToWaterLevel = {
            'critical': 95,
            'high': 78,
            'medium': 55,
            'low': 15, // Low water level for LOW risk
          };
          const waterLevel = riskToWaterLevel[p.overallRisk] || 15;

          return {
            id: p.code?.toLowerCase() || p.name?.toLowerCase().replace(/\s+/g, '-'),
            name: p.name,
            status: p.overallRisk === 'critical' ? 'critical' : p.overallRisk === 'high' ? 'warning' : 'normal',
            waterLevel,
            floodRisk: p.overallRisk || 'low',
            affectedDistricts: (p.criticalDistricts || 0) + (p.highRiskDistricts || 0),
            evacuated: p.overallRisk === 'critical' ? 25000 : p.overallRisk === 'high' ? 10000 : 0,
            coordinates: [30, 70], // Default Pakistan center
          };
        });

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
      NotificationService.showError('Failed to load flood map data. Please refresh the page.');
      setError('Failed to load flood map data');
      // Keep using fallback mock data
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch simulation scenarios from backend
   */
  const fetchSimulationScenarios = useCallback(async () => {
    try {
      const scenarios = await NdmaApiService.getSimulationScenarios();
      if (Array.isArray(scenarios)) {
        setSimulationScenarios(scenarios);
        console.log('📊 Simulation scenarios loaded:', scenarios);
      }
    } catch (err) {
      console.warn('⚠️ Could not load simulation scenarios:', err);
    }
  }, []);

  /**
   * Refresh weather for a specific province (without running ML prediction)
   * Updates liveWeatherData state with fresh data from Open-Meteo API
   * @param {number} provinceId - Province ID (1-6)
   */
  const refreshWeatherForProvince = useCallback(async (provinceId) => {
    if (!provinceId) {
      console.warn('Province ID required for weather refresh');
      return null;
    }

    // Convert abbreviated IDs to numeric
    const idToNumeric = { 'pb': 1, 'sd': 2, 'kp': 3, 'bl': 4, 'gb': 5, 'ajk': 6, 'ict': 1 };
    const numericId = typeof provinceId === 'string' ? (idToNumeric[provinceId.toLowerCase()] || 1) : provinceId;

    console.log(`🔄 Refreshing weather for province ${numericId}...`);
    const weather = await fetchWeatherForProvince(numericId);
    return weather;
  }, [fetchWeatherForProvince]);

  /**
   * Run flood prediction using ML model
   * NDMA-only: Supports both live and simulation modes
   * LIVE MODE: Fetches real weather data from Open-Meteo API
   * SIMULATION MODE: Uses preset scenarios from backend
   */
  const runPrediction = useCallback(async (provinceId, generateAlert = false) => {
    if (!provinceId) {
      console.warn('Province ID required for prediction');
      return null;
    }

    setIsPredicting(true);
    try {
      let payload;

      if (simulationEnabled) {
        // SIMULATION MODE: Use hardcoded scenario values (backend handles this)
        payload = {
          rainfall_24h: 50, // Backend overrides these with scenario values
          rainfall_48h: 30,
          humidity: 75,
          temperature: 28,
          provinceId,
          simulationMode: true,
          simulationScenario: simulationScenario,
          generateAlert,
        };
        console.log(`🎮 SIMULATION mode: ${simulationScenario} for province ${provinceId}`);
      } else {
        // LIVE MODE: Fetch real weather data from Open-Meteo API
        console.log(`🌤️ LIVE mode: Fetching real weather for province ${provinceId}...`);
        const weather = await fetchWeatherForProvince(provinceId);

        payload = {
          rainfall_24h: weather.rainfall_24h,
          rainfall_48h: weather.rainfall_48h,
          humidity: weather.humidity,
          temperature: weather.temperature,
          provinceId,
          simulationMode: false,
          generateAlert,
        };
        console.log(`🌤️ LIVE weather payload:`, payload);
      }

      const result = await NdmaApiService.predictFlood(payload);

      setPredictionResult({
        ...result,
        weatherSource: simulationEnabled ? 'simulation' : 'live-api',
        weatherData: simulationEnabled ? null : liveWeatherData,
      });
      setLastPredictionTime(new Date());

      console.log(`✅ Prediction: ${result.flood_risk} risk (${simulationEnabled ? 'SIMULATION' : 'LIVE'})`);

      // ========================================================
      // 🗺️ VISUAL MAP UPDATE - Update provinces based on prediction
      // ========================================================
      if (result && result.flood_risk) {
        const riskToLevel = {
          'High': { floodRisk: 'critical', status: 'critical', waterLevel: 95 },
          'Medium': { floodRisk: 'high', status: 'warning', waterLevel: 75 },
          'Low': { floodRisk: 'low', status: 'normal', waterLevel: 25 },
        };

        const riskConfig = riskToLevel[result.flood_risk] || riskToLevel['Low'];

        // Map provinceId to province key - matches all provinces
        const idToKey = {
          1: 'pb',      // Punjab (abbreviated)
          2: 'sd',      // Sindh (abbreviated)
          3: 'kp',      // KPK (abbreviated)
          4: 'bl',      // Balochistan (abbreviated)
          5: 'gb',      // Gilgit-Baltistan
          6: 'ajk'      // Azad Kashmir
        };
        const targetKey = idToKey[provinceId] || 'pb';

        // Update the provinces array to trigger map re-render (single log only)
        setProvinces(prev => {
          const updated = prev.map(p => {
            const pIdStr = String(p.id).toLowerCase();
            const targetStr = String(targetKey).toLowerCase();

            if (pIdStr === targetStr) {
              return {
                ...p,
                floodRisk: riskConfig.floodRisk,
                status: riskConfig.status,
                waterLevel: riskConfig.waterLevel,
                affectedDistricts: result.flood_risk === 'High' ? 8 : result.flood_risk === 'Medium' ? 4 : 1,
                evacuated: result.flood_risk === 'High' ? 50000 : result.flood_risk === 'Medium' ? 10000 : 0,
              };
            }
            return p;
          });
          return updated;
        });


        // Add flood zone marker for high/medium risk
        if (result.flood_risk !== 'Low') {
          // Province center coordinates
          const provinceCoords = {
            punjab: { lat: 31.17, lon: 72.70 },
            sindh: { lat: 25.89, lon: 68.52 },
            kpk: { lat: 34.01, lon: 71.52 },
            balochistan: { lat: 28.49, lon: 65.09 },
            gb: { lat: 35.80, lon: 74.98 },
            ajk: { lat: 33.93, lon: 73.78 }
          };

          const coords = provinceCoords[targetKey] || provinceCoords.punjab;

          const newFloodZone = {
            id: `ml-prediction-${Date.now()}`,
            name: `ML Predicted Zone - ${targetKey}`,
            riskLevel: riskConfig.floodRisk,
            province: targetKey,
            status: 'active',
            source: simulationEnabled ? 'simulation' : 'live',
            latitude: coords.lat,
            longitude: coords.lon,
          };
          setFloodZones(prev => [...prev.filter(z => !String(z.id).startsWith('ml-prediction-')), newFloodZone]);
          console.log('🌊 Added flood zone to map:', newFloodZone);
        }
      }

      // If alert was generated, refresh data
      if (result.alertGenerated) {
        console.log('🚨 Alert generated with ID:', result.alertId);
      }

      return result;
    } catch (err) {
      NotificationService.showError('Flood prediction failed. Please try again.');
      return null;
    } finally {
      setIsPredicting(false);
    }
  }, [simulationEnabled, simulationScenario, fetchWeatherForProvince, liveWeatherData]);

  // ==================== RESET MAP WHEN SIMULATION IS TURNED OFF ====================
  // When simulation mode is disabled, reset all provinces to normal/low risk state
  useEffect(() => {
    if (!simulationEnabled) {
      console.log('🔄 Simulation OFF - Resetting map to normal state');

      // Reset all provinces to default low risk state
      setProvinces(PROVINCE_STATUS_DATA.map(p => ({
        ...p,
        floodRisk: 'low',
        status: 'normal',
        waterLevel: 15,
        affectedDistricts: 0,
        evacuated: 0,
      })));

      // Clear prediction results and weather data
      setPredictionResult(null);
      setLiveWeatherData(null);

      // Clear ML-generated flood zones
      setFloodZones(prev => prev.filter(z => !String(z.id).startsWith('ml-prediction-')));
    }
  }, [simulationEnabled]);

  // Fetch data on mount (including simulation scenarios)
  useEffect(() => {
    fetchFloodMapData();
    fetchSimulationScenarios();
  }, [fetchFloodMapData, fetchSimulationScenarios]);

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
      NotificationService.showError('Failed to refresh flood data. Please try again.');
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

    // ML Prediction / Simulation (NDMA-only)
    simulationEnabled,
    setSimulationEnabled,
    simulationScenario,
    setSimulationScenario,
    simulationScenarios,
    predictionResult,
    isPredicting,
    lastPredictionTime,
    liveWeatherData,
    runPrediction,
    refreshWeatherForProvince,

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
