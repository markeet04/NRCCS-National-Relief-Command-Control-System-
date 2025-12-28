import { useState } from 'react';
import PropTypes from 'prop-types';
import { RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import ProvincialWeatherMap from '../../ProvincialMap/ProvincialWeatherMap';

/**
 * FloodMapSection Component
 * Displays the provincial weather/situation map with NDMA-style layout
 * Uses the ProvincialWeatherMap component WITHOUT its dashboard layout wrapper
 */
const FloodMapSection = ({ provinceName = 'Punjab', colors, isLight }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`national-map-card border-left-green ${isFullscreen ? 'map-fullscreen' : ''}`}>
      {/* Map Header */}
      <div className="national-map-header">
        <div>
          <h3 className="national-map-title">{provinceName} Situation Map</h3>
          <p className="national-map-subtitle">
            Real-time weather & emergency conditions
          </p>
        </div>
        <div className="national-map-controls">
          <button
            className="national-map-btn"
            title="Refresh"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            className={`national-map-btn ${isFullscreen ? 'fullscreen-active' : ''}`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Map Container - Using ProvincialWeatherMap WITHOUT its dashboard wrapper */}
      <div
        className={`national-map-container ${isFullscreen ? 'map-container-fullscreen' : ''}`}
        style={{
          height: isFullscreen ? 'calc(100vh - 180px)' : '450px',
          padding: '0 20px 20px 20px',
        }}
      >
        <ProvincialWeatherMap
          key={refreshKey}
          provinceName={provinceName}
          height={isFullscreen ? 'calc(100vh - 200px)' : '420px'}
          showDashboardLayout={false}
        />
      </div>

      {/* Map Legend */}
      <div className="national-map-legend">
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot severe" />
          <span className="national-map-legend-label">Critical</span>
        </div>
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot warning" />
          <span className="national-map-legend-label">High Risk</span>
        </div>
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot watch" />
          <span className="national-map-legend-label">Moderate</span>
        </div>
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot normal" />
          <span className="national-map-legend-label">Normal</span>
        </div>
      </div>
    </div>
  );
};

FloodMapSection.propTypes = {
  provinceName: PropTypes.string,
  colors: PropTypes.object,
  isLight: PropTypes.bool,
};

export default FloodMapSection;
