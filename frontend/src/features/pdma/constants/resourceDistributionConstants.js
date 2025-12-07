// Resource Distribution Constants
import { Package, Droplet, Heart, Truck } from 'lucide-react';

export const RESOURCE_DISTRIBUTION_FILTERS = ['all', 'available', 'allocated', 'low', 'critical'];

export const RESOURCE_DISTRIBUTION_DATA = [
  {
    id: 1,
    name: 'Food Supplies',
    icon: Package,
    status: 'available',
    quantity: 3200,
    unit: 'units',
    location: 'Provincial Warehouse',
    allocated: 800,
    trend: 12,
    lastUpdated: '2 hours ago'
  },
  {
    id: 2,
    name: 'Fresh Water',
    icon: Droplet,
    status: 'available',
    quantity: 6500,
    unit: 'liters',
    location: 'District Karachi',
    allocated: 2000,
    trend: 8,
    lastUpdated: '30 mins ago'
  },
  {
    id: 3,
    name: 'Medical Kits',
    icon: Heart,
    status: 'allocated',
    quantity: 1800,
    unit: 'kits',
    location: 'District Sukkur',
    allocated: 1500,
    trend: -5,
    lastUpdated: '1 hour ago'
  },
  {
    id: 4,
    name: 'Blankets & Clothing',
    icon: Package,
    status: 'low',
    quantity: 2100,
    unit: 'units',
    location: 'Relief Center',
    allocated: 1800,
    trend: -15,
    lastUpdated: '45 mins ago'
  },
  {
    id: 5,
    name: 'Tents & Shelter',
    icon: Package,
    status: 'available',
    quantity: 450,
    unit: 'tents',
    location: 'Provincial Storage',
    allocated: 350,
    trend: 5,
    lastUpdated: '20 mins ago'
  },
  {
    id: 6,
    name: 'Diesel & Fuel',
    icon: Truck,
    status: 'critical',
    quantity: 890,
    unit: 'liters',
    location: 'District Larkana',
    allocated: 800,
    trend: -25,
    lastUpdated: '10 mins ago'
  }
];

export const RESOURCE_STATUS_COLORS = {
  available: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' },
  allocated: { bg: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
  low: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
  critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' }
};
