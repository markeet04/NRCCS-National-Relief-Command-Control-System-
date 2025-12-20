import { useMemo, useRef, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import DemoModal from '@shared/components/DemoModal/DemoModal';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { Map, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  LayerControls
} from '../components';
import {
  FLOOD_ZONE_COLORS,
  MAP_CENTER,
  DEFAULT_MAP_ZOOM
} from '../constants';
import { useProvincialMapState } from '../hooks';
import '../styles/pdma.css';


const ProvincialMap = () => {
  // Use custom hook for map state management
  const {
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
    handleExpandMap,
    handleResetZoom,
    handleExportMap,
    mapData,
    loading,
    error,
  } = useProvincialMapState();

  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Use backend data instead of hardcoded FLOOD_ZONES
  const floodZones = mapData.zones || [];
  const layers = [
    { id: 'all', name: 'All Zones', visible: selectedLayer === 'all' },
    { id: 'critical', name: 'Critical', visible: selectedLayer === 'critical' },
    { id: 'high', name: 'High Risk', visible: selectedLayer === 'high' },
    { id: 'medium', name: 'Medium', visible: selectedLayer === 'medium' },
    { id: 'stable', name: 'Stable', visible: selectedLayer === 'stable' }
  ];

  const filteredZones = selectedLayer === 'all'
    ? floodZones
    : floodZones.filter(zone => zone.risk === selectedLayer);

  const totalAffected = floodZones.reduce((sum, zone) => sum + (zone.affectedPopulation || 0), 0);
  const criticalZones = floodZones.filter(zone => zone.risk === 'critical').length;

  const mapMarkers = filteredZones.map(zone => ({
    lat: zone.lat,
    lng: zone.lon,
    title: zone.name,
    description: `Risk: ${zone.risk} | Affected: ${zone.affectedPopulation?.toLocaleString() || 0}`
  }));

  // Render loading state
  if (loading) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        pageTitle="Flood Risk Map - Pakistan"
        pageSubtitle="Real-time flood risk monitoring and visualization"
        pageIcon={Map}
        pageIconColor="#3b82f6"
        userRole="PDMA"
        userName="fz"
      >
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
        </div>
      </DashboardLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        pageTitle="Flood Risk Map - Pakistan"
        pageSubtitle="Real-time flood risk monitoring and visualization"
        pageIcon={Map}
        pageIconColor="#3b82f6"
        userRole="PDMA"
        userName="fz"
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
      pageTitle="Flood Risk Map - Pakistan"
      pageSubtitle="Real-time flood risk monitoring and visualization"
      pageIcon={Map}
      pageIconColor="#10b981"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Map and Layer Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', marginBottom: '24px' }}>
          {/* Map Component */}
          <div style={{
            background: colors.cardBg,
            borderColor: colors.border,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <MapContainer 
              markers={mapMarkers}
              zoom={mapZoom}
              center={MAP_CENTER}
            />
          </div>

          {/* Layer Controls Component */}
          <LayerControls 
            layers={layers}
            onToggleLayer={(layerId) => setSelectedLayer(layerId === selectedLayer ? 'all' : layerId)}
            colors={colors}
          />
        </div>

        {/* Zones Table */}
        <div
          style={{
            background: colors.cardBg,
            borderColor: colors.border,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
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
                {filteredZones.map((zone, idx) => {
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
                        {zone.affectedPopulation.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: colors.textPrimary, fontWeight: '500', fontSize: '13px' }}>
                        {zone.shelters}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Modal */}
        <DemoModal
          isOpen={demoModal.isOpen}
          onClose={() => setDemoModal({ ...demoModal, isOpen: false })}
          title={demoModal.title}
          message={demoModal.message}
          type={demoModal.type}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProvincialMap;
