// usePDMADashboardState Hook
// Manages state for PDMADashboard component
import { useState, useEffect } from 'react';
import { pdmaApi } from '../services';
import { useNotification } from '@shared/hooks';

const usePDMADashboardState = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [demoModal, setDemoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notification = useNotification();

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, alertsData, districtsData, resourcesData] = await Promise.all([
        pdmaApi.getDashboardStats(),
        pdmaApi.getAllAlerts({ status: 'active' }),
        pdmaApi.getAllDistricts(),
        pdmaApi.getAllResources(),
      ]);

      setStats(statsData);
      setAlerts(alertsData);
      setDistricts(districtsData);
      setResources(resourcesData);
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showDemo = (title, message, type = 'info') => {
    setDemoModal({ isOpen: true, title, message, type });
  };

  const handleNavigate = (route) => {
    setActiveRoute(route);
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await pdmaApi.resolveAlert(alertId);
      notification.success('Alert resolved successfully');
      
      // Refresh alerts
      const updatedAlerts = await pdmaApi.getAllAlerts({ status: 'active' });
      setAlerts(updatedAlerts);
    } catch (err) {
      notification.error(err.message);
    }
  };

  const handleAllocateResource = async (resourceId, districtId, quantity) => {
    try {
      await pdmaApi.allocateResource(resourceId, { districtId, quantity });
      notification.success('Resource allocated successfully');
      
      // Refresh resources
      const updatedResources = await pdmaApi.getAllResources();
      setResources(updatedResources);
    } catch (err) {
      notification.error(err.message);
    }
  };

  const handleAlertFormSubmit = async (formData) => {
    try {
      await pdmaApi.createAlert(formData);
      notification.success(`Alert "${formData.title}" created successfully`);
      setIsAlertFormOpen(false);
      
      // Refresh alerts
      const updatedAlerts = await pdmaApi.getAllAlerts({ status: 'active' });
      setAlerts(updatedAlerts);
    } catch (err) {
      notification.error(err.message);
    }
  };

  const handleResourceFormSubmit = async (formData) => {
    try {
      await pdmaApi.createResource(formData);
      notification.success(`Resource "${formData.name}" added successfully`);
      setIsResourceFormOpen(false);
      
      // Refresh resources
      const updatedResources = await pdmaApi.getAllResources();
      setResources(updatedResources);
    } catch (err) {
      notification.error(err.message);
    }
  };

  return {
    activeRoute,
    setActiveRoute,
    demoModal,
    setDemoModal,
    isAlertFormOpen,
    setIsAlertFormOpen,
    isResourceFormOpen,
    setIsResourceFormOpen,
    showDemo,
    handleNavigate,
    handleResolveAlert,
    handleAllocateResource,
    handleAlertFormSubmit,
    handleResourceFormSubmit,
    // Data
    stats,
    alerts,
    districts,
    resources,
    loading,
    error,
  };
};

export default usePDMADashboardState;
