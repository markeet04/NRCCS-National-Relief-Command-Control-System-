// useProvincialMapState Hook
// Manages state for ProvincialMap component
import { useState } from 'react';

const useProvincialMapState = () => {
  const [activeRoute, setActiveRoute] = useState('map');
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [mapZoom, setMapZoom] = useState(6);
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const handleExpandMap = () => {
    setIsMapExpanded(true);
    showDemo('Map Expanded', 'The flood risk map is now in full-screen view. Press Escape or click the minimize button to return to normal view.', 'success');
  };

  const handleResetZoom = () => {
    setMapZoom(6);
    showDemo('Zoom Reset', 'Map zoom level has been reset to default view (Level 6) showing all monitored flood zones across the province.', 'info');
  };

  const handleExportMap = () => {
    showDemo('Map Exported', 'Flood risk map has been exported as a PNG file. The file has been downloaded to your default downloads folder.', 'success');
  };

  return {
    activeRoute,
    setActiveRoute,
    selectedLayer,
    setSelectedLayer,
    mapZoom,
    setMapZoom,
    demoModal,
    setDemoModal,
    isMapExpanded,
    setIsMapExpanded,
    showDemo,
    handleExpandMap,
    handleResetZoom,
    handleExportMap
  };
};

export default useProvincialMapState;
