import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Thermometer, Wind, Droplets, CloudRain, RefreshCw, Navigation } from 'lucide-react';
import NdmaFloodMap from './NdmaFloodMap';
import { useSettings } from '@app/providers/ThemeProvider';

// Major cities for Quick Jump
const QUICK_JUMP_CITIES = [
  { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
  { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
  { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
];

// Theme-aware colors
const getThemeColors = (theme) => ({
  headerBg: theme === 'light'
    ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
    : 'linear-gradient(135deg, #1a1d21 0%, #0f1114 100%)',
  weatherBarBg: theme === 'light'
    ? 'rgba(241, 245, 249, 0.95)'
    : 'rgba(26, 29, 33, 0.95)',
  quickJumpBg: theme === 'light'
    ? 'rgba(248, 250, 252, 0.95)'
    : 'rgba(15, 17, 20, 0.95)',
  titleColor: theme === 'light' ? '#1e293b' : '#fff',
  subtitleColor: theme === 'light' ? '#64748b' : '#94a3b8',
  textPrimary: theme === 'light' ? '#1e293b' : '#fff',
  textMuted: theme === 'light' ? '#64748b' : '#94a3b8',
  buttonBg: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
  buttonBorder: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  buttonColor: theme === 'light' ? '#475569' : '#94a3b8',
  badgeBg: theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255,255,255,0.1)',
  borderColor: theme === 'light' ? '#cbd5e1' : '#2d3238',
});

// Open-Meteo API
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * FloodMapSection Component - Professional Enterprise Layout
 * Features: Dynamic weather, Pin Mode, Quick Jump cities, compact design
 */
const FloodMapSection = ({
  provinces,
  onProvinceClick,
  onRunPrediction,
  activeLayers,
}) => {
  // Theme support
  const { theme } = useSettings();
  const colors = getThemeColors(theme);

  // State for weather and pin mode
  const [pinMode, setPinMode] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'Pakistan',
    lat: 30.38,
    lon: 69.35
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Fetch weather data from Open-Meteo
  const fetchWeather = useCallback(async (lat, lon, locationName = null) => {
    setIsLoadingWeather(true);
    try {
      const response = await fetch(
        `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
      );
      if (!response.ok) throw new Error('Weather API error');
      const data = await response.json();

      // Parse weather data
      setWeatherData({
        temperature: data.current?.temperature_2m || 0,
        humidity: data.current?.relative_humidity_2m || 0,
        precipitation: data.current?.precipitation || 0,
        windSpeed: data.current?.wind_speed_10m || 0,
        windDirection: getWindDirection(data.current?.wind_direction_10m || 0),
        condition: getWeatherCondition(data.current?.weather_code || 0),
      });

      setSelectedLocation({
        name: locationName || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        lat,
        lon
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Initial weather load
  useEffect(() => {
    fetchWeather(30.38, 69.35, 'Central Pakistan');
  }, [fetchWeather]);

  // Get wind direction label
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  // Get weather condition label
  const getWeatherCondition = (code) => {
    const conditions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle',
      55: 'Dense drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
      71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
      95: 'Thunderstorm', 96: 'Hail storm', 99: 'Severe storm',
    };
    return conditions[code] || 'Unknown';
  };

  // Handle map click for pin mode - called only when pin mode is active
  const handleMapClick = useCallback((lat, lon, placeName) => {
    // NdmaFloodMap only calls this when pin mode is ON, so always fetch weather
    fetchWeather(lat, lon, placeName || `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
  }, [fetchWeather]);

  // Handle quick jump to city
  const handleQuickJump = (city) => {
    fetchWeather(city.lat, city.lon, city.name);
  };

  return (
    <div className="flood-map-section" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0' }}>
      {/* Compact Header with Title and Pin Mode Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: colors.headerBg,
        borderRadius: '12px 12px 0 0',
        borderBottom: `1px solid ${colors.borderColor}`
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: colors.titleColor }}>
            National Flood Monitoring Map
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: colors.subtitleColor }}>
            Real-time weather & flood risk across Pakistan
          </p>
        </div>

        {/* Pin Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: colors.textMuted }}>Pin Mode</span>
          <button
            onClick={() => setPinMode(!pinMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '6px',
              border: pinMode ? '1px solid #22c55e' : `1px solid ${colors.buttonBorder}`,
              background: pinMode ? 'rgba(34, 197, 94, 0.15)' : colors.buttonBg,
              color: pinMode ? '#22c55e' : colors.buttonColor,
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <MapPin size={14} />
            {pinMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Dynamic Weather Info Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: colors.weatherBarBg,
        borderBottom: `1px solid ${colors.borderColor}`,
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Location Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={14} style={{ color: '#60a5fa' }} />
          <span style={{ fontWeight: '600', color: colors.textPrimary, fontSize: '13px' }}>
            {selectedLocation.name}
          </span>
          <span style={{ color: colors.textMuted, fontSize: '11px' }}>
            ({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lon.toFixed(2)}°E)
          </span>
        </div>

        {/* Weather Stats */}
        {weatherData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Thermometer size={14} style={{ color: '#f97316' }} />
              <span style={{ color: colors.textPrimary, fontSize: '12px', fontWeight: '500' }}>
                {weatherData.temperature}°C
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wind size={14} style={{ color: colors.textMuted }} />
              <span style={{ color: colors.textPrimary, fontSize: '12px' }}>
                {weatherData.windSpeed} km/h {weatherData.windDirection}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudRain size={14} style={{ color: '#3b82f6' }} />
              <span style={{ color: colors.textPrimary, fontSize: '12px' }}>
                {weatherData.precipitation} mm
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={14} style={{ color: '#06b6d4' }} />
              <span style={{ color: colors.textPrimary, fontSize: '12px' }}>
                {weatherData.humidity}%
              </span>
            </div>
            <span style={{
              color: colors.textMuted,
              fontSize: '11px',
              padding: '2px 8px',
              background: colors.badgeBg,
              borderRadius: '4px'
            }}>
              {weatherData.condition}
            </span>
            <button
              onClick={() => fetchWeather(selectedLocation.lat, selectedLocation.lon, selectedLocation.name)}
              disabled={isLoadingWeather}
              style={{
                background: 'none',
                border: 'none',
                color: colors.textMuted,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Refresh weather"
            >
              <RefreshCw size={14} className={isLoadingWeather ? 'animate-spin' : ''} />
            </button>
          </div>
        )}
      </div>

      {/* Quick Jump Cities */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: colors.quickJumpBg,
        borderBottom: `1px solid ${colors.borderColor}`,
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '10px', color: colors.textMuted, whiteSpace: 'nowrap' }}>
          ↗ Quick Jump:
        </span>
        {QUICK_JUMP_CITIES.map(city => (
          <button
            key={city.name}
            onClick={() => handleQuickJump(city)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '500',
              color: selectedLocation.name === city.name ? colors.textPrimary : colors.buttonColor,
              background: selectedLocation.name === city.name ? 'rgba(59, 130, 246, 0.3)' : colors.buttonBg,
              border: selectedLocation.name === city.name ? '1px solid rgba(59, 130, 246, 0.5)' : `1px solid ${colors.buttonBorder}`,
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Map Container - Takes remaining space, no extra padding */}
      <div style={{
        flex: 1,
        position: 'relative',
        minHeight: '400px',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden'
      }}>
        <NdmaFloodMap
          height="100%"
          provinces={provinces}
          floodZones={[]}
          onProvinceClick={onProvinceClick}
          onRunPrediction={onRunPrediction}
          activeLayers={activeLayers}
          searchTerm=""
          pinMode={pinMode}
          onMapClick={handleMapClick}
          quickJumpLocation={selectedLocation}
        />
      </div>
    </div>
  );
};

FloodMapSection.propTypes = {
  provinces: PropTypes.array,
  onProvinceClick: PropTypes.func.isRequired,
  onRunPrediction: PropTypes.func,
  activeLayers: PropTypes.array,
};

FloodMapSection.defaultProps = {
  provinces: [],
  activeLayers: [],
};

export default FloodMapSection;
