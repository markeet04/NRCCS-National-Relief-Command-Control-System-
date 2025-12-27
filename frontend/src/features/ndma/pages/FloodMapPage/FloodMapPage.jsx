import { MapPin, Search, Map, Droplets, Users, Building2, Layers, X } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';

// Import custom hook for flood map logic
import { useFloodMapLogic } from '../../hooks';

// Import constants
import { MAP_TYPE_OPTIONS, MAP_LAYERS } from '../../constants';

// Import NdmaFloodMap component
import { NdmaFloodMap } from '../../components/FloodMapPage';

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

    // ML Prediction / Simulation (NDMA-only)
    simulationEnabled,
    setSimulationEnabled,
    simulationScenario,
    setSimulationScenario,
    simulationScenarios,
    predictionResult,
    isPredicting,
    liveWeatherData,
    runPrediction,

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

            {/* Map Content - Interactive ArcGIS Map */}
            <div className="flood-map-content" style={{ position: 'relative', minHeight: '500px' }}>
              {/* Debug logging */}
              {console.log('📦 FloodMapPage passing provinces to map:', provinces.map(p => ({ id: p.id, name: p.name, risk: p.floodRisk })))}

              {/* NdmaFloodMap Component - Real Interactive Map */}
              <NdmaFloodMap
                height="500px"
                provinces={provinces}
                floodZones={[]}
                onProvinceClick={(province) => setSelectedProvince(province)}
                onRunPrediction={runPrediction}
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

        {/* Right Column - Province Status Panel */}
        <div className="flood-province-panel">
          {/* ML PREDICTION CONTROL PANEL - NDMA ONLY */}
          <div className="flood-province-card" style={{ marginBottom: '16px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
            <div className="flood-province-header" style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔮 ML Flood Prediction
              </h3>
              <span className="flood-province-count" style={{
                background: simulationEnabled ? '#f59e0b' : '#22c55e',
                color: '#000',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {simulationEnabled ? 'SIMULATION' : 'LIVE'}
              </span>
            </div>

            <div style={{ padding: '12px' }}>
              {/* Simulation Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>Simulation Mode</span>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '44px',
                  height: '24px'
                }}>
                  <input
                    type="checkbox"
                    checked={simulationEnabled}
                    onChange={(e) => setSimulationEnabled(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    inset: 0,
                    backgroundColor: simulationEnabled ? '#3b82f6' : '#475569',
                    borderRadius: '24px',
                    transition: '0.3s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '18px',
                      width: '18px',
                      left: simulationEnabled ? '22px' : '3px',
                      bottom: '3px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }} />
                  </span>
                </label>
              </div>

              {/* Scenario Selector (only when simulation enabled) */}
              {simulationEnabled && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    Scenario
                  </label>
                  <select
                    value={simulationScenario}
                    onChange={(e) => setSimulationScenario(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      backgroundColor: '#1e293b',
                      color: '#f1f5f9',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="normal">🌤️ Normal Weather</option>
                    <option value="heavy_rain">🌧️ Heavy Rain</option>
                    <option value="extreme_event">🌊 Extreme Event</option>
                  </select>
                </div>
              )}

              {/* Run Prediction Button */}
              <button
                onClick={() => {
                  // Map province string IDs to numeric IDs for backend
                  // Match the abbreviated IDs from floodMapPageConstants.js
                  const provinceIdMap = {
                    'pb': 1,      // Punjab
                    'sd': 2,      // Sindh
                    'kp': 3,      // Khyber Pakhtunkhwa
                    'bl': 4,      // Balochistan
                    'gb': 5,      // Gilgit-Baltistan
                    'ajk': 6,     // Azad Kashmir
                    'ict': 1,     // Islamabad (defaults to Punjab region)
                    // Legacy full names for backward compatibility
                    'punjab': 1,
                    'sindh': 2,
                    'kpk': 3,
                    'balochistan': 4,
                    'gilgit': 5,
                    'azadkashmir': 6
                  };

                  const provinceId = selectedProvince?.id ?
                    (provinceIdMap[selectedProvince.id.toLowerCase()] || 1) : 1;

                  runPrediction(provinceId, true);
                }}
                disabled={isPredicting}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isPredicting ? '#475569' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: isPredicting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isPredicting ? '⏳ Analyzing...' : '🔍 Run Prediction'}
              </button>

              {/* Prediction Result */}
              {predictionResult && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: predictionResult.flood_risk === 'High' ? 'rgba(239, 68, 68, 0.15)' :
                    predictionResult.flood_risk === 'Medium' ? 'rgba(245, 158, 11, 0.15)' :
                      'rgba(34, 197, 94, 0.15)',
                  border: `1px solid ${predictionResult.flood_risk === 'High' ? '#ef4444' :
                    predictionResult.flood_risk === 'Medium' ? '#f59e0b' : '#22c55e'}`
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: predictionResult.flood_risk === 'High' ? '#ef4444' :
                      predictionResult.flood_risk === 'Medium' ? '#f59e0b' : '#22c55e',
                    marginBottom: '4px'
                  }}>
                    {predictionResult.flood_risk === 'High' ? '🚨' :
                      predictionResult.flood_risk === 'Medium' ? '⚠️' : '✅'} {predictionResult.flood_risk} Risk
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                    Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                  </div>
                  {predictionResult.simulationMode && (
                    <div style={{ color: '#f59e0b', fontSize: '10px', marginTop: '4px' }}>
                      ⚡ Simulation: {predictionResult.simulationScenario}
                    </div>
                  )}
                  {/* Show real weather data in LIVE mode */}
                  {!predictionResult.simulationMode && liveWeatherData && (
                    <div style={{
                      color: '#60a5fa',
                      fontSize: '10px',
                      marginTop: '6px',
                      padding: '6px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '4px'
                    }}>
                      🌤️ <strong>Live Weather ({liveWeatherData.provinceName}):</strong><br />
                      🌧️ Rain 24h: {liveWeatherData.rainfall_24h}mm | 48h: {liveWeatherData.rainfall_48h}mm<br />
                      🌡️ Temp: {liveWeatherData.temperature}°C | 💧 Humidity: {liveWeatherData.humidity}%
                    </div>
                  )}
                  {predictionResult.alertGenerated && (
                    <div style={{ color: '#3b82f6', fontSize: '10px', marginTop: '4px' }}>
                      🔔 Alert #{predictionResult.alertId} created
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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
