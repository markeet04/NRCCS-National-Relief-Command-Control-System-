import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { AlertCard } from '@shared/components/dashboard';
import { Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';

// Import service layers and utilities
import { AlertService } from '@services/AlertService';
import { NotificationService } from '@services/NotificationService';
import { UI_CONSTANTS, APP_CONFIG } from '@config/constants';
import { validateAlert } from '@utils/validationUtils';
import { formatNumber } from '@utils/formatUtils';
import { getCurrentTimestamp, isToday } from '@utils/dateUtils';

/**
 * AlertsPage Component
 * Comprehensive alert management interface for viewing, creating, and managing alerts
 */
const AlertsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewAlertId, setViewAlertId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize alerts state from service layer
  // Add sample alerts for initial feed if service is empty
  const sampleAlerts = [
    {
      id: 1,
      title: 'Flash Flood Warning - Sindh',
      description: 'Heavy rainfall has caused flash floods in multiple districts of Sindh. Residents are advised to evacuate low-lying areas immediately.',
      severity: 'critical',
      type: 'flood',
      province: 'Sindh',
      district: 'Sukkur',
      tehsil: 'New Sukkur',
      source: 'NDMA',
      location: 'Sindh, Sukkur, New Sukkur',
      status: 'active',
      timestamp: getCurrentTimestamp(),
    },
    {
      id: 2,
      title: 'Medical Aid Required - Punjab',
      description: 'Outbreak of waterborne diseases reported in flood-affected areas. Medical teams are being dispatched.',
      severity: 'high',
      type: 'medical',
      province: 'Punjab',
      district: 'Lahore',
      tehsil: 'Model Town',
      source: 'NDMA',
      location: 'Punjab, Lahore, Model Town',
      status: 'resolved',
      timestamp: getCurrentTimestamp(),
    },
    {
      id: 3,
      title: 'Evacuation Alert - Balochistan',
      description: 'Evacuation ordered for coastal areas due to cyclone warning. Please cooperate with local authorities.',
      severity: 'medium',
      type: 'evacuation',
      province: 'Balochistan',
      district: 'Gwadar',
      tehsil: 'Gwadar City',
      source: 'NDMA',
      location: 'Balochistan, Gwadar, Gwadar City',
      status: 'active',
      timestamp: getCurrentTimestamp(),
    },
  ];
  const [alerts, setAlerts] = useState(sampleAlerts);

  // Load alerts on component mount
  useEffect(() => {
    // On first mount, initialize localStorage with sample alerts if empty
    const stored = localStorage.getItem('ndma_alerts');
    if (!stored) {
      localStorage.setItem('ndma_alerts', JSON.stringify(sampleAlerts));
    }
    loadAlerts(true);
  }, []);

  const loadAlerts = async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      setError(null);
      const alertsData = await AlertService.getAlerts();
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      if (showSuccessMessage) {
        NotificationService.showSuccess('Alerts loaded successfully');
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      setError('Failed to load alerts');
      NotificationService.showError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  // Menu items for NDMA role with dynamic badges
  const menuItems = useMemo(() => [
    { route: 'dashboard', label: 'National Dashboard', icon: 'dashboard' },
    { route: 'alerts', label: 'Nationwide Alerts', icon: 'alerts' }, // no badge when on alerts page
    { route: 'resources', label: 'Resource Allocation', icon: 'resources' },
    { route: 'map', label: 'Flood Map', icon: 'map' },
  ], []);

  // Province and district data from constants
  const provinceDistrictsMap = UI_CONSTANTS.PROVINCE_DISTRICTS;

  // Form state for new alert
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    severity: 'high',
    type: 'flood',
    province: '',
    district: '',
    tehsil: '',
    source: 'NDMA',
  });

  const availableDistricts = newAlert.province ? provinceDistrictsMap[newAlert.province] || [] : [];

  // Event handlers using service layer
  const handleViewAlert = (alertId) => {
    setViewAlertId(alertId);
  };

  const handleResolveAlert = async (id) => {
    try {
      const updatedAlert = await AlertService.updateAlert(id, { status: 'resolved' });
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? updatedAlert : alert
      ));
      NotificationService.showSuccess('Alert status updated');
    } catch (error) {
      console.error('Error updating alert:', error);
      NotificationService.showError('Failed to update alert');
    }
  };

  const handleReopenAlert = async (id) => {
    try {
      const updatedAlert = await AlertService.updateAlert(id, { status: 'active' });
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? updatedAlert : alert
      ));
      NotificationService.showSuccess('Alert reopened successfully');
    } catch (error) {
      console.error('Error reopening alert:', error);
      NotificationService.showError('Failed to reopen alert');
    }
  };

  const handleChangeNewAlert = (event) => {
    const { name, value } = event.target;
    if (name === 'province') {
      setNewAlert(prev => ({ ...prev, [name]: value, district: '' }));
    } else {
      setNewAlert(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitNewAlert = async (event) => {
    event.preventDefault();

    // Validate using validation utilities
    console.log('Validating alert data:', newAlert);
    const validation = validateAlert(newAlert);
    console.log('Validation result:', validation);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      NotificationService.showError('Validation failed: ' + Object.values(validation.errors).join(', '));
      return;
    }

    try {
      setLoading(true);
      
      const location = [newAlert.province, newAlert.district, newAlert.tehsil]
        .filter(Boolean)
        .join(', ');

      const alertPayload = {
        ...newAlert,
        location,
        timestamp: getCurrentTimestamp()
      };

      console.log('Creating alert with payload:', alertPayload);
      const createdAlert = await AlertService.createAlert(alertPayload);
      console.log('Alert created:', createdAlert);
      
      // Immediately add to state for instant UI update
      setAlerts(prev => [createdAlert, ...prev]);
      console.log('Alert added to state');
      
      // Reset form
      setNewAlert({ 
        title: '', 
        description: '', 
        severity: 'high', 
        type: 'flood', 
        province: '', 
        district: '', 
        tehsil: '', 
        source: 'NDMA' 
      });
      setIsCreateModalOpen(false);
      
      NotificationService.showSuccess('Alert created successfully');

    } catch (error) {
      console.error('Error creating alert:', error);
      NotificationService.showError('Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const alertToView = viewAlertId ? alerts.find(a => a.id === viewAlertId) : null;
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const displayedAlerts = alerts.filter(alert => 
    showResolved ? alert.status === 'resolved' : alert.status !== 'resolved'
  );

  // Show loading state
  if (loading && alerts.length === 0) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading alerts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Error Loading Alerts
            </p>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <button
              onClick={loadAlerts}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#0ea5e9', color: '#ffffff' }}
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        activeRoute="alerts"
        onNavigate={(route) => console.log('Navigate to:', route)}
        userRole="NDMA"
        userName="Admin"
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle="Alert Management System"
        notificationCount={activeAlertsCount}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Nationwide Alerts</h1>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {showResolved ? 'Viewing resolved alerts' : `Monitoring ${activeAlertsCount} active alerts across Pakistan`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg transition-colors text-sm font-medium"
              style={{ 
                backgroundColor: showResolved ? '#0ea5e9' : 'rgba(148, 163, 184, 0.12)', 
                color: showResolved ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                padding: '10px 20px',
                minHeight: '40px'
              }}
              onClick={() => setShowResolved(!showResolved)}
              disabled={loading}
            >
              {showResolved ? 'Show Active' : 'Show Resolved'}
            </button>
            <button
              type="button"
              className="flex items-center rounded-lg transition-colors text-sm font-medium"
              style={{ 
                backgroundColor: loading ? 'rgba(14, 165, 233, 0.5)' : '#0ea5e9', 
                color: '#ffffff', 
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '10px 20px',
                gap: '8px',
                minHeight: '40px'
              }}
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6" style={{ marginTop: '24px' }}>
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg p-4 border border-red-500/20">
            <div className="text-center">
              <p className="text-sm font-medium text-red-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-500">
                {formatNumber(alerts.filter(a => a.severity === 'critical' && a.status === 'active').length)}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-4 border border-orange-500/20">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-400 mb-1">High</p>
              <p className="text-2xl font-bold text-orange-500">
                {formatNumber(alerts.filter(a => a.severity === 'high' && a.status === 'active').length)}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-center">
              <p className="text-sm font-medium text-yellow-400 mb-1">Medium</p>
              <p className="text-2xl font-bold text-yellow-500">
                {formatNumber(alerts.filter(a => a.severity === 'medium' && a.status === 'active').length)}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/20">
            <div className="text-center">
              <p className="text-sm font-medium text-green-400 mb-1">Resolved Today</p>
              <p className="text-2xl font-bold text-green-500">
                {formatNumber(alerts.filter(a => a.status === 'resolved' && 
                  isToday(a.resolvedAt || a.timestamp)).length)}
              </p>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div>
          {displayedAlerts.map((alert) => (
            <div key={alert.id} style={{ margin: '16px 0' }}>
              <AlertCard
                {...alert}
                showSeverityBadge={true}
                onResolve={alert.status !== 'resolved' ? () => handleResolveAlert(alert.id) : undefined}
                onReopen={alert.status === 'resolved' ? () => handleReopenAlert(alert.id) : undefined}
                onView={() => handleViewAlert(alert.id)}
              />
            </div>
          ))}
          {displayedAlerts.length === 0 && (
            <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                {showResolved ? 'No resolved alerts found' : 'No active alerts at this time'}
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* Create Alert Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999, padding: '1rem' }}>
          <div className="w-full" style={{ maxWidth: '500px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', flexShrink: 0 }}>
              <h3 className="text-lg font-semibold" style={{ color: '#f8fafc', margin: 0 }}>Create New Alert</h3>
              <button
                className="p-1.5 rounded transition-colors"
                style={{ color: '#94a3b8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Close create alert modal"
                disabled={loading}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewAlert} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ overflowY: 'auto', padding: '20px', flexGrow: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Alert Title */}
                  <div>
                    <label className="block text-sm font-medium" style={{ color: '#94a3b8', marginBottom: '6px' }}>
                      Alert Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newAlert.title}
                      onChange={handleChangeNewAlert}
                      required
                      className="w-full rounded-md"
                      style={{ 
                        backgroundColor: '#0f172a', 
                        color: '#e2e8f0', 
                        border: '1px solid #334155',
                        padding: '8px 12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="e.g., Flash Flood Warning"
                      disabled={loading}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#334155'}
                    />
                  </div>

                  {/* Severity Level */}
                  <div>
                    <label className="block text-sm font-medium" style={{ color: '#94a3b8', marginBottom: '6px' }}>
                      Severity Level
                    </label>
                    <select
                      name="severity"
                      value={newAlert.severity}
                      onChange={handleChangeNewAlert}
                      required
                      className="w-full rounded-md"
                      style={{ 
                        backgroundColor: '#0f172a', 
                        color: '#e2e8f0', 
                        border: '1px solid #334155',
                        padding: '8px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      disabled={loading}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#334155'}
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Affected Provinces */}
                  <div>
                    <label className="block text-sm font-medium" style={{ color: '#94a3b8', marginBottom: '8px' }}>
                      Affected Provinces
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(provinceDistrictsMap).map(province => (
                        <label 
                          key={province} 
                          className="flex items-center" 
                          style={{ 
                            padding: '8px 10px',
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#475569'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                        >
                          <input
                            type="checkbox"
                            checked={newAlert.province === province}
                            onChange={(e) => {
                              setNewAlert(prev => ({
                                ...prev,
                                province: e.target.checked ? province : '',
                                district: ''
                              }));
                            }}
                            style={{
                              width: '16px',
                              height: '16px',
                              marginRight: '8px',
                              accentColor: '#3b82f6',
                              cursor: 'pointer'
                            }}
                            disabled={loading}
                          />
                          <span style={{ color: '#e2e8f0', fontSize: '13px' }}>{province}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* District */}
                  {newAlert.province && (
                    <div>
                      <label className="block text-sm font-medium" style={{ color: '#94a3b8', marginBottom: '6px' }}>
                        District (Optional)
                      </label>
                      <select
                        name="district"
                        value={newAlert.district}
                        onChange={handleChangeNewAlert}
                        className="w-full rounded-md"
                        style={{ 
                          backgroundColor: '#0f172a', 
                          color: '#e2e8f0', 
                          border: '1px solid #334155',
                          padding: '8px 12px',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                        disabled={loading}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#334155'}
                      >
                        <option value="">Select District</option>
                        {availableDistricts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Alert Message */}
                  <div>
                    <label className="block text-sm font-medium" style={{ color: '#94a3b8', marginBottom: '6px' }}>
                      Alert Message
                    </label>
                    <textarea
                      name="description"
                      value={newAlert.description}
                      onChange={handleChangeNewAlert}
                      required
                      rows="3"
                      className="w-full rounded-md"
                      style={{ 
                        backgroundColor: '#0f172a', 
                        color: '#e2e8f0', 
                        border: '1px solid #334155',
                        padding: '8px 12px',
                        fontSize: '14px',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Detailed alert message..."
                      disabled={loading}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#334155'}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(148, 163, 184, 0.1)', flexShrink: 0 }}>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-md font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#334155', 
                      color: '#e2e8f0',
                      padding: '10px 16px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={loading}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-md font-medium transition-colors"
                    style={{ 
                      backgroundColor: loading ? '#dc2626' : '#ef4444', 
                      color: '#ffffff',
                      padding: '10px 16px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      opacity: loading ? 0.7 : 1
                    }}
                    disabled={loading}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#dc2626')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ef4444')}
                  >
                    {loading ? 'Creating...' : 'Create Alert'}
                  </button>
                </div>
              </div>
            </form>
          </div>    
        </div>
      )}

      {/* Alert Details Modal */}
      {alertToView && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(2, 6, 23, 0.75)', zIndex: 9999 }}>
          <div className="w-full max-w-3xl rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-tertiary)', zIndex: 10, padding: '24px 32px' }}>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Alert Details</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Full alert information</p>
              </div>
              <button
                className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
                style={{ color: 'var(--text-secondary)', backgroundColor: 'rgba(148, 163, 184, 0.12)' }}
                onClick={() => setViewAlertId(null)}
                aria-label="Close alert details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '32px' }}>
                <h4 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.3' }}>{alertToView.title}</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-lg text-xs font-semibold uppercase" style={{
                    backgroundColor: alertToView.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' :
                      alertToView.severity === 'high' ? 'rgba(249, 115, 22, 0.15)' :
                      alertToView.severity === 'medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: alertToView.severity === 'critical' ? '#ef4444' :
                      alertToView.severity === 'high' ? '#f97316' :
                      alertToView.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                    border: `1px solid ${alertToView.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' :
                      alertToView.severity === 'high' ? 'rgba(249, 115, 22, 0.3)' :
                      alertToView.severity === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                    letterSpacing: '0.05em'
                  }}>
                    {alertToView.severity}
                  </span>
                  <span className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2" style={{
                    backgroundColor: alertToView.status === 'active' ? 'rgba(59, 130, 246, 0.15)' :
                      alertToView.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                    color: alertToView.status === 'active' ? '#3b82f6' :
                      alertToView.status === 'resolved' ? '#10b981' : '#94a3b8',
                    border: `1px solid ${alertToView.status === 'active' ? 'rgba(59, 130, 246, 0.3)' :
                      alertToView.status === 'resolved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
                  }}>
                    {alertToView.status === 'active' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {alertToView.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px 24px' }}>
                  <h5 className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Description</h5>
                  <p style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '15px' }}>{alertToView.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
                  {alertToView.type && (
                    <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px 20px' }}>
                      <h5 className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Alert Type</h5>
                      <p className="font-medium" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{alertToView.type}</p>
                    </div>
                  )}
                  {alertToView.location && (
                    <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px 20px' }}>
                      <h5 className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Location</h5>
                      <p className="font-medium" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{alertToView.location}</p>
                    </div>
                  )}
                  {alertToView.source && (
                    <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px 20px' }}>
                      <h5 className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Source</h5>
                      <p className="font-medium" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{alertToView.source}</p>
                    </div>
                  )}
                  <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px 20px' }}>
                    <h5 className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Alert ID</h5>
                    <p className="font-medium font-mono" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>#{alertToView.id}</p>
                  </div>
                </div>

                {alertToView.status === 'active' && (
                  <div className="rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="text-sm font-semibold" style={{ color: '#ef4444', marginBottom: '8px' }}>Active Alert</h5>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          This alert is currently active and requires attention.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row" style={{ gap: '12px', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  className="w-full md:w-auto rounded-lg font-medium transition-colors hover:bg-opacity-80"
                  style={{ backgroundColor: 'rgba(148, 163, 184, 0.12)', color: 'var(--text-primary)', fontSize: '15px', padding: '12px 24px' }}
                  onClick={() => setViewAlertId(null)}
                >
                  Close
                </button>
                {alertToView.status === 'active' && (
                  <button
                    className="w-full md:flex-1 rounded-lg font-semibold flex items-center justify-center transition-colors hover:bg-opacity-90"
                    style={{ backgroundColor: '#10b981', color: '#ffffff', gap: '8px', padding: '12px 24px' }}
                    onClick={() => {
                      handleResolveAlert(alertToView.id);
                      setViewAlertId(null);
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertsPage;
