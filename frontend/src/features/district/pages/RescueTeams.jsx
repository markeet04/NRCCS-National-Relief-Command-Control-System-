import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Users, MapPin, Activity, Phone, Truck } from 'lucide-react';

const RescueTeams = () => {
  const [activeRoute, setActiveRoute] = useState('rescue');
  
  const menuItems = [
    { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
    { route: 'sos', label: 'SOS Requests', icon: 'alerts', badge: 15 },
    { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
    { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
    { route: 'reports', label: 'Damage Reports', icon: 'map' },
  ];

  const [teams] = useState([
    {
      id: 1,
      name: 'Alpha Team',
      members: 8,
      lead: 'Captain Ahmed Khan',
      phone: '+92-300-1234567',
      status: 'on mission',
      location: 'Block A, Sukkur',
      equipment: ['Boat', 'Medical Kit', 'Communication Radio', 'Rescue Gear'],
      currentMission: 'Evacuating 5 families from flooded area',
      availability: 'busy'
    },
    {
      id: 2,
      name: 'Bravo Team',
      members: 6,
      lead: 'Lt. Hassan Ali',
      phone: '+92-301-9876543',
      status: 'available',
      location: 'District HQ',
      equipment: ['Boat', 'Medical Kit', 'Ropes', 'Life Jackets'],
      currentMission: null,
      availability: 'available'
    },
    {
      id: 3,
      name: 'Charlie Team',
      members: 10,
      lead: 'Major Fatima Zahra',
      phone: '+92-302-5555555',
      status: 'on mission',
      location: 'Block C, Sukkur',
      equipment: ['Helicopter', 'Medical Kit', 'Rescue Harness', 'Communication Radio'],
      currentMission: 'Medical evacuation in progress',
      availability: 'busy'
    },
    {
      id: 4,
      name: 'Delta Team',
      members: 7,
      lead: 'Captain Sara Malik',
      phone: '+92-303-4444444',
      status: 'standby',
      location: 'Sector 2 Base',
      equipment: ['Truck', 'Medical Kit', 'Food Supplies', 'Water Purification'],
      currentMission: null,
      availability: 'standby'
    }
  ]);

  const getStatusColor = (status) => {
    if (status === 'available') return '#10b981';
    if (status === 'on mission') return '#3b82f6';
    if (status === 'standby') return '#fb923c';
    return '#6b7280';
  };

  const handleAssignMission = (teamId) => {
    alert(`Assigning mission to team ${teamId}...`);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Rescue Teams"
      pageSubtitle="Manage rescue operations and team deployment"
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
              Total Teams
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {teams.length}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Available Teams
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
              {teams.filter(t => t.availability === 'available').length}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Active Missions
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>
              {teams.filter(t => t.availability === 'busy').length}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Total Personnel
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {teams.reduce((sum, t) => sum + t.members, 0)}
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          Rescue Teams Status
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {teams.map((team) => (
            <div
              key={team.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: `4px solid ${getStatusColor(team.status)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                    {team.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {team.members} members
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        {team.location}
                      </span>
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: `${getStatusColor(team.status)}33`,
                  color: getStatusColor(team.status)
                }}>
                  {team.status}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '6px' }}>
                    Team Leader
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                    {team.lead}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '6px' }}>
                    Contact
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    <span style={{ color: '#fff', fontSize: '14px' }}>
                      {team.phone}
                    </span>
                  </div>
                </div>
              </div>

              {team.currentMission && (
                <div style={{
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Activity size={16} style={{ color: '#60a5fa' }} />
                    <span style={{ color: '#60a5fa', fontSize: '13px', fontWeight: '500' }}>
                      Current Mission
                    </span>
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px' }}>
                    {team.currentMission}
                  </div>
                </div>
              )}

              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '12px' }}>
                  Equipment
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {team.equipment.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {team.availability === 'available' && (
                <button
                  onClick={() => handleAssignMission(team.id)}
                  style={{
                    padding: '10px 20px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Assign Mission
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RescueTeams;
