import { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { AlertTriangle, Truck, Users, Package, MapPin, Cloud, Wind, Thermometer, Droplets } from 'lucide-react';
import { useBadge } from '@shared/contexts/BadgeContext';

/**
 * NDMADashboard Component
 * National Dashboard for NDMA (National Disaster Management Authority)
 */

const NDMADashboard = () => {
  const { activeStatusCount } = useBadge();
  const [activeRoute, setActiveRoute] = useState('dashboard');

  // Menu items for NDMA role
  const menuItems = useMemo(() => [
    { route: 'dashboard', label: 'National Dashboard', icon: 'dashboard' },
    { route: 'alerts', label: 'Nationwide Alerts', icon: 'alerts', badge: activeStatusCount },
    { route: 'resources', label: 'Resource Allocation', icon: 'resources' },
    { route: 'map', label: 'Flood Map', icon: 'map' }
  ], [activeStatusCount]);

  const handleNavigate = (route) => {
    setActiveRoute(route);
    console.log('Navigate to:', route);
  };

  // Stats data
  const stats = [
    { title: 'Active Emergencies', value: 3, change: -12, trend: 'down', icon: AlertTriangle, color: '#ef4444' },
    { title: 'Teams Deployed', value: 2, change: 8, trend: 'up', icon: Truck, color: '#3b82f6' },
    { title: 'People Evacuated', value: '15,432', change: 15, trend: 'up', icon: Users, color: '#10b981' },
    { title: 'Resources Available', value: '182,000', change: 0, trend: 'neutral', icon: Package, color: '#f59e0b' }
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
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
          National Overview - NDMA
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          Real-time national disaster management dashboard
        </p>
      </div>

      {/* Critical Alert Banner */}
      <div 
        style={{ 
          backgroundColor: '#7f1d1d', 
          border: '1px solid #991b1b', 
          borderLeft: '4px solid #ef4444',
          borderRadius: '8px', 
          padding: '16px 20px', 
          marginBottom: '24px' 
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <div style={{ color: '#fecaca', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
              Flash Flood Warning
            </div>
            <div style={{ color: '#fca5a5', fontSize: '13px', lineHeight: '1.5' }}>
              Heavy rainfall expected in next 24 hours. Evacuate low-lying areas immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            style={{ 
              backgroundColor: '#1e293b', 
              borderRadius: '12px', 
              padding: '20px',
              border: '1px solid #334155',
              position: 'relative'
            }}
          >
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  {stat.title}
                </div>
                <div style={{ color: '#f8fafc', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                  {stat.value}
                </div>
                {stat.change !== 0 && (
                  <div 
                    style={{ 
                      color: stat.trend === 'up' ? '#10b981' : '#ef4444', 
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {stat.trend === 'up' ? '+' : ''}{stat.change}% vs yesterday
                  </div>
                )}
              </div>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns */}
        <div className="lg:col-span-2" style={{ marginTop: '24px' }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Pakistan - Live Situation Map
            </h3>
            
            {/* Map Placeholder */}
            <div style={{ 
              backgroundColor: '#0f172a', 
              borderRadius: '8px', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              border: '1px solid #334155'
            }}>
              <MapPin className="w-16 h-16 mb-4" style={{ color: '#3b82f6' }} />
              <h4 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Interactive Pakistan Map
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
                SOS Locations + Flood Zones + Shelters + Rescue Teams
              </p>
              
              {/* Map Legend */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Critical SOS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                  <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Flood Zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Shelters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          {/* 24h Weather */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px', marginTop: '24px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              24h Weather
            </h3>
            <div className="flex flex-col gap-3">
              {weatherData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>{item.label}</span>
                  <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: '600' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Status */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Resource Status
            </h3>
            <div className="flex flex-col gap-4">
              {resources.map((resource, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500' }}>
                      {resource.name}
                    </span>
                    <span style={{ color: resource.color, fontSize: '13px', fontWeight: '600' }}>
                      {resource.percentage}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
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
