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
  Plus
} from 'lucide-react';
import { 
  getMenuItemsByRole, 
  ROLE_CONFIG, 
  STAT_GRADIENT_KEYS 
} from '@shared/constants/dashboardConfig';

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
      title: 'Provincial Alerts',
      value: '5',
      icon: AlertTriangle,
      trend: -10,
      trendLabel: 'vs last week',
      color: 'danger',
      gradientKey: STAT_GRADIENT_KEYS.alerts,
    },
    {
      title: 'SOS Requests',
      value: '18',
      icon: Radio,
      trend: -5,
      trendLabel: 'vs yesterday',
      color: 'warning',
      gradientKey: STAT_GRADIENT_KEYS.sos,
    },
    {
      title: 'Active Shelters',
      value: '12',
      icon: Home,
      trend: 8,
      trendLabel: 'in province',
      color: 'success',
      gradientKey: STAT_GRADIENT_KEYS.shelters,
    },
    {
      title: 'Resources Available',
      value: '6.0K',
      icon: Package,
      trend: 0,
      trendLabel: 'units',
      color: 'info',
      gradientKey: STAT_GRADIENT_KEYS.resources,
    },
    {
      title: 'Rescue Teams',
      value: '15',
      icon: Users,
      trend: 3,
      trendLabel: 'active',
      color: 'success',
      gradientKey: STAT_GRADIENT_KEYS.teams,
    },
    {
      title: 'Affected Population',
      value: '45K',
      icon: Users,
      trend: 2,
      trendLabel: 'estimated',
      color: 'default',
      gradientKey: STAT_GRADIENT_KEYS.population,
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
      notificationCount={8}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alert Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Provincial Alerts</h2>
            <button 
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
              style={{ 
                background: isLight ? colors.btnSuccessBg : '#059669',
                boxShadow: isLight ? colors.btnSuccessShadow : 'none'
              }}
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                {...alert}
                onResolve={() => handleResolveAlert(alert.id)}
                onView={() => console.log('View alert', alert.id)}
              />
            ))}
          </div>
        </div>

        {/* District Overview */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>District Status</h2>
          <div 
            className="rounded-xl p-6 transition-all duration-300"
            style={{ 
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: isLight ? colors.cardShadow : 'none'
            }}
          >
            <div className="space-y-4">
              <div style={{ paddingBottom: '12px', borderBottom: `1px solid ${colors.cardBorder}` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Karachi</span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ ...colors.getStatusBadge('#ef4444') }}
                  >
                    Critical
                  </span>
                </div>
                <p className="text-xs" style={{ color: colors.textMuted }}>5 active alerts, 12 SOS</p>
              </div>
              <div style={{ paddingBottom: '12px', borderBottom: `1px solid ${colors.cardBorder}` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Sukkur</span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ ...colors.getStatusBadge('#f97316') }}
                  >
                    High
                  </span>
                </div>
                <p className="text-xs" style={{ color: colors.textMuted }}>3 active alerts, 8 SOS</p>
              </div>
              <div style={{ paddingBottom: '12px', borderBottom: `1px solid ${colors.cardBorder}` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Hyderabad</span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ ...colors.getStatusBadge('#f59e0b') }}
                  >
                    Medium
                  </span>
                </div>
                <p className="text-xs" style={{ color: colors.textMuted }}>2 active alerts, 3 SOS</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Larkana</span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ ...colors.getStatusBadge('#10b981') }}
                  >
                    Stable
                  </span>
                </div>
                <p className="text-xs" style={{ color: colors.textMuted }}>0 active alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provincial Flood Heatmap */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <MapContainer
          title={`${provinceName} Province Flood Risk Heatmap`}
          onExpand={() => console.log('Expand map')}
        />
      </div>

      {/* Resource Inventory */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Provincial Resource Inventory</h2>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
            style={{ 
              background: isLight ? colors.btnSuccessBg : '#059669',
              boxShadow: isLight ? colors.btnSuccessShadow : 'none'
            }}
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              {...resource}
              onAllocate={() => handleAllocateResource(resource.id)}
              onViewDetails={() => console.log('View resource', resource.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PDMADashboard;
