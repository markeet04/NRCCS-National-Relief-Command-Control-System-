import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/Layout';
import { StatCard, AlertCard, ResourceCard, MapContainer } from '../../components/Dashboard';
import { 
  Radio, 
  Home, 
  Users, 
  Package,
  FileText,
  MapPin,
  Plus,
  CheckCircle
} from 'lucide-react';

/**
 * DistrictDashboard Component
 * District/Regional Dashboard for ground-level operations
 * Handles SOS requests, local shelters, rescue teams, and damage reports
 */
const DistrictDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const districtName = 'Sukkur'; // This would come from auth context
  const provinceName = 'Sindh';

  // Menu items for District role
  const menuItems = [
    { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
    { route: 'sos', label: 'SOS Requests', icon: 'alerts', badge: 15 },
    { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
    { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
    { route: 'reports', label: 'Damage Reports', icon: 'map' },
  ];

  // Mock data
  const stats = [
    {
      title: 'Pending SOS',
      value: '15',
      icon: Radio,
      trend: -12,
      trendLabel: 'vs yesterday',
      color: 'danger',
    },
    {
      title: 'Active Shelters',
      value: '8',
      icon: Home,
      trend: 2,
      trendLabel: 'newly opened',
      color: 'success',
    },
    {
      title: 'Shelter Capacity',
      value: '850',
      icon: Users,
      trend: 0,
      trendLabel: 'people',
      color: 'info',
    },
    {
      title: 'Rescue Teams Active',
      value: '12',
      icon: Users,
      trend: 0,
      trendLabel: 'teams',
      color: 'success',
    },
    {
      title: 'Local Resources',
      value: '2.3K',
      icon: Package,
      trend: -5,
      trendLabel: 'units available',
      color: 'warning',
    },
    {
      title: 'Damage Reports',
      value: '34',
      icon: FileText,
      trend: 8,
      trendLabel: 'submitted today',
      color: 'default',
    },
  ];

  const sosRequests = [
    {
      id: 1,
      title: 'Emergency Rescue - Family Stranded',
      description: 'Family of 5 trapped on rooftop. Urgent rescue needed.',
      severity: 'critical',
      status: 'active',
      type: 'rescue',
      location: 'Street 12, Sukkur',
      source: 'Civilian Portal',
    },
    {
      id: 2,
      title: 'Medical Emergency - Elderly Person',
      description: 'Elderly person needs immediate medical attention and evacuation.',
      severity: 'high',
      status: 'active',
      type: 'medical',
      location: 'Block C, Sukkur',
      source: 'Civilian Portal',
    },
    {
      id: 3,
      title: 'Food Supply Request',
      description: 'Community shelter running low on food supplies.',
      severity: 'medium',
      status: 'pending',
      type: 'supply',
      location: 'Community Center',
      source: 'Shelter Manager',
    },
  ];

  const shelters = [
    {
      id: 1,
      name: 'Central Community Hall',
      icon: 'shelter',
      quantity: '250 / 300',
      location: 'Downtown Sukkur',
      province: districtName,
      status: 'available',
    },
    {
      id: 2,
      name: 'School Shelter A',
      icon: 'shelter',
      quantity: '180 / 200',
      location: 'North Block',
      province: districtName,
      status: 'available',
    },
    {
      id: 3,
      name: 'Sports Complex',
      icon: 'shelter',
      quantity: '420 / 450',
      location: 'East Side',
      province: districtName,
      status: 'critical',
    },
  ];

  const navigate = useNavigate();

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      navigate('/district');
    } else {
      navigate(`/district/${route}`);
    }
  };

  const handleAssignSOS = (sosId) => {
    console.log('Assign SOS:', sosId);
  };

  const handleManageShelter = (shelterId) => {
    console.log('Manage shelter:', shelterId);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      userRole={`District ${districtName}`}
      userName="District Officer"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle={`${districtName} District - ${provinceName} Province tactical operations`}
      notificationCount={15}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* SOS Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">Active SOS Requests</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                View All
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {sosRequests.map((sos) => (
              <AlertCard
                key={sos.id}
                {...sos}
                onResolve={() => handleAssignSOS(sos.id)}
                onView={() => console.log('View SOS', sos.id)}
              />
            ))}
          </div>
        </div>

        {/* Rescue Teams Status */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Rescue Teams</h2>
          <div className="bg-white rounded-xl p-6 shadow-card border border-neutral-200">
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Team Alpha</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-600">Location: Sector 5</p>
                <p className="text-xs text-neutral-600">Members: 8</p>
              </div>
              <div className="pb-3 border-b border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Team Bravo</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-600">Location: Downtown</p>
                <p className="text-xs text-neutral-600">Members: 10</p>
              </div>
              <div className="pb-3 border-b border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Team Charlie</span>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                    Standby
                  </span>
                </div>
                <p className="text-xs text-neutral-600">Location: Base Camp</p>
                <p className="text-xs text-neutral-600">Members: 6</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Medical Team</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-600">Location: Field Hospital</p>
                <p className="text-xs text-neutral-600">Members: 12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Map */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <MapContainer
          title={`${districtName} District Flood Risk Heatmap`}
          onExpand={() => console.log('Expand map')}
        />
      </div>

      {/* Shelter Management */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Local Shelters</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            Register Shelter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((shelter) => (
            <ResourceCard
              key={shelter.id}
              {...shelter}
              onAllocate={() => handleManageShelter(shelter.id)}
              onViewDetails={() => console.log('View shelter', shelter.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistrictDashboard;
