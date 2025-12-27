import { DashboardLayout } from '@shared/components/layout';

// Import custom hook for flood map logic
import { useFloodMapLogic } from '../../hooks';

// Import constants
import { MAP_TYPE_OPTIONS } from '../../constants';

// Import modular components
import {
  ManageMapsModal,
  FloodMapSection,
  MLPredictionPanel,
  ProvinceStatusPanel,
} from '../../components/FloodMapPage';

// Import styles
import '../../styles/flood-map.css';
import '../../styles/global-ndma.css';

/**
 * FloodMapPage Component
 * Interactive Pakistan flood map with province status monitoring
 * Two-column layout: Large map (3fr) + Province status panel (1fr)
 * 
 * Refactored to modular architecture - all UI sections are now separate components
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
    refreshWeatherForProvince,

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
      <ManageMapsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        defaultMaps={defaultMaps}
        extraMaps={extraMaps}
        onDeleteMap={handleDeleteMapSection}
      />

      {/* Main Two-Column Layout */}
      <div className="flood-map-container">
        {/* Left Column: Interactive Map Section */}
        <FloodMapSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          mapView={mapView}
          onMapViewChange={setMapView}
          mapTypeOptions={MAP_TYPE_OPTIONS}
          extraMaps={extraMaps}
          onOpenModal={openModal}
          provinces={provinces}
          onProvinceClick={(province) => setSelectedProvince(province)}
          onRunPrediction={runPrediction}
          activeLayers={activeLayers}
        />

        {/* Right Column: Province Status + ML Prediction */}
        <div className="flood-province-panel">
          {/* ML Prediction Panel */}
          <MLPredictionPanel
            simulationEnabled={simulationEnabled}
            onSimulationToggle={setSimulationEnabled}
            simulationScenario={simulationScenario}
            onScenarioChange={setSimulationScenario}
            simulationScenarios={simulationScenarios}
            liveWeatherData={liveWeatherData}
            selectedProvince={selectedProvince}
            isPredicting={isPredicting}
            predictionResult={predictionResult}
            onRunPrediction={runPrediction}
            onRefreshWeather={refreshWeatherForProvince}
          />

          {/* Province Status Panel */}
          <ProvinceStatusPanel
            provinces={provinces}
            selectedProvince={selectedProvince}
            onProvinceSelect={setSelectedProvince}
            simulationEnabled={simulationEnabled}
            onRefreshWeather={refreshWeatherForProvince}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FloodMapPage;
