/**
 * ProvincialMap Page - PDMA Dashboard
 * 
 * Now uses ArcGIS JavaScript API for consistency with NDMA and District maps.
 * Replaced Leaflet implementation.
 */

import { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { useAuth } from '@shared/hooks';
import { Loader2 } from 'lucide-react';
import ProvincialWeatherMap from '../components/ProvincialMap/ProvincialWeatherMap/ProvincialWeatherMap';
import { useProvincialMapState, usePendingRequestsCount } from '../hooks';
import '@styles/css/main.css';

const ProvincialMap = () => {
  // Get authenticated user
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'PDMA User';

  // Get pending district requests count for badge
  const { pendingCount } = usePendingRequestsCount();

  const {
    activeRoute,
    setActiveRoute,
    mapData,
    loading,
    error,
  } = useProvincialMapState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma', 0, 0, pendingCount), [pendingCount]);

  // Use backend data for flood zones
  const floodZones = mapData.zones || [];
  const totalAffected = floodZones.reduce((sum, zone) => sum + (zone.affectedPopulation || 0), 0);
  const criticalZones = floodZones.filter(zone => zone.risk === 'critical').length;

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        pageTitle="Map"
        pageSubtitle="Flood risk monitoring"
        userRole="pdma"
        userName={userName}
      >
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        pageTitle="Map"
        pageSubtitle="Flood risk monitoring"
        userRole="pdma"
        userName={userName}
      >
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2" style={{ color: colors.danger }}>
              Failed to load map data
            </div>
            <div style={{ color: colors.mutedText }}>{error}</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Map"
      pageSubtitle="Flood risk monitoring and visualization"
      userRole="pdma"
      userName={userName}
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' }}>
            Flood Risk Map
          </h2>
          <p style={{ fontSize: '0.9rem', color: colors.textMuted }}>
            Real-time flood risk monitoring and visualization
          </p>
        </div>

        {/* ArcGIS Map Component */}
        <div style={{ marginBottom: '24px' }}>
          <ProvincialWeatherMap
            height="500px"
            showDashboardLayout={false}
          />
        </div>

        {/* Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Total Flood Zones</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary }}>{floodZones.length}</div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Critical Zones</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{criticalZones}</div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Affected Population</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrimary }}>{totalAffected.toLocaleString()}</div>
          </div>
        </div>

        {/* Zones Table */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: `1px solid ${colors.border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>Flood Zones Details</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}`, background: colors.bgSecondary }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>Zone Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>Risk Level</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>Affected Population</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>Shelters</th>
                </tr>
              </thead>
              <tbody>
                {floodZones.map((zone) => {
                  const riskColors = {
                    critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
                    high: { bg: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
                    medium: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
                    stable: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
                  };
                  const riskColor = riskColors[zone.risk] || riskColors.stable;

                  return (
                    <tr key={zone.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px 16px', color: colors.textPrimary, fontWeight: '500', fontSize: '13px' }}>
                        {zone.name}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          background: riskColor.light,
                          color: riskColor.bg
                        }}>
                          {zone.risk}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: colors.textPrimary, fontWeight: '500', fontSize: '13px' }}>
                        {(zone.affectedPopulation || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: colors.textPrimary, fontWeight: '500', fontSize: '13px' }}>
                        {zone.shelters || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProvincialMap;
