import { useMemo, useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatCard } from '@shared/components/dashboard';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { AlertTriangle, Truck, Users, Package, MapPin } from 'lucide-react';
import { useBadge } from '@shared/contexts/BadgeContext';
import { 
  getMenuItemsByRole, 
  ROLE_CONFIG, 
  STAT_GRADIENT_KEYS,
  DEFAULT_WEATHER_DATA,
  getCardStyle 
} from '@shared/constants/dashboardConfig';

/**
 * NDMADashboard Component
 * National Dashboard for NDMA (National Disaster Management Authority)
 * Uses shared layout and configuration from dashboardConfig
 */
const NDMADashboard = () => {
  const { activeStatusCount } = useBadge();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.ndma;
  
  // Get menu items from shared config with dynamic badge
  const menuItems = useMemo(() => 
    getMenuItemsByRole('ndma', activeStatusCount), 
    [activeStatusCount]
  );

  const handleNavigate = (route) => {
    setActiveRoute(route);
    console.log('Navigate to:', route);
  };

  // Stats data - using shared gradient keys with StatCard format
  const stats = [
    { title: 'Active Emergencies', value: 3, trend: -12, trendLabel: 'vs yesterday', trendDirection: 'down', icon: AlertTriangle, gradientKey: STAT_GRADIENT_KEYS.emergencies },
    { title: 'Teams Deployed', value: 2, trend: 8, trendLabel: 'vs yesterday', trendDirection: 'up', icon: Truck, gradientKey: STAT_GRADIENT_KEYS.teams },
    { title: 'People Evacuated', value: '15,432', trend: 15, trendLabel: 'vs yesterday', trendDirection: 'up', icon: Users, gradientKey: STAT_GRADIENT_KEYS.success },
    { title: 'Resources Available', value: '182,000', trend: 0, trendLabel: 'units', trendDirection: null, icon: Package, gradientKey: STAT_GRADIENT_KEYS.resources }
  ];

  // Weather data - using shared default
  const weatherData = DEFAULT_WEATHER_DATA;

  // Resource status
  const resources = [
    { name: 'Food Packets', percentage: 68, color: '#10b981' },
    { name: 'Tents', percentage: 45, color: '#f59e0b' },
    { name: 'Medical Kits', percentage: 82, color: '#10b981' }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      notificationCount={5}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>
          National Overview - NDMA
        </h1>
        <p style={{ fontSize: '14px', color: colors.textMuted }}>
          Real-time national disaster management dashboard
        </p>
      </div>

      {/* Critical Alert Banner */}
      <div 
        style={{ 
          backgroundColor: isLight ? '#fef2f2' : colors.criticalHover, 
          border: `1px solid ${isLight ? '#fecaca' : colors.critical}`, 
          borderLeft: `4px solid ${colors.critical}`,
          borderRadius: '8px', 
          padding: '16px 20px', 
          marginBottom: '24px' 
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <div style={{ color: isLight ? colors.danger : colors.criticalText, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
              Flash Flood Warning
            </div>
            <div style={{ color: isLight ? colors.criticalHover : colors.criticalText, fontSize: '13px', lineHeight: '1.5' }}>
              Heavy rainfall expected in next 24 hours. Evacuate low-lying areas immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns */}
        <div className="lg:col-span-2" style={{ marginTop: '24px' }}>
          <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, borderLeft: !isLight ? '4px solid #3b82f6' : `1px solid ${colors.cardBorder}`, padding: '24px' }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Pakistan - Live Situation Map
            </h3>
  
            {/* Map Placeholder */}
            <div style={{ 
              background: colors.background, 
              borderRadius: '8px', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              border: `1px solid ${colors.cardBorder}`
            }}>
              <MapPin className="w-16 h-16 mb-4" style={{ color: colors.primary }} />
              <h4 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Interactive Pakistan Map
              </h4>
              <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
                SOS Locations + Flood Zones + Shelters + Rescue Teams
              </p>
    
              {/* Map Legend */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.critical }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Critical SOS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.low }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Flood Zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.success }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Shelters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          {/* 24h Weather */}
          <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, borderLeft: !isLight ? '4px solid #06b6d4' : `1px solid ${colors.cardBorder}`, padding: '20px', marginTop: '24px' }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              24h Weather
            </h3>
            <div className="flex flex-col gap-3">
              {weatherData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span style={{ color: colors.textMuted, fontSize: '14px' }}>{item.label}</span>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Status */}
          <div className="transition-all duration-300" style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, borderLeft: !isLight ? '4px solid #10b981' : `1px solid ${colors.cardBorder}`, padding: '20px', boxShadow: isLight ? colors.cardShadow : 'none' }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Resource Status
            </h3>
            <div className="flex flex-col gap-4">
              {resources.map((resource, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500' }}>
                      {resource.name}
                    </span>
                    <span style={{ color: resource.color, fontSize: '13px', fontWeight: '600' }}>
                      {resource.percentage}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: isLight ? '#e2e8f0' : colors.elevatedBg, borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${resource.percentage}%`, 
                        height: '100%', 
                        backgroundColor: resource.color,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NDMADashboard;
