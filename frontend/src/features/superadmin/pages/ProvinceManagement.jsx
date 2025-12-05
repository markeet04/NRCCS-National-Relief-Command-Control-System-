import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ProvinceManagement = () => {
  const [activeRoute, setActiveRoute] = useState('provinces');
  
  const menuItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'users', label: 'User Management', icon: 'users' },
    { route: 'provinces', label: 'Provinces & Districts', icon: 'provinces' },
    { route: 'settings', label: 'System Settings', icon: 'settings' },
    { route: 'api', label: 'API Integration', icon: 'api' }
  ];

  const [provinces] = useState([
    {
      id: 1,
      name: 'Punjab',
      districts: ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala']
    },
    {
      id: 2,
      name: 'Sindh',
      districts: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpurkhas']
    },
    {
      id: 3,
      name: 'Khyber Pakhtunkhwa',
      districts: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat']
    },
    {
      id: 4,
      name: 'Balochistan',
      districts: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi']
    },
    {
      id: 5,
      name: 'Gilgit-Baltistan',
      districts: ['Gilgit', 'Skardu', 'Hunza', 'Ghizer', 'Diamer']
    }
  ]);

  const handleAddProvince = () => {
    alert('Add Province functionality - to be implemented');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Province & District Management"
      pageSubtitle="Manage administrative regions and districts"
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
            Province & District Management
          </h2>
          <button
            onClick={handleAddProvince}
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
            Add Province
          </button>
        </div>

        {/* Province Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {provinces.map((province) => (
            <div
              key={province.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Province Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#fff',
                    marginBottom: '4px'
                  }}>
                    {province.name}
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {province.districts.length} districts
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#60a5fa'
                    }}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Districts List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {province.districts.map((district, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px'
                    }}
                  >
                    {district}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProvinceManagement;
