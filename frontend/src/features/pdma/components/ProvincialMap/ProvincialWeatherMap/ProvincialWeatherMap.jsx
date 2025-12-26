/**
 * ProvincialMap Component - NRCCS PDMA Dashboard
 * ArcGIS JavaScript API 4.34 with REAL Weather Data
 * 
 * CONVERTED FROM LEAFLET TO ARCGIS for consistency with NDMA/District maps
 * 
 * Features:
 * - Province-wide interactive map (default: Punjab)
 * - Dynamic weather based on map center
 * - REAL wind and precipitation from Open-Meteo API
 * - Theme-aware basemap switching
 * 
 * USED BY: PDMA Dashboard (Provincial Level)
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CloudRain, Wind, Droplets, Loader2, Layers, Thermometer, Gauge, RefreshCw, MapPin, Map as MapIcon } from 'lucide-react';

// ArcGIS Core Modules
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

// ArcGIS Widgets
import LayerList from '@arcgis/core/widgets/LayerList';
import Expand from '@arcgis/core/widgets/Expand';

// ArcGIS Reactive Utils
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

// ArcGIS Dark Theme CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// Shared Config
import { getBasemapByTheme, PROVINCE_CONFIG, getProvinceConfig, getMapConfigForUser, normalizeProvinceName } from '@shared/config/mapConfig';
import { GIS_LAYERS } from '@config/gisLayerConfig';

// Open Data Service for OSM gauging stations
import { fetchGaugingStations } from '@shared/services/openDataService';

// Weather Animation Service
import weatherAnimationService from '@shared/services/weatherAnimationService';

// Theme
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// Auth - for login-based province scoping
import { useAuth } from '@app/providers/AuthProvider';

// Layout
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';


// Open-Meteo API URL
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// ============================================================================
// WEATHER HELPERS
// ============================================================================

const fetchWeatherData = async (lat, lon) => {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m', 'relative_humidity_2m', 'precipitation', 'rain',
        'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m'
      ].join(','),
      hourly: ['precipitation_probability', 'precipitation'].join(','),
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
        windDirection: data.current.wind_direction_10m,
        windGusts: data.current.wind_gusts_10m
      },
      hourly: {
        precipitationProbability: data.hourly.precipitation_probability
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
};

const getWindDirectionText = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
};

const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 51: 'Light drizzle', 61: 'Slight rain', 63: 'Moderate rain',
    65: 'Heavy rain', 80: 'Rain showers', 95: 'Thunderstorm'
  };
  return descriptions[code] || 'Unknown';
};

// ============================================================================
// COMPONENT
// ============================================================================

const ProvincialWeatherMap = ({
  provinceName: propProvinceName,  // Optional prop override
  height = '500px',
  showDashboardLayout = true
}) => {
  // Get logged-in user for province scoping
  const { user } = useAuth();

  // Debug: Log user object to verify province is returned from backend
  console.log('🔐 PDMA User from auth:', user);
  console.log('📍 User province field:', user?.province);
  console.log('📍 User provinceId field:', user?.provinceId);

  // Use user's province from auth, fallback to prop, then to Punjab
  const provinceName = user?.province || propProvinceName || 'Punjab';
  console.log(`🗺️ Using province: "${provinceName}" (from ${user?.province ? 'auth' : propProvinceName ? 'prop' : 'default'})`);


  // Refs
  const mapContainerRef = useRef(null);
  const rainCanvasRef = useRef(null);
  const viewRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const windLayerRef = useRef(null);
  const precipLayerRef = useRef(null);
  const rainAnimationRef = useRef(null);
  const viewMoveTimeoutRef = useRef(null);

  // Province config - uses user's assigned province for correct map bounds
  const provinceConfig = useMemo(() => {
    const key = normalizeProvinceName(provinceName);
    const config = PROVINCE_CONFIG[key] || PROVINCE_CONFIG.punjab;
    console.log(`📍 PDMA Map: Loading ${provinceName} → config key: ${key}`, config);
    return config;
  }, [provinceName]);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [rainEnabled, setRainEnabled] = useState(false);
  const [windEnabled, setWindEnabled] = useState(false);
  const [precipEnabled, setPrecipEnabled] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: provinceConfig.center[1],
    lon: provinceConfig.center[0],
    name: provinceName
  });
  const [animationMode, setAnimationMode] = useState({ mode: 'detecting', label: '🔍 Detecting...' });
  const [activeRoute, setActiveRoute] = useState('map');

  // Theme

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Menu items
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // ============================================================================
  // WEATHER DATA LOADING
  // ============================================================================

  const loadWeatherData = useCallback(async (lat, lon) => {
    setWeatherLoading(true);
    const data = await fetchWeatherData(lat, lon);
    if (data) {
      setWeatherData(data);
      setCurrentLocation({ lat, lon, name: provinceName });
      console.log(`✓ Weather loaded for ${provinceName}:`, data.current);
    }
    setWeatherLoading(false);
  }, [provinceName]);

  // Initial weather load
  useEffect(() => {
    loadWeatherData(provinceConfig.center[1], provinceConfig.center[0]);
  }, [loadWeatherData, provinceConfig]);

  // ============================================================================
  // RAIN ANIMATION
  // ============================================================================

  const startRainAnimation = useCallback(() => {
    const canvas = rainCanvasRef.current;
    const mapContainer = mapContainerRef.current;
    if (!canvas || !mapContainer) return;

    const ctx = canvas.getContext('2d');
    const rect = mapContainer.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = rect.height || 500;

    const precipitation = weatherData?.current?.precipitation || 0;
    const dropCount = Math.min(400, 50 + Math.floor(precipitation * 35));

    const drops = [];
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 25 + 10,
        speed: Math.random() * 15 + 10,
        opacity: Math.random() * 0.4 + 0.2
      });
    }

    const windDir = weatherData?.current?.windDirection || 0;
    const rainAngle = (windDir - 90) * (Math.PI / 180);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(drop => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity})`;
        ctx.lineWidth = 1;
        const endX = drop.x - Math.sin(rainAngle) * drop.length;
        const endY = drop.y + Math.cos(rainAngle) * drop.length;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });
      rainAnimationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [weatherData]);

  const stopRainAnimation = useCallback(() => {
    if (rainAnimationRef.current) {
      cancelAnimationFrame(rainAnimationRef.current);
      rainAnimationRef.current = null;
    }
    const canvas = rainCanvasRef.current;
    if (canvas) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

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

        const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
        if (apiKey) {
          esriConfig.apiKey = apiKey;
          console.log('✓ ArcGIS API Key configured');
        }

        // Province boundary
        const provinceBoundary = new Polygon({
          rings: [[
            [provinceConfig.bounds.minLon, provinceConfig.bounds.minLat],
            [provinceConfig.bounds.minLon, provinceConfig.bounds.maxLat],
            [provinceConfig.bounds.maxLon, provinceConfig.bounds.maxLat],
            [provinceConfig.bounds.maxLon, provinceConfig.bounds.minLat],
            [provinceConfig.bounds.minLon, provinceConfig.bounds.minLat]
          ]],
          spatialReference: { wkid: 4326 }
        });
        // ============================================================
        // GIS LAYERS - PDMA PROVINCIAL LEVEL ONLY
        // Coordination layers: District Boundaries, Rivers, Gauging Stations, Dams
        // NO shelters (those are DISTRICT level only)
        // ============================================================

        const windLayer = new GraphicsLayer({ title: 'Wind Flow', visible: false });
        const precipLayer = new GraphicsLayer({ title: 'Precipitation Zones', visible: false });

        // PDMA-specific layers (provincial coordination level)
        const floodZonesLayer = new GraphicsLayer({ title: 'Flood Risk Zones', visible: true });
        const gaugingStationsLayer = new GraphicsLayer({ title: 'Gauging Stations', visible: true });
        const damsLayer = new GraphicsLayer({ title: 'Dams & Reservoirs', visible: false });

        // REAL District Boundaries (FeatureLayer from Living Atlas - filtered for Pakistan)
        const districtBoundariesLayer = new FeatureLayer({
          url: GIS_LAYERS.adminBoundaries.districts.url,
          title: 'District Boundaries',
          visible: true,
          opacity: 0.8,
          definitionExpression: GIS_LAYERS.adminBoundaries.districts.definitionExpression,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 0, 0],
              outline: { color: [239, 68, 68, 0.8], width: 1.5 }
            }
          }
        });

        // REAL Province Boundary (FeatureLayer - for the specific province)
        // Living Atlas World Administrative Divisions uses NAME field for admin unit names
        // Map Pakistan province names to Living Atlas NAME field values
        const provinceNameMapping = {
          'punjab': 'Punjab',
          'sindh': 'Sindh',
          'kpk': 'Khyber Pakhtunkhwa',
          'khyber pakhtunkhwa': 'Khyber Pakhtunkhwa',
          'balochistan': 'Balochistan',
          'gilgit-baltistan': 'Gilgit-Baltistan',
          'gilgit baltistan': 'Gilgit-Baltistan',
          'azad kashmir': 'Azad Kashmir',
          'ajk': 'Azad Kashmir',
          'islamabad': 'Islamabad'
        };
        const searchName = provinceNameMapping[provinceName.toLowerCase()] || provinceName;

        const provinceBoundaryLayer = new FeatureLayer({
          url: GIS_LAYERS.adminBoundaries.provinces.url,
          title: `${provinceName} Boundary`,
          visible: true,
          opacity: 0.9,
          // Use only NAME field - ADM1_NAME doesn't exist in Living Atlas
          definitionExpression: `COUNTRY = 'Pakistan' AND NAME = '${searchName}'`,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 0, 0],
              outline: { color: [16, 185, 129], width: 3 }
            }
          }
        });


        windLayerRef.current = windLayer;
        precipLayerRef.current = precipLayer;

        // DYNAMIC Gauging Stations from OSM Overpass API (PDMA level feature)
        // No more hardcoded data - fetches live from OpenStreetMap
        const loadGaugingStationsFromOSM = async () => {
          try {
            const bounds = {
              minLat: provinceConfig.bounds.minLat,
              minLon: provinceConfig.bounds.minLon,
              maxLat: provinceConfig.bounds.maxLat,
              maxLon: provinceConfig.bounds.maxLon
            };

            const stations = await fetchGaugingStations(bounds);

            if (stations && stations.length > 0) {
              stations.forEach(station => {
                // Green for normal, red/orange for warning types
                const color = station.type === 'gauge' || station.type === 'gauging_station'
                  ? [16, 185, 129, 255]  // Green
                  : [59, 130, 246, 255]; // Blue for other types

                gaugingStationsLayer.add(new Graphic({
                  geometry: new Point({ longitude: station.lon, latitude: station.lat }),
                  symbol: new SimpleMarkerSymbol({
                    style: 'diamond',
                    color: color,
                    size: 12,
                    outline: { color: [255, 255, 255], width: 2 }
                  }),
                  attributes: station,
                  popupTemplate: {
                    title: '📊 {name}',
                    content: `
                      <b>Type:</b> {type}<br>
                      <b>Operator:</b> {operator}<br>
                      <i>Data: OpenStreetMap</i>
                    `
                  }
                }));
              });
              console.log(`✓ Loaded ${stations.length} gauging stations from OSM for ${provinceName}`);
            } else {
              console.log(`⚠️ No gauging stations found in OSM for ${provinceName}`);
            }
          } catch (error) {
            console.warn('⚠️ Failed to load gauging stations from OSM:', error);
            // Graceful failure - layer will be empty but map won't crash
          }
        };
        loadGaugingStationsFromOSM();

        // Rivers layer
        const riversLayer = GIS_LAYERS.hydrology.rivers?.url ? new TileLayer({
          url: GIS_LAYERS.hydrology.rivers.url,
          title: 'Rivers & Water Features',
          visible: true,
          opacity: 0.7
        }) : null;

        // Layer order: Rivers -> Province Boundary -> District Boundaries -> Flood zones -> Gauging Stations -> Weather
        const mapLayers = [
          provinceBoundaryLayer,     // Province boundary (REAL shape from Living Atlas)
          districtBoundariesLayer,   // District boundaries (REAL shapes)
          floodZonesLayer,           // Flood risk areas
          gaugingStationsLayer,      // Gauging stations (PDMA specific)
          damsLayer,                 // Dams & reservoirs
          precipLayer,               // Weather precipitation
          windLayer                  // Wind animation
        ];
        if (riversLayer) mapLayers.unshift(riversLayer);

        // Create map with theme-aware basemap
        const map = new Map({
          basemap: getBasemapByTheme(theme),
          layers: mapLayers
        });
        mapInstanceRef.current = map;

        // Create view with HiDPI support for crisp rendering
        const view = new MapView({
          container: mapContainerRef.current,
          map: map,
          center: provinceConfig.center,
          zoom: provinceConfig.zoom,
          constraints: {
            geometry: provinceBoundary,
            minZoom: 6,
            maxZoom: 16,
            rotationEnabled: false
          },
          ui: { components: ['zoom', 'compass'] },
          // FIX BLURRINESS: Force high DPI rendering
          pixelRatio: window.devicePixelRatio || 1,
          qualityProfile: 'high'
        });
        viewRef.current = view;


        await view.when();

        // LayerList widget
        const layerList = new LayerList({
          view: view,
          listItemCreatedFunction: (event) => {
            event.item.panel = { content: 'legend', open: false };
          }
        });
        const layerListExpand = new Expand({
          view, content: layerList, expandIcon: 'layers',
          expandTooltip: 'Layers', expanded: false, group: 'top-left'
        });
        view.ui.add(layerListExpand, 'top-left');

        // Initialize animation mode
        try {
          await weatherAnimationService.initialize();
          const modeInfo = weatherAnimationService.getMode();
          setAnimationMode(modeInfo);
          console.log(`✓ Animation Mode: ${modeInfo.label}`);
        } catch (error) {
          console.warn('Animation init warning:', error);
          setAnimationMode({ mode: 'timeslider', label: '⏱ Time-Based Mode' });
        }

        // Debounced weather fetch on map move
        reactiveUtils.watch(
          () => view.center,
          (center) => {
            if (viewMoveTimeoutRef.current) clearTimeout(viewMoveTimeoutRef.current);
            viewMoveTimeoutRef.current = setTimeout(() => {
              if (center) {
                loadWeatherData(center.latitude, center.longitude);
              }
            }, 2000); // 2 second debounce for better performance
          }
        );

        if (isMounted) {
          setIsLoading(false);
          console.log(`✓ ProvincialMap loaded: ${provinceName}`);
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

    return () => {
      isMounted = false;
      if (viewMoveTimeoutRef.current) clearTimeout(viewMoveTimeoutRef.current);
      stopRainAnimation();
      viewRef.current?.destroy();
      mapInstanceRef.current?.destroy();
    };
  }, [provinceName, provinceConfig, loadWeatherData, stopRainAnimation]);

  // ============================================================================
  // THEME-REACTIVE BASEMAP SWITCHING
  // Updates basemap when user toggles dark/light mode without reloading map
  // ============================================================================

  useEffect(() => {
    if (mapInstanceRef.current) {
      const newBasemap = getBasemapByTheme(theme);
      mapInstanceRef.current.basemap = newBasemap;
      console.log(`✓ PDMA Basemap switched to: ${newBasemap}`);
    }
  }, [theme]);

  // Toggle handlers
  const toggleRain = useCallback(() => {
    const newState = !rainEnabled;
    setRainEnabled(newState);
    newState ? startRainAnimation() : stopRainAnimation();
  }, [rainEnabled, startRainAnimation, stopRainAnimation]);

  const toggleWind = useCallback(() => {
    const newState = !windEnabled;
    setWindEnabled(newState);
    if (windLayerRef.current) windLayerRef.current.visible = newState;
  }, [windEnabled]);

  const togglePrecip = useCallback(() => {
    const newState = !precipEnabled;
    setPrecipEnabled(newState);
    if (precipLayerRef.current) precipLayerRef.current.visible = newState;
  }, [precipEnabled]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const mapContent = (
    <div className="provincial-map-wrapper" style={{ background: colors.bgPrimary }}>
      {/* Weather Bar */}
      {weatherData && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 16px',
          marginBottom: '12px',
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer style={{ width: '16px', height: '16px', color: '#f97316' }} />
            <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
              {weatherData.current.temperature}°C
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
              {weatherData.current.windSpeed} km/h {getWindDirectionText(weatherData.current.windDirection)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
            <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
              {weatherData.current.precipitation} mm
            </span>
          </div>
          <span style={{
            marginLeft: 'auto',
            color: colors.textMuted,
            fontSize: '12px'
          }}>
            {getWeatherDescription(weatherData.current.weatherCode)}
          </span>
          {weatherLoading && <Loader2 className="animate-spin" style={{ width: '16px', height: '16px', color: colors.primary }} />}
        </div>
      )}

      {/* Map Container */}
      <div style={{
        position: 'relative',
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Rain Canvas */}
        <canvas
          ref={rainCanvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2,
            display: rainEnabled ? 'block' : 'none'
          }}
        />

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
            <Loader2 className="animate-spin" style={{ width: '48px', height: '48px', color: '#10b981', marginBottom: '12px' }} />
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Loading {provinceName} Map...</span>
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

        {/* Province Label */}
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
          zIndex: 3
        }}>
          🏛️ PDMA {provinceName}
        </div>

        {/* Animation Mode Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '11px',
          fontWeight: '600',
          backgroundColor: animationMode.mode?.includes('webgl')
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(59, 130, 246, 0.2)',
          color: animationMode.mode?.includes('webgl') ? '#22c55e' : '#3b82f6',
          zIndex: 3
        }}>
          {animationMode.label}
        </div>
      </div>

      {/* Animation controls in LayerList widget */}
    </div>
  );

  // Return with or without dashboard layout
  if (!showDashboardLayout) {
    return mapContent;
  }

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle={`Flood Risk Map - ${provinceName}`}
      pageSubtitle="Real-time flood risk monitoring and visualization"
      pageIcon={MapIcon}
      pageIconColor="#10b981"
      userRole="PDMA"
      userName="User"
    >
      {mapContent}
    </DashboardLayout>
  );
};

export default ProvincialWeatherMap;
