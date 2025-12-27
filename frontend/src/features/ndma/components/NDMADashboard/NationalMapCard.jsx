import PropTypes from 'prop-types';
import { Layers, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import NationalMap from '../NationalMap';

/**
 * NationalMapCard Component
 * Displays the national weather map with header, controls, and legend
 * Uses CSS classes from national-dashboard.css
 */
const NationalMapCard = ({ 
  isFullscreen, 
  onToggleFullscreen,
  onRefresh,
  onToggleLayers,
}) => {
  return (
    <div className={`national-map-card border-left-blue ${isFullscreen ? 'map-fullscreen' : ''}`}>
      {/* Map Header */}
      <div className="national-map-header">
        <div>
          <h3 className="national-map-title">National Weather Map</h3>
          <p className="national-map-subtitle">
            Real-time weather conditions across Pakistan
          </p>
        </div>
        <div className="national-map-controls">
          <button 
            className="national-map-btn" 
            title="Toggle layers"
            onClick={onToggleLayers}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            className="national-map-btn" 
            title="Refresh"
            onClick={onRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            className={`national-map-btn ${isFullscreen ? 'fullscreen-active' : ''}`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className={`national-map-container ${isFullscreen ? 'map-container-fullscreen' : ''}`}>
        <NationalMap height={isFullscreen ? 'calc(100vh - 180px)' : '650px'} />
      </div>

      {/* Map Legend */}
      <div className="national-map-legend">
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot severe" />
          <span className="national-map-legend-label">Severe Weather</span>
        </div>
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot warning" />
          <span className="national-map-legend-label">Warning</span>
        </div>
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot watch" />
          <span className="national-map-legend-label">Watch</span>
        </div>
        <div className="national-map-legend-item">
          <div className="national-map-legend-dot normal" />
          <span className="national-map-legend-label">Normal</span>
        </div>
      </div>
    </div>
  );
};

NationalMapCard.propTypes = {
  isFullscreen: PropTypes.bool,
  onToggleFullscreen: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
  onToggleLayers: PropTypes.func,
};

NationalMapCard.defaultProps = {
  isFullscreen: false,
  onRefresh: () => {},
  onToggleLayers: () => {},
};

export default NationalMapCard;
