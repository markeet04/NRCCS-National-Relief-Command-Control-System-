/**
 * WeatherInfoPanel Component
 * Displays current weather information for the map location
 */
import { Thermometer, Wind, Droplets, Loader2 } from 'lucide-react';
import { getWindDirectionText, getWeatherDescription } from './weatherUtils';

const WeatherInfoPanel = ({
    weatherData,
    weatherLoading,
    colors
}) => {
    if (!weatherData) return null;

    return (
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
            {/* Temperature */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer style={{ width: '16px', height: '16px', color: '#f97316' }} />
                <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
                    {weatherData.current.temperature}°C
                </span>
            </div>

            {/* Wind */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wind style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                    {weatherData.current.windSpeed} km/h {getWindDirectionText(weatherData.current.windDirection)}
                </span>
            </div>

            {/* Precipitation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Droplets style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                    {weatherData.current.precipitation} mm
                </span>
            </div>

            {/* Weather Description */}
            <span style={{
                marginLeft: 'auto',
                color: colors.textMuted,
                fontSize: '12px'
            }}>
                {getWeatherDescription(weatherData.current.weatherCode)}
            </span>

            {/* Loading Indicator */}
            {weatherLoading && <Loader2 className="animate-spin" style={{ width: '16px', height: '16px', color: colors.primary }} />}
        </div>
    );
};

export default WeatherInfoPanel;
