import { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { AlertTriangle, Truck, Users, Package, MapPin, Cloud, Wind, Thermometer, Droplets } from 'lucide-react';

/**
 * NDMADashboard Component
 * National Dashboard for NDMA (National Disaster Management Authority)
 */

const NDMADashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  
  // Theme support
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  // Menu items for NDMA role
  const menuItems = useMemo(() => [
    { route: 'dashboard', label: 'National Dashboard', icon: 'dashboard' },
    { route: 'alerts', label: 'Nationwide Alerts', icon: 'alerts', badge: 12 },
    { route: 'resources', label: 'Resource Allocation', icon: 'resources' },
    { route: 'map', label: 'Flood Map', icon: 'map' }
  ], []);

  const handleNavigate = (route) => {
    setActiveRoute(route);
    console.log('Navigate to:', route);
  };

  // Stats data
  const stats = [
    { title: 'Active Emergencies', value: 3, change: -12, trend: 'down', icon: AlertTriangle, color: '#ef4444', gradientKey: 'rose' },
    { title: 'Teams Deployed', value: 2, change: 8, trend: 'up', icon: Truck, color: '#3b82f6', gradientKey: 'blue' },
    { title: 'People Evacuated', value: '15,432', change: 15, trend: 'up', icon: Users, color: '#10b981', gradientKey: 'emerald' },
    { title: 'Resources Available', value: '182,000', change: 0, trend: 'neutral', icon: Package, color: '#f59e0b', gradientKey: 'amber' }
  ];

  // Weather data
  const weatherData = [
    { label: 'Rainfall', value: 'Heavy' },
    { label: 'Wind Speed', value: '45 km/h' },
    { label: 'Temperature', value: '28°C' },
    { label: 'Humidity', value: '85%' }
  ];

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
      userRole="NDMA"
      userName="Admin"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle="Real-time national disaster management dashboard"
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
          backgroundColor: isLight ? '#fef2f2' : '#7f1d1d', 
          border: `1px solid ${isLight ? '#fecaca' : '#991b1b'}`, 
          borderLeft: '4px solid #ef4444',
          borderRadius: '8px', 
          padding: '16px 20px', 
          marginBottom: '24px' 
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <div style={{ color: isLight ? '#991b1b' : '#fecaca', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
              Flash Flood Warning
            </div>
            <div style={{ color: isLight ? '#b91c1c' : '#fca5a5', fontSize: '13px', lineHeight: '1.5' }}>
              Heavy rainfall expected in next 24 hours. Evacuate low-lying areas immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const gradient = isLight && colors.gradients ? colors.gradients[stat.gradientKey] : null;
          const StatIcon = stat.icon;
          const isWhiteText = gradient && gradient.textColor === '#ffffff';
          return (
            <div 
              key={index}
              className="transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
              style={{ 
                background: gradient ? gradient.bg : colors.cardBg, 
                borderRadius: '12px', 
                padding: '24px',
                border: gradient ? 'none' : `1px solid ${colors.cardBorder}`,
                borderTop: gradient ? `4px solid ${gradient.borderTop}` : `1px solid ${colors.cardBorder}`,
                boxShadow: gradient ? gradient.shadow : (isLight ? colors.cardShadow : 'none')
              }}
            >
              <div className="flex items-start justify-between">
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: gradient ? gradient.textColor : colors.textMuted, 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    opacity: isWhiteText ? 0.9 : 1
                  }}>
                    {stat.title}
                  </div>
                  <div style={{ 
                    color: gradient ? gradient.textColor : colors.textPrimary, 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    lineHeight: '1',
                    marginBottom: '8px'
                  }}>
                    {stat.value}
                  </div>
                  {stat.change !== 0 && (
                    <div 
                      style={{ 
                        color: isWhiteText ? 'rgba(255, 255, 255, 0.9)' : (stat.trend === 'up' ? '#059669' : '#dc2626'),
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      {stat.trend === 'up' ? '↗ +' : '↘ '}{stat.change}% <span style={{ color: gradient ? gradient.textColor : colors.textMuted, opacity: isWhiteText ? 0.85 : 0.7 }}>vs yesterday</span>
                    </div>
                  )}
                </div>
                {StatIcon && (
                  <div 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: gradient ? gradient.iconBg : `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <StatIcon className="w-6 h-6" style={{ color: '#ffffff' }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="transition-all duration-300" style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, padding: '24px', boxShadow: isLight ? colors.cardShadow : 'none' }}>
            <h3 style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Pakistan - Live Situation Map
            </h3>
            
            {/* Map Placeholder */}
            <div style={{ 
              background: isLight ? '#f1f5f9' : '#0f172a', 
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
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Critical SOS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Flood Zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Shelters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          {/* 24h Weather */}
          <div className="transition-all duration-300" style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, padding: '20px', boxShadow: isLight ? colors.cardShadow : 'none' }}>
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
          <div className="transition-all duration-300" style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, padding: '20px', boxShadow: isLight ? colors.cardShadow : 'none' }}>
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
                  <div style={{ width: '100%', height: '8px', backgroundColor: isLight ? '#e2e8f0' : '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
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
