import { useState, useMemo, useRef, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { Map, Zap, AlertTriangle, Filter, Download, Maximize2, Users, Home, Droplet } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/pdma.css';

const ProvincialMap = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [activeRoute, setActiveRoute] = useState('map');
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [mapZoom, setMapZoom] = useState(6);

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  const floodZones = [
    { id: 1, name: 'Karachi Coastal', risk: 'critical', lat: 24.8607, lon: 67.0011, affectedPopulation: 2500, shelters: 8 },
    { id: 2, name: 'Sukkur Valley', risk: 'high', lat: 27.7162, lon: 68.8711, affectedPopulation: 1800, shelters: 5 },
    { id: 3, name: 'Hyderabad Suburbs', risk: 'medium', lat: 25.3548, lon: 68.3336, affectedPopulation: 950, shelters: 3 },
    { id: 4, name: 'Larkana Region', risk: 'stable', lat: 27.5614, lon: 68.2114, affectedPopulation: 0, shelters: 1 },
    { id: 5, name: 'Mirpur Khas', risk: 'medium', lat: 25.5222, lon: 69.0115, affectedPopulation: 650, shelters: 2 }
  ];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Pakistan
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([29.9124, 68.7738], mapZoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(mapInstanceRef.current);
    }

    // Update zoom
    mapInstanceRef.current.setZoom(mapZoom);

    return () => {
      // Cleanup is handled by Leaflet
    };
  }, [mapZoom]);

  // Add flood zone markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    const getRiskColor = (risk) => {
      const colorMap = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#f59e0b',
        stable: '#10b981'
      };
      return colorMap[risk] || colorMap.stable;
    };

    // Add markers for filtered zones
    filteredZones.forEach((zone) => {
      const color = getRiskColor(zone.risk);
      
      const html = `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 4px 12px ${color}66;
        ">
          ${zone.id}
        </div>
      `;

      const marker = L.marker([zone.lat, zone.lon], {
        icon: L.divIcon({
          html: html,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      });

      marker.bindPopup(`
        <div style="font-size: 12px;">
          <strong>${zone.name}</strong><br/>
          Risk: <span style="color: ${color}">${zone.risk}</span><br/>
          Affected: ${zone.affectedPopulation.toLocaleString()}<br/>
          Shelters: ${zone.shelters}
        </div>
      `);

      marker.addTo(mapInstanceRef.current);
    });
  }, [selectedLayer]);

  const getRiskColor = (risk) => {
    const colors = {
      critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
      high: { bg: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
      medium: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
      stable: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
    };
    return colors[risk] || colors.stable;
  };

  const filteredZones = selectedLayer === 'all'
    ? floodZones
    : floodZones.filter(zone => zone.risk === selectedLayer);

  const totalAffected = floodZones.reduce((sum, zone) => sum + zone.affectedPopulation, 0);
  const criticalZones = floodZones.filter(zone => zone.risk === 'critical').length;

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
        {/* Quick Stats */}
        <div className="pdma-stats-grid" style={{ marginBottom: '28px' }}>
            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '16px',
                borderLeft: '4px solid #ef4444'
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Critical Zones</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '6px' }}>{criticalZones}</p>
              <p style={{ fontSize: '11px', color: colors.textMuted }}>Immediate Alert</p>
            </div>

            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '16px',
                borderLeft: '4px solid #f97316'
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Affected Population</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f97316', marginBottom: '6px' }}>
                {(totalAffected / 1000).toFixed(1)}K
              </p>
              <p style={{ fontSize: '11px', color: colors.textMuted }}>Estimated</p>
            </div>

            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '16px',
                borderLeft: '4px solid #f59e0b'
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Active Alerts</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>
                {floodZones.filter(z => z.risk === 'critical' || z.risk === 'high').length}
              </p>
              <p style={{ fontSize: '11px', color: colors.textMuted }}>High Risk</p>
            </div>

            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '16px',
                borderLeft: '4px solid #10b981'
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Monitoring Zones</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>{floodZones.length}</p>
              <p style={{ fontSize: '11px', color: colors.textMuted }}>Tracked</p>
            </div>
          </div>

        {/* Main Map & Control Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          {/* Map Container */}
          <div style={{ gridColumn: 'span 1', minWidth: 0 }}>
            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '16px',
                overflow: 'hidden'
              }}
            >
              {/* Map Visualization */}
              <div
                ref={mapRef}
                style={{
                  width: '100%',
                  height: '500px',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              />

              {/* Zoom Controls */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  zIndex: 20
                }}
              >
                <button
                  onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  −
                </button>
              </div>
            </div>
          </div>

          {/* Control Panel - 3 Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Filter Controls */}
            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Filter size={16} style={{ color: colors.textPrimary }} />
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>Filter</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['all', 'critical', 'high', 'medium', 'stable'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedLayer(filter)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                      background:
                        selectedLayer === filter
                          ? filter === 'all'
                            ? '#667eea'
                            : getRiskColor(filter).bg
                          : colors.cardBg,
                      color: selectedLayer === filter ? '#fff' : colors.textPrimary,
                      borderWidth: selectedLayer === filter ? '0px' : '1px',
                      borderStyle: 'solid',
                      borderColor: colors.border
                    }}
                  >
                    {filter === 'all' ? 'All Zones' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Controls */}
            <div
              className="pdma-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                padding: '20px'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary, marginBottom: '16px' }}>
                Controls
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Maximize2 size={14} />
                  Expand
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>

          {/* Map Statistics */}

          </div>
        </div>
            

        {/* Zones Details Table */}
        <div
          className="pdma-card"
          style={{
            background: colors.cardBg,
            borderColor: colors.border,
            padding: '0',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary }}>Flood Zones</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>
                    Zone Name
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>
                    Risk Level
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>
                    Affected Population
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: colors.textSecondary, fontSize: '11px', fontWeight: '700' }}>
                    Active Shelters
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.map((zone, idx) => {
                  const riskColor = getRiskColor(zone.risk);
                  return (
                    <tr
                      key={zone.id}
                      style={{
                        borderBottom: idx !== filteredZones.length - 1 ? `1px solid ${colors.border}` : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: colors.textPrimary, fontWeight: '500', fontSize: '13px' }}>
                        {zone.name}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            background: riskColor.light,
                            color: riskColor.bg
                          }}
                        >
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

        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default ProvincialMap;
