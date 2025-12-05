import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { StatCard } from '../../components/Dashboard';
import { Users, AlertTriangle, Activity, Zap, TrendingUp, Settings } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  
  const menuItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'users', label: 'User Management', icon: 'users' },
    { route: 'provinces', label: 'Provinces & Districts', icon: 'provinces' },
    { route: 'settings', label: 'System Settings', icon: 'settings' },
    { route: 'api', label: 'API Integration', icon: 'api' }
  ];

  const [stats, setStats] = useState([
    {
      title: 'Total Users',
      value: '142',
      icon: Users,
      trend: 12,
      trendLabel: 'vs last month',
      color: 'success'
    },
    {
      title: 'Active Alerts',
      value: '12',
      icon: AlertTriangle,
      trend: -5,
      trendLabel: 'vs last week',
      color: 'warning'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      icon: Activity,
      trend: 0.1,
      trendLabel: 'This month',
      color: 'success'
    },
    {
      title: 'API Calls Today',
      value: '15.2K',
      icon: Zap,
      trend: 23,
      trendLabel: 'vs yesterday',
      color: 'primary'
    }
  ]);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Super Admin Dashboard"
      pageSubtitle="System-wide management and configuration"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* System Overview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#fff'
          }}>
            System Overview
          </h2>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <p>Welcome to the Super Admin Portal. Use the sidebar to manage users, configure system settings, and monitor integrations.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
