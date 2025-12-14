/**
 * ProvincialMap Component - NRCCS PDMA Dashboard
 * ArcGIS JavaScript API 4.33 with REAL Weather Data
 * 
 * Features:
 * - Punjab Province interactive map
 * - Dynamic weather based on map center location
 * - Click on any location to get weather data
 * - REAL wind data from Open-Meteo API
 * - REAL precipitation data from Open-Meteo API
 * - Wind particles flowing in ACTUAL wind direction
 * - Weather info panel showing current conditions for viewed area
 * 
 * USED BY: PDMA Dashboard (Provincial Level)
 * PURPOSE: Real-time weather visualization for Punjab Province
 * 
 * WEATHER API: Open-Meteo (free, no API key required)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { CloudRain, Wind, Droplets, Loader2, Layers, Thermometer, Gauge, RefreshCw, MapPin, Navigation } from 'lucide-react';

// ArcGIS Core Modules (4.33)
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

// ArcGIS Dark Theme CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// Theme
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Punjab Province Configuration
const PUNJAB_CONFIG = {
  name: 'Punjab',
  center: [72.7097, 31.1704], // Punjab center (lon, lat)
  zoom: 7,
  minZoom: 6,
  maxZoom: 16,
  bounds: {
    minLon: 69.3,
    minLat: 27.7,
    maxLon: 75.4,
    maxLat: 34.0
  }
};

// Punjab Districts/Cities for quick navigation
const PUNJAB_CITIES = [
  { name: 'Lahore', lat: 31.5497, lon: 74.3436 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Gujranwala', lat: 32.1877, lon: 74.1945 },
  { name: 'Sialkot', lat: 32.4945, lon: 74.5229 },
  { name: 'Bahawalpur', lat: 29.3956, lon: 71.6836 },
  { name: 'Sargodha', lat: 32.0836, lon: 72.6711 },
  { name: 'DG Khan', lat: 30.0489, lon: 70.6455 },
  { name: 'Sahiwal', lat: 30.6682, lon: 73.1114 }
];

// Open-Meteo API URL (free, no API key needed)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// ============================================================================
// WEATHER SERVICE
// ============================================================================

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

const getLocationName = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
    );
    const data = await response.json();
    return data.address?.city || data.address?.town || data.address?.county || data.address?.state_district || 'Unknown Location';
  } catch {
    return 'Unknown Location';
  }
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

const ProvincialMap = ({ province = 'Punjab', height = '450px' }) => {
  // Refs
  const mapContainerRef = useRef(null);
  const rainCanvasRef = useRef(null);
  const viewRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const windLayerRef = useRef(null);
  const precipLayerRef = useRef(null);
  const locationMarkerRef = useRef(null);
  const rainAnimationRef = useRef(null);
  const windAnimationRef = useRef(null);
  const windParticlesRef = useRef([]);
  const windAnimatingRef = useRef(false);
  const weatherDataRef = useRef(null);
  const noiseGridRef = useRef(null);
  const precipZonesRef = useRef(null);
  const viewMoveTimeoutRef = useRef(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [rainEnabled, setRainEnabled] = useState(false);
  const [windEnabled, setWindEnabled] = useState(false);
  const [precipEnabled, setPrecipEnabled] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 31.1704, lon: 72.7097, name: 'Punjab' });
  const [lastUpdate, setLastUpdate] = useState(null);

  // Theme
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // ============================================================================
  // FETCH WEATHER DATA
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
      
      precipZonesRef.current = null;
    }
    setWeatherLoading(false);
  }, []);

  useEffect(() => {
    loadWeatherData(PUNJAB_CONFIG.center[1], PUNJAB_CONFIG.center[0]);
  }, [loadWeatherData]);

  // ============================================================================
  // GET CURRENT VIEW BOUNDS
  // ============================================================================

  const getCurrentViewBounds = useCallback(() => {
    const view = viewRef.current;
    if (!view?.extent) return PUNJAB_CONFIG.bounds;
    
    return {
      minLon: view.extent.xmin,
      minLat: view.extent.ymin,
      maxLon: view.extent.xmax,
      maxLat: view.extent.ymax
    };
  }, []);

  // ============================================================================
  // RAIN ANIMATION
  // ============================================================================

  const startRainAnimation = useCallback(() => {
    const canvas = rainCanvasRef.current;
    const weather = weatherDataRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const precipitation = weather?.current?.precipitation || 0;
    const rain = weather?.current?.rain || 0;
    const actualRain = Math.max(precipitation, rain);
    
    const baseDrops = 50;
    const maxDrops = 400;
    const dropCount = Math.min(maxDrops, baseDrops + Math.floor(actualRain * 35));

    const rainDrops = [];
    for (let i = 0; i < dropCount; i++) {
      rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 25 + 10 + (actualRain * 2),
        speed: Math.random() * 15 + 10 + (actualRain * 0.5),
        opacity: Math.random() * 0.4 + 0.2,
        thickness: Math.random() * 1.5 + 0.5
      });
    }

    const windDir = weather?.current?.windDirection || 0;
    const windSpeed = weather?.current?.windSpeed || 0;
    const rainAngle = (windDir - 90) * (Math.PI / 180);
    const windEffect = Math.min(windSpeed / 20, 1) * 5;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rainDrops.forEach(drop => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity})`;
        ctx.lineWidth = drop.thickness;
        ctx.lineCap = 'round';
        
        const endX = drop.x - Math.sin(rainAngle) * drop.length;
        const endY = drop.y + Math.cos(rainAngle) * drop.length;
        
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        if (drop.y > canvas.height - 15) {
          ctx.beginPath();
          ctx.arc(endX, canvas.height - 3, 2, 0, Math.PI, true);
          ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity * 0.4})`;
          ctx.stroke();
        }

        drop.y += drop.speed;
        drop.x += windEffect * Math.sin(rainAngle);

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
        if (drop.x < -20) drop.x = canvas.width + 20;
        if (drop.x > canvas.width + 20) drop.x = -20;
      });

      rainAnimationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const stopRainAnimation = useCallback(() => {
    if (rainAnimationRef.current) {
      cancelAnimationFrame(rainAnimationRef.current);
      rainAnimationRef.current = null;
    }
    const canvas = rainCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // ============================================================================
  // WIND ANIMATION
  // ============================================================================

  const createNoiseField = useCallback(() => {
    const gridSize = 8;
    const noiseGrid = [];
    for (let i = 0; i < gridSize; i++) {
      noiseGrid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        noiseGrid[i][j] = {
          angle: Math.random() * Math.PI * 2,
          magnitude: 0.3 + Math.random() * 0.7
        };
      }
    }
    return noiseGrid;
  }, []);

  const getTurbulence = useCallback((x, y, bounds, noiseGrid) => {
    if (!noiseGrid) return { dx: 0, dy: 0 };
    
    const gridSize = noiseGrid.length;
    const normalizedX = (x - bounds.minLon) / (bounds.maxLon - bounds.minLon);
    const normalizedY = (y - bounds.minLat) / (bounds.maxLat - bounds.minLat);
    
    const gridX = Math.max(0, Math.min(gridSize - 1, normalizedX * (gridSize - 1)));
    const gridY = Math.max(0, Math.min(gridSize - 1, normalizedY * (gridSize - 1)));
    
    const x0 = Math.floor(gridX);
    const y0 = Math.floor(gridY);
    const x1 = Math.min(x0 + 1, gridSize - 1);
    const y1 = Math.min(y0 + 1, gridSize - 1);
    
    const fx = gridX - x0;
    const fy = gridY - y0;
    
    const n00 = noiseGrid[x0]?.[y0] || { angle: 0, magnitude: 0 };
    const n10 = noiseGrid[x1]?.[y0] || { angle: 0, magnitude: 0 };
    const n01 = noiseGrid[x0]?.[y1] || { angle: 0, magnitude: 0 };
    const n11 = noiseGrid[x1]?.[y1] || { angle: 0, magnitude: 0 };
    
    const angle = n00.angle * (1 - fx) * (1 - fy) +
                  n10.angle * fx * (1 - fy) +
                  n01.angle * (1 - fx) * fy +
                  n11.angle * fx * fy;
    
    const magnitude = n00.magnitude * (1 - fx) * (1 - fy) +
                      n10.magnitude * fx * (1 - fy) +
                      n01.magnitude * (1 - fx) * fy +
                      n11.magnitude * fx * fy;
    
    return {
      dx: Math.cos(angle) * magnitude * 0.15,
      dy: Math.sin(angle) * magnitude * 0.15
    };
  }, []);

  const initWindParticles = useCallback(() => {
    const bounds = getCurrentViewBounds();
    const weather = weatherDataRef.current;
    
    noiseGridRef.current = createNoiseField();
    
    const windSpeed = weather?.current?.windSpeed || 5;
    const baseCount = 130;
    const particleCount = Math.min(280, Math.floor(baseCount + windSpeed * 2));
    
    const particles = [];
    const width = bounds.maxLon - bounds.minLon;
    const height = bounds.maxLat - bounds.minLat;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: bounds.minLon + Math.random() * width,
        y: bounds.minLat + Math.random() * height,
        trail: [],
        baseSpeed: 0.0015 + Math.random() * 0.002,
        age: Math.random() * 80,
        maxAge: 60 + Math.random() * 60,
        turbulencePhase: Math.random() * Math.PI * 2
      });
    }
    windParticlesRef.current = particles;
  }, [createNoiseField, getCurrentViewBounds]);

  const runWindAnimation = useCallback(() => {
    const graphicsLayer = windLayerRef.current;
    const weather = weatherDataRef.current;
    
    if (!graphicsLayer || !windAnimatingRef.current) return;

    const bounds = getCurrentViewBounds();
    const particles = windParticlesRef.current;
    const noiseGrid = noiseGridRef.current;
    const time = Date.now() * 0.001;
    
    const windDirDegrees = weather?.current?.windDirection || 0;
    const windSpeedKmh = weather?.current?.windSpeed || 5;
    
    const windAngleRad = ((windDirDegrees + 180) % 360) * (Math.PI / 180);
    
    const baseWindX = Math.sin(windAngleRad);
    const baseWindY = Math.cos(windAngleRad);
    
    const speedScale = 0.0015 + (windSpeedKmh / 80) * 0.003;
    const turbulenceScale = Math.max(0.1, 0.4 - windSpeedKmh / 100);

    graphicsLayer.removeAll();
    const graphics = [];
    
    const width = bounds.maxLon - bounds.minLon;
    const height = bounds.maxLat - bounds.minLat;

    particles.forEach((p) => {
      const turbulence = getTurbulence(p.x, p.y, bounds, noiseGrid);
      const oscillation = Math.sin(time * 2 + p.turbulencePhase) * 0.3;
      
      const moveX = (baseWindX + turbulence.dx * turbulenceScale + oscillation * turbulence.dy) * (p.baseSpeed + speedScale);
      const moveY = (baseWindY + turbulence.dy * turbulenceScale + oscillation * turbulence.dx) * (p.baseSpeed + speedScale);
      
      p.x += moveX;
      p.y += moveY;
      p.age++;

      p.trail.push({ x: p.x, y: p.y });
      
      const maxTrailLength = Math.floor(11 + windSpeedKmh / 5);
      if (p.trail.length > maxTrailLength) p.trail.shift();

      const margin = width * 0.02;
      const outOfBounds = p.x > bounds.maxLon + margin || p.x < bounds.minLon - margin ||
                          p.y > bounds.maxLat + margin || p.y < bounds.minLat - margin;
      
      if (outOfBounds || p.age > p.maxAge) {
        const spawnEdge = Math.random();
        const windFromX = -baseWindX;
        const windFromY = -baseWindY;
        
        if (Math.abs(windFromX) > Math.abs(windFromY)) {
          p.x = windFromX > 0 ? bounds.minLon - margin : bounds.maxLon + margin;
          p.y = bounds.minLat + Math.random() * height;
        } else {
          p.x = bounds.minLon + Math.random() * width;
          p.y = windFromY > 0 ? bounds.minLat - margin : bounds.maxLat + margin;
        }
        
        if (spawnEdge < 0.3) {
          p.x = bounds.minLon + Math.random() * width;
          p.y = bounds.minLat + Math.random() * height;
        }
        
        p.trail = [];
        p.age = 0;
        p.turbulencePhase = Math.random() * Math.PI * 2;
      }

      if (p.trail.length > 3) {
        const lifeFade = 1 - (p.age / p.maxAge);
        const trailFade = Math.min(1, p.trail.length / 6);
        const alpha = lifeFade * trailFade;

        let r, g, b;
        if (windSpeedKmh < 10) {
          [r, g, b] = [100, 180, 255];
        } else if (windSpeedKmh < 20) {
          [r, g, b] = [80, 200, 255];
        } else if (windSpeedKmh < 35) {
          [r, g, b] = [60, 220, 220];
        } else if (windSpeedKmh < 50) {
          [r, g, b] = [100, 230, 150];
        } else {
          [r, g, b] = [255, 220, 80];
        }

        const paths = p.trail.map(t => [t.x, t.y]);
        
        graphics.push(new Graphic({
          geometry: new Polyline({
            paths: [paths],
            spatialReference: { wkid: 4326 }
          }),
          symbol: new SimpleLineSymbol({
            color: [r, g, b, alpha * 180],
            width: 1.5 + (windSpeedKmh / 40),
            cap: 'round',
            join: 'round'
          })
        }));

        const head = p.trail[p.trail.length - 1];
        graphics.push(new Graphic({
          geometry: new Point({
            longitude: head.x,
            latitude: head.y,
            spatialReference: { wkid: 4326 }
          }),
          symbol: new SimpleMarkerSymbol({
            style: 'circle',
            color: [r, g, b, alpha * 230],
            size: 3 + (windSpeedKmh / 30),
            outline: { color: [255, 255, 255, alpha * 80], width: 0.5 }
          })
        }));
      }
    });

    graphicsLayer.addMany(graphics);

    if (windAnimatingRef.current) {
      windAnimationRef.current = setTimeout(runWindAnimation, 40);
    }
  }, [getTurbulence, getCurrentViewBounds]);

  const startWindAnimation = useCallback(() => {
    windAnimatingRef.current = true;
    initWindParticles();
    runWindAnimation();
  }, [initWindParticles, runWindAnimation]);

  const stopWindAnimation = useCallback(() => {
    windAnimatingRef.current = false;
    if (windAnimationRef.current) {
      clearTimeout(windAnimationRef.current);
      windAnimationRef.current = null;
    }
    if (windLayerRef.current?.type === 'graphics') {
      windLayerRef.current.removeAll();
    }
  }, []);

  // ============================================================================
  // PRECIPITATION ZONES
  // ============================================================================

  const createPrecipitationZones = useCallback(() => {
    const bounds = getCurrentViewBounds();
    const weather = weatherDataRef.current;
    const graphics = [];

    const currentPrecip = weather?.current?.precipitation || 0;
    const precipProb = weather?.hourly?.precipitationProbability?.[0] || 0;
    
    const zoneCount = Math.max(3, Math.min(8, Math.floor(currentPrecip * 2) + Math.floor(precipProb / 20)));

    if (!precipZonesRef.current || precipZonesRef.current.length !== zoneCount) {
      const zones = [];
      const width = bounds.maxLon - bounds.minLon;
      const height = bounds.maxLat - bounds.minLat;
      
      const cols = Math.ceil(Math.sqrt(zoneCount));
      const rows = Math.ceil(zoneCount / cols);
      
      for (let i = 0; i < zoneCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const baseX = bounds.minLon + (col + 0.5) * (width / cols);
        const baseY = bounds.minLat + (row + 0.5) * (height / rows);
        
        const seedX = Math.sin(i * 12.9898) * 43758.5453;
        const seedY = Math.sin(i * 78.233) * 43758.5453;
        const offsetX = ((seedX - Math.floor(seedX)) - 0.5) * width * 0.15;
        const offsetY = ((seedY - Math.floor(seedY)) - 0.5) * height * 0.15;
        
        zones.push({
          centerX: Math.max(bounds.minLon + width * 0.05, Math.min(bounds.maxLon - width * 0.05, baseX + offsetX)),
          centerY: Math.max(bounds.minLat + height * 0.05, Math.min(bounds.maxLat - height * 0.05, baseY + offsetY)),
          sizeVariance: 0.8 + ((seedX + seedY) % 1) * 0.4,
          shapeSeeds: Array.from({ length: 18 }, (_, j) => 
            0.6 + (Math.sin((i * 18 + j) * 43.233) * 0.5 + 0.5) * 0.8
          )
        });
      }
      precipZonesRef.current = zones;
    }

    const width = bounds.maxLon - bounds.minLon;
    const height = bounds.maxLat - bounds.minLat;
    const baseSize = Math.min(width, height) * 0.1;

    precipZonesRef.current.forEach((zone, i) => {
      const size = (baseSize + (currentPrecip / 15) * baseSize) * zone.sizeVariance;
      const intensity = Math.min(1, (currentPrecip / 10) + (precipProb / 100) * 0.5 + (i / precipZonesRef.current.length) * 0.2);

      const points = [];
      const segments = 18;
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const variance = zone.shapeSeeds[j % 18];
        const r = size * variance;
        points.push([
          zone.centerX + Math.cos(angle) * r,
          zone.centerY + Math.sin(angle) * r * 0.85
        ]);
      }

      const red = Math.floor(59 + (1 - intensity) * 100);
      const green = Math.floor(130 - intensity * 60);
      const blue = Math.floor(200 + intensity * 55);
      const alpha = 60 + intensity * 90;

      graphics.push(new Graphic({
        geometry: new Polygon({
          rings: [points],
          spatialReference: { wkid: 4326 }
        }),
        symbol: new SimpleFillSymbol({
          color: [red, green, blue, alpha],
          outline: new SimpleLineSymbol({
            color: [red - 20, green - 20, blue, alpha + 20],
            width: 1.5
          })
        })
      }));
    });

    return graphics;
  }, [getCurrentViewBounds]);

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
        }

        const punjabBoundary = new Polygon({
          rings: [[
            [PUNJAB_CONFIG.bounds.minLon, PUNJAB_CONFIG.bounds.minLat],
            [PUNJAB_CONFIG.bounds.minLon, PUNJAB_CONFIG.bounds.maxLat],
            [PUNJAB_CONFIG.bounds.maxLon, PUNJAB_CONFIG.bounds.maxLat],
            [PUNJAB_CONFIG.bounds.maxLon, PUNJAB_CONFIG.bounds.minLat],
            [PUNJAB_CONFIG.bounds.minLon, PUNJAB_CONFIG.bounds.minLat]
          ]],
          spatialReference: { wkid: 4326 }
        });

        const windLayer = new GraphicsLayer({ title: 'Wind Flow', visible: false });
        const precipLayer = new GraphicsLayer({ title: 'Precipitation', visible: false });
        const locationLayer = new GraphicsLayer({ title: 'Location Marker', visible: true });

        windLayerRef.current = windLayer;
        precipLayerRef.current = precipLayer;
        locationMarkerRef.current = locationLayer;

        const map = new Map({
          basemap: apiKey ? 'hybrid' : 'satellite',
          layers: [precipLayer, windLayer, locationLayer]
        });
        mapInstanceRef.current = map;

        const view = new MapView({
          container: mapContainerRef.current,
          map: map,
          center: PUNJAB_CONFIG.center,
          zoom: PUNJAB_CONFIG.zoom,
          constraints: {
            geometry: punjabBoundary,
            minZoom: PUNJAB_CONFIG.minZoom,
            maxZoom: PUNJAB_CONFIG.maxZoom,
            rotationEnabled: false
          },
          ui: { components: ['zoom', 'compass'] }
        });
        viewRef.current = view;

        await view.when();

        // Handle map view changes
        view.watch('center', () => {
          if (viewMoveTimeoutRef.current) {
            clearTimeout(viewMoveTimeoutRef.current);
          }
          viewMoveTimeoutRef.current = setTimeout(() => {
            const center = view.center;
            if (center) {
              loadWeatherData(center.latitude, center.longitude);
              
              if (windEnabled) {
                initWindParticles();
              }
              if (precipEnabled) {
                precipZonesRef.current = null;
                precipLayerRef.current?.removeAll();
                const zones = createPrecipitationZones();
                precipLayerRef.current?.addMany(zones);
              }
            }
          }, 1000);
        });

        // Click handler
        view.on('click', async (event) => {
          const { latitude, longitude } = event.mapPoint;
          
          locationLayer.removeAll();
          locationLayer.add(new Graphic({
            geometry: new Point({
              longitude: longitude,
              latitude: latitude,
              spatialReference: { wkid: 4326 }
            }),
            symbol: new SimpleMarkerSymbol({
              style: 'circle',
              color: [16, 185, 129, 255],
              size: 12,
              outline: { color: [255, 255, 255], width: 3 }
            })
          }));

          loadWeatherData(latitude, longitude);
        });

        if (isMounted) {
          setIsLoading(false);
          console.log('✓ ProvincialMap loaded: Punjab');
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
      stopWindAnimation();
      viewRef.current?.destroy();
      mapInstanceRef.current?.destroy();
    };
  }, [loadWeatherData, stopRainAnimation, stopWindAnimation]);

  // ============================================================================
  // TOGGLE HANDLERS
  // ============================================================================

  const toggleRain = useCallback(() => {
    const newState = !rainEnabled;
    setRainEnabled(newState);
    newState ? startRainAnimation() : stopRainAnimation();
  }, [rainEnabled, startRainAnimation, stopRainAnimation]);

  const toggleWind = useCallback(() => {
    const newState = !windEnabled;
    setWindEnabled(newState);
    if (windLayerRef.current) {
      windLayerRef.current.visible = newState;
      newState ? startWindAnimation() : stopWindAnimation();
    }
  }, [windEnabled, startWindAnimation, stopWindAnimation]);

  const togglePrecipitation = useCallback(() => {
    const newState = !precipEnabled;
    setPrecipEnabled(newState);
    if (precipLayerRef.current) {
      precipLayerRef.current.visible = newState;
      if (newState) {
        precipZonesRef.current = null;
        const zones = createPrecipitationZones();
        precipLayerRef.current.addMany(zones);
      } else {
        precipLayerRef.current.removeAll();
      }
    }
  }, [precipEnabled, createPrecipitationZones]);

  const navigateToCity = useCallback((city) => {
    if (viewRef.current) {
      viewRef.current.goTo({
        center: [city.lon, city.lat],
        zoom: 11
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
    backgroundColor: isActive ? '#166534' : '#10b981',
    color: '#ffffff',
    boxShadow: isActive 
      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.25), 0 0 15px rgba(16, 185, 129, 0.5)' 
      : '0 2px 4px rgba(0, 0, 0, 0.15)'
  });

  const activeLayers = [];
  if (rainEnabled) activeLayers.push('Rain');
  if (windEnabled) activeLayers.push('Wind');
  if (precipEnabled) activeLayers.push('Precipitation');

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ width: '100%' }}>
      {/* Location & Weather Info Panel */}
      <div
        style={{
          marginBottom: '12px',
          padding: '14px 18px',
          backgroundColor: isLight ? '#ecfdf5' : '#064e3b',
          borderRadius: '12px',
          border: `1px solid ${isLight ? '#a7f3d0' : '#065f46'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <MapPin style={{ width: '18px', height: '18px', color: '#10b981' }} />
          <span style={{ color: colors.textPrimary, fontWeight: '700', fontSize: '15px' }}>
            {currentLocation.name}
          </span>
          <span style={{ color: colors.textMuted, fontSize: '12px' }}>
            ({currentLocation.lat.toFixed(2)}°N, {currentLocation.lon.toFixed(2)}°E)
          </span>
          {weatherLoading && (
            <Loader2 className="animate-spin" style={{ width: '14px', height: '14px', color: '#10b981', marginLeft: 'auto' }} />
          )}
        </div>

        {weatherData && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer style={{ width: '16px', height: '16px', color: '#f97316' }} />
              <span style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>
                {weatherData.current.temperature}°C
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
              <span style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>
                {weatherData.current.windSpeed} km/h {getWindDirectionText(weatherData.current.windDirection)}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
              <span style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>
                {weatherData.current.precipitation} mm
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
              <span style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '14px' }}>
                {weatherData.current.humidity}%
              </span>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: colors.textMuted, fontSize: '11px' }}>
                {getWeatherDescription(weatherData.current.weatherCode)}
              </span>
              <button
                onClick={() => loadWeatherData(currentLocation.lat, currentLocation.lon)}
                disabled={weatherLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  opacity: weatherLoading ? 0.5 : 1
                }}
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
      </div>

      {/* Quick City Navigation */}
      <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ color: colors.textMuted, fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
          <Navigation style={{ width: '12px', height: '12px', marginRight: '4px' }} />
          Quick Jump:
        </span>
        {PUNJAB_CITIES.map(city => (
          <button
            key={city.name}
            onClick={() => navigateToCity(city)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${colors.cardBorder}`,
              backgroundColor: colors.cardBg,
              color: colors.textSecondary,
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = colors.cardBg;
              e.target.style.color = colors.textSecondary;
            }}
          >
            {city.name}
          </button>
        ))}
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

        {rainEnabled && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(30, 58, 95, 0.3) 0%, rgba(15, 23, 42, 0.4) 100%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}

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
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Loading Punjab Map...</span>
          </div>
        )}

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

        {!isLoading && activeLayers.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderRadius: '20px',
            zIndex: 5
          }}>
            <Layers style={{ width: '14px', height: '14px', color: '#10b981' }} />
            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600' }}>
              {activeLayers.length} Active
            </span>
          </div>
        )}

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
          📍 PDMA Punjab Province
        </div>
      </div>

      {/* Toggle Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
        <button onClick={toggleRain} style={getButtonStyle(rainEnabled)}>
          <CloudRain style={{ width: '18px', height: '18px' }} />
          Rain Effect
          {rainEnabled && <span style={{ opacity: 0.8 }}>●</span>}
        </button>

        <button onClick={toggleWind} style={getButtonStyle(windEnabled)}>
          <Wind style={{ width: '18px', height: '18px' }} />
          Wind Flow
          {windEnabled && <span style={{ opacity: 0.8 }}>●</span>}
        </button>

        <button onClick={togglePrecipitation} style={getButtonStyle(precipEnabled)}>
          <Droplets style={{ width: '18px', height: '18px' }} />
          Precipitation
          {precipEnabled && <span style={{ opacity: 0.8 }}>●</span>}
        </button>
      </div>

      {/* Legend */}
      {activeLayers.length > 0 && weatherData && (
        <div style={{
          marginTop: '14px',
          padding: '16px 20px',
          backgroundColor: isLight ? '#f8fafc' : '#1e293b',
          borderRadius: '12px',
          border: `1px solid ${colors.cardBorder || colors.border}`
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: colors.textSecondary, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Live Weather for {currentLocation.name}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rainEnabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#3b82f620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudRain style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                </div>
                <div>
                  <div style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                    Rain ({weatherData.current.precipitation}mm)
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: '11px' }}>
                    Angle based on {weatherData.current.windSpeed} km/h {getWindDirectionText(weatherData.current.windDirection)} wind
                  </div>
                </div>
              </div>
            )}
            
            {windEnabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#60a5fa20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wind style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
                </div>
                <div>
                  <div style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                    Wind: {weatherData.current.windSpeed} km/h
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: '11px' }}>
                    Direction: {getWindDirectionText(weatherData.current.windDirection)} ({weatherData.current.windDirection}°) • Gusts: {weatherData.current.windGusts} km/h
                  </div>
                </div>
              </div>
            )}
            
            {precipEnabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
                </div>
                <div>
                  <div style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                    Precipitation: {weatherData.current.precipitation}mm
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: '11px' }}>
                    Probability: {weatherData.hourly.precipitationProbability[0]}% • {getWeatherDescription(weatherData.current.weatherCode)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvincialMap;
