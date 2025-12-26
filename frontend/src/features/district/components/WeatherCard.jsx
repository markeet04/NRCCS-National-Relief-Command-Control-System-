/**
 * WeatherCard Component
 * Displays weather summary for district
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
import { Cloud } from 'lucide-react';
import '@styles/css/main.css';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="card card-body">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="text-muted" style={{ width: '18px', height: '18px' }} />
        <h3 className="text-base font-semibold text-primary">
          Weather Summary
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-muted mb-1">
            Current Conditions
          </p>
          <p className="text-sm font-semibold text-primary">
            {weather.conditions}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">
            Temperature
          </p>
          <p className="text-2xl font-bold text-primary">
            {weather.temperature}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">
            Forecast
          </p>
          <p className="text-sm" style={{ color: 'var(--primary)', lineHeight: '1.4' }}>
            {weather.forecast}
          </p>
        </div>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    conditions: PropTypes.string,
    temperature: PropTypes.string,
    forecast: PropTypes.string,
  }),
};

export default WeatherCard;

