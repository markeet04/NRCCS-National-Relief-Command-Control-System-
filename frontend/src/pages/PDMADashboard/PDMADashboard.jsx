import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { StatCard, AlertCard, ResourceCard, MapContainer } from '../../components/Dashboard';
import { 
  AlertTriangle, 
  Radio, 
  Home, 
  Package, 
  Users, 
  Building,
  Plus
} from 'lucide-react';

/**
 * PDMADashboard Component
 * Provincial Dashboard for PDMA (Provincial Disaster Management Authority)
 * Displays province-level disaster coordination and resource management
 */
const PDMADashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const provinceName = 'Sindh'; // This would come from auth context

  // Menu items for PDMA role
  const menuItems = [
    { route: 'dashboard', label: 'Provincial Dashboard', icon: 'dashboard' },
    { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
    { route: 'shelters', label: 'Shelter Management', icon: 'map' },
    { route: 'districts', label: 'District Coordination', icon: 'alerts' },
    { route: 'map', label: 'Provincial Map', icon: 'map' },
  ];

  // Mock data - will be replaced with API calls
  const stats = [
    {
      title: 'Provincial Alerts',
      value: '5',
      icon: AlertTriangle,
      trend: -10,
      trendLabel: 'vs last week',
      color: 'danger',
    },
    {
      title: 'SOS Requests',
      value: '18',
      icon: Radio,
      trend: -5,
      trendLabel: 'vs yesterday',
      color: 'warning',
    },
    {
      title: 'Active Shelters',
      value: '12',
      icon: Home,
      trend: 8,
      trendLabel: 'in province',
      color: 'success',
    },
    {
      title: 'Resources Available',
      value: '6.0K',
      icon: Package,
      trend: 0,
      trendLabel: 'units',
      color: 'info',
    },
    {
      title: 'Rescue Teams',
      value: '15',
      icon: Users,
      trend: 3,
      trendLabel: 'active',
      color: 'success',
    },
    {
      title: 'Affected Population',
      value: '45K',
      icon: Users,
      trend: 2,
      trendLabel: 'estimated',
      color: 'default',
    },
  ];

  const alerts = [
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

  const resources = [
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

  const handleNavigate = (route) => {
    setActiveRoute(route);
    console.log('Navigate to:', route);
  };

  const handleResolveAlert = (alertId) => {
    console.log('Resolve alert:', alertId);
  };

  const handleAllocateResource = (resourceId) => {
    console.log('Allocate resource:', resourceId);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={`PDMA ${provinceName}`}
      userName="Provincial Admin"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle={`${provinceName} Provincial disaster coordination and management`}
      notificationCount={8}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alert Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">Provincial Alerts</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                {...alert}
                onResolve={() => handleResolveAlert(alert.id)}
                onView={() => console.log('View alert', alert.id)}
              />
            ))}
          </div>
        </div>

        {/* District Overview */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">District Status</h2>
          <div className="bg-white rounded-xl p-6 shadow-card border border-neutral-200">
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Karachi</span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Critical</span>
                </div>
                <p className="text-xs text-neutral-600">5 active alerts, 12 SOS</p>
              </div>
              <div className="pb-3 border-b border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Sukkur</span>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">High</span>
                </div>
                <p className="text-xs text-neutral-600">3 active alerts, 8 SOS</p>
              </div>
              <div className="pb-3 border-b border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Hyderabad</span>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Medium</span>
                </div>
                <p className="text-xs text-neutral-600">2 active alerts, 3 SOS</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Larkana</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Stable</span>
                </div>
                <p className="text-xs text-neutral-600">0 active alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provincial Flood Heatmap */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <MapContainer
          title={`${provinceName} Province Flood Risk Heatmap`}
          onExpand={() => console.log('Expand map')}
        />
      </div>

      {/* Resource Inventory */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Provincial Resource Inventory</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              {...resource}
              onAllocate={() => handleAllocateResource(resource.id)}
              onViewDetails={() => console.log('View resource', resource.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PDMADashboard;
