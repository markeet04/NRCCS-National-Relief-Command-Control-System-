import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';

const ProvincialMap = () => {
  const [activeRoute, setActiveRoute] = useState('map');
  
  const menuItems = [
    { route: 'dashboard', label: 'Provincial Dashboard', icon: 'dashboard' },
    { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
    { route: 'shelters', label: 'Shelter Management', icon: 'map' },
    { route: 'districts', label: 'District Coordination', icon: 'alerts' },
    { route: 'map', label: 'Provincial Map', icon: 'map' },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Flood Risk Map - Pakistan"
      pageSubtitle="Real-time flood risk monitoring"
      userRole="PDMA"
      userName="fz"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          Flood Risk Map - Pakistan
        </h2>
        
        {/* Map Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          minHeight: '600px'
        }}>
          {/* Map placeholder - integrate with actual map library */}
          <div style={{
            width: '100%',
            height: '600px',
            background: '#0a0f1a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Pakistan map outline placeholder */}
            <div style={{
              width: '400px',
              height: '500px',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '20px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Location markers */}
              <div style={{
                position: 'absolute',
                top: '100px',
                left: '150px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(107, 114, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid rgba(107, 114, 128, 0.5)'
              }}>
                2
              </div>
              <div style={{
                position: 'absolute',
                top: '200px',
                left: '100px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(107, 114, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid rgba(107, 114, 128, 0.5)'
              }}>
                1
              </div>
              <div style={{
                position: 'absolute',
                top: '150px',
                right: '80px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid #10b981'
              }}>
                3
              </div>
              <div style={{
                position: 'absolute',
                bottom: '120px',
                right: '120px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(107, 114, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid rgba(107, 114, 128, 0.5)'
              }}>
                5
              </div>
              
              <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '14px' }}>
                Map visualization area
              </span>
            </div>
            
            {/* Risk Levels Legend */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
                Risk Levels
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#ef4444'
                  }} />
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    Critical
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#f59e0b'
                  }} />
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    High
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#6b7280'
                  }} />
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    Medium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProvincialMap;
