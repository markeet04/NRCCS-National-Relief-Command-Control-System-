import PropTypes from 'prop-types';
import { Map, Search, Layers } from 'lucide-react';
import NdmaFloodMap from './NdmaFloodMap';

/**
 * FloodMapSection Component
 * Left column with interactive ArcGIS map, controls, and legend
 */
const FloodMapSection = ({
  searchTerm,
  onSearchChange,
  mapView,
  onMapViewChange,
  mapTypeOptions,
  extraMaps,
  onOpenModal,
  provinces,
  onProvinceClick,
  onRunPrediction,
  activeLayers,
}) => {
  return (
    <div className="flood-map-section">
      <div className="flood-map-card">
        {/* Map Header */}
        <div className="flood-map-header">
          <div className="flood-map-title">
            <div className="flood-map-title-icon">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2>Interactive Pakistan Map</h2>
              <p className="flood-map-title-subtitle">Real-time flood monitoring</p>
            </div>
          </div>

          <div className="flood-map-controls">
            {/* Search */}
            <div className="flood-map-search">
              <Search className="flood-map-search-icon" />
              <input
                type="text"
                className="flood-map-search-input"
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search location..."
              />
            </div>

            {/* Map Type Selector */}
            <select
              className="flood-map-select"
              value={mapView}
              onChange={e => onMapViewChange(e.target.value)}
            >
              {mapTypeOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
              {extraMaps.map(map => (
                <option key={map.id} value={map.name}>
                  {map.name}
                </option>
              ))}
            </select>

            {/* Manage Maps Button */}
            <button
              className="flood-action-btn-ghost"
              onClick={onOpenModal}
              title="Manage map sections"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Content - Interactive ArcGIS Map */}
        <div className="flood-map-content" style={{ position: 'relative', minHeight: '500px' }}>
          <NdmaFloodMap
            height="500px"
            provinces={provinces}
            floodZones={[]}
            onProvinceClick={onProvinceClick}
            onRunPrediction={onRunPrediction}
            activeLayers={activeLayers}
            searchTerm={searchTerm}
          />

          {/* Map Legend - Positioned over the map */}
          <div className="flood-map-legend" style={{
            position: 'absolute',
            bottom: '60px',
            left: '12px',
            zIndex: 10,
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            borderRadius: '10px',
            padding: '14px'
          }}>
            <div className="flood-map-legend-title">Flood Risk Legend</div>
            <div className="flood-map-legend-items">
              <div className="flood-map-legend-item">
                <div className="flood-map-legend-color critical"></div>
                <span className="flood-map-legend-label">Critical (90%+)</span>
              </div>
              <div className="flood-map-legend-item">
                <div className="flood-map-legend-color high"></div>
                <span className="flood-map-legend-label">High Risk (75-90%)</span>
              </div>
              <div className="flood-map-legend-item">
                <div className="flood-map-legend-color medium"></div>
                <span className="flood-map-legend-label">Medium (50-75%)</span>
              </div>
              <div className="flood-map-legend-item">
                <div className="flood-map-legend-color low"></div>
                <span className="flood-map-legend-label">Low/Safe (&lt;50%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FloodMapSection.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  mapView: PropTypes.string,
  onMapViewChange: PropTypes.func.isRequired,
  mapTypeOptions: PropTypes.array,
  extraMaps: PropTypes.array,
  onOpenModal: PropTypes.func.isRequired,
  provinces: PropTypes.array,
  onProvinceClick: PropTypes.func.isRequired,
  onRunPrediction: PropTypes.func,
  activeLayers: PropTypes.array,
};

FloodMapSection.defaultProps = {
  searchTerm: '',
  mapView: 'terrain',
  mapTypeOptions: [],
  extraMaps: [],
  provinces: [],
  activeLayers: [],
};

export default FloodMapSection;
