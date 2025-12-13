import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Shared Layout & Theme
import { DashboardLayout } from '../../../shared/components/layout';
import { useSettings } from '../../../app/providers/ThemeProvider';
import { getThemeColors } from '../../../shared/utils/themeColors';

// District-specific imports - hooks, constants, components
import { useDistrictData, useRescueTeams } from '../hooks';
import { DISTRICT_MENU_ITEMS, DEFAULT_DISTRICT_INFO, STAT_GRADIENT_KEYS } from '../constants';
import { StatCard, WeatherCard, AlertsList, LiveMapCard, SOSTable } from '../components';

// Icons
import { Users, CheckCircle, Clock, MapPin, AlertTriangle, Radio, Home, Package } from 'lucide-react';

/**
 * DistrictDashboard Component
 * District/Regional Dashboard for ground-level operations
 * Uses modular components, hooks, and services for easy backend integration
 */
const DistrictDashboard = () => {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  
  // Theme support
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Use dynamic theme colors for all styling

  // District info - would come from auth context in production
  const districtInfo = DEFAULT_DISTRICT_INFO;

  // Use custom hooks for data management (ready for backend integration)
  const { 
    stats, 
    recentSOS, 
    alerts, 
    weather, 
    loading: dashboardLoading 
  } = useDistrictData(districtInfo.name);

  const { 
    teams, 
    teamCounts 
  } = useRescueTeams(districtInfo.name);

  // Transform stats for display with proper gradient keys
  const displayStats = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        title: 'PENDING SOS',
        value: String(stats.pendingSOS || 15),
        icon: 'radio',
        trend: stats.sosTrend || 12,
        trendLabel: 'vs yesterday',
        trendDirection: 'down',
        gradientKey: STAT_GRADIENT_KEYS.danger,
      },
      {
        title: 'ACTIVE SHELTERS',
        value: String(stats.activeShelters || 8),
        icon: 'home',
        trend: stats.shelterTrend || 2,
        trendLabel: 'newly opened',
        trendDirection: 'up',
        gradientKey: STAT_GRADIENT_KEYS.success,
      },
      {
        title: 'SHELTER CAPACITY',
        value: String(stats.shelterCapacity || 850),
        icon: 'users',
        trend: null,
        trendLabel: null,
        trendDirection: null,
        gradientKey: STAT_GRADIENT_KEYS.info,
      },
      {
        title: 'RESCUE TEAMS ACTIVE',
        value: String(stats.activeTeams || teamCounts?.busy || 12),
        icon: 'users',
        trend: null,
        trendLabel: null,
        trendDirection: null,
        gradientKey: 'blue',
      },
      {
        title: 'LOCAL RESOURCES',
        value: String(stats.localResources || 0),
        icon: 'package',
        trend: stats.resourceTrend || 5,
        trendLabel: 'units available',
        trendDirection: 'down',
        gradientKey: STAT_GRADIENT_KEYS.warning,
      },
      {
        title: 'DAMAGE REPORTS',
        value: String(stats.damageReports || 34),
        icon: 'file',
        trend: stats.reportsTrend || 8,
        trendLabel: 'submitted today',
        trendDirection: 'up',
        gradientKey: STAT_GRADIENT_KEYS.default,
      },
    ];
  }, [stats, teamCounts]);

  // Navigation handler
  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  // Get team status color helper
  const getTeamStatusStyle = (status) => {
    switch (status) {
      case 'active':
      case 'on_mission':
        return { bg: colors.successGlow, text: colors.success };
      case 'standby':
        return { bg: colors.warningLight, text: colors.warning };
      case 'unavailable':
        return { bg: colors.criticalBg, text: colors.critical };
      default:
        return { bg: colors.textMuted + '22', text: colors.textMuted };
    }
  };

  // NDMA-style card wrapper style helper
  const cardStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder || colors.border}`,
    borderLeft: !isLight ? '4px solid #374151' : `1px solid ${colors.cardBorder || colors.border}`,
    borderRadius: '12px',
    padding: '20px',
  };

  const statCardStyle = {
    background: colors.cardBgHover,
    border: `1px solid ${colors.cardBorder || colors.border}`,
    borderLeft: !isLight ? '4px solid #6b7280' : `1px solid ${colors.cardBorder || colors.border}`,
    borderRadius: '12px',
    padding: '20px',
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={`District ${districtInfo.name}`}
      userName="District Officer"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle={`${districtInfo.name} District - ${districtInfo.province} Province tactical operations`}
      notificationCount={stats?.pendingSOS || 15}
    >
      {/* Page Header - NDMA Style */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>
          District Overview - {districtInfo.name}
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary }}>
          Real-time district disaster management dashboard
        </p>
      </div>

      {/* Critical Alert Banner - NDMA Style */}
      <div 
        style={{ 
          backgroundColor: colors.criticalBg, 
          border: `1px solid ${colors.critical}55`, 
          borderLeft: `4px solid ${colors.critical}`,
          borderRadius: '8px', 
          padding: '16px 20px', 
          marginBottom: '24px' 
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.critical }} />
          <div>
            <div style={{ color: colors.criticalText, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
              Flash Flood Warning
            </div>
            <div style={{ color: colors.criticalText, fontSize: '13px', lineHeight: '1.5' }}>
              Heavy rainfall expected in next 24 hours. Evacuate low-lying areas immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - NDMA Style (4 columns) */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        style={{ gap: '16px', marginBottom: '24px' }}
      >
        {displayStats.slice(0, 4).map((stat, index) => (
          <div key={index} style={statCardStyle}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.title}
              </span>
              <div style={{ 
                background: colors.primaryLight, 
                borderRadius: '8px', 
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon === 'radio' && <Radio style={{ color: colors.primary, width: '18px', height: '18px' }} />}
                {stat.icon === 'home' && <Home style={{ color: colors.primary, width: '18px', height: '18px' }} />}
                {stat.icon === 'users' && <Users style={{ color: colors.primary, width: '18px', height: '18px' }} />}
                {stat.icon === 'package' && <Package style={{ color: colors.primary, width: '18px', height: '18px' }} />}
              </div>
            </div>
            <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
              {stat.value}
            </p>
            {stat.trend !== null && (
              <span style={{ 
                color: stat.trendDirection === 'up' ? colors.success : stat.trendDirection === 'down' ? colors.critical : colors.textMuted,
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {stat.trendDirection === 'up' ? '↑' : stat.trendDirection === 'down' ? '↓' : ''}
                {' '}{Math.abs(stat.trend)}% {stat.trendLabel}
              </span>
            )}
            {stat.trend === null && stat.trendLabel && (
              <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                {stat.trendLabel}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Map and Sidebar Section */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-3"
        style={{ gap: '20px', marginBottom: '24px' }}
      >
        {/* Live District Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div style={{ ...cardStyle, padding: '24px', borderLeft: !isLight ? '4px solid #3b82f6' : cardStyle.borderLeft }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              {districtInfo.name} District - Live Situation Map
            </h3>
            <div style={{ 
              background: colors.cardBgHover, 
              borderRadius: '8px', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              border: `1px solid ${colors.cardBorder || colors.border}`
            }}>
              <MapPin className="w-16 h-16 mb-4" style={{ color: colors.primary }} />
              <h4 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Interactive District Map
              </h4>
              <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center' }}>
                Click to view detailed regions
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Takes 1 column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 24h Weather - NDMA Style */}
          <div style={{ ...cardStyle, borderLeft: !isLight ? '4px solid #06b6d4' : cardStyle.borderLeft }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              24h Weather
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span style={{ color: colors.textMuted, fontSize: '14px' }}>Rainfall</span>
                <span style={{ color: colors.critical, fontSize: '14px', fontWeight: '600' }}>{weather?.rainfall || 'Heavy'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.textMuted, fontSize: '14px' }}>Wind Speed</span>
                <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{weather?.windSpeed || '45 km/h'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.textMuted, fontSize: '14px' }}>Temperature</span>
                <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{weather?.temperature || '28°C'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.textMuted, fontSize: '14px' }}>Humidity</span>
                <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{weather?.humidity || '85%'}</span>
              </div>
            </div>
          </div>

          {/* Today's Alerts Card - NDMA Style */}
          <div style={{ ...cardStyle, borderLeft: !isLight ? '4px solid #ef4444' : cardStyle.borderLeft }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Today's Alerts
            </h3>
            <div className="flex flex-col gap-3">
              {alerts?.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: alert.severity === 'critical' ? colors.critical : colors.warning,
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div>
                    <p style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: '500' }}>
                      {alert.title || alert.message}
                    </p>
                    <p style={{ color: colors.textMuted, fontSize: '12px' }}>
                      {alert.time || '2 hours ago'}
                    </p>
                  </div>
                </div>
              )) || (
                <p style={{ color: colors.textMuted, fontSize: '13px' }}>No alerts today</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ...existing code... */}
    </DashboardLayout>
  );
};

export default DistrictDashboard;
 