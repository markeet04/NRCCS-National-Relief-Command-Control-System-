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
import { Users, CheckCircle, Clock } from 'lucide-react';

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
        return { bg: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.2)', text: '#22c55e' };
      case 'standby':
        return { bg: isLight ? '#fef3c7' : 'rgba(251, 191, 36, 0.2)', text: '#f59e0b' };
      case 'unavailable':
        return { bg: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
      default:
        return { bg: isLight ? '#f3f4f6' : 'rgba(107, 114, 128, 0.2)', text: '#6b7280' };
    }
  };

  // Card wrapper style helper
  const cardStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: isLight ? colors.cardShadow : 'none',
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
      {/* Stats Grid - 3 columns, 2 rows */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: '20px', marginBottom: '24px' }}
      >
        {displayStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Map and Sidebar Section */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-4"
        style={{ gap: '20px', marginBottom: '24px' }}
      >
        {/* Live District Map - Takes 3 columns */}
        <div className="lg:col-span-3">
          <LiveMapCard title={`${districtInfo.name} District Live Map`} />
        </div>

        {/* Right Sidebar - Takes 1 column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Weather Summary Card - using new component */}
          <WeatherCard weather={weather} />

          {/* Today's Alerts Card - using new component */}
          <AlertsList alerts={alerts} title="Today's Alerts" />
        </div>
      </div>

      {/* Recent SOS Requests Table - using new component */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <h2 
            className="font-semibold"
            style={{ color: colors.textPrimary, fontSize: '18px' }}
          >
            Recent SOS Requests
          </h2>
          <button
            onClick={() => handleNavigate('sos')}
            className="font-medium transition-colors"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            View All
          </button>
        </div>
        <SOSTable 
          requests={recentSOS.slice(0, 5)} 
          compact 
          showActions={false}
        />
      </div>

      {/* Rescue Teams Section */}
      <div style={{ ...cardStyle, marginTop: '24px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <h2 
            className="font-semibold"
            style={{ color: colors.textPrimary, fontSize: '16px' }}
          >
            Rescue Teams Status
          </h2>
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.2)', 
                color: '#22c55e' 
              }}
            >
              {teamCounts?.available || 0} Available
            </span>
            <button
              onClick={() => handleNavigate('rescue')}
              className="text-sm font-medium"
              style={{ color: '#3b82f6', cursor: 'pointer', background: 'transparent', border: 'none' }}
            >
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.slice(0, 4).map((team) => {
            const statusStyle = getTeamStatusStyle(team.status);
            return (
              <div 
                key={team.id}
                className="rounded-lg p-4"
                style={{ 
                  background: isLight ? '#f8fafc' : 'rgba(0, 0, 0, 0.2)',
                  border: `1px solid ${colors.cardBorder}`
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {team.name}
                  </span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    style={{ 
                      backgroundColor: statusStyle.bg, 
                      color: statusStyle.text 
                    }}
                  >
                    {team.status === 'active' || team.status === 'on_mission' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {team.status.replace('_', ' ')}
                  </span>
                </div>
                <p 
                  className="text-xs"
                  style={{ color: colors.textMuted }}
                >
                  Location: {team.location}
                </p>
                <p 
                  className="text-xs flex items-center gap-1"
                  style={{ color: colors.textMuted }}
                >
                  <Users className="w-3 h-3" />
                  {team.members} members
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistrictDashboard;
 