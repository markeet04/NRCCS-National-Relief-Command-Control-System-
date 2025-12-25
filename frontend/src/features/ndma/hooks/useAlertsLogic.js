import { useState, useMemo, useEffect, useCallback } from 'react';
import { useBadge } from '@shared/contexts/BadgeContext';
import NdmaApiService from '@shared/services/NdmaApiService';
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
  const { updateActiveStatusCount, activeStatusCount, provincialRequestsCount } = useBadge();

  // UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewAlertId, setViewAlertId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
   * Load alerts from backend API
   */
  const loadAlerts = useCallback(async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Loading alerts from backend API...');
      const alertsData = await NdmaApiService.getAllAlerts();
      console.log('📋 Loaded alerts:', alertsData);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);

      // Update badge count with active alerts
      const activeAlerts = Array.isArray(alertsData)
        ? alertsData.filter(alert => alert.status !== 'resolved')
        : [];
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
      const updatedAlert = await NdmaApiService.resolveAlert(id);
      setAlerts(prev => {
        const newAlerts = prev.map(alert =>
          alert.id === id ? { ...alert, status: 'resolved', resolvedAt: new Date().toISOString() } : alert
        );
        const activeAlerts = newAlerts.filter(alert => alert.status !== 'resolved');
        updateActiveStatusCount(activeAlerts.length);
        return newAlerts;
      });
      NotificationService.showSuccess('Alert resolved successfully');
    } catch (err) {
      console.error('Error resolving alert:', err);
      NotificationService.showError('Failed to resolve alert');
    }
  }, [updateActiveStatusCount]);

  /**
   * Reopen a resolved alert - Note: Backend doesn't have reopen endpoint, so we reload
   */
  const handleReopenAlert = useCallback(async (id) => {
    try {
      // Backend doesn't have reopen, so we'll just reload alerts
      // In production, you'd want to add a reopen endpoint
      NotificationService.showInfo('Reopening alerts requires admin action');
      await loadAlerts(false);
    } catch (err) {
      console.error('Error reopening alert:', err);
      NotificationService.showError('Failed to reopen alert');
    }
  }, [loadAlerts]);

  /**
   * Delete an alert
   */
  const handleDeleteAlert = useCallback(async (id) => {
    try {
      await NdmaApiService.deleteAlert(id);
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
    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
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
    // Clear province validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.province;
      return newErrors;
    });
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
      setValidationErrors(validation.errors);
      NotificationService.showError('Please fix the validation errors');
      return;
    }

    // Clear validation errors if valid
    setValidationErrors({});

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
      await NdmaApiService.createAlert(alertPayload);
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
    setValidationErrors({});
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

  const displayedAlerts = useMemo(() => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return alerts
      .filter(alert =>
        showResolved ? alert.status === 'resolved' : alert.status !== 'resolved'
      )
      .sort((a, b) => {
        const orderA = severityOrder[a.severity] ?? 4;
        const orderB = severityOrder[b.severity] ?? 4;
        return orderA - orderB;
      });
  }, [alerts, showResolved]);

  const alertStats = useMemo(() => ({
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'active').length,
    medium: alerts.filter(a => a.severity === 'medium' && a.status === 'active').length,
    resolvedToday: alerts.filter(a => a.status === 'resolved' && isToday(a.resolvedAt || a.timestamp)).length,
  }), [alerts]);

  // Get role configuration
  const roleConfig = ROLE_CONFIG.ndma;
  // Menu items with badge counts from context for consistency across all pages
  const menuItems = useMemo(() => getMenuItemsByRole('ndma', activeStatusCount, provincialRequestsCount), [activeStatusCount, provincialRequestsCount]);

  return {
    // State
    alerts,
    loading,
    error,
    isCreateModalOpen,
    viewAlertId,
    showResolved,
    newAlert,
    validationErrors,

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
