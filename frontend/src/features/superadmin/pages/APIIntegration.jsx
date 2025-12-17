import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Plus, Cloud } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import SuperAdminService from '../services';
import { useNotification } from '@shared/hooks';

const APIIntegration = () => {
  const [activeRoute, setActiveRoute] = useState('api');
  const [showModal, setShowModal] = useState(false);
  const [newApi, setNewApi] = useState({ name: '', baseUrl: '', apiKey: '', description: '', isActive: true });
  const [deleteApiId, setDeleteApiId] = useState(null);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useSettings();
  const { showSuccess, showError } = useNotification();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  useEffect(() => {
    fetchApiIntegrations();
  }, []);

  const fetchApiIntegrations = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminService.getAllApiIntegrations();
      setIntegrations(data);
    } catch (error) {
      showError(error.message || 'Failed to fetch API integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApi = async (id) => {
    if (confirm('Are you sure you want to delete this API integration?')) {
      try {
        setLoading(true);
        await SuperAdminService.deleteApiIntegration(id);
        showSuccess('API integration deleted successfully');
        await fetchApiIntegrations();
      } catch (error) {
        showError(error.response?.data?.message || error.message || 'Failed to delete API integration');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddIntegration = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewApi({ name: '', baseUrl: '', apiKey: '', description: '', isActive: true });
  };

  const handleModalSave = async () => {
    if (newApi.name && newApi.baseUrl && newApi.apiKey) {
      try {
        setLoading(true);
        await SuperAdminService.createApiIntegration(newApi);
        showSuccess('API integration added successfully');
        await fetchApiIntegrations();
        handleModalClose();
      } catch (error) {
        showError(error.response?.data?.message || error.message || 'Failed to add API integration');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTestConnection = async (id, name) => {
    try {
      setLoading(true);
      await SuperAdminService.testApiIntegration(id);
      showSuccess(`Connection to ${name} is working!`);
    } catch (error) {
      showError(error.response?.data?.message || error.message || `Failed to connect to ${name}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateKey = async (id, name) => {
    if (confirm(`Are you sure you want to regenerate the API key for ${name}?`)) {
      showError('This feature is not yet implemented in the backend');
    }
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
        {/* Add Integration Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30, 41, 59, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#23293a',
              borderRadius: '20px',
              padding: '32px 32px 24px 32px',
              minWidth: '400px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              border: `1px solid ${colors.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
              alignItems: 'stretch',
              maxWidth: '95vw'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', color: colors.textPrimary, marginBottom: '18px', textAlign: 'center' }}>Add New API</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '6px', display: 'block' }}>Name</label>
                  <input
                    type="text"
                    value={newApi.name}
                    onChange={e => setNewApi({ ...newApi, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.textPrimary, fontSize: '15px', marginBottom: '2px' }}
                    placeholder="Enter name"
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '6px', display: 'block' }}>URL</label>
                  <input
                    type="text"
                    value={newApi.url}
                    onChange={e => setNewApi({ ...newApi, url: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.textPrimary, fontSize: '15px', marginBottom: '2px' }}
                    placeholder="Enter URL"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '6px', display: 'block' }}>API Key</label>
                  <input
                    type="text"
                    value={newApi.apiKey}
                    onChange={e => setNewApi({ ...newApi, apiKey: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.textPrimary, fontSize: '15px', marginBottom: '2px' }}
                    placeholder="Enter API Key"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center' }}>
                <button onClick={handleModalClose} style={{ flex: 1, padding: '12px 0', background: '#3a4256', color: '#cfd8e3', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}>Cancel</button>
                <button onClick={handleModalSave} style={{ flex: 1, padding: '12px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}>Add</button>
              </div>
            </div>
          </div>
        )}
        {/* Header with Add Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary }}>
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
                background: colors.cardBg,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${colors.border}`
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
                      color: colors.textPrimary,
                      marginBottom: '2px'
                    }}>
                      {integration.name}
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: colors.primary
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
                  color: colors.textSecondary,
                  marginBottom: '6px'
                }}>
                  API Key
                </label>
                <div style={{
                  padding: '10px 12px',
                  background: colors.inputBg,
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: colors.textPrimary
                }}>
                  {integration.apiKey}
                </div>
              </div>

              {/* Last Tested */}
              <div style={{ 
                fontSize: '13px', 
                color: colors.textSecondary,
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
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Regenerate Key
                </button>
                  <button
                    onClick={() => setDeleteApiId(integration.id)}
                    style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    Delete
                  </button>
              </div>
                    {/* Delete Confirmation Modal */}
                    {deleteApiId !== null && (
                      <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(30, 41, 59, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                      }}>
                        <div style={{
                          background: colors.cardBg,
                          borderRadius: '16px',
                          padding: '32px',
                          minWidth: '350px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                          border: `1px solid ${colors.border}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '18px',
                          position: 'relative'
                        }}>
                          <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>Confirm Deletion</h3>
                          <p style={{ fontSize: '15px', color: colors.textSecondary }}>Are you sure you want to delete this API integration? This action cannot be undone.</p>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteApiId(null)} style={{ padding: '8px 18px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                            <button onClick={() => handleDeleteApi(deleteApiId)} style={{ padding: '8px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default APIIntegration;
