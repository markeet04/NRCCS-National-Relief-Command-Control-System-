import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { Plus, Cloud } from 'lucide-react';

const APIIntegration = () => {
  const [activeRoute, setActiveRoute] = useState('api');
  
  const menuItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'users', label: 'User Management', icon: 'users' },
    { route: 'provinces', label: 'Provinces & Districts', icon: 'provinces' },
    { route: 'settings', label: 'System Settings', icon: 'settings' },
    { route: 'api', label: 'API Integration', icon: 'api' }
  ];

  const [integrations] = useState([
    {
      id: 1,
      name: 'Weather API',
      url: 'https://api.weather.gov.pk',
      apiKey: 'wea_***************',
      status: 'active',
      lastTested: '2 hours ago'
    },
    {
      id: 2,
      name: 'SMS Gateway',
      url: 'https://sms.gateway.pk',
      apiKey: 'sms_***************',
      status: 'active',
      lastTested: '2 hours ago'
    },
    {
      id: 3,
      name: 'Mapping Service',
      url: 'https://maps.service.pk',
      apiKey: 'map_***************',
      status: 'inactive',
      lastTested: '5 days ago'
    }
  ]);

  const handleAddIntegration = () => {
    alert('Add Integration functionality - to be implemented');
  };

  const handleTestConnection = (name) => {
    alert(`Testing connection to ${name}...`);
  };

  const handleRegenerateKey = (name) => {
    alert(`Regenerating API key for ${name}...`);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="API Integration"
      pageSubtitle="Manage external API connections and services"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        {/* Header with Add Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
            API Integration
          </h2>
          <button
            onClick={handleAddIntegration}
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
            Add Integration
          </button>
        </div>

        {/* Integration Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
          gap: '20px'
        }}>
          {integrations.map((integration) => (
            <div
              key={integration.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Integration Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: integration.status === 'active' 
                      ? 'rgba(16, 185, 129, 0.2)' 
                      : 'rgba(107, 114, 128, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: integration.status === 'active' ? '#10b981' : '#6b7280'
                  }}>
                    <Cloud size={20} />
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#fff',
                      marginBottom: '2px'
                    }}>
                      {integration.name}
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'rgba(147, 147, 255, 0.8)'
                    }}>
                      {integration.url}
                    </p>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: integration.status === 'active' 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(107, 114, 128, 0.2)',
                  color: integration.status === 'active' ? '#10b981' : '#6b7280'
                }}>
                  {integration.status}
                </span>
              </div>

              {/* API Key */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '6px'
                }}>
                  API Key
                </label>
                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {integration.apiKey}
                </div>
              </div>

              {/* Last Tested */}
              <div style={{ 
                fontSize: '13px', 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '16px'
              }}>
                Last tested: {integration.lastTested}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleTestConnection(integration.name)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Test Connection
                </button>
                <button
                  onClick={() => handleRegenerateKey(integration.name)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Regenerate Key
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default APIIntegration;
