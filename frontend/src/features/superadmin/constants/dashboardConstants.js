import { Users, AlertTriangle, Activity, Zap } from 'lucide-react';
import { STAT_GRADIENT_KEYS } from '@shared/constants/dashboardConfig';

export const SUPERADMIN_STATS = [
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
