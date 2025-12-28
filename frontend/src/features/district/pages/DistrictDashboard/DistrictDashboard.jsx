import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/AuthProvider';

// Shared Layout
import { DashboardLayout } from '../../../../shared/components/layout';
import { StatCard } from '@shared/components/dashboard';
import { PageLoader } from '@shared/components/ui';
import '@styles/css/main.css';

// District-specific imports - hooks, constants, components
import { useDistrictData, useRescueTeams } from '../../hooks';
import { DISTRICT_MENU_ITEMS, STAT_GRADIENT_KEYS } from '../../constants';
import { WeatherCard, AlertsList, LiveMapCard, SOSTable, DistrictMap } from '../../components';

// Icons
import { Users, CheckCircle, Clock, AlertTriangle, Radio, Home, Package, Maximize2, Minimize2, X } from 'lucide-react';

/**
 * DistrictDashboard Component
 * District/Regional Dashboard for ground-level operations
 * Uses modular components, hooks, and services for easy backend integration
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */
const DistrictDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

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
    <>
      <DashboardLayout
        menuItems={DISTRICT_MENU_ITEMS}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        userRole={`District ${districtInfo?.name || 'Loading...'}`}
        userName={user?.name || 'District Officer'}
        pageTitle="National Rescue & Crisis Coordination System"
        pageSubtitle={districtInfo ? `${districtInfo.name} District - ${districtInfo.province?.name || districtInfo.province || ''} Province tactical operations` : 'Loading district...'}
        notificationCount={rawStats?.pendingSOS || 0}
      >
        {/* Loading State */}
        {dashboardLoading && (
          <PageLoader message="Loading dashboard data..." />
        )}

        {!dashboardLoading && (
          <>
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="page-title">
                District Overview - {districtInfo?.name || 'Loading...'}
              </h1>
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

            {/* Map Section - Full Width */}
            <div className="mb-6">
              <div className="card card-body" style={{
                borderLeftColor: '#3b82f6',
                borderLeftWidth: '4px',
                boxShadow: 'inset 4px 0 8px -2px rgba(59, 130, 246, 0.3)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary">
                    {districtInfo?.name || 'District'} - Live Situation Map
                  </h3>
                  <button
                    onClick={() => setIsMapFullscreen(true)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="Expand Map"
                    style={{ background: 'rgba(59, 130, 246, 0.15)' }}
                  >
                    <Maximize2 size={20} color="#3b82f6" />
                  </button>
                </div>
                {/* ArcGIS District Map with Weather Layers */}
                <DistrictMap
                  districtName={districtInfo?.name}
                  height="450px"
                />
              </div>
            </div>
          </>
        )}
      </DashboardLayout>

      {/* Fullscreen Map Modal */}
      {
        isMapFullscreen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {districtInfo?.name || 'District'} - Live Situation Map
              </h2>
              <button
                onClick={() => setIsMapFullscreen(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                title="Close Fullscreen"
                style={{ background: 'rgba(239, 68, 68, 0.15)' }}
              >
                <X size={24} color="#ef4444" />
              </button>
            </div>

            {/* Fullscreen Map */}
            <div className="flex-1 p-4" style={{ height: 'calc(100vh - 80px)' }}>
              <DistrictMap
                districtName={districtInfo?.name}
                height="calc(100vh - 112px)"
              />
            </div>
          </div>
        )
      }

    </>
  );
};

export default DistrictDashboard;

