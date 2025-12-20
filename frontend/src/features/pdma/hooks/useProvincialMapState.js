// useProvincialMapState Hook
// Manages state for ProvincialMap component
import { useState, useEffect } from 'react';
import { pdmaApi } from '../services';
import useNotification from '@shared/hooks/useNotification';

const useProvincialMapState = () => {
  const [activeRoute, setActiveRoute] = useState('map');
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [mapZoom, setMapZoom] = useState(6);
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  // Data states
  const [mapData, setMapData] = useState({ zones: [], shelters: [], sosMarkers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch map data from backend
  const fetchMapData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pdmaApi.getMapData();
      setMapData(data);
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const handleExpandMap = () => {
    setIsMapExpanded(true);
    notification.success('Map expanded to full-screen view');
  };

  const handleResetZoom = () => {
    setMapZoom(6);
    notification.info('Map zoom reset to default');
  };

  const handleExportMap = () => {
    notification.success('Map exported successfully');
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
    handleExportMap,
    // Data
    mapData,
    loading,
    error,
    refreshMapData: fetchMapData,
  };
};

export default useProvincialMapState;
