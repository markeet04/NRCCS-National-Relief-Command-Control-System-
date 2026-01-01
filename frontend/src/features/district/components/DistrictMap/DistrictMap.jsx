/**
 * DistrictMap Component - NRCCS District Dashboard
 * ArcGIS JavaScript API 4.33 with REAL Weather Data
 * 
 * Features:
 * - Hybrid basemap centered on Peshawar District
 * - REAL wind data from Open-Meteo API (direction & speed)
 * - REAL precipitation data from Open-Meteo API
 * - Rain animation based on actual precipitation levels
 * - Wind particles flowing in ACTUAL wind direction
 * - Weather info panel showing current conditions
 * 
 * USED BY: District Dashboard
 * PURPOSE: Real-time weather visualization for Peshawar District
 * 
 * WEATHER API: Open-Meteo (free, no API key required)
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CloudRain, Wind, Droplets, Loader2, Layers, Thermometer, Gauge, RefreshCw } from 'lucide-react';

// ArcGIS Core Modules (4.33)
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';  // DEPRECATED: Kept for reference, not used
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

// ArcGIS Widgets
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import Search from '@arcgis/core/widgets/Search';

// ArcGIS Dark Theme CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// GIS Layer Configuration
import { GIS_LAYERS, LAYER_SYMBOLS } from '@config/gisLayerConfig';

// Weather Animation Service
import weatherAnimationService from '@shared/services/weatherAnimationService.js';

// Open Data Service for OSM hospital data
import { fetchHospitalsFromOSM } from '@shared/services/openDataService.js';

// District API for backend shelter data
import districtApi from '../../services/districtApi';

// Theme
import { useSettings } from '../../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../../shared/utils/themeColors';

// Map Configuration
import { getBasemapByTheme, getDistrictConfig, DISTRICT_CONFIG as ALL_DISTRICT_CONFIGS } from '@shared/config/mapConfig';

// Auth - for login-based district scoping
import { useAuth } from '@app/providers/AuthProvider';

// ============================================================================
// CONFIGURATION
// ============================================================================

// NOTE: District config is now dynamically loaded in component from mapConfig.js
// based on user.district from auth (same pattern as PDMA province scoping)
// See DISTRICT_CONFIG in mapConfig.js for all supported districts

// Open-Meteo API URL (free, no API key needed)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';


// ============================================================================
// WEATHER SERVICE
// ============================================================================

/**
 * Fetch real weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
const fetchWeatherData = async (lat, lon) => {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'rain',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m'
      ].join(','),
      hourly: [
        'precipitation_probability',
        'precipitation',
        'rain'
      ].join(','),
      timezone: 'Asia/Karachi',
      forecast_days: 1
    });

    const response = await fetch(`${WEATHER_API_URL}?${params}`);
    if (!response.ok) throw new Error('Weather API request failed');

    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        rain: data.current.rain,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m, // Degrees (0 = North, 90 = East, etc.)
        windGusts: data.current.wind_gusts_10m
      },
      hourly: {
        precipitationProbability: data.hourly.precipitation_probability,
        precipitation: data.hourly.precipitation
      },
      units: data.current_units,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
};

/**
 * Convert wind direction degrees to compass direction
 */
const getWindDirectionText = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Get weather description from WMO weather code
 */
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || 'Unknown';
};

// ============================================================================
// COMPONENT
// ============================================================================

const DistrictMap = ({ districtName: propDistrictName, height = '384px' }) => {
  // Get logged-in user for district scoping (same pattern as PDMA)
  const { user } = useAuth();

  // Use user's district from auth, fallback to prop, then to default
  const districtName = user?.district || propDistrictName || 'Peshawar';

  // Get district config dynamically based on user's assigned district
  const districtConfig = useMemo(() => {
    const config = getDistrictConfig(districtName);
    console.log(`📍 District Map: Loading ${districtName} → config:`, config);
    return {
      ...config,
      lat: config.center[1],
      lon: config.center[0]
    };
  }, [districtName]);

  // Debug logging for district scoping
  console.log('🔐 District User from auth:', user);
  console.log('📍 User district field:', user?.district);
  console.log(`🗺️ Using district: "${districtName}" (from ${user?.district ? 'auth' : propDistrictName ? 'prop' : 'default'})`);

  // Refs
  const mapContainerRef = useRef(null);
  const viewRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const weatherDataRef = useRef(null);
  // Weather animation refs removed - Meteo provides numeric data only

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  // Weather toggle states removed - no map-based weather layers
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [animationMode, setAnimationMode] = useState({ mode: 'detecting', label: '🔍 Detecting...' });

  // Theme
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // ============================================================================
  // FETCH WEATHER DATA
  // ============================================================================

  const loadWeatherData = useCallback(async () => {
    setWeatherLoading(true);
    const data = await fetchWeatherData(districtConfig.lat, districtConfig.lon);
    if (data) {
      setWeatherData(data);
      weatherDataRef.current = data;
      setLastUpdate(new Date());
      console.log('✓ Real weather data loaded:', data.current);
    }
    setWeatherLoading(false);
  }, [districtConfig.lat, districtConfig.lon]);

  // Load weather data on mount and every 10 minutes
  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [loadWeatherData]);

  // ============================================================================
  // WEATHER ANIMATIONS REMOVED
  // ============================================================================
  // The following animation functions have been removed as part of Weather Layer Cleanup:
  // - startRainAnimation, stopRainAnimation (canvas rain drops)
  // - createNoiseField, getTurbulence (wind turbulence calculations)
  // - initWindParticles, runWindAnimation, startWindAnimation, stopWindAnimation (wind particles)
  // - createPrecipitationZones (precipitation zone overlays)
  //
  // Reason: Meteo API provides point-based numeric weather data only
  // Weather is now displayed as information panels, not map overlays
  // To reintroduce, would need:
  //   - Weather radar API for precipitation overlays
  //   - Wind field API for spatial wind data
  // ============================================================================

  // ============================================================================
  // MAP INITIALIZATION
  // ============================================================================

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setMapError(null);

        // Configure API Key
        const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
        if (apiKey) {
          esriConfig.apiKey = apiKey;
          console.log('✓ ArcGIS API Key configured');
        }

        // Create boundary from dynamic district config
        const districtBoundary = new Polygon({
          rings: [[
            [districtConfig.bounds.minLon, districtConfig.bounds.minLat],
            [districtConfig.bounds.minLon, districtConfig.bounds.maxLat],
            [districtConfig.bounds.maxLon, districtConfig.bounds.maxLat],
            [districtConfig.bounds.maxLon, districtConfig.bounds.minLat],
            [districtConfig.bounds.minLon, districtConfig.bounds.minLat]
          ]],
          spatialReference: { wkid: 4326 }
        });

        // ============================================================
        // WEATHER ANIMATION LAYERS REMOVED
        // Wind Flow and Precipitation Zones GraphicsLayers removed
        // Meteo API provides point-based numeric weather data only
        // Weather displayed as info panel (not map overlays)
        // ============================================================

        // ============================================================
        // GIS LAYERS - DISTRICT TACTICAL LEVEL
        // This is the ONLY level with: Shelters, Hospitals (from OSM), Local Facilities
        // NDMA and PDMA do NOT have these layers
        // 
        // RASTER LAYERS DISABLED: riversLayer TileLayer removed
        // Reason: Raster tiles pixelate when zoomed beyond native resolution
        // Vector basemaps (arcgis/navigation) include water features by default
        // ============================================================

        // REMOVED: riversLayer - Raster TileLayer causes blurriness
        // Vector basemaps include water features by default

        // DISTRICT-SPECIFIC LAYERS (Tactical Level)
        // District Boundary from Living Atlas (public FeatureLayer)
        // NOTE: Using World Administrative Divisions - free tier only has Admin Level 1 (provinces)
        // For actual tehsil-level boundaries, would need premium subscription or GADM GeoJSON hosting
        const tehsilBoundariesLayer = new FeatureLayer({
          url: GIS_LAYERS.adminBoundaries.districts.url,
          title: `${districtName} District Boundary`,
          visible: true,
          opacity: 0.9,
          // Filter for Pakistan and use NAME field only (ADM2_NAME doesn't exist in free tier)
          definitionExpression: `COUNTRY = 'Pakistan'`,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 0, 0],
              outline: { color: [239, 68, 68], width: 3 }
            }
          }
        });

        const hospitalsLayer = new GraphicsLayer({ title: '🏥 Hospitals', visible: true });
        const sheltersLayer = new GraphicsLayer({ title: '🏠 Shelters & Camps', visible: true });
        // NOTE: Evacuation routes layer removed - no longer required
        const rescueAssetsLayer = new GraphicsLayer({ title: 'Rescue Assets', visible: false });

        // Add hospital markers - DYNAMIC from OSM Overpass API (DISTRICT ONLY)
        // No more hardcoded data - fetches live from OpenStreetMap
        const loadHospitalsFromOSM = async () => {
          try {
            // Use district bounds for hospital query
            const bounds = {
              minLat: districtConfig.bounds.minLat,
              minLon: districtConfig.bounds.minLon,
              maxLat: districtConfig.bounds.maxLat,
              maxLon: districtConfig.bounds.maxLon
            };

            const hospitals = await fetchHospitalsFromOSM(bounds);

            hospitals.forEach(h => {
              hospitalsLayer.add(new Graphic({
                geometry: new Point({ longitude: h.lon, latitude: h.lat }),
                symbol: new SimpleMarkerSymbol({
                  style: 'cross',
                  color: LAYER_SYMBOLS.hospital.color,
                  size: LAYER_SYMBOLS.hospital.size,
                  outline: { color: [255, 255, 255], width: 2 }
                }),
                attributes: h,
                popupTemplate: {
                  title: '🏥 {name}',
                  content: `
                    <b>Type:</b> Hospital<br>
                    <b>Emergency:</b> ${h.emergency ? 'Yes' : 'Unknown'}<br>
                    ${h.beds ? '<b>Beds:</b> ' + h.beds + '<br>' : ''}
                    ${h.operator ? '<b>Operator:</b> ' + h.operator + '<br>' : ''}
                    ${h.phone ? '<b>Phone:</b> ' + h.phone + '<br>' : ''}
                    <i>Data: OpenStreetMap</i>
                  `
                }
              }));
            });
            console.log(`✓ Loaded ${hospitals.length} hospitals from OSM`);
          } catch (error) {
            console.warn('⚠️ Failed to load hospitals from OSM:', error);
            // Graceful failure - hospital layer will just be empty
          }
        };
        loadHospitalsFromOSM();

        // Add shelter markers (DISTRICT ONLY FEATURE)
        // Load shelters from backend API instead of mock data
        const loadSheltersFromBackend = async () => {
          try {
            const response = await districtApi.getAllShelters();
            const sheltersData = response.data || response || [];

            sheltersData.forEach(s => {
              // Get coordinates from shelter data
              const lon = s.coordinates?.lng || s.lng || s.longitude || 71.5;
              const lat = s.coordinates?.lat || s.lat || s.latitude || 34.0;

              // Determine status for symbology
              const occupancyPercent = (s.occupancy / s.capacity) * 100;
              let status = 'available';
              if (occupancyPercent >= 100) status = 'full';
              else if (occupancyPercent >= 90) status = 'near-full';

              const sym = LAYER_SYMBOLS.shelter[status] || LAYER_SYMBOLS.shelter.available;

              sheltersLayer.add(new Graphic({
                geometry: new Point({ longitude: lon, latitude: lat }),
                symbol: new SimpleMarkerSymbol({
                  style: 'square', color: sym.color, size: sym.size + 4,
                  outline: { color: [255, 255, 255], width: 2 }
                }),
                attributes: {
                  ...s,
                  status,
                  occupancyPercent: Math.round(occupancyPercent)
                },
                popupTemplate: {
                  title: '🏠 {name}',
                  content: `<b>Capacity:</b> {capacity} people<br>
                           <b>Occupancy:</b> {occupancy} ({occupancyPercent}%)<br>
                           <b>Status:</b> {status}<br>
                           <b>Address:</b> {address}`
                }
              }));
            });
            console.log(`✓ Loaded ${sheltersData.length} shelters from backend`);
          } catch (error) {
            console.warn('⚠️ Failed to load shelters from backend, using fallback:', error);
            // Fallback to mock data if API fails
            EMERGENCY_FACILITIES.shelters?.forEach(s => {
              const sym = LAYER_SYMBOLS.shelter[s.status] || LAYER_SYMBOLS.shelter.available;
              sheltersLayer.add(new Graphic({
                geometry: new Point({ longitude: s.lon, latitude: s.lat }),
                symbol: new SimpleMarkerSymbol({
                  style: 'square', color: sym.color, size: sym.size + 4,
                  outline: { color: [255, 255, 255], width: 2 }
                }),
                attributes: s,
                popupTemplate: {
                  title: '🏠 {name}',
                  content: '<b>Capacity:</b> {capacity} people<br><b>Status:</b> {status}'
                }
              }));
            });
          }
        };
        loadSheltersFromBackend();

        // NOTE: Evacuation routes removed - no longer required

        // Build layers - DISTRICT TACTICAL ORDERING
        // Shows: Shelters, Hospitals (unique to district)
        // NOTE: Evacuation routes removed - no longer required
        // Build layers array - ALL VECTOR (no raster TileLayers)
        const mapLayers = [
          tehsilBoundariesLayer,  // Tehsil/UC boundaries (VECTOR FeatureLayer)
          sheltersLayer,          // Shelter markers (VECTOR Graphics - DISTRICT ONLY)
          hospitalsLayer,         // Hospital markers (VECTOR Graphics)
          rescueAssetsLayer       // Rescue teams/vehicles (VECTOR Graphics)
          // Weather layers removed - Meteo API provides numeric data only
        ];
        // NOTE: riversLayer removed - raster TileLayer caused blurriness

        // Create Map with theme-aware basemap
        const map = new Map({
          basemap: getBasemapByTheme(theme),
          layers: mapLayers
        });
        mapInstanceRef.current = map;

        // Create MapView with HiDPI support for crisp rendering
        const view = new MapView({
          container: mapContainerRef.current,
          map: map,
          center: districtConfig.center,
          zoom: districtConfig.zoom,
          constraints: {
            geometry: districtBoundary,
            minZoom: districtConfig.minZoom,
            maxZoom: districtConfig.maxZoom,
            rotationEnabled: false
          },
          ui: { components: ['zoom', 'compass'] },
          // FIX BLURRINESS: Force high DPI rendering for crisp visuals
          pixelRatio: window.devicePixelRatio || 1,
          qualityProfile: 'high'
        });
        viewRef.current = view;


        await view.when();

        // LayerList Widget
        const layerList = new LayerList({
          view: view,
          listItemCreatedFunction: (event) => { event.item.panel = { content: 'legend', open: false }; }
        });
        const layerListExpand = new Expand({
          view, content: layerList, expandIcon: 'layers', expandTooltip: 'Layer List', expanded: false, group: 'top-left'
        });
        view.ui.add(layerListExpand, 'top-left');

        // Legend Widget
        const legend = new Legend({ view, style: 'card' });
        const legendExpand = new Expand({
          view, content: legend, expandIcon: 'legend', expandTooltip: 'Legend', expanded: false, group: 'top-left'
        });
        view.ui.add(legendExpand, 'top-left');

        // ============================================================
        // SEARCH WIDGET - ArcGIS Geocoding with Autocomplete
        // District level - higher zoom for tactical precision
        // ============================================================
        const searchWidget = new Search({
          view: view,
          popupEnabled: true,
          resultGraphicEnabled: true,
          searchTerm: '',
          countryCode: 'PK',  // Focus on Pakistan
          suggestionsEnabled: true,
          minSuggestCharacters: 2,
          maxSuggestions: 6,
          allPlaceholder: 'Search location...',
          goToOverride: (view, options) => {
            return view.goTo({
              target: options.target,
              zoom: 14  // District level - tactical zoom
            }, { duration: 1000, easing: 'ease-in-out' });
          }
        });
        view.ui.add(searchWidget, { position: 'top-right' });

        console.log('✓ District GIS Layers initialized');

        if (isMounted) {
          setIsLoading(false);
          console.log(`✓ DistrictMap loaded: ${districtName} District`);
        }

      } catch (error) {
        console.error('Map initialization error:', error);
        if (isMounted) {
          setMapError(error.message || 'Failed to load map');
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    // ============================================================
    // RESIZE OBSERVER - CRITICAL FOR PREVENTING BLURRINESS
    // When container resizes (sidebar toggle, fullscreen), canvas must update
    // ============================================================
    let resizeObserver = null;
    let resizeTimeout = null;

    const setupResizeObserver = () => {
      const container = mapContainerRef.current;
      if (!container) return;

      resizeObserver = new ResizeObserver(() => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (viewRef.current && typeof viewRef.current.resize === 'function') {
            viewRef.current.resize();
            console.log('🔄 DistrictMap resized for crisp rendering');
          }
        }, 100);
      });

      resizeObserver.observe(container);
      console.log('✓ ResizeObserver attached to DistrictMap container');
    };

    setTimeout(setupResizeObserver, 500);

    return () => {
      isMounted = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      // Weather animation cleanup removed - animations no longer exist
      viewRef.current?.destroy();
      mapInstanceRef.current?.destroy();
    };
  }, [districtName]);

  // ============================================================================
  // THEME-REACTIVE BASEMAP SWITCHING
  // Updates basemap when user toggles dark/light mode without reloading map
  // ============================================================================

  useEffect(() => {
    if (mapInstanceRef.current) {
      const newBasemap = getBasemapByTheme(theme);
      mapInstanceRef.current.basemap = newBasemap;
      console.log(`✓ District Basemap switched to: ${newBasemap}`);
    }
  }, [theme]);

  // ============================================================================
  // TOGGLE HANDLERS - WEATHER TOGGLES REMOVED
  // ============================================================================
  // toggleRain, toggleWind, togglePrecipitation removed
  // Reason: Weather animations removed - Meteo API provides numeric data only
  // Weather is now displayed as information panels, not map overlays

  // ============================================================================
  // STYLES
  // ============================================================================

  const getButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#166534' : '#16a34a',
    color: '#ffffff',
    boxShadow: isActive
      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.25), 0 0 15px rgba(22, 163, 74, 0.5)'
      : '0 2px 4px rgba(0, 0, 0, 0.15)'
  });

  // activeLayers removed - weather toggle states no longer exist
  // Weather is now information panels only, not map layers

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ width: '100%' }}>
      {/* Weather Info Panel - REAL DATA */}
      {weatherData && (
        <div
          style={{
            marginBottom: '12px',
            padding: '14px 18px',
            backgroundColor: isLight ? '#f0fdf4' : '#052e16',
            borderRadius: '12px',
            border: `1px solid ${isLight ? '#bbf7d0' : '#166534'}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer style={{ width: '18px', height: '18px', color: '#f97316' }} />
            <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
              {weatherData.current.temperature}°C
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
            <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
              {weatherData.current.windSpeed} km/h {getWindDirectionText(weatherData.current.windDirection)}
            </span>
            <span style={{ color: colors.textMuted, fontSize: '12px' }}>
              ({weatherData.current.windDirection}°)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
            <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
              {weatherData.current.precipitation} mm
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gauge style={{ width: '18px', height: '18px', color: '#06b6d4' }} />
            <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
              {weatherData.current.humidity}%
            </span>
          </div>

          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.textMuted,
            fontSize: '11px'
          }}>
            <span>{getWeatherDescription(weatherData.current.weatherCode)}</span>
            <button
              onClick={loadWeatherData}
              disabled={weatherLoading}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                opacity: weatherLoading ? 0.5 : 1
              }}
              title="Refresh weather data"
            >
              <RefreshCw
                style={{
                  width: '14px',
                  height: '14px',
                  color: colors.textMuted,
                  animation: weatherLoading ? 'spin 1s linear infinite' : 'none'
                }}
              />
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        style={{
          position: 'relative',
          height: height,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.cardBorder || colors.border}`
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Rain Canvas and Rain Overlay REMOVED - weather is now info panel only */}

        {/* Loading */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 10
          }}>
            <Loader2 className="animate-spin" style={{ width: '48px', height: '48px', color: '#22c55e', marginBottom: '12px' }} />
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Loading {districtName} Map...</span>
          </div>
        )}

        {/* Error */}
        {mapError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.cardBg,
            zIndex: 10
          }}>
            <div style={{ color: '#ef4444', fontWeight: '600', marginBottom: '8px' }}>⚠️ Map Error</div>
            <div style={{ color: colors.textMuted, fontSize: '13px' }}>{mapError}</div>
          </div>
        )}

        {/* Active Layers Badge removed - weather animations no longer exist */}

        {/* District Label */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          color: '#ffffff',
          padding: '10px 16px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '600',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          📍 {districtName} District, KPK
        </div>
      </div>

      {/* Weather legend section removed - weather animations no longer exist */}
      {/* Weather is now shown in the info panel at the top only */}
    </div>
  );
};

export default DistrictMap;
