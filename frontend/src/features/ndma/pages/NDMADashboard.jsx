import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import {
  AlertTriangle,
  Truck,
  Users,
  Package,
  ArrowRight,
  Layers,
  RefreshCw,
  Maximize2,
  Minimize2,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { useBadge } from '@shared/contexts/BadgeContext';
import NdmaApiService from '@shared/services/NdmaApiService';

// Import NationalMap component
import NationalMap from '../components/NationalMap';

// Import custom hook for dashboard logic
import { useDashboardLogic } from '../hooks';

// Import constants
import { RESOURCE_STATUS } from '../constants';

// Import global NDMA styles (pitch black background, border accents)
import '../styles/global-ndma.css';

// Import page-specific styles
import '../styles/national-dashboard.css';

/**
 * NDMADashboard Component
 * National Dashboard for NDMA (National Disaster Management Authority)
 * Clean dark theme matching District Dashboard style
 */
const NDMADashboard = () => {
  const navigate = useNavigate();
  const { activeStatusCount, provincialRequestsCount, updateActiveStatusCount } = useBadge();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(0);
  const { theme } = useSettings();
  const isLight = theme === 'light';

  // Loading and data states for dashboard stats
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [resourceStats, setResourceStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats, resource stats, and alerts in parallel
      const [statsData, resStats, alertsData] = await Promise.all([
        NdmaApiService.getDashboardStats(),
        NdmaApiService.getResourceStats(),
        NdmaApiService.getAllAlerts({ status: 'active' })
      ]);

      setDashboardStats(statsData);
      setResourceStats(resStats);

      // Calculate critical alerts count
      const criticalCount = Array.isArray(alertsData)
        ? alertsData.filter(a => a.severity === 'critical').length
        : 0;
      setCriticalAlertsCount(criticalCount);

      // Update badge count
      const activeAlertsCount = Array.isArray(alertsData) ? alertsData.length : 0;
      updateActiveStatusCount(activeAlertsCount);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [updateActiveStatusCount]);

  // Fetch data on mount and when badge changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Toggle map fullscreen mode
  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  // Use custom hook for dashboard logic
  const { roleConfig, menuItems } = useDashboardLogic(activeStatusCount, provincialRequestsCount);

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/ndma');
    } else {
      navigate(`/ndma/${route}`);
    }
  };

  // Format number for display
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Build stats array from backend data
  const stats = [
    {
      title: 'Active Emergencies',
      value: loading ? '...' : formatNumber(dashboardStats?.activeAlerts || 0),
      trend: null,
      trendDirection: null,
      trendLabel: 'active alerts',
      icon: AlertTriangle,
      iconClass: 'emergencies'
    },
    {
      title: 'Teams Deployed',
      value: loading ? '...' : formatNumber(dashboardStats?.activeTeams || 0),
      trend: null,
      trendDirection: null,
      trendLabel: 'rescue teams',
      icon: Truck,
      iconClass: 'teams'
    },
    {
      title: 'People Evacuated',
      value: loading ? '...' : formatNumber(dashboardStats?.peopleSheltered || 0),
      trend: null,
      trendDirection: null,
      trendLabel: 'in shelters',
      icon: Users,
      iconClass: 'evacuated'
    },
    {
      title: 'Resources Available',
      value: loading ? '...' : formatNumber(resourceStats?.availableQuantity || dashboardStats?.totalResources || 0),
      trend: null,
      trendDirection: null,
      trendLabel: 'units',
      icon: Package,
      iconClass: 'resources'
    }
  ];

  // 24h Weather data
  const weatherData = {
    rainfall: 'Heavy',
    windSpeed: '45 km/h',
    temperature: '28°C',
    humidity: '85%'
  };

  // Get status icon for resource
  const getStatusIcon = (status) => {
    if (status === 'adequate') {
      return <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />;
    }
    return <AlertTriangle className="w-4 h-4" style={{ color: status === 'low' ? '#f97316' : '#eab308' }} />;
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      notificationCount={activeStatusCount || 5}
    >
      <div className={`ndma-page ${isLight ? 'light' : ''}`}>
        {/* Page Header */}
        <div className="national-page-header">
          <h1 className="national-page-title">National Overview - NDMA</h1>
          <p className="national-page-subtitle">
            Real-time national disaster management dashboard
          </p>
        </div>

        {/* Critical Alert Banner - Red with white text */}
        {criticalAlertsCount > 0 && (
          <div className="national-alert-banner">
            <div className="national-alert-banner-content">
              <div className="national-alert-banner-icon">
                <AlertTriangle />
              </div>
              <div className="national-alert-banner-text">
                <div className="national-alert-banner-title">
                  {criticalAlertsCount} Critical Alert{criticalAlertsCount > 1 ? 's' : ''} Require Attention
                </div>
                <div className="national-alert-banner-desc">
                  Flash Flood Warning - Evacuate low-lying areas immediately
                </div>
              </div>
            </div>
            <button
              className="national-alert-banner-action"
              onClick={() => navigate('/ndma/alerts')}
            >
              View all alerts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Grid - 4 Cards in a Row */}
        <div className="national-stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            // Determine left border accent class based on stat type
            const borderClass =
              stat.iconClass === 'emergencies' ? 'border-left-red' :
                stat.iconClass === 'teams' ? 'border-left-blue' :
                  stat.iconClass === 'evacuated' ? 'border-left-green' :
                    stat.iconClass === 'resources' ? 'border-left-purple' : '';
            return (
              <div key={index} className={`national-stat-card ${borderClass}`}>
                <div className="national-stat-card-header">
                  <span className="national-stat-card-label">{stat.title}</span>
                  <div className={`national-stat-card-icon ${stat.iconClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
                <div className="national-stat-card-value">{stat.value}</div>
                {stat.trend !== null ? (
                  <div className={`national-stat-card-trend ${stat.trendDirection}`}>
                    {stat.trendDirection === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.trend}% {stat.trendLabel}
                  </div>
                ) : (
                  <div className="national-stat-card-trend neutral">
                    {stat.trendLabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content Grid - 2fr left, 1fr right */}
        <div className={`national-main-grid ${isMapFullscreen ? 'map-fullscreen-active' : ''}`}>
          {/* Left Column - National Weather Map */}
          <div className={`national-map-card border-left-blue ${isMapFullscreen ? 'map-fullscreen' : ''}`}>
            <div className="national-map-header">
              <div>
                <h3 className="national-map-title">National Weather Map</h3>
                <p className="national-map-subtitle">
                  Real-time weather conditions across Pakistan
                </p>
              </div>
              <div className="national-map-controls">
                <button className="national-map-btn" title="Toggle layers">
                  <Layers className="w-4 h-4" />
                </button>
                <button className="national-map-btn" title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  className={`national-map-btn ${isMapFullscreen ? 'fullscreen-active' : ''}`}
                  title={isMapFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  onClick={toggleMapFullscreen}
                >
                  {isMapFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className={`national-map-container ${isMapFullscreen ? 'map-container-fullscreen' : ''}`}>
              <NationalMap height={isMapFullscreen ? 'calc(100vh - 180px)' : '650px'} />
            </div>
            <div className="national-map-legend">
              <div className="national-map-legend-item">
                <div className="national-map-legend-dot severe" />
                <span className="national-map-legend-label">Severe Weather</span>
              </div>
              <div className="national-map-legend-item">
                <div className="national-map-legend-dot warning" />
                <span className="national-map-legend-label">Warning</span>
              </div>
              <div className="national-map-legend-item">
                <div className="national-map-legend-dot watch" />
                <span className="national-map-legend-label">Watch</span>
              </div>
              <div className="national-map-legend-item">
                <div className="national-map-legend-dot normal" />
                <span className="national-map-legend-label">Normal</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stacked Cards */}
          <div className={`national-sidebar ${isMapFullscreen ? 'sidebar-hidden' : ''}`}>
            {/* Resource Status Card */}
            <div className="national-resource-card border-left-green">
              <div className="national-resource-header">
                <h3 className="national-resource-title">Resource Status</h3>
                <span className="national-resource-timestamp">
                  <Clock className="w-3 h-3" />
                  Updated just now
                </span>
              </div>
              <div className="national-resource-list">
                {RESOURCE_STATUS.map((resource, index) => (
                  <div key={index} className="national-resource-item">
                    <div className="national-resource-item-header">
                      <div className="national-resource-item-name">
                        {getStatusIcon(resource.status)}
                        {resource.type}
                      </div>
                      <div className="national-resource-item-status">
                        <span className="national-resource-item-percent">
                          {resource.allocated}%
                        </span>
                        <span className={`national-resource-item-badge ${resource.status}`}>
                          {resource.status}
                        </span>
                      </div>
                    </div>
                    <div className="national-progress">
                      <div
                        className={`national-progress-bar ${resource.status}`}
                        style={{ width: `${resource.allocated}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 24h Weather Card */}
            <div className="national-weather-card border-left-cyan">
              <h3 className="national-weather-title">24h Weather</h3>
              <div className="national-weather-list">
                <div className="national-weather-row">
                  <span className="national-weather-label">Rainfall</span>
                  <span className="national-weather-value critical">{weatherData.rainfall}</span>
                </div>
                <div className="national-weather-row">
                  <span className="national-weather-label">Wind Speed</span>
                  <span className="national-weather-value">{weatherData.windSpeed}</span>
                </div>
                <div className="national-weather-row">
                  <span className="national-weather-label">Temperature</span>
                  <span className="national-weather-value">{weatherData.temperature}</span>
                </div>
                <div className="national-weather-row">
                  <span className="national-weather-label">Humidity</span>
                  <span className="national-weather-value">{weatherData.humidity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NDMADashboard;
