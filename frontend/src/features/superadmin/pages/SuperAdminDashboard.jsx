import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { StatCard } from '@shared/components/dashboard';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { Users, AlertTriangle, Activity, Zap, TrendingUp, Settings } from 'lucide-react';
import { 
  getMenuItemsByRole, 
  ROLE_CONFIG, 
  STAT_GRADIENT_KEYS 
} from '@shared/constants/dashboardConfig';

/**
 * SuperAdminDashboard Component
 * System-wide management and configuration dashboard
 * Uses shared layout and configuration from dashboardConfig
 */
const SuperAdminDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  
  // Theme support
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Get role configuration from shared config
  const roleConfig = ROLE_CONFIG.superadmin;

  // Get menu items from shared config
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  // Stats using shared gradient keys
  const stats = [
    {
      title: 'Total Users',
      value: '142',
      icon: Users,
      trend: 12,
      trendLabel: 'vs last month',
      color: 'success',
      gradientKey: STAT_GRADIENT_KEYS.users
    },
    {
      title: 'Active Alerts',
      value: '12',
      icon: AlertTriangle,
      trend: -5,
      trendLabel: 'vs last week',
      color: 'warning',
      gradientKey: STAT_GRADIENT_KEYS.alerts
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      icon: Activity,
      trend: 0.1,
      trendLabel: 'This month',
      color: 'success',
      gradientKey: STAT_GRADIENT_KEYS.uptime
    },
    {
      title: 'API Calls Today',
      value: '15.2K',
      icon: Zap,
      trend: 23,
      trendLabel: 'vs yesterday',
      color: 'primary',
      gradientKey: STAT_GRADIENT_KEYS.api
    }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle={roleConfig.title}
      pageSubtitle={roleConfig.subtitle}
      userRole={roleConfig.userRole}
      userName={roleConfig.userName}
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
        <div 
          className="transition-all duration-300"
          style={{
            background: colors.cardBg,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.cardBorder}`,
            boxShadow: isLight ? colors.cardShadow : 'none'
          }}
        >
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: colors.textPrimary
          }}>
            System Overview
          </h2>
          <div style={{ color: colors.textSecondary }}>
            <p>Welcome to the Super Admin Portal. Use the sidebar to manage users, configure system settings, and monitor integrations.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
