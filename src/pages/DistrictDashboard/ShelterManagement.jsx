import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { MapPin, Users, Activity, AlertTriangle } from 'lucide-react';

const ShelterManagement = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  
  const menuItems = [
    { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
    { route: 'sos', label: 'SOS Requests', icon: 'alerts', badge: 15 },
    { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
    { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
    { route: 'reports', label: 'Damage Reports', icon: 'map' },
  ];

  const [shelters] = useState([
    {
      id: 1,
      name: 'Government School Shelter',
      location: 'Block A, Sukkur',
      capacity: 500,
      occupied: 450,
      status: 'near capacity',
      facilities: ['Medical', 'Food', 'Water', 'Sanitation'],
      coordinator: 'Ahmed Malik',
      phone: '+92-300-1111111'
    },
    {
      id: 2,
      name: 'Community Center Shelter',
      location: 'Block B, Sukkur',
      capacity: 300,
      occupied: 180,
      status: 'available',
      facilities: ['Food', 'Water', 'Sanitation'],
      coordinator: 'Sara Khan',
      phone: '+92-301-2222222'
    },
    {
      id: 3,
      name: 'Sports Complex Shelter',
      location: 'Block C, Sukkur',
      capacity: 800,
      occupied: 250,
      status: 'available',
      facilities: ['Medical', 'Food', 'Water', 'Sanitation', 'Power'],
      coordinator: 'Hassan Ali',
      phone: '+92-302-3333333'
    }
  ]);

  const getOccupancyColor = (occupied, capacity) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 70) return '#fb923c';
    return '#10b981';
  };

  const getStatusColor = (status) => {
    if (status === 'near capacity') return '#ef4444';
    if (status === 'available') return '#10b981';
    return '#6b7280';
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Shelter Management"
      pageSubtitle="Monitor and manage evacuation shelters"
      userRole="District Sukkur"
      userName="District Officer"
    >
      <div style={{ padding: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Total Shelters
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {shelters.length}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Total Capacity
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {shelters.reduce((sum, s) => sum + s.capacity, 0)}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              People Sheltered
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {shelters.reduce((sum, s) => sum + s.occupied, 0)}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Available Space
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
              {shelters.reduce((sum, s) => sum + (s.capacity - s.occupied), 0)}
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          Active Shelters
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {shelters.map((shelter) => {
            const occupancyPercentage = (shelter.occupied / shelter.capacity) * 100;
            return (
              <div
                key={shelter.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                      {shelter.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {shelter.location}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: `${getStatusColor(shelter.status)}33`,
                    color: getStatusColor(shelter.status)
                  }}>
                    {shelter.status}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Users size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        Capacity: {shelter.occupied} / {shelter.capacity}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${occupancyPercentage}%`,
                        height: '100%',
                        background: getOccupancyColor(shelter.occupied, shelter.capacity),
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
                      Coordinator
                    </div>
                    <div style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>
                      {shelter.coordinator}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                      {shelter.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '12px' }}>
                    Available Facilities
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {shelter.facilities.map((facility, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShelterManagement;
