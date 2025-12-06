import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@shared/components/layout';
import { Phone, Users, AlertTriangle, MapPin } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const CivilianDashboard = () => {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState('home');
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
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
      severity: 'critical',
      date: '3/15/2024, 10:30:00 AM'
    }
  ]);

  const [shelters] = useState([
    {
      id: 1,
      name: 'Government School Shelter',
      location: 'Main Road, Sukkur',
      capacity: 320,
      maxCapacity: 500,
      status: 'operational'
    },
    {
      id: 2,
      name: 'Community Center Shelter',
      location: 'Civil Lines, Hyderabad',
      capacity: 280,
      maxCapacity: 300,
      status: 'operational'
    }
  ]);

  const handleSOSClick = () => {
    navigate('/civilian/sos');
  };

  const handleMissingPersonClick = () => {
    navigate('/civilian/missing');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Civilian Portal"
      pageSubtitle="Emergency assistance and disaster information"
      userRole="Civilian Portal"
      userName="sgb"
    >
      <div style={{ padding: '24px' }}>
        {/* Action Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Emergency SOS Card */}
          <div style={{
            background: isLight ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '32px',
            border: isLight ? '1px solid #fecaca' : '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isLight ? '#fecaca' : 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Phone size={40} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>
              Emergency SOS
            </h3>
            <p style={{ color: colors.textMuted, marginBottom: '24px', fontSize: '14px' }}>
              Request immediate rescue assistance
            </p>
            <button
              onClick={handleSOSClick}
              style={{
                padding: '12px 32px',
                background: isLight ? '#ef4444' : 'rgba(59, 130, 246, 0.2)',
                color: isLight ? '#ffffff' : '#60a5fa',
                border: isLight ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Send SOS Request
            </button>
          </div>

          {/* Missing Person Card */}
          <div style={{
            background: isLight ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '32px',
            border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(59, 130, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isLight ? '#bfdbfe' : 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Users size={40} style={{ color: '#3b82f6' }} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>
              Missing Person
            </h3>
            <p style={{ color: colors.textMuted, marginBottom: '24px', fontSize: '14px' }}>
              Report or search for missing persons
            </p>
            <button
              onClick={handleMissingPersonClick}
              style={{
                padding: '12px 32px',
                background: isLight ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                color: isLight ? '#ffffff' : '#60a5fa',
                border: isLight ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Report Missing Person
            </button>
          </div>
        </div>

        {/* Active Alerts & Notices */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`,
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
            Active Alerts & Notices
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: isLight ? '#fef2f2' : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  padding: '16px',
                  borderLeft: '4px solid #ef4444'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={20} style={{ color: '#ef4444' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary }}>
                      {alert.title}
                    </h3>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444'
                  }}>
                    {alert.severity}
                  </span>
                </div>
                <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                  {alert.description}
                </p>
                <p style={{ color: colors.textMuted, fontSize: '12px' }}>
                  {alert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                  {alert.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Shelters */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
            Nearby Shelters
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {shelters.map((shelter) => {
              const percentage = (shelter.capacity / shelter.maxCapacity) * 100;
              return (
                <div
                  key={shelter.id}
                  style={{
                    background: isLight ? colors.background : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '20px',
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '4px' }}>
                        {shelter.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: colors.textMuted, fontSize: '13px' }}>
                        <MapPin size={14} />
                        {shelter.location}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981'
                    }}>
                      {shelter.status}
                    </span>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: colors.textSecondary }}>Capacity</span>
                      <span style={{ fontSize: '13px', color: colors.textPrimary, fontWeight: '500' }}>
                        {shelter.capacity} / {shelter.maxCapacity}
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: percentage > 90 ? '#ef4444' : '#10b981',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CivilianDashboard;
