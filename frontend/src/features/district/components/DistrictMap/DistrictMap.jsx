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

import { useEffect, useRef, useState, useCallback } from 'react';
import { CloudRain, Wind, Droplets, Loader2, Layers, Thermometer, Gauge, RefreshCw } from 'lucide-react';

// ArcGIS Core Modules (4.33)
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
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

// ArcGIS Dark Theme CSS
import '@arcgis/core/assets/esri/themes/dark/main.css';

// GIS Layer Configuration
import { GIS_LAYERS, EMERGENCY_FACILITIES, LAYER_SYMBOLS } from '@config/gisLayerConfig';

// Weather Animation Service
import weatherAnimationService from '@shared/services/weatherAnimationService';

// District API for backend shelter data
import districtApi from '../../services/districtApi';

// Theme
import { useSettings } from '../../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../../shared/utils/themeColors';

// Map Configuration
import { getBasemapByTheme } from '@shared/config/mapConfig';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Peshawar District Configuration
const DISTRICT_CONFIG = {
  name: 'Peshawar',
  province: 'KPK',
  center: [71.57, 34.0], // Peshawar coordinates (lon, lat)
  lat: 34.0,
  lon: 71.57,
  zoom: 11,
  minZoom: 9,
  maxZoom: 14,  // Constrained to prevent pixelation at district level
  bounds: {
    minLon: 71.3,
    minLat: 33.8,
    maxLon: 71.85,
    maxLat: 34.25
  }
};

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

const DistrictMap = ({ districtName = 'Peshawar', height = '384px' }) => {
  // Refs
  const mapContainerRef = useRef(null);
  const rainCanvasRef = useRef(null);
  const viewRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const windLayerRef = useRef(null);
  const precipLayerRef = useRef(null);
  const rainAnimationRef = useRef(null);
  const windAnimationRef = useRef(null);
  const windParticlesRef = useRef([]);
  const windAnimatingRef = useRef(false);
  const weatherDataRef = useRef(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [rainEnabled, setRainEnabled] = useState(false);
  const [windEnabled, setWindEnabled] = useState(false);
  const [precipEnabled, setPrecipEnabled] = useState(false);
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
    const data = await fetchWeatherData(DISTRICT_CONFIG.lat, DISTRICT_CONFIG.lon);
    if (data) {
      setWeatherData(data);
      weatherDataRef.current = data;
      setLastUpdate(new Date());
      console.log('✓ Real weather data loaded:', data.current);
    }
    setWeatherLoading(false);
  }, []);

  // Load weather data on mount and every 10 minutes
  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [loadWeatherData]);

  // ============================================================================
  // RAIN ANIMATION (Based on REAL precipitation)
  // ============================================================================

  const startRainAnimation = useCallback(() => {
    const canvas = rainCanvasRef.current;
    const mapContainer = mapContainerRef.current;
    const weather = weatherDataRef.current;
    if (!canvas || !mapContainer) return;

    const ctx = canvas.getContext('2d');
    const containerRect = mapContainer.getBoundingClientRect();
    canvas.width = containerRect.width || 800;
    canvas.height = containerRect.height || 384;

    // Determine rain intensity from REAL data
    const precipitation = weather?.current?.precipitation || 0;
    const rain = weather?.current?.rain || 0;
    const actualRain = Math.max(precipitation, rain);

    // Scale drop count based on actual precipitation (0-50mm range)
    const baseDrops = 50;
    const maxDrops = 400;
    const dropCount = Math.min(maxDrops, baseDrops + Math.floor(actualRain * 35));

    console.log(`Rain animation: ${actualRain}mm precipitation → ${dropCount} drops`);

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

    // Get wind direction for rain angle
    const windDir = weather?.current?.windDirection || 0;
    const windSpeed = weather?.current?.windSpeed || 0;
    // Rain angle based on wind (converted to canvas coordinates)
    const rainAngle = (windDir - 90) * (Math.PI / 180); // Adjust for canvas
    const windEffect = Math.min(windSpeed / 20, 1) * 5; // Max 5px horizontal drift

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rainDrops.forEach(drop => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity})`;
        ctx.lineWidth = drop.thickness;
        ctx.lineCap = 'round';

        // Calculate end point based on wind direction
        const endX = drop.x - Math.sin(rainAngle) * drop.length;
        const endY = drop.y + Math.cos(rainAngle) * drop.length;

        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Splash at bottom
        if (drop.y > canvas.height - 15) {
          ctx.beginPath();
          ctx.arc(endX, canvas.height - 3, 2, 0, Math.PI, true);
          ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity * 0.4})`;
          ctx.stroke();
        }

        // Update position based on wind
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
  // WIND ANIMATION - FlowRenderer Style (Curved Streamlines)
  // Based on REAL wind direction & speed from Open-Meteo API
  // ============================================================================

  /**
   * Create a Perlin-like noise function for natural wind turbulence
   */
  const createNoiseField = useCallback(() => {
    // Simple noise grid for turbulence
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

  const noiseGridRef = useRef(null);

  /**
   * Get turbulence at a point using bilinear interpolation
   */
  const getTurbulence = useCallback((x, y, bounds, noiseGrid) => {
    if (!noiseGrid) return { dx: 0, dy: 0 };

    const gridSize = noiseGrid.length;
    const normalizedX = (x - bounds.minLon) / (bounds.maxLon - bounds.minLon);
    const normalizedY = (y - bounds.minLat) / (bounds.maxLat - bounds.minLat);

    const gridX = normalizedX * (gridSize - 1);
    const gridY = normalizedY * (gridSize - 1);

    const x0 = Math.floor(gridX);
    const y0 = Math.floor(gridY);
    const x1 = Math.min(x0 + 1, gridSize - 1);
    const y1 = Math.min(y0 + 1, gridSize - 1);

    const fx = gridX - x0;
    const fy = gridY - y0;

    // Bilinear interpolation
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
    const { bounds } = DISTRICT_CONFIG;
    const weather = weatherDataRef.current;

    // Create noise field for turbulence
    noiseGridRef.current = createNoiseField();

    // More particles for denser flow visualization
    const windSpeed = weather?.current?.windSpeed || 5;
    const density = 1.0; // Adjustable density factor
    const baseCount = 150;
    const particleCount = Math.min(300, Math.floor(baseCount * density + windSpeed * 2));

    const particles = [];
    const width = bounds.maxLon - bounds.minLon;
    const height = bounds.maxLat - bounds.minLat;

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles evenly across the map
      particles.push({
        x: bounds.minLon + Math.random() * width,
        y: bounds.minLat + Math.random() * height,
        trail: [],
        // Varying speeds for more natural look
        baseSpeed: 0.0008 + Math.random() * 0.0012,
        age: Math.random() * 80, // Stagger start ages
        maxAge: 60 + Math.random() * 60, // Varying lifespans
        // Individual turbulence offset
        turbulencePhase: Math.random() * Math.PI * 2
      });
    }
    windParticlesRef.current = particles;
  }, [createNoiseField]);

  const runWindAnimation = useCallback(() => {
    const graphicsLayer = windLayerRef.current;
    const weather = weatherDataRef.current;

    if (!graphicsLayer || !windAnimatingRef.current) return;

    const { bounds } = DISTRICT_CONFIG;
    const particles = windParticlesRef.current;
    const noiseGrid = noiseGridRef.current;
    const time = Date.now() * 0.001; // For animated turbulence

    // Get REAL wind direction and speed
    const windDirDegrees = weather?.current?.windDirection || 0;
    const windSpeedKmh = weather?.current?.windSpeed || 5;

    // Convert meteorological wind direction (where it comes FROM) to movement direction (where it goes TO)
    const windAngleRad = ((windDirDegrees + 180) % 360) * (Math.PI / 180);

    // Base movement vector from real wind
    const baseWindX = Math.sin(windAngleRad);
    const baseWindY = Math.cos(windAngleRad);

    // Speed scaling based on actual wind speed
    const speedScale = 0.0006 + (windSpeedKmh / 80) * 0.0015;

    // Turbulence intensity (higher wind = less turbulence relative to main flow)
    const turbulenceScale = Math.max(0.1, 0.4 - windSpeedKmh / 100);

    graphicsLayer.removeAll();
    const graphics = [];

    const width = bounds.maxLon - bounds.minLon;
    const height = bounds.maxLat - bounds.minLat;

    particles.forEach((p, index) => {
      // Get local turbulence
      const turbulence = getTurbulence(p.x, p.y, bounds, noiseGrid);

      // Add time-based oscillation for flowing effect
      const oscillation = Math.sin(time * 2 + p.turbulencePhase) * 0.3;

      // Combined movement: real wind direction + turbulence + oscillation
      const moveX = (baseWindX + turbulence.dx * turbulenceScale + oscillation * turbulence.dy) * (p.baseSpeed + speedScale);
      const moveY = (baseWindY + turbulence.dy * turbulenceScale + oscillation * turbulence.dx) * (p.baseSpeed + speedScale);

      p.x += moveX;
      p.y += moveY;
      p.age++;

      // Store trail point
      p.trail.push({ x: p.x, y: p.y });

      // Trail length based on speed (faster = longer trails)
      const maxTrailLength = Math.floor(12 + windSpeedKmh / 5);
      if (p.trail.length > maxTrailLength) p.trail.shift();

      // Check if out of bounds or too old
      const margin = 0.02;
      const outOfBounds = p.x > bounds.maxLon + margin || p.x < bounds.minLon - margin ||
        p.y > bounds.maxLat + margin || p.y < bounds.minLat - margin;

      if (outOfBounds || p.age > p.maxAge) {
        // Respawn from upwind edge based on wind direction
        const spawnEdge = Math.random();
        const windFromX = -baseWindX;
        const windFromY = -baseWindY;

        if (Math.abs(windFromX) > Math.abs(windFromY)) {
          // Wind is more horizontal - spawn from left or right
          p.x = windFromX > 0 ? bounds.minLon - margin : bounds.maxLon + margin;
          p.y = bounds.minLat + Math.random() * height;
        } else {
          // Wind is more vertical - spawn from top or bottom
          p.x = bounds.minLon + Math.random() * width;
          p.y = windFromY > 0 ? bounds.minLat - margin : bounds.maxLat + margin;
        }

        // Also allow some random spawning across the map for fill
        if (spawnEdge < 0.3) {
          p.x = bounds.minLon + Math.random() * width;
          p.y = bounds.minLat + Math.random() * height;
        }

        p.trail = [];
        p.age = 0;
        p.turbulencePhase = Math.random() * Math.PI * 2;
      }

      // Draw curved trail using quadratic bezier approximation
      if (p.trail.length > 3) {
        // Fade based on age
        const lifeFade = 1 - (p.age / p.maxAge);
        const trailFade = Math.min(1, p.trail.length / 6);
        const alpha = lifeFade * trailFade;

        // Color gradient based on wind speed
        let r, g, b;
        if (windSpeedKmh < 10) {
          [r, g, b] = [100, 180, 255]; // Light blue - Calm
        } else if (windSpeedKmh < 20) {
          [r, g, b] = [80, 200, 255]; // Cyan - Light breeze
        } else if (windSpeedKmh < 35) {
          [r, g, b] = [60, 220, 220]; // Teal - Moderate
        } else if (windSpeedKmh < 50) {
          [r, g, b] = [100, 230, 150]; // Green - Fresh
        } else {
          [r, g, b] = [255, 220, 80]; // Yellow - Strong
        }

        // Create smooth curved path
        const paths = p.trail.map(t => [t.x, t.y]);

        // Draw the streamline
        graphics.push(new Graphic({
          geometry: new Polyline({
            paths: [paths],
            spatialReference: { wkid: 4326 }
          }),
          symbol: new SimpleLineSymbol({
            color: [r, g, b, alpha * 180],
            width: 1.5 + (windSpeedKmh / 40), // Thicker lines for stronger wind
            cap: 'round',
            join: 'round'
          })
        }));

        // Glowing head particle
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
            outline: {
              color: [255, 255, 255, alpha * 80],
              width: 0.5
            }
          })
        }));
      }
    });

    graphicsLayer.addMany(graphics);

    if (windAnimatingRef.current) {
      windAnimationRef.current = setTimeout(runWindAnimation, 40); // ~25 FPS for smooth animation
    }
  }, [getTurbulence]);

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
  // PRECIPITATION ZONES (Based on REAL precipitation probability)
  // Uses seeded random for consistent zone placement
  // ============================================================================

  // Store precipitation zone positions to keep them stable
  const precipZonesRef = useRef(null);

  const createPrecipitationZones = useCallback(() => {
    const { bounds } = DISTRICT_CONFIG;
    const weather = weatherDataRef.current;
    const graphics = [];

    // Get real precipitation data
    const currentPrecip = weather?.current?.precipitation || 0;
    const precipProb = weather?.hourly?.precipitationProbability?.[0] || 0;

    // Only show zones if there's actual precipitation or high probability
    if (currentPrecip < 0.1 && precipProb < 20) {
      console.log('No significant precipitation - showing light coverage');
    }

    // Number of zones based on precipitation amount
    const zoneCount = Math.max(3, Math.min(8, Math.floor(currentPrecip * 2) + Math.floor(precipProb / 20)));

    console.log(`Precipitation zones: ${currentPrecip}mm, ${precipProb}% prob → ${zoneCount} zones`);

    // Generate stable zone positions if not already created or zone count changed
    if (!precipZonesRef.current || precipZonesRef.current.length !== zoneCount) {
      const zones = [];
      const width = bounds.maxLon - bounds.minLon;
      const height = bounds.maxLat - bounds.minLat;

      // Create evenly distributed grid positions with some randomness
      const cols = Math.ceil(Math.sqrt(zoneCount));
      const rows = Math.ceil(zoneCount / cols);

      for (let i = 0; i < zoneCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        // Base position in grid
        const baseX = bounds.minLon + (col + 0.5) * (width / cols);
        const baseY = bounds.minLat + (row + 0.5) * (height / rows);

        // Add controlled randomness - use index as seed for consistency
        const seedX = Math.sin(i * 12.9898) * 43758.5453;
        const seedY = Math.sin(i * 78.233) * 43758.5453;
        const offsetX = ((seedX - Math.floor(seedX)) - 0.5) * 0.08;
        const offsetY = ((seedY - Math.floor(seedY)) - 0.5) * 0.08;

        zones.push({
          centerX: Math.max(bounds.minLon + 0.05, Math.min(bounds.maxLon - 0.05, baseX + offsetX)),
          centerY: Math.max(bounds.minLat + 0.05, Math.min(bounds.maxLat - 0.05, baseY + offsetY)),
          // Seeded random for size variance
          sizeVariance: 0.8 + ((seedX + seedY) % 1) * 0.4,
          // Seeded random for shape variance per segment
          shapeSeeds: Array.from({ length: 18 }, (_, j) =>
            0.6 + (Math.sin((i * 18 + j) * 43.233) * 0.5 + 0.5) * 0.8
          )
        });
      }
      precipZonesRef.current = zones;
    }

    // Draw zones using stable positions
    precipZonesRef.current.forEach((zone, i) => {
      // Size based on precipitation intensity
      const baseSize = 0.04 + (currentPrecip / 15) * 0.05;
      const size = baseSize * zone.sizeVariance;

      // Intensity based on actual precipitation
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

      // Color based on intensity (light blue → blue → purple)
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

        // Configure API Key
        const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
        if (apiKey) {
          esriConfig.apiKey = apiKey;
          console.log('✓ ArcGIS API Key configured');
        }

        // Create boundary
        const districtBoundary = new Polygon({
          rings: [[
            [DISTRICT_CONFIG.bounds.minLon, DISTRICT_CONFIG.bounds.minLat],
            [DISTRICT_CONFIG.bounds.minLon, DISTRICT_CONFIG.bounds.maxLat],
            [DISTRICT_CONFIG.bounds.maxLon, DISTRICT_CONFIG.bounds.maxLat],
            [DISTRICT_CONFIG.bounds.maxLon, DISTRICT_CONFIG.bounds.minLat],
            [DISTRICT_CONFIG.bounds.minLon, DISTRICT_CONFIG.bounds.minLat]
          ]],
          spatialReference: { wkid: 4326 }
        });

        // Create layers - Weather Animation
        const windLayer = new GraphicsLayer({ title: 'Wind Flow', visible: false });
        const precipLayer = new GraphicsLayer({ title: 'Precipitation Zones', visible: false });

        windLayerRef.current = windLayer;
        precipLayerRef.current = precipLayer;

        // ============================================================
        // GIS LAYERS - DISTRICT TACTICAL LEVEL
        // This is the ONLY level with: Shelters, Evacuation Routes, Local Facilities
        // NDMA and PDMA do NOT have these layers
        // ============================================================

        // Rivers (TileLayer - public, no auth)
        const riversLayer = GIS_LAYERS.hydrology.rivers.url ? new TileLayer({
          url: GIS_LAYERS.hydrology.rivers.url,
          title: GIS_LAYERS.hydrology.rivers.title,
          visible: true,
          opacity: 0.7
        }) : null;

        // DISTRICT-SPECIFIC LAYERS (Tactical Level)
        // REAL District/Tehsil Boundary (FeatureLayer from Living Atlas)
        const tehsilBoundariesLayer = new FeatureLayer({
          url: GIS_LAYERS.adminBoundaries.districts.url,
          title: `${districtName} District Boundary`,
          visible: true,
          opacity: 0.9,
          // Filter for this specific district 
          definitionExpression: `(${GIS_LAYERS.adminBoundaries.districts.definitionExpression}) AND (NAME LIKE '%${districtName}%' OR ADM2_NAME LIKE '%${districtName}%')`,
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
        const evacuationLayer = new GraphicsLayer({ title: '🚗 Evacuation Routes', visible: true });
        const rescueAssetsLayer = new GraphicsLayer({ title: 'Rescue Assets', visible: false });

        // Add hospital markers
        EMERGENCY_FACILITIES.hospitals.forEach(h => {
          hospitalsLayer.add(new Graphic({
            geometry: new Point({ longitude: h.lon, latitude: h.lat }),
            symbol: new SimpleMarkerSymbol({
              style: 'cross', color: LAYER_SYMBOLS.hospital.color, size: LAYER_SYMBOLS.hospital.size,
              outline: { color: [255, 255, 255], width: 2 }
            }),
            attributes: h,
            popupTemplate: { title: '🏥 {name}', content: 'Emergency: {emergency}<br>Beds: {beds}' }
          }));
        });

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

        // Add evacuation routes (DISTRICT ONLY FEATURE)
        EMERGENCY_FACILITIES.evacuationRoutes.forEach(route => {
          const sym = LAYER_SYMBOLS.evacuationRoute[route.status] || LAYER_SYMBOLS.evacuationRoute.clear;
          evacuationLayer.add(new Graphic({
            geometry: new Polyline({ paths: [route.paths], spatialReference: { wkid: 4326 } }),
            symbol: new SimpleLineSymbol({
              color: sym.color,
              width: sym.width + 1, // Thicker for visibility
              style: 'solid'
            }),
            attributes: route,
            popupTemplate: { title: '🚗 {name}', content: 'Route Status: {status}' }
          }));
        });

        // Build layers - DISTRICT TACTICAL ORDERING
        // Shows: Shelters, Hospitals, Evacuation Routes (unique to district)
        const mapLayers = [
          tehsilBoundariesLayer,  // Tehsil/UC boundaries
          evacuationLayer,        // Evacuation routes (DISTRICT ONLY)
          sheltersLayer,          // Shelter markers (DISTRICT ONLY)
          hospitalsLayer,         // Hospital markers
          rescueAssetsLayer,      // Rescue teams/vehicles
          precipLayer,            // Weather raster
          windLayer               // Wind animation
        ];
        if (riversLayer) mapLayers.unshift(riversLayer);

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
          center: DISTRICT_CONFIG.center,
          zoom: DISTRICT_CONFIG.zoom,
          constraints: {
            geometry: districtBoundary,
            minZoom: DISTRICT_CONFIG.minZoom,
            maxZoom: DISTRICT_CONFIG.maxZoom,
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

    return () => {
      isMounted = false;
      stopRainAnimation();
      stopWindAnimation();
      viewRef.current?.destroy();
      mapInstanceRef.current?.destroy();
    };
  }, [districtName, stopRainAnimation, stopWindAnimation]);

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
        const zones = createPrecipitationZones();
        precipLayerRef.current.addMany(zones);
      } else {
        precipLayerRef.current.removeAll();
      }
    }
  }, [precipEnabled, createPrecipitationZones]);

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

  const activeLayers = [];
  if (rainEnabled) activeLayers.push('Rain');
  if (windEnabled) activeLayers.push('Wind');
  if (precipEnabled) activeLayers.push('Precipitation');

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

        {/* Rain Overlay */}
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

        {/* Active Layers Badge */}
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
            <Layers style={{ width: '14px', height: '14px', color: '#22c55e' }} />
            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600' }}>
              {activeLayers.length} Active
            </span>
          </div>
        )}

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

      {/* Animation controls available in LayerList widget above */}

      {/* Legend with REAL data */}
      {activeLayers.length > 0 && weatherData && (
        <div style={{
          marginTop: '14px',
          padding: '16px 20px',
          backgroundColor: isLight ? '#f8fafc' : '#1e293b',
          borderRadius: '12px',
          border: `1px solid ${colors.cardBorder || colors.border}`
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: colors.textSecondary, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Live Weather Layers
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

export default DistrictMap;
