import { useState, useMemo, useEffect, useCallback } from 'react';
import { useBadge } from '@shared/contexts/BadgeContext';
import { AlertService } from '@services/AlertService';
import { NotificationService } from '@services/NotificationService';
import { validateAlert } from '@utils/validationUtils';
import { getCurrentTimestamp, isToday } from '@utils/dateUtils';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { INITIAL_ALERT_FORM } from '../constants';

/**
 * useAlertsLogic Hook
 * Manages all business logic for the NDMA Alerts page
 */
export const useAlertsLogic = () => {
  const { updateActiveStatusCount } = useBadge();
  
  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewAlertId, setViewAlertId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  
  // Data State
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [newAlert, setNewAlert] = useState(INITIAL_ALERT_FORM);

  // Load alerts on mount
  useEffect(() => {
    loadAlerts(false);
  }, []);

  /**
   * Load alerts from service
   */
  const loadAlerts = useCallback(async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Loading alerts from AlertService...');
      const alertsData = await AlertService.getAlerts();
      console.log('📋 Loaded alerts:', alertsData);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      
      // Update badge count with active alerts
      const activeAlerts = alertsData.filter(alert => alert.status !== 'resolved');
      updateActiveStatusCount(activeAlerts.length);
      
      if (showSuccessMessage) {
        NotificationService.showSuccess('Alerts loaded successfully');
      }
    } catch (err) {
      console.error('❌ Error loading alerts:', err);
      setError('Failed to load alerts');
      NotificationService.showError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [updateActiveStatusCount]);

  /**
   * View alert details
   */
  const handleViewAlert = useCallback((alertId) => {
    setViewAlertId(alertId);
  }, []);

  /**
   * Close alert details modal
   */
  const handleCloseViewAlert = useCallback(() => {
    setViewAlertId(null);
  }, []);

  /**
   * Resolve an alert
   */
  const handleResolveAlert = useCallback(async (id) => {
    try {
      const updatedAlert = await AlertService.updateAlert(id, { status: 'resolved' });
      setAlerts(prev => {
        const newAlerts = prev.map(alert =>
          alert.id === id ? updatedAlert : alert
        );
        const activeAlerts = newAlerts.filter(alert => alert.status !== 'resolved');
        updateActiveStatusCount(activeAlerts.length);
        return newAlerts;
      });
      NotificationService.showSuccess('Alert status updated');
    } catch (err) {
      console.error('Error updating alert:', err);
      NotificationService.showError('Failed to update alert');
    }
  }, [updateActiveStatusCount]);

  /**
   * Reopen a resolved alert
   */
  const handleReopenAlert = useCallback(async (id) => {
    try {
      const updatedAlert = await AlertService.updateAlert(id, { status: 'active' });
      setAlerts(prev => {
        const newAlerts = prev.map(alert =>
          alert.id === id ? updatedAlert : alert
        );
        const activeAlerts = newAlerts.filter(alert => alert.status !== 'resolved');
        updateActiveStatusCount(activeAlerts.length);
        return newAlerts;
      });
      NotificationService.showSuccess('Alert reopened successfully');
    } catch (err) {
      console.error('Error reopening alert:', err);
      NotificationService.showError('Failed to reopen alert');
    }
  }, [updateActiveStatusCount]);

  /**
   * Delete an alert
   */
  const handleDeleteAlert = useCallback(async (id) => {
    try {
      await AlertService.deleteAlert(id);
      setAlerts(prev => {
        const newAlerts = prev.filter(alert => alert.id !== id);
        const activeAlerts = newAlerts.filter(alert => alert.status !== 'resolved');
        updateActiveStatusCount(activeAlerts.length);
        return newAlerts;
      });
      NotificationService.showSuccess('Alert deleted successfully');
    } catch (err) {
      console.error('Error deleting alert:', err);
      NotificationService.showError('Failed to delete alert');
    }
  }, [updateActiveStatusCount]);

  /**
   * Handle form field changes
   */
  const handleChangeNewAlert = useCallback((event) => {
    const { name, value } = event.target;
    if (name === 'province') {
      setNewAlert(prev => ({ ...prev, [name]: value, district: '' }));
    } else {
      setNewAlert(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Handle province checkbox change
   */
  const handleProvinceChange = useCallback((province, checked) => {
    setNewAlert(prev => ({
      ...prev,
      province: checked ? province : '',
      district: ''
    }));
  }, []);

  /**
   * Submit new alert
   */
  const handleSubmitNewAlert = useCallback(async (event) => {
    event.preventDefault();

    console.log('🔍 Validating alert data:', newAlert);
    const validation = validateAlert(newAlert);
    console.log('✅ Validation result:', validation);
    
    if (!validation.isValid) {
      console.error('❌ Validation errors:', validation.errors);
      NotificationService.showError('Validation failed: ' + Object.values(validation.errors).join(', '));
      return;
    }

    try {
      setLoading(true);
      console.log('⏳ Starting alert creation process...');
      
      const location = [newAlert.province, newAlert.district, newAlert.tehsil]
        .filter(Boolean)
        .join(', ');

      const alertPayload = {
        ...newAlert,
        location,
        timestamp: getCurrentTimestamp()
      };

      console.log('📦 Creating alert with payload:', alertPayload);
      await AlertService.createAlert(alertPayload);
      console.log('✅ Alert created successfully');
      
      // Reload all alerts from service
      await loadAlerts(false);
      
      // Reset form and close modal
      resetForm();
      setIsCreateModalOpen(false);
      
      NotificationService.showSuccess('Alert published successfully');
    } catch (err) {
      console.error('❌ Error creating alert:', err);
      NotificationService.showError('Failed to publish alert: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [newAlert, loadAlerts]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setNewAlert(INITIAL_ALERT_FORM);
  }, []);

  /**
   * Open create modal
   */
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  /**
   * Close create modal
   */
  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    resetForm();
  }, [resetForm]);

  /**
   * Toggle resolved filter
   */
  const toggleShowResolved = useCallback(() => {
    setShowResolved(prev => !prev);
  }, []);

  // Computed values
  const alertToView = useMemo(
    () => viewAlertId ? alerts.find(a => a.id === viewAlertId) : null,
    [viewAlertId, alerts]
  );

  const activeAlertsCount = useMemo(
    () => alerts.filter(a => a.status === 'active').length,
    [alerts]
  );

  const displayedAlerts = useMemo(
    () => alerts.filter(alert => 
      showResolved ? alert.status === 'resolved' : alert.status !== 'resolved'
    ),
    [alerts, showResolved]
  );

  const alertStats = useMemo(() => ({
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'active').length,
    medium: alerts.filter(a => a.severity === 'medium' && a.status === 'active').length,
    resolvedToday: alerts.filter(a => a.status === 'resolved' && isToday(a.resolvedAt || a.timestamp)).length,
  }), [alerts]);

  // Get role configuration
  const roleConfig = ROLE_CONFIG.ndma;
  const menuItems = useMemo(() => getMenuItemsByRole('ndma', 0), []);

  return {
    // State
    alerts,
    loading,
    error,
    isCreateModalOpen,
    viewAlertId,
    showResolved,
    newAlert,
    
    // Computed
    alertToView,
    activeAlertsCount,
    displayedAlerts,
    alertStats,
    roleConfig,
    menuItems,
    
    // Actions
    loadAlerts,
    handleViewAlert,
    handleCloseViewAlert,
    handleResolveAlert,
    handleReopenAlert,
    handleDeleteAlert,
    handleChangeNewAlert,
    handleProvinceChange,
    handleSubmitNewAlert,
    openCreateModal,
    closeCreateModal,
    toggleShowResolved,
    resetForm,
  };
};

export default useAlertsLogic;
