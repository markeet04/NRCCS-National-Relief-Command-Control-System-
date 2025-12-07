// PDMA Dashboard Constants
import {
  Radio,
  Home,
  Package,
  Users,
  FileText
} from 'lucide-react';
import { STAT_GRADIENT_KEYS } from '@shared/constants/dashboardConfig';

export const PDMA_DASHBOARD_STATS = [
  {
    title: 'PENDING SOS',
    value: '15',
    icon: Radio,
    trend: -12,
    trendLabel: 'vs yesterday',
    trendDirection: 'down',
    gradientKey: STAT_GRADIENT_KEYS.danger,
  },
  {
    title: 'ACTIVE SHELTERS',
    value: '8',
    icon: Home,
    trend: 2,
    trendLabel: 'newly opened',
    trendDirection: 'up',
    gradientKey: STAT_GRADIENT_KEYS.success,
  },
  {
    title: 'SHELTER CAPACITY',
    value: '850',
    icon: Users,
    trend: null,
    trendLabel: null,
    trendDirection: null,
    gradientKey: STAT_GRADIENT_KEYS.info,
  },
  {
    title: 'RESCUE TEAMS ACTIVE',
    value: '1',
    icon: Users,
    trend: null,
    trendLabel: null,
    trendDirection: null,
    gradientKey: 'blue',
  },
  {
    title: 'LOCAL RESOURCES',
    value: '0',
    icon: Package,
    trend: -5,
    trendLabel: 'units available',
    trendDirection: 'down',
    gradientKey: STAT_GRADIENT_KEYS.warning,
  },
  {
    title: 'DAMAGE REPORTS',
    value: '34',
    icon: FileText,
    trend: 8,
    trendLabel: 'submitted today',
    trendDirection: 'up',
    gradientKey: STAT_GRADIENT_KEYS.default,
  },
];

export const PDMA_DASHBOARD_ALERTS = [
  {
    id: 1,
    title: 'Flash Flood Warning - Karachi',
    description: 'Heavy rainfall expected in coastal areas. Monitor water levels closely.',
    severity: 'high',
    status: 'active',
    type: 'flood',
    location: 'Karachi',
    source: 'PDMA Sindh',
  },
  {
    id: 2,
    title: 'Evacuation Order - District Sukkur',
    description: 'Mandatory evacuation for low-lying areas. Proceed to designated shelters.',
    severity: 'critical',
    status: 'active',
    type: 'evacuation',
    location: 'Sukkur',
    source: 'District Sukkur',
  },
  {
    id: 3,
    title: 'Shelter Capacity Alert - Hyderabad',
    description: 'Shelter capacity reaching maximum. Additional facilities needed.',
    severity: 'medium',
    status: 'pending',
    type: 'shelter',
    location: 'Hyderabad',
    source: 'District Hyderabad',
  },
];

export const PDMA_DASHBOARD_DISTRICTS = [
  { name: 'Karachi', status: 'Critical', severity: '#ef4444', alerts: 5, sos: 12 },
  { name: 'Sukkur', status: 'High', severity: '#f97316', alerts: 3, sos: 8 },
  { name: 'Hyderabad', status: 'Medium', severity: '#f59e0b', alerts: 2, sos: 3 },
  { name: 'Larkana', status: 'Stable', severity: '#10b981', alerts: 0, sos: 0 }
];

export const PDMA_DASHBOARD_RESOURCES = (provinceName) => [
  {
    id: 1,
    name: 'Food',
    icon: 'food',
    quantity: '3,200 units',
    location: 'Provincial Warehouse',
    province: provinceName,
    status: 'available',
  },
  {
    id: 2,
    name: 'Water',
    icon: 'water',
    quantity: '6,500 liters',
    location: 'District Karachi',
    province: provinceName,
    status: 'available',
  },
  {
    id: 3,
    name: 'Medical',
    icon: 'medical',
    quantity: '1,800 kits',
    location: 'District Sukkur',
    province: provinceName,
    status: 'allocated',
  },
  {
    id: 4,
    name: 'Shelter',
    icon: 'shelter',
    quantity: '450 tents',
    location: 'Provincial Storage',
    province: provinceName,
    status: 'available',
  },
  {
    id: 5,
    name: 'Clothing',
    icon: 'clothing',
    quantity: '2,100 units',
    location: 'Relief Center',
    province: provinceName,
    status: 'low',
  },
  {
    id: 6,
    name: 'Blanket',
    icon: 'blanket',
    quantity: '890 units',
    location: 'District Larkana',
    province: provinceName,
    status: 'critical',
  },
];

export const SEVERITY_BORDER_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b'
};

export const STATUS_COLORS = {
  available: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
  allocated: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
  low: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
};
