/**
 * Weather Utility Functions
 * Pure functions for weather data fetching and formatting
 */

// Open-Meteo API URL
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object|null>} Weather data or null on error
 */
export const fetchWeatherData = async (lat, lon) => {
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

/**
 * Convert wind direction in degrees to compass direction
 * @param {number} degrees - Wind direction in degrees (0-360)
 * @returns {string} Compass direction (e.g., "N", "NE", "E")
 */
export const getWindDirectionText = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
};

/**
 * Get weather description from WMO weather code
 * @param {number} code - WMO weather code
 * @returns {string} Human-readable weather description
 */
export const getWeatherDescription = (code) => {
    const descriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 51: 'Light drizzle', 61: 'Slight rain', 63: 'Moderate rain',
        65: 'Heavy rain', 80: 'Rain showers', 95: 'Thunderstorm'
    };
    return descriptions[code] || 'Unknown';
};
