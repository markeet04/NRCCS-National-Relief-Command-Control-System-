import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { AlertTriangle, Plus, CheckCircle } from 'lucide-react';

const AlertsNotices = () => {
  const [activeRoute, setActiveRoute] = useState('alerts');
  
  const menuItems = [
    { route: 'home', label: 'Home', icon: 'dashboard' },
    { route: 'sos', label: 'Emergency SOS', icon: 'alerts' },
    { route: 'shelters', label: 'Find Shelters', icon: 'map' },
    { route: 'missing', label: 'Missing Persons', icon: 'users' },
    { route: 'alerts', label: 'Alerts & Notices', icon: 'alerts' }
  ];

  const [alerts] = useState([
    {
      id: 1,
      title: 'Flash Flood Warning - Sindh',
      description: 'Heavy rainfall expected in next 24 hours. Residents near riverbanks should evacuate immediately.',
      type: 'flood',
      location: 'Sindh',
      issuedBy: 'NDMA',
      severity: 'critical',
      status: 'active'
    },
    {
      id: 2,
      title: 'Evacuation Order - District Sukkur',
      description: 'Mandatory evacuation for low-lying areas. Proceed to designated shelters.',
      type: 'evacuation',
      location: 'Sukkur, Sindh',
      issuedBy: 'PDMA Sindh',
      severity: 'high',
      status: 'active'
    }
  ]);

  const handleResolve = (id) => {
    alert(`Resolving alert ${id}...`);
  };

  const handleCreateAlert = () => {
    alert('Create alert functionality - to be implemented');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Alert Management"
      pageSubtitle="View and manage disaster alerts and notices"
      userRole="Civilian Portal"
      userName="sgb"
    >
      <div style={{ padding: '24px' }}>
        {/* Header with Create Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
            Alert Management
          </h2>
          <button
            onClick={handleCreateAlert}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Plus size={18} />
            Create Alert
          </button>
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <AlertTriangle 
                    size={24} 
                    style={{ 
                      color: alert.severity === 'critical' ? '#ef4444' : '#fb923c',
                      flexShrink: 0
                    }} 
                  />
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#fff'
                  }}>
                    {alert.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: alert.severity === 'critical' 
                      ? 'rgba(239, 68, 68, 0.2)' 
                      : 'rgba(251, 146, 60, 0.2)',
                    color: alert.severity === 'critical' ? '#ef4444' : '#fb923c'
                  }}>
                    {alert.severity}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981'
                  }}>
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '14px',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                {alert.description}
              </p>

              {/* Details */}
              <div style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '16px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    Type:
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginLeft: '8px'
                  }}>
                    {alert.type}
                  </span>
                </div>
                <div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    Location:
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginLeft: '8px'
                  }}>
                    {alert.location}
                  </span>
                </div>
                <div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    By:
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginLeft: '8px'
                  }}>
                    {alert.issuedBy}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleResolve(alert.id)}
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
                Resolve
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AlertsNotices;
