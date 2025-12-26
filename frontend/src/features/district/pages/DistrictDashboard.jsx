import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Shared Layout
import { DashboardLayout } from '../../../shared/components/layout';
import '@styles/css/main.css';

// District-specific imports - hooks, constants, components
import { useDistrictData, useRescueTeams } from '../hooks';
import { DISTRICT_MENU_ITEMS, STAT_GRADIENT_KEYS } from '../constants';
import { StatCard, WeatherCard, AlertsList, LiveMapCard, SOSTable, DistrictMap } from '../components';

// Icons
import { Users, CheckCircle, Clock, AlertTriangle, Radio, Home, Package } from 'lucide-react';

/**
 * DistrictDashboard Component
 * District/Regional Dashboard for ground-level operations
 * Uses modular components, hooks, and services for easy backend integration
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */
const DistrictDashboard = () => {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState('dashboard');

  // Use custom hooks for data management - fetches real data from API
  const {
    stats,
    rawStats,
    districtInfo,
    recentSOS,
    alerts,
    weather,
    loading: dashboardLoading
  } = useDistrictData();

  const {
    teams,
    teamCounts
  } = useRescueTeams();

  // Transform stats for display with proper gradient keys
  const displayStats = useMemo(() => {
    if (!stats && !rawStats) return [];

    const s = rawStats || stats || {};

    return [
      {
        title: 'PENDING SOS',
        value: String(s.pendingSOS || 0),
        icon: 'radio',
        trend: s.sosTrend || null,
        trendLabel: s.sosTrend ? 'vs yesterday' : null,
        trendDirection: s.sosTrend ? 'down' : null,
        gradientKey: STAT_GRADIENT_KEYS.danger,
      },
      {
        title: 'ACTIVE SHELTERS',
        value: String(s.activeShelters || 0),
        icon: 'home',
        trend: s.shelterTrend || null,
        trendLabel: s.shelterTrend ? 'newly opened' : null,
        trendDirection: s.shelterTrend ? 'up' : null,
        gradientKey: STAT_GRADIENT_KEYS.success,
      },
      {
        title: 'SHELTER CAPACITY',
        value: String(s.shelterCapacity || 0),
        icon: 'users',
        trend: null,
        trendLabel: s.shelterOccupancy ? `${s.shelterOccupancy} occupancy` : null,
        trendDirection: null,
        gradientKey: STAT_GRADIENT_KEYS.info,
      },
      {
        title: 'RESCUE TEAMS ACTIVE',
        value: String(s.activeTeams || teamCounts?.busy || 0),
        icon: 'users',
        trend: null,
        trendLabel: s.availableTeams ? `${s.availableTeams} available` : null,
        trendDirection: null,
        gradientKey: 'blue',
      },
      {
        title: 'LOCAL RESOURCES',
        value: String(s.localResources || 0),
        icon: 'package',
        trend: null,
        trendLabel: null,
        trendDirection: null,
        gradientKey: STAT_GRADIENT_KEYS.warning,
      },
      {
        title: 'DAMAGE REPORTS',
        value: String(s.damageReports || 0),
        icon: 'file',
        trend: s.pendingDamageReports || null,
        trendLabel: s.pendingDamageReports ? `${s.pendingDamageReports} pending` : null,
        trendDirection: s.pendingDamageReports ? 'up' : null,
        gradientKey: STAT_GRADIENT_KEYS.default,
      },
    ];
  }, [stats, rawStats, teamCounts]);

  // Navigation handler
  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  return (
    <DashboardLayout
      menuItems={DISTRICT_MENU_ITEMS}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={`District ${districtInfo?.name || 'Loading...'}`}
      userName="District Officer"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle={districtInfo ? `${districtInfo.name} District - ${districtInfo.province?.name || districtInfo.province || ''} Province tactical operations` : 'Loading district...'}
      notificationCount={rawStats?.pendingSOS || 0}
    >
      {/* Loading State */}
      {dashboardLoading && (
        <div className="text-center p-10 text-muted">
          Loading dashboard data...
        </div>
      )}

      {!dashboardLoading && (
        <>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="page-title">
              District Overview - {districtInfo?.name || 'Loading...'}
            </h1>
            <p className="page-subtitle">
              Real-time district disaster management dashboard
            </p>
          </div>

          {/* Critical Alert Banner - Only show if there are critical alerts */}
          {alerts?.some(a => a.severity === 'critical') && (
            <div className="alert alert--danger mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">
                    {alerts.find(a => a.severity === 'critical')?.type || 'Critical Alert'}
                  </div>
                  <div className="text-sm">
                    {alerts.find(a => a.severity === 'critical')?.description || 'Check alerts for details'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid - Using StatCard component for consistent styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {displayStats.slice(0, 4).map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                trendLabel={stat.trendLabel}
                trendDirection={stat.trendDirection}
                gradientKey={stat.gradientKey}
              />
            ))}
          </div>

          {/* Map and Sidebar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Live District Map - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="card card-body">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  {districtInfo?.name || 'District'} - Live Situation Map
                </h3>
                {/* ArcGIS District Map with Weather Layers */}
                <DistrictMap
                  districtName={districtInfo?.name}
                  height="450px"
                />
              </div>
            </div>

            {/* Right Sidebar - Takes 1 column */}
            <div className="flex flex-col gap-5">

              {/* Today's Alerts Card */}
              <div className="card card-body">
                <h3 className="text-base font-semibold text-primary mb-4">
                  Today's Alerts
                </h3>
                <div className="flex flex-col gap-3">
                  {alerts?.slice(0, 3).map((alert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{
                          backgroundColor: alert.severity === 'critical' ? '#ef4444' : '#f59e0b'
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {alert.title || alert.message}
                        </p>
                        <p className="text-xs text-muted">
                          {alert.time || '2 hours ago'}
                        </p>
                      </div>
                    </div>
                  )) || (
                      <p className="text-sm text-muted">No alerts today</p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DistrictDashboard;

