import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Phone, MapPin, Clock, User, CheckCircle } from 'lucide-react';

const EmergencySOS = () => {
  const [activeRoute, setActiveRoute] = useState('sos');
  
  const menuItems = [
    { route: 'home', label: 'Home', icon: 'dashboard' },
    { route: 'sos', label: 'Emergency SOS', icon: 'alerts' },
    { route: 'shelters', label: 'Find Shelters', icon: 'map' },
    { route: 'missing', label: 'Missing Persons', icon: 'users' },
    { route: 'alerts', label: 'Alerts & Notices', icon: 'alerts' }
  ];

  const [sosRequests] = useState([
    {
      id: 1,
      name: 'Ali Hassan',
      description: 'Trapped on rooftop with family of 5. Water level rising rapidly.',
      phone: '+92-300-1234567',
      location: 'Street 15, Block A, Sukkur',
      time: '3/15/2024, 11:30:00 AM',
      urgency: 'critical urgency',
      status: 'assigned',
      assignedTo: 'Rescue Team Alpha'
    },
    {
      id: 2,
      name: 'Ayesha Malik',
      description: 'Need medical assistance. Elderly person with chronic condition.',
      phone: '+92-301-9876543',
      location: 'Village Kot Diji, Khairpur',
      time: '3/15/2024, 12:00:00 PM',
      urgency: 'high urgency',
      status: 'pending',
      assignedTo: null
    }
  ]);

  const handleMarkResolved = (id) => {
    alert(`Marking SOS request ${id} as resolved...`);
  };

  const handleViewOnMap = (location) => {
    alert(`Opening map for: ${location}`);
  };

  const handleAssignTeam = (id) => {
    alert(`Assigning rescue team to request ${id}...`);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="SOS Emergency Requests"
      pageSubtitle="Track and manage emergency assistance requests"
      userRole="Civilian Portal"
      userName="sgb"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          SOS Emergency Requests
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
              {/* Header with badges */}
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
                  background: request.status === 'assigned' 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(107, 114, 128, 0.2)',
                  color: request.status === 'assigned' ? '#60a5fa' : '#9ca3af'
                }}>
                  {request.status}
                </span>
              </div>

              {/* Person Name */}
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
                {request.name}
              </h3>

              {/* Description */}
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '20px' }}>
                {request.description}
              </p>

              {/* Details Grid */}
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
                {request.assignedTo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                      Assigned to: {request.assignedTo}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {request.status === 'assigned' && (
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
                )}
                {request.status === 'pending' && (
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
                )}
                <button
                  onClick={() => handleViewOnMap(request.location)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencySOS;
