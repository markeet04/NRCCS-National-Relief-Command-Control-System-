import { MapPin, Search, Map, Droplets, Users, Building2, Layers, X } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';

// Import custom hook for flood map logic
import { useFloodMapLogic } from '../../hooks';

// Import constants
import { MAP_TYPE_OPTIONS, MAP_LAYERS } from '../../constants';

// Import styles
import '../../styles/flood-map.css';
import '../../styles/global-ndma.css';

/**
 * FloodMapPage Component
 * Interactive Pakistan flood map with province status monitoring
 * Two-column layout: Large map (3fr) + Province status panel (1fr)
 */
const FloodMapPage = () => {
  // Use custom hook for all flood map logic
  const {
    // State
    selectedProvince,
    mapView,
    searchTerm,
    isModalOpen,
    extraMaps,
    activeLayers,
    
    // Data
    provinces,
    menuItems,
    defaultMaps,
    
    // Actions
    setSelectedProvince,
    setMapView,
    setSearchTerm,
    openModal,
    closeModal,
    handleDeleteMapSection,
    toggleLayer,
    isLayerActive,
  } = useFloodMapLogic();

  /**
   * Get risk level class based on water level percentage
   */
  const getRiskLevel = (waterLevel) => {
    if (waterLevel >= 90) return 'critical';
    if (waterLevel >= 75) return 'high';
    if (waterLevel >= 50) return 'medium';
    return 'low';
  };

  /**
   * Format number with commas
   */
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute="map"
      onNavigate={(route) => console.log('Navigate to:', route)}
      userRole="NDMA"
      userName="Admin"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle="Flood Risk Map"
      notificationCount={5}
    >
      {/* Modal for managing map sections */}
      {isModalOpen && (
        <div className="flood-modal-overlay">
          <div className="flood-modal">
            <div className="flood-modal-header">
              <h3>Manage Map Sections</h3>
              <button 
                className="flood-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flood-modal-body">
              <div className="flood-modal-section">
                <div className="flood-modal-section-title">Default Maps</div>
                <ul className="flood-modal-list">
                  {defaultMaps.map(map => (
                    <li key={map.name} className="flood-modal-list-item">
                      <span>{map.label}</span>
                      <span className="default-tag">Default</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {extraMaps.length > 0 && (
                <div className="flood-modal-section">
                  <div className="flood-modal-section-title">Custom Maps</div>
                  <ul className="flood-modal-list">
                    {extraMaps.map(map => (
                      <li key={map.id} className="flood-modal-list-item">
                        <span>{map.name}</span>
                        <button
                          className="delete-btn"
                          aria-label={`Delete ${map.name}`}
                          onClick={() => handleDeleteMapSection(map.id)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flood-modal-footer">
              <button
                className="flood-modal-btn flood-modal-btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="flood-map-container">
        {/* Left Column - Interactive Map */}
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
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search location..."
                  />
                </div>
                
                {/* Map Type Selector */}
                <select
                  className="flood-map-select"
                  value={mapView}
                  onChange={e => setMapView(e.target.value)}
                >
                  {MAP_TYPE_OPTIONS.map(option => (
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
                  onClick={openModal}
                  title="Manage map sections"
                >
                  <Layers className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Map Content */}
            <div className="flood-map-content">
              <div className="flood-map-placeholder">
                <MapPin className="flood-map-placeholder-icon" />
                <h3>Interactive Pakistan Map</h3>
                <p>
                  Real-time visualization of all provinces, districts, flood zones, 
                  evacuation routes, and rescue team positions.
                </p>
              </div>
              
              {/* Map Legend */}
              <div className="flood-map-legend">
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
              
              {/* Layer Controls */}
              <div className="flood-map-layers">
                <div className="flood-map-layers-title">Map Layers</div>
                {MAP_LAYERS.slice(0, 4).map(layer => (
                  <label key={layer.id} className="flood-map-layer-toggle">
                    <input
                      type="checkbox"
                      checked={isLayerActive(layer.id)}
                      onChange={() => toggleLayer(layer.id)}
                    />
                    <span>{layer.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Province Status Panel */}
        <div className="flood-province-panel">
          <div className="flood-province-card">
            <div className="flood-province-header">
              <h3>Province Status</h3>
              <span className="flood-province-count">{provinces.length} regions</span>
            </div>
            
            <div className="flood-province-list">
              {provinces.map(province => {
                const riskLevel = getRiskLevel(province.waterLevel);
                const isSelected = selectedProvince?.id === province.id;
                
                return (
                  <div
                    key={province.id}
                    className={`flood-province-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedProvince(province)}
                  >
                    {/* Header: Name + Risk Badge */}
                    <div className="flood-province-item-header">
                      <span className="flood-province-name">{province.name}</span>
                      <span className={`flood-risk-badge ${province.floodRisk}`}>
                        {province.floodRisk}
                      </span>
                    </div>
                    
                    {/* Water Level Progress Bar */}
                    <div className="flood-water-level">
                      <div className="flood-water-level-header">
                        <span className="flood-water-level-label">
                          <Droplets className="w-3 h-3" />
                          Water Level
                        </span>
                        <span className={`flood-water-level-value ${riskLevel}`}>
                          {province.waterLevel}%
                        </span>
                      </div>
                      <div className="flood-progress-bar">
                        <div 
                          className={`flood-progress-fill ${riskLevel}`}
                          style={{ width: `${province.waterLevel}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flood-province-stats">
                      <div className="flood-province-stat">
                        <Building2 className="flood-province-stat-icon" />
                        <span className="flood-province-stat-value">{province.affectedDistricts}</span>
                        <span className="flood-province-stat-label">districts</span>
                      </div>
                      <div className="flood-province-stat">
                        <Users className="flood-province-stat-icon" />
                        <span className="flood-province-stat-value">{formatNumber(province.evacuated)}</span>
                        <span className="flood-province-stat-label">evacuated</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FloodMapPage;
