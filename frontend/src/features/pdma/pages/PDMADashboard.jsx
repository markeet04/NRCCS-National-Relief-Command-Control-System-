import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatCard, AlertCard, ResourceCard, MapContainer } from '@shared/components/dashboard';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import {
  AlertTriangle,
  Radio,
  Home,
  Package,
  Users,
  Building,
  Plus,
  TrendingDown,
  TrendingUp,
  Zap,
  Activity,
  FileText,
  Shield
} from 'lucide-react';
import {
  getMenuItemsByRole,
  ROLE_CONFIG,
  STAT_GRADIENT_KEYS
} from '@shared/constants/dashboardConfig';
import '../styles/pdma.css';

/**
 * PDMADashboard Component
 * Provincial Dashboard for PDMA (Provincial Disaster Management Authority)
 * Displays province-level disaster coordination and resource management
 * Uses shared layout and configuration from dashboardConfig
 */
const PDMADashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const provinceName = 'Sindh'; // This would come from auth context

  // Theme support
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.pdma;

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  // Mock data - will be replaced with API calls (using shared gradient keys)
  const stats = [
    {
      title: 'PENDING SOS',
      value: '15',
      icon: Radio,
      trend: -12,
      trendLabel: 'vs yesterday',
      trendDirection: 'down',
      gradientKey: STAT_GRADIENT_KEYS.danger,
    },
    {
      title: 'ACTIVE SHELTERS',
      value: '8',
      icon: Home,
      trend: 2,
      trendLabel: 'newly opened',
      trendDirection: 'up',
      gradientKey: STAT_GRADIENT_KEYS.success,
    },
    {
      title: 'SHELTER CAPACITY',
      value: '850',
      icon: Users,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: STAT_GRADIENT_KEYS.info,
    },
    {
      title: 'RESCUE TEAMS ACTIVE',
      value: '1',
      icon: Users,
      trend: null,
      trendLabel: null,
      trendDirection: null,
      gradientKey: 'blue',
    },
    {
      title: 'LOCAL RESOURCES',
      value: '0',
      icon: Package,
      trend: -5,
      trendLabel: 'units available',
      trendDirection: 'down',
      gradientKey: STAT_GRADIENT_KEYS.warning,
    },
    {
      title: 'DAMAGE REPORTS',
      value: '34',
      icon: FileText,
      trend: 8,
      trendLabel: 'submitted today',
      trendDirection: 'up',
      gradientKey: STAT_GRADIENT_KEYS.default,
    },
  ];

  const alerts = [
    {
      id: 1,
      title: 'Flash Flood Warning - Karachi',
      description: 'Heavy rainfall expected in coastal areas. Monitor water levels closely.',
      severity: 'high',
      status: 'active',
      type: 'flood',
      location: 'Karachi',
      source: 'PDMA Sindh',
    },
    {
      id: 2,
      title: 'Evacuation Order - District Sukkur',
      description: 'Mandatory evacuation for low-lying areas. Proceed to designated shelters.',
      severity: 'critical',
      status: 'active',
      type: 'evacuation',
      location: 'Sukkur',
      source: 'District Sukkur',
    },
    {
      id: 3,
      title: 'Shelter Capacity Alert - Hyderabad',
      description: 'Shelter capacity reaching maximum. Additional facilities needed.',
      severity: 'medium',
      status: 'pending',
      type: 'shelter',
      location: 'Hyderabad',
      source: 'District Hyderabad',
    },
  ];

  const resources = [
    {
      id: 1,
      name: 'Food',
      icon: 'food',
      quantity: '3,200 units',
      location: 'Provincial Warehouse',
      province: provinceName,
      status: 'available',
    },
    {
      id: 2,
      name: 'Water',
      icon: 'water',
      quantity: '6,500 liters',
      location: 'District Karachi',
      province: provinceName,
      status: 'available',
    },
    {
      id: 3,
      name: 'Medical',
      icon: 'medical',
      quantity: '1,800 kits',
      location: 'District Sukkur',
      province: provinceName,
      status: 'allocated',
    },
    {
      id: 4,
      name: 'Shelter',
      icon: 'shelter',
      quantity: '450 tents',
      location: 'Provincial Storage',
      province: provinceName,
      status: 'available',
    },
    {
      id: 5,
      name: 'Clothing',
      icon: 'clothing',
      quantity: '2,100 units',
      location: 'Relief Center',
      province: provinceName,
      status: 'low',
    },
    {
      id: 6,
      name: 'Blanket',
      icon: 'blanket',
      quantity: '890 units',
      location: 'District Larkana',
      province: provinceName,
      status: 'critical',
    },
  ];

  const handleNavigate = (route) => {
    setActiveRoute(route);
    console.log('Navigate to:', route);
  };

  const handleResolveAlert = (alertId) => {
    console.log('Resolve alert:', alertId);
  };

  const handleAllocateResource = (resourceId) => {
    console.log('Allocate resource:', resourceId);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={`${roleConfig.userRole} ${provinceName}`}
      userName={roleConfig.userName}
      pageTitle={roleConfig.title}
      pageSubtitle={`${provinceName} ${roleConfig.subtitle}`}
      pageIcon={Shield}
      pageIconColor="#6366f1"
      notificationCount={8}
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Stats Section - 3 columns responsive */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: '20px', marginBottom: '24px' }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Grid: Alerts & District Status */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-5"
          style={{ gap: '20px', marginBottom: '24px' }}
        >
          {/* Provincial Alerts - Takes 3 columns */}
          <div 
            className="lg:col-span-3"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div className="pdma-section-title" style={{ margin: 0 }}>
                <div
                  className="pdma-section-title-icon"
                  style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <AlertTriangle size={18} color="#ef4444" />
                </div>
                <h2 className="pdma-section-title-text">Provincial Alerts</h2>
              </div>
              <button className="pdma-button pdma-button-primary pdma-button-small">
                <Plus size={14} />
                Create
              </button>
            </div>

            <div
              style={{
                padding: '20px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
                {alerts.map((alert) => {
                  const severityBorderColor = {
                    critical: '#ef4444',
                    high: '#f97316',
                    medium: '#f59e0b'
                  }[alert.severity] || '#f59e0b';

                  return (
                    <div
                      key={alert.id}
                      className="pdma-alert-item"
                      style={{
                        background: colors.cardBg,
                        borderColor: severityBorderColor,
                        borderLeftColor: severityBorderColor,
                        borderBottomColor: colors.border,
                        borderRightColor: colors.border,
                        borderTopColor: colors.border
                      }}
                    >
                      <div className="pdma-alert-item-header">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="pdma-alert-item-title" style={{ color: colors.textPrimary }}>
                            {alert.title}
                          </div>
                          <div className="pdma-alert-item-description" style={{ color: colors.textSecondary }}>
                            {alert.description}
                          </div>
                        </div>
                        <span className={`pdma-badge pdma-badge-${alert.severity}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div
                        className="pdma-alert-item-footer"
                        style={{
                          borderTopColor: colors.border,
                          color: colors.textMuted
                        }}
                      >
                        <span>📍 {alert.location}</span>
                        <span>{alert.source}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* District Status - Takes 2 columns */}
          <div
            className="lg:col-span-2"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              <div className="pdma-section-title" style={{ margin: 0 }}>
                <div
                  className="pdma-section-title-icon"
                  style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <Building size={18} color="#3b82f6" />
                </div>
                <h2 className="pdma-section-title-text">District Status</h2>
              </div>
            </div>

            <div
              style={{
                padding: '20px',
                flex: 1,
                overflowY: 'auto'
              }}
            >
              {[
                { name: 'Karachi', status: 'Critical', severity: '#ef4444', alerts: 5, sos: 12 },
                { name: 'Sukkur', status: 'High', severity: '#f97316', alerts: 3, sos: 8 },
                { name: 'Hyderabad', status: 'Medium', severity: '#f59e0b', alerts: 2, sos: 3 },
                { name: 'Larkana', status: 'Stable', severity: '#10b981', alerts: 0, sos: 0 }
              ].map((district, idx) => (
                <div
                  key={idx}
                  className="pdma-district-item"
                  style={{
                    borderBottomColor: colors.border,
                    color: colors.textSecondary
                  }}
                >
                  <div className="pdma-district-header">
                    <span className="pdma-district-name" style={{ color: colors.textPrimary }}>
                      {district.name}
                    </span>
                    <span
                      className="pdma-badge"
                      style={{
                        background: `${district.severity}20`,
                        color: district.severity
                      }}
                    >
                      {district.status}
                    </span>
                  </div>
                  <div className="pdma-district-stats">
                    <span>⚠️ {district.alerts}</span>
                    <span>📞 {district.sos}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flood Map Section */}
        <div className="pdma-section">
          <div className="pdma-section-title">
            <div
              className="pdma-section-title-icon"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              <Activity size={18} color="#10b981" />
            </div>
            <h2 className="pdma-section-title-text">Flood Risk Map</h2>
          </div>
          <div
            className="pdma-map-container"
            style={{
              background: colors.cardBg,
              borderColor: colors.border
            }}
          >
            <MapContainer
              title={`${provinceName} Flood Risk`}
              onExpand={() => console.log('Expand map')}
            />
          </div>
        </div>

        {/* Resources Section */}
        <div className="pdma-section">
          <div className="pdma-section-header">
            <div className="pdma-section-header-title">
              <div
                className="pdma-section-title-icon"
                style={{ background: 'rgba(34, 197, 94, 0.1)' }}
              >
                <Package size={18} color="#22c55e" />
              </div>
              <h2 className="pdma-section-title-text">Resources Inventory</h2>
            </div>
            <button className="pdma-button pdma-button-success pdma-button-small">
              <Plus size={14} />
              Add Resource
            </button>
          </div>

          <div className="pdma-resources-grid">
            {resources.map((resource) => {
              const statusColors = {
                available: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
                allocated: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
                low: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
                critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
              };
              const statusColor = statusColors[resource.status] || statusColors.available;

              return (
                <div
                  key={resource.id}
                  className="pdma-resource-card"
                  style={{
                    background: colors.cardBg,
                    borderColor: colors.border
                  }}
                >
                  <div className="pdma-resource-header">
                    <div className="pdma-resource-title-group">
                      <div
                        className="pdma-resource-icon"
                        style={{ background: statusColor.bg }}
                      >
                        <Package size={16} color={statusColor.text} />
                      </div>
                      <h3 className="pdma-resource-name" style={{ color: colors.textPrimary }}>
                        {resource.name}
                      </h3>
                    </div>
                    <span className="pdma-badge" style={{ background: statusColor.bg, color: statusColor.text }}>
                      {resource.status}
                    </span>
                  </div>

                  <div
                    className="pdma-resource-info"
                    style={{
                      borderTopColor: colors.border,
                      borderBottomColor: colors.border,
                      color: colors.textSecondary
                    }}
                  >
                    <div className="pdma-resource-info-row">
                      <span className="pdma-resource-label">Quantity:</span>
                      <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                        {resource.quantity}
                      </span>
                    </div>
                    <div className="pdma-resource-info-row">
                      <span className="pdma-resource-label">Location:</span>
                      <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                        {resource.location}
                      </span>
                    </div>
                  </div>

                  <button
                    className="pdma-button pdma-button-outline pdma-button-small"
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      color: '#3b82f6',
                      borderColor: 'rgba(59, 130, 246, 0.3)'
                    }}
                    onClick={() => handleAllocateResource(resource.id)}
                  >
                    Allocate
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PDMADashboard;
