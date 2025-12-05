import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Phone, MapPin, Clock, User, CheckCircle } from 'lucide-react';

const SOSRequests = () => {
  const [activeRoute, setActiveRoute] = useState('sos');
  
  const menuItems = [
    { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
    { route: 'sos', label: 'SOS Requests', icon: 'alerts', badge: 15 },
    { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
    { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
    { route: 'reports', label: 'Damage Reports', icon: 'map' },
  ];

  const [sosRequests] = useState([
    {
      id: 1,
      name: 'Ali Hassan',
      description: 'Family of 5 trapped on rooftop. Water level rising rapidly.',
      phone: '+92-300-1234567',
      location: 'Street 15, Block A, Sukkur',
      time: '3/15/2024, 11:30:00 AM',
      urgency: 'critical urgency',
      status: 'active',
      assignedTo: null
    },
    {
      id: 2,
      name: 'Fatima Khan',
      description: 'Elderly person needs medical evacuation urgently.',
      phone: '+92-301-9876543',
      location: 'Block C, Sukkur',
      time: '3/15/2024, 12:00:00 PM',
      urgency: 'high urgency',
      status: 'active',
      assignedTo: null
    }
  ]);

  const handleAssignTeam = (id) => {
    alert(`Assigning rescue team to request ${id}...`);
  };

  const handleMarkResolved = (id) => {
    alert(`Marking SOS request ${id} as resolved...`);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="SOS Requests"
      pageSubtitle="Manage emergency assistance requests"
      userRole="District Sukkur"
      userName="District Officer"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          Active SOS Requests
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sosRequests.map((request) => (
            <div
              key={request.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '4px solid #ef4444'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: request.urgency.includes('critical') 
                    ? 'rgba(239, 68, 68, 0.2)' 
                    : 'rgba(251, 146, 60, 0.2)',
                  color: request.urgency.includes('critical') ? '#ef4444' : '#fb923c'
                }}>
                  {request.urgency}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981'
                }}>
                  {request.status}
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
                {request.name}
              </h3>

              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '20px' }}>
                {request.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                    {request.phone}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                    {request.location}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                    {request.time}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAssignTeam(request.id)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Assign Team
                </button>
                <button
                  onClick={() => handleMarkResolved(request.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  <CheckCircle size={16} />
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SOSRequests;
