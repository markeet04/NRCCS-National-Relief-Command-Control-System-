/**
 * NationalMap Component - NRCCS NDMA Dashboard
 * ArcGIS JavaScript API 4.33 with REAL Weather Data
 * 
 * Features:
 * - Pakistan-wide interactive map
 * - Dynamic weather based on map center location (from Meteo API)
 * - Click on any location to get weather data
 * - Weather info panel showing current conditions for viewed area
 * 
 * WEATHER DISPLAY: Information panels only (no map overlays)
 * - Temperature, wind speed/direction, precipitation, humidity
 * - All data sourced from Open-Meteo API (free, no key required)
 * 
 * WEATHER ANIMATIONS REMOVED:
 * - Wind particle flow (was visual effect, not spatial data)
 * - Rain canvas animation (was visual effect, not real-time radar)
 * - Precipitation zone overlays (were generated, not from weather service)
 * - Reason: Meteo API provides point-based numeric data only
 * 
 * USED BY: NDMA Dashboard (National Level)
 * PURPOSE: Real-time weather information for entire Pakistan
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Wind, Droplets, Loader2, Thermometer, Gauge, RefreshCw, MapPin, Navigation } from 'lucide-react';

// ArcGIS Core Modules (4.33)
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';  // DEPRECATED: Kept for reference, not used
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
// Polyline removed - was used for wind particle trails
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
import { GIS_LAYERS, EMERGENCY_FACILITIES, LAYER_SYMBOLS } from '@config/gisLayerConfig';

// Weather Animation Service - REMOVED (Meteo API provides numeric data only)
// import weatherAnimationService from '@shared/services/weatherAnimationService';

// Theme
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// Map Configuration
import { getBasemapByTheme, ROLE_MAP_CONFIG } from '@shared/config/mapConfig';

// ArcGIS Reactive Utils (replaces deprecated view.watch)
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Pakistan Nationwide Configuration
const PAKISTAN_CONFIG = {
  name: 'Pakistan',
  center: [69.3451, 30.3753], // Pakistan center (lon, lat)
  zoom: 5,
  minZoom: 4,
  maxZoom: 8,  // Constrained to prevent pixelation at national level
  bounds: {
    minLon: 60.8,
    minLat: 23.5,
    maxLon: 77.8,
    maxLat: 37.1
  }
};

// Major cities for quick navigation
const MAJOR_CITIES = [
  { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
  { name: 'Lahore', lat: 31.5497, lon: 74.3436 },
  { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
  { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
  { name: 'Gilgit', lat: 35.9208, lon: 74.3144 },
  { name: 'Muzaffarabad', lat: 34.3700, lon: 73.4711 }
];

// Open-Meteo API URL (free, no API key needed)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// ============================================================================
// WEATHER SERVICE
// ============================================================================

/**
 * Fetch real weather data from Open-Meteo API
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
        windDirection: data.current.wind_direction_10m,
        windGusts: data.current.wind_gusts_10m
      },
      hourly: {
        precipitationProbability: data.hourly.precipitation_probability,
        precipitation: data.hourly.precipitation
      },
      units: data.current_units,
      timestamp: new Date().toISOString(),
      location: { lat, lon }
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
};

/**
 * Get location name from coordinates (local fallback - no external API)
 * Nominatim API has CORS issues from localhost, so we use a simple grid-based approach
 */
const getLocationName = async (lat, lon) => {
  // Pakistan major cities with approximate bounding boxes
  const PAKISTAN_CITIES = [
    { name: 'Islamabad', lat: 33.6844, lon: 73.0479, radius: 0.3 },
    { name: 'Lahore', lat: 31.5497, lon: 74.3436, radius: 0.4 },
    { name: 'Karachi', lat: 24.8607, lon: 67.0011, radius: 0.5 },
    { name: 'Peshawar', lat: 34.0151, lon: 71.5249, radius: 0.3 },
    { name: 'Quetta', lat: 30.1798, lon: 66.9750, radius: 0.3 },
    { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169, radius: 0.2 },
    { name: 'Faisalabad', lat: 31.4504, lon: 73.1350, radius: 0.3 },
    { name: 'Multan', lat: 30.1575, lon: 71.5249, radius: 0.3 },
    { name: 'Hyderabad', lat: 25.3960, lon: 68.3578, radius: 0.3 },
    { name: 'Gujranwala', lat: 32.1877, lon: 74.1945, radius: 0.2 },
    { name: 'Sialkot', lat: 32.4945, lon: 74.5229, radius: 0.2 },
    { name: 'Bahawalpur', lat: 29.3956, lon: 71.6722, radius: 0.3 },
    { name: 'Sargodha', lat: 32.0836, lon: 72.6711, radius: 0.2 },
    { name: 'Sukkur', lat: 27.7244, lon: 68.8228, radius: 0.2 },
    { name: 'Abbottabad', lat: 34.1688, lon: 73.2215, radius: 0.2 },
    { name: 'Gilgit', lat: 35.9208, lon: 74.3144, radius: 0.3 },
    { name: 'Muzaffarabad', lat: 34.3700, lon: 73.4711, radius: 0.2 },
  ];

  // Find nearest city within radius
  for (const city of PAKISTAN_CITIES) {
    const distance = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2));
    if (distance <= city.radius) {
      return `${city.name} Area`;
    }
  }

  // Regional fallback based on coordinates
  if (lat >= 35) return 'Northern Areas';
  if (lat >= 33 && lon <= 71) return 'KPK Region';
  if (lat >= 33 && lon > 71) return 'Punjab North';
  if (lat >= 30 && lat < 33 && lon > 72) return 'Central Punjab';
  if (lat >= 30 && lat < 33 && lon <= 72) return 'Western Pakistan';
  if (lat >= 27 && lat < 30) return 'Sindh/Balochistan';
  if (lat < 27) return 'Southern Sindh';

  return `Pakistan (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`;
};

const getWindDirectionText = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || 'Unknown';
};

// ============================================================================
// COMPONENT
// ============================================================================

const NationalMap = ({ height = '450px' }) => {
  // Refs
  const mapContainerRef = useRef(null);
  const viewRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const locationMarkerRef = useRef(null);
  const weatherDataRef = useRef(null);
  const viewMoveTimeoutRef = useRef(null);

  // ============================================================================
  // WEATHER ANIMATIONS REMOVED
  // Reason: Meteo API provides numeric weather data only, not spatial layers
  // Rain/wind animations were visual effects not backed by real-time spatial data
  // Weather is now displayed as information panels only (not map layers)
  // ============================================================================

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 30.3753, lon: 69.3451, name: 'Pakistan' });
  const [lastUpdate, setLastUpdate] = useState(null);

  // Theme
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // ============================================================================
  // FETCH WEATHER DATA FOR CURRENT VIEW
  // ============================================================================

  const loadWeatherData = useCallback(async (lat, lon) => {
    setWeatherLoading(true);
    const data = await fetchWeatherData(lat, lon);
    const locationName = await getLocationName(lat, lon);

    if (data) {
      setWeatherData(data);
      weatherDataRef.current = data;
      setCurrentLocation({ lat, lon, name: locationName });
      setLastUpdate(new Date());
      console.log(`✓ Weather data loaded for ${locationName}:`, data.current);
    }
    setWeatherLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadWeatherData(PAKISTAN_CONFIG.center[1], PAKISTAN_CONFIG.center[0]);
  }, [loadWeatherData]);

  // ============================================================================
  // GET CURRENT VIEW BOUNDS
  // ============================================================================

  const getCurrentViewBounds = useCallback(() => {
    const view = viewRef.current;
    if (!view?.extent) return PAKISTAN_CONFIG.bounds;

    return {
      minLon: view.extent.xmin,
      minLat: view.extent.ymin,
      maxLon: view.extent.xmax,
      maxLat: view.extent.ymax
    };
  }, []);

  // ============================================================================
  // WEATHER ANIMATION FUNCTIONS - REMOVED
  // ============================================================================
  // The following animation functions have been removed:
  // - startRainAnimation / stopRainAnimation (canvas-based rain droplets)
  // - createNoiseField / getTurbulence (wind flow field)
  // - initWindParticles / wind animation loop (particle system)
  // - createPrecipitationZones (GraphicsLayer zones)
  //
  // REASON: Meteo API provides point-based numeric weather data only.
  // These visual effects were not backed by real-time spatial weather data.
  // Weather is now displayed as information panels (temperature, wind speed, etc.)
  // not as map layers/overlays.
  //
  // TO REINTRODUCE: Would require subscription to weather radar imagery API
  // or ArcGIS Spatial Analysis services for real spatial weather data.
  // ============================================================================

  // Wind animation and precipitation zones functions removed
  // See comment block above for explanation

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

        // Pakistan boundary (simple envelope for view constraints)
        const pakistanBoundary = new Polygon({
          rings: [[
            [PAKISTAN_CONFIG.bounds.minLon, PAKISTAN_CONFIG.bounds.minLat],
            [PAKISTAN_CONFIG.bounds.minLon, PAKISTAN_CONFIG.bounds.maxLat],
            [PAKISTAN_CONFIG.bounds.maxLon, PAKISTAN_CONFIG.bounds.maxLat],
            [PAKISTAN_CONFIG.bounds.maxLon, PAKISTAN_CONFIG.bounds.minLat],
            [PAKISTAN_CONFIG.bounds.minLon, PAKISTAN_CONFIG.bounds.minLat]
          ]],
          spatialReference: { wkid: 4326 }
        });

        // ============================================================
        // WEATHER ANIMATION LAYERS REMOVED
        // windLayer and precipLayer were GraphicsLayers for visual effects
        // Meteo API provides numeric weather data only (no spatial layers)
        // ============================================================

        // Location Marker Layer - for click-to-get-weather functionality
        const locationLayer = new GraphicsLayer({ title: 'Location Marker', visible: true });
        locationMarkerRef.current = locationLayer;

        // ============================================================
        // GIS LAYERS - NDMA NATIONAL LEVEL ONLY
        // Strategic layers: Province Boundaries, Flood Zones
        // NO shelters, NO evacuation routes (those are DISTRICT level)
        // 
        // RASTER LAYERS DISABLED: hillshade and rivers TileLayers removed
        // Reason: Raster tiles pixelate when zoomed beyond native resolution
        // Vector basemaps (arcgis/navigation) include road/water styling
        // ============================================================

        // REMOVED: hillshadeLayer - Raster TileLayer causes blurriness
        // REMOVED: riversLayer - Raster TileLayer causes blurriness
        // Vector basemaps (arcgis/navigation, arcgis/navigation-night) include:
        // - Roads, boundaries, water features, terrain shading
        // - All rendered as vectors = crisp at any zoom level

        // REAL Pakistan Country Boundary (FeatureLayer from Living Atlas - VECTOR)
        const pakistanCountryLayer = new FeatureLayer({
          url: GIS_LAYERS.adminBoundaries.country.url,
          title: '🇵🇰 Pakistan Boundary',
          visible: true,
          opacity: 0.9,
          definitionExpression: GIS_LAYERS.adminBoundaries.country.definitionExpression,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 0, 0],
              outline: { color: [59, 130, 246], width: 3 }
            }
          }
        });

        // REAL Province Boundaries (FeatureLayer from Living Atlas - VECTOR)
        const provinceBoundaryLayer = new FeatureLayer({
          url: GIS_LAYERS.adminBoundaries.provinces.url,
          title: 'Province Boundaries',
          visible: true,
          opacity: 0.8,
          definitionExpression: GIS_LAYERS.adminBoundaries.provinces.definitionExpression,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 0, 0],
              outline: { color: [16, 185, 129], width: 2 }
            }
          }
        });

        // Flood zones layer (GraphicsLayer for dynamic data - VECTOR)
        const floodZonesLayer = new GraphicsLayer({ title: 'Flood Forecast Zones', visible: false });

        // Build layers array - VECTOR ONLY
        // NO TileLayers (raster) to prevent pixelation
        // Weather animation layers (precipLayer, windLayer) REMOVED
        const mapLayers = [
          pakistanCountryLayer,     // Pakistan country boundary (VECTOR)
          provinceBoundaryLayer,    // Province boundaries (VECTOR)
          floodZonesLayer,          // Flood forecast zones (VECTOR Graphics)
          locationLayer             // Top - user location marker (VECTOR Graphics)
        ];

        // Map with theme-aware basemap
        const map = new Map({
          basemap: getBasemapByTheme(theme),
          layers: mapLayers
        });
        mapInstanceRef.current = map;

        // MapView with HiDPI support for crisp rendering
        const view = new MapView({
          container: mapContainerRef.current,
          map: map,
          center: PAKISTAN_CONFIG.center,
          zoom: PAKISTAN_CONFIG.zoom,
          constraints: {
            geometry: pakistanBoundary,
            minZoom: PAKISTAN_CONFIG.minZoom,
            maxZoom: PAKISTAN_CONFIG.maxZoom,
            rotationEnabled: false
          },
          ui: { components: ['zoom', 'compass'] },
          // FIX BLURRINESS: Force high DPI rendering
          pixelRatio: window.devicePixelRatio || 1,
          qualityProfile: 'high'
        });
        viewRef.current = view;


        await view.when();

        // ============================================================
        // UI WIDGETS - LayerList and Legend
        // ============================================================

        // LayerList Widget
        const layerList = new LayerList({
          view: view,
          listItemCreatedFunction: (event) => {
            const item = event.item;
            // Add legend for each layer
            item.panel = {
              content: 'legend',
              open: false
            };
          }
        });

        const layerListExpand = new Expand({
          view: view,
          content: layerList,
          expandIcon: 'layers',
          expandTooltip: 'Layer List',
          expanded: false,
          group: 'top-left'
        });
        view.ui.add(layerListExpand, 'top-left');

        // Legend Widget
        const legend = new Legend({
          view: view,
          style: 'card'
        });

        const legendExpand = new Expand({
          view: view,
          content: legend,
          expandIcon: 'legend',
          expandTooltip: 'Legend',
          expanded: false,
          group: 'top-left'
        });
        view.ui.add(legendExpand, 'top-left');

        // ============================================================
        // SEARCH WIDGET - ArcGIS Geocoding with Autocomplete
        // Uses World Geocoding Service for address/place search
        // National level - full Pakistan coverage
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
          allPlaceholder: 'Search location in Pakistan...',
          goToOverride: (view, options) => {
            return view.goTo({
              target: options.target,
              zoom: 8  // National level zoom
            }, { duration: 1000, easing: 'ease-in-out' });
          }
        });
        view.ui.add(searchWidget, { position: 'top-right' });

        console.log('✓ GIS Layers and Widgets initialized');

        // ============================================================
        // WEATHER ANIMATION SERVICE REMOVED
        // initAnimationMode function removed - weatherAnimationService no longer exists
        // Weather is now displayed as numeric data in info panels only
        // ============================================================

        // Handle map view changes - debounced using reactiveUtils (replaces deprecated view.watch)
        reactiveUtils.watch(
          () => view.center,
          (center) => {
            if (viewMoveTimeoutRef.current) {
              clearTimeout(viewMoveTimeoutRef.current);
            }
            viewMoveTimeoutRef.current = setTimeout(() => {
              if (center) {
                console.log(`Map moved to: ${center.latitude.toFixed(4)}, ${center.longitude.toFixed(4)}`);
                loadWeatherData(center.latitude, center.longitude);
                // Weather animation reinitialization removed - animations no longer exist
              }
            }, 2000); // 2 second debounce for better performance
          }
        );

        // Click to get weather for specific point
        view.on('click', async (event) => {
          const { latitude, longitude } = event.mapPoint;
          console.log(`Clicked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

          // Add marker at clicked location
          locationLayer.removeAll();
          locationLayer.add(new Graphic({
            geometry: new Point({
              longitude: longitude,
              latitude: latitude,
              spatialReference: { wkid: 4326 }
            }),
            symbol: new SimpleMarkerSymbol({
              style: 'circle',
              color: [59, 130, 246, 255],
              size: 12,
              outline: { color: [255, 255, 255], width: 3 }
            })
          }));

          loadWeatherData(latitude, longitude);
        });

        if (isMounted) {
          setIsLoading(false);
          console.log('✓ NationalMap loaded: Pakistan');
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
    // Without this, WebGL renders at wrong resolution causing blur
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
            console.log('🔄 NationalMap resized for crisp rendering');
          }
        }, 100);  // 100ms debounce
      });

      resizeObserver.observe(container);
      console.log('✓ ResizeObserver attached to NationalMap container');
    };

    // Delay observer setup until view is ready
    setTimeout(setupResizeObserver, 500);

    return () => {
      isMounted = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (viewMoveTimeoutRef.current) clearTimeout(viewMoveTimeoutRef.current);
      // Rain/Wind animation cleanup removed - animations no longer exist
      viewRef.current?.destroy();
      mapInstanceRef.current?.destroy();
    };
  }, [loadWeatherData]);

  // ============================================================================
  // THEME-REACTIVE BASEMAP SWITCHING
  // Updates basemap when user toggles dark/light mode without reloading map
  // ============================================================================

  useEffect(() => {
    if (mapInstanceRef.current) {
      const newBasemap = getBasemapByTheme(theme);
      mapInstanceRef.current.basemap = newBasemap;
      console.log(`✓ Basemap switched to: ${newBasemap}`);
    }
  }, [theme]);

  // ============================================================================
  // TOGGLE HANDLERS - REMOVED
  // ============================================================================
  // Weather animation toggles removed:
  // - toggleRain, toggleWind, togglePrecipitation
  // Reason: Animations no longer exist - Meteo provides numeric data only

  // Navigate to city
  const navigateToCity = useCallback((city) => {
    if (viewRef.current) {
      viewRef.current.goTo({
        center: [city.lon, city.lat],
        zoom: 10
      }, { duration: 1500 });
    }
  }, []);

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
    backgroundColor: isActive ? '#1e40af' : '#3b82f6',
    color: '#ffffff',
    boxShadow: isActive
      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.25), 0 0 15px rgba(59, 130, 246, 0.5)'
      : '0 2px 4px rgba(0, 0, 0, 0.15)'
  });

  // activeLayers removed - weather animations no longer exist

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="national-map-wrapper">
      {/* Location & Weather Info Panel */}
      <div className="national-map-weather-bar">
        {/* Current Location */}
        <div className="national-map-location-row">
          <MapPin className="national-map-location-icon" />
          <span className="national-map-location-name">
            {currentLocation.name}
          </span>
          <span className="national-map-location-coords">
            ({currentLocation.lat.toFixed(2)}°N, {currentLocation.lon.toFixed(2)}°E)
          </span>
          {weatherLoading && (
            <Loader2 className="animate-spin national-map-weather-loading" />
          )}
          {/* Animation Mode Badge removed - weather animations no longer exist */}
        </div>

        {/* Weather Data */}
        {weatherData && (
          <div className="national-map-weather-data">
            <div className="national-map-weather-item">
              <Thermometer className="national-map-weather-icon temp" />
              <span className="national-map-weather-value">
                {weatherData.current.temperature}°C
              </span>
            </div>

            <div className="national-map-weather-item">
              <Wind className="national-map-weather-icon wind" />
              <span className="national-map-weather-value">
                {weatherData.current.windSpeed} km/h {getWindDirectionText(weatherData.current.windDirection)}
              </span>
            </div>

            <div className="national-map-weather-item">
              <Droplets className="national-map-weather-icon precip" />
              <span className="national-map-weather-value">
                {weatherData.current.precipitation} mm
              </span>
            </div>

            <div className="national-map-weather-item">
              <Gauge className="national-map-weather-icon humidity" />
              <span className="national-map-weather-value">
                {weatherData.current.humidity}%
              </span>
            </div>

            <div className="national-map-weather-status">
              <span className="national-map-weather-desc">
                {getWeatherDescription(weatherData.current.weatherCode)}
              </span>
              <button
                onClick={() => loadWeatherData(currentLocation.lat, currentLocation.lon)}
                disabled={weatherLoading}
                className="national-map-refresh-btn"
                title="Refresh weather data"
              >
                <RefreshCw
                  className={`national-map-refresh-icon ${weatherLoading ? 'spinning' : ''}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick City Navigation */}
      <div className="national-map-quickjump">
        <span className="national-map-quickjump-label">
          <Navigation className="national-map-quickjump-icon" />
          Quick Jump:
        </span>
        <div className="national-map-quickjump-buttons">
          {MAJOR_CITIES.map(city => (
            <button
              key={city.name}
              onClick={() => navigateToCity(city)}
              className="national-map-city-btn"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

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

        {/* Rain Canvas and Rain Overlay REMOVED - weather animations no longer exist */}

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
            <Loader2 className="animate-spin" style={{ width: '48px', height: '48px', color: '#3b82f6', marginBottom: '12px' }} />
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Loading Pakistan Map...</span>
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

        {/* Click Hint */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          color: '#ffffff',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '11px',
          zIndex: 3
        }}>
          💡 Click anywhere to get weather for that location
        </div>

        {/* National Label */}
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
          🇵🇰 NDMA National View
        </div>
      </div>

      {/* Weather legend section removed - weather animations no longer exist */}
      {/* Weather info is shown in the panel at the top */}
    </div>
  );
};

export default NationalMap;
