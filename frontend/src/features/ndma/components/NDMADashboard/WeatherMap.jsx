import PropTypes from 'prop-types';
import { RefreshCw, Maximize2, Layers } from 'lucide-react';
import { NationalMap } from '../NationalMap';

/**
 * WeatherMap Component
 * Wrapper component for the National Weather Map with controls
 */
const WeatherMap = ({ 
  onRefresh, 
  onFullscreen, 
  onLayerToggle,
  isLoading,
  isLight 
}) => {
  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)' 
      }}
    >
      {/* Map Header */}
      <div 
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div>
          <h3 
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            National Weather Map
          </h3>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Real-time weather conditions across Pakistan
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {onLayerToggle && (
            <button
              onClick={onLayerToggle}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'rgba(148, 163, 184, 0.12)',
                color: 'var(--text-secondary)',
              }}
              title="Toggle layers"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'rgba(148, 163, 184, 0.12)',
                color: 'var(--text-secondary)',
              }}
              title="Refresh map"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'rgba(148, 163, 184, 0.12)',
                color: 'var(--text-secondary)',
              }}
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: '500px' }}>
        <NationalMap />
        
        {isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 text-white animate-spin mb-2" />
              <span className="text-white text-sm">Updating map data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div 
        className="p-4 flex flex-wrap gap-4"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Severe Weather
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Warning
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Watch
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Normal
          </span>
        </div>
      </div>
    </div>
  );
};

WeatherMap.propTypes = {
  onRefresh: PropTypes.func,
  onFullscreen: PropTypes.func,
  onLayerToggle: PropTypes.func,
  isLoading: PropTypes.bool,
  isLight: PropTypes.bool,
};

WeatherMap.defaultProps = {
  onRefresh: null,
  onFullscreen: null,
  onLayerToggle: null,
  isLoading: false,
  isLight: false,
};

export default WeatherMap;
