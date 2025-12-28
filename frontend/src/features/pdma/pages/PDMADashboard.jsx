import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { MapContainer as SharedMapContainer } from '@shared/components/dashboard';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import AlertForm from '@shared/components/DemoModal/AlertForm';
import ResourceForm from '@shared/components/DemoModal/ResourceForm';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@shared/hooks';
import {
  getMenuItemsByRole,
  ROLE_CONFIG
} from '@shared/constants/dashboardConfig';
import {
  StatisticsSection,
  AlertsSection,
  FloodMapSection
} from '../components';
import { usePDMADashboardState } from '../hooks';
import {
  transformStatsForUI,
  transformAlertsForUI,
  transformDistrictsForDashboard
} from '../utils';
import '@styles/css/main.css';
import '@features/ndma/styles/national-dashboard.css'; // Import NDMA styles for stat cards

/**
 * PDMADashboard Component
 * Provincial Dashboard for PDMA (Provincial Disaster Management Authority)
 * Displays province-level disaster coordination and resource management
 * Uses modular components and hooks for better maintainability
 */
const PDMADashboard = () => {
  // Get authenticated user
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'PDMA User';

  // Use custom hook for dashboard state management
  const {
    activeRoute,
    handleNavigate,
    demoModal,
    setDemoModal,
    isAlertFormOpen,
    setIsAlertFormOpen,
    isResourceFormOpen,
    setIsResourceFormOpen,
    handleResolveAlert,
    handleAllocateResource,
    handleAlertFormSubmit,
    handleResourceFormSubmit,
    // Real data from backend
    stats: apiStats,
    alerts: apiAlerts,
    districts: apiDistricts,
    resources: apiResources,
    loading,
    error,
  } = usePDMADashboardState();

  const provinceName = user?.provinceName || 'Province';

  // Theme support
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.pdma;

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Transform backend data to UI format
  const stats = transformStatsForUI(apiStats);
  const alerts = transformAlertsForUI(apiAlerts);
  const districts = transformDistrictsForDashboard(apiDistricts);
  const resources = apiResources || [];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={`${roleConfig.userRole} ${provinceName}`}
      userName={userName}
      pageTitle={roleConfig.title}
      pageSubtitle={`${provinceName} ${roleConfig.subtitle}`}
      pageIcon={Shield}
      pageIconColor="#6366f1"
      notificationCount={alerts?.length || 0}
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: colors.textSecondary
          }}>
            <Loader2 size={40} className="animate-spin" style={{ marginRight: '12px' }} />
            <span>Loading dashboard data...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            padding: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '20px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Statistics Section - NDMA Style Cards */}
            <StatisticsSection stats={stats} colors={colors} />

            {/* Map and Alerts Section - Map on left, Alerts column on right */}
            <div className="national-main-grid" style={{ marginBottom: '24px' }}>
              {/* Flood Map Section - Left Side */}
              <FloodMapSection provinceName={provinceName} colors={colors} isLight={isLight} />

              {/* Alerts Section - Right Side Column */}
              <div className="national-sidebar">
                <AlertsSection
                  alerts={alerts}
                  colors={colors}
                  isLight={isLight}
                  showAllAlerts={true}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={demoModal.isOpen}
        onClose={() => setDemoModal({ ...demoModal, isOpen: false })}
        title={demoModal.title}
        message={demoModal.message}
        type={demoModal.type}
      />

      {/* Alert Form Modal */}
      <AlertForm
        isOpen={isAlertFormOpen}
        onClose={() => setIsAlertFormOpen(false)}
        onSubmit={handleAlertFormSubmit}
      />

      {/* Resource Form Modal */}
      <ResourceForm
        isOpen={isResourceFormOpen}
        onClose={() => setIsResourceFormOpen(false)}
        onSubmit={handleResourceFormSubmit}
      />
    </DashboardLayout>
  );
};

export default PDMADashboard;
