import { Plus, AlertTriangle, CheckCircle, Clock, MapPin, User } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils';

// Import modular components
import {
  CreateAlertModal,
  AlertDetailsModal,
} from '../../components/AlertsPage';

// Import custom hook for alerts logic
import { useAlertsLogic } from '../../hooks';

// Import styles
import '../../styles/nationwide-alerts.css';
import '../../styles/global-ndma.css';

/**
 * AlertsPage Component
 * Nationwide alert management interface with summary stats and alert card list
 * Matches District dashboard alert style
 */
const AlertsPage = () => {
  // Get theme from settings
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Use custom hook for all alert logic
  const {
    // State
    loading,
    error,
    isCreateModalOpen,
    showResolved,
    newAlert,
    validationErrors,
    
    // Computed
    alertToView,
    activeAlertsCount,
    displayedAlerts,
    alertStats,
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
  } = useAlertsLogic();

  /**
   * Get status icon component
   */
  const getStatusIcon = (status) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4" />;
    if (status === 'pending') return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  // Show loading state
  if (loading && displayedAlerts.length === 0) {
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
        <div className="alerts-loading">
          <div className="alerts-loading-spinner"></div>
          <p className="alerts-loading-text">Loading alerts...</p>
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
        <div className="alerts-error">
          <AlertTriangle className="alerts-error-icon" />
          <h3 className="alerts-error-title">Error Loading Alerts</h3>
          <p className="alerts-error-message">{error}</p>
          <button
            className="alerts-btn alerts-btn-primary"
            onClick={() => loadAlerts()}
          >
            Retry
          </button>
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
        {/* Page Header */}
        <div className="alerts-page-header">
          <div>
            <h1 className="alerts-page-title">Nationwide Alerts</h1>
            <p className="alerts-page-subtitle">
              {showResolved 
                ? 'Viewing resolved alerts' 
                : `Monitoring ${activeAlertsCount} active alerts across Pakistan`}
            </p>
          </div>
          <div className="alerts-page-actions">
            <button
              className={`alerts-btn alerts-btn-secondary ${showResolved ? 'active' : ''}`}
              onClick={toggleShowResolved}
              disabled={loading}
            >
              {showResolved ? 'Show Active' : 'Show Resolved'}
            </button>
            <button
              className="alerts-btn alerts-btn-primary"
              onClick={openCreateModal}
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="alerts-stats-grid">
          <div className="alerts-stat-card critical">
            <div className="alerts-stat-label critical">Critical</div>
            <div className="alerts-stat-value critical">{alertStats.critical}</div>
          </div>
          <div className="alerts-stat-card high">
            <div className="alerts-stat-label high">High</div>
            <div className="alerts-stat-value high">{alertStats.high}</div>
          </div>
          <div className="alerts-stat-card medium">
            <div className="alerts-stat-label medium">Medium</div>
            <div className="alerts-stat-value medium">{alertStats.medium}</div>
          </div>
          <div className="alerts-stat-card resolved">
            <div className="alerts-stat-label resolved">Resolved Today</div>
            <div className="alerts-stat-value resolved">{alertStats.resolvedToday}</div>
          </div>
        </div>

        {/* Alert Cards List */}
        {displayedAlerts.length === 0 ? (
          <div className="alerts-list-empty">
            <p>{showResolved ? 'No resolved alerts found' : 'No active alerts at this time'}</p>
          </div>
        ) : (
          <div className="alerts-list">
            {displayedAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-card ${alert.severity} ${alert.status === 'resolved' ? 'resolved' : ''}`}
              >
                {/* Header with badges */}
                <div className="alert-card-header">
                  <div className="alert-card-badges">
                    <span className={`alert-severity-badge ${alert.severity}`}>
                      {alert.severity}
                    </span>
                    {alert.type && (
                      <span className="alert-type-badge">
                        {alert.type}
                      </span>
                    )}
                    <span className={`alert-status-badge ${alert.status}`}>
                      {getStatusIcon(alert.status)}
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="alert-card-title">{alert.title}</h3>

                {/* Description */}
                <p className="alert-card-description">{alert.description}</p>

                {/* Meta Info */}
                <div className="alert-card-meta">
                  {alert.location && (
                    <div className="alert-card-meta-item">
                      <MapPin className="w-4 h-4" />
                      <span className="alert-card-meta-label">Location:</span>
                      <span className="alert-card-meta-value">{alert.location}</span>
                    </div>
                  )}
                  {alert.source && (
                    <div className="alert-card-meta-item">
                      <User className="w-4 h-4" />
                      <span className="alert-card-meta-label">Source:</span>
                      <span className="alert-card-meta-value">{alert.source}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="alert-card-actions">
                  <button
                    className="alerts-btn alerts-btn-outline"
                    onClick={() => handleViewAlert(alert.id)}
                  >
                    View Details
                  </button>
                  
                  {alert.status === 'resolved' ? (
                    <>
                      <button
                        className="alerts-btn alerts-btn-warning"
                        onClick={() => handleReopenAlert(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Reopen
                      </button>
                      <button
                        className="alerts-btn alerts-btn-danger"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="alerts-btn alerts-btn-success"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>

      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        formData={newAlert}
        onChange={handleChangeNewAlert}
        onProvinceChange={handleProvinceChange}
        onSubmit={handleSubmitNewAlert}
        loading={loading}
        colors={colors}
        isLight={isLight}
        validationErrors={validationErrors}
      />

      {/* Alert Details Modal */}
      <AlertDetailsModal
        alert={alertToView}
        onClose={handleCloseViewAlert}
        onResolve={handleResolveAlert}
        colors={colors}
        isLight={isLight}
      />
    </>
  );
};

export default AlertsPage;
