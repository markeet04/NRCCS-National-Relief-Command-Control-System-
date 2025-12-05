import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Plus, Package, Droplet, Heart } from 'lucide-react';

const ResourceDistribution = () => {
  const [activeRoute, setActiveRoute] = useState('resources');
  
  const menuItems = [
    { route: 'dashboard', label: 'Provincial Dashboard', icon: 'dashboard' },
    { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
    { route: 'shelters', label: 'Shelter Management', icon: 'map' },
    { route: 'districts', label: 'District Coordination', icon: 'alerts' },
    { route: 'map', label: 'Provincial Map', icon: 'map' },
  ];

  const [resources] = useState([
    {
      id: 1,
      name: 'food',
      icon: Package,
      status: 'available',
      quantity: '',
      location: '',
      province: ''
    },
    {
      id: 2,
      name: 'water',
      icon: Droplet,
      status: 'available',
      quantity: '',
      location: '',
      province: ''
    },
    {
      id: 3,
      name: 'medical',
      icon: Heart,
      status: 'allocated',
      quantity: '',
      location: '',
      province: ''
    }
  ]);

  const handleAddResource = () => {
    alert('Add resource functionality - to be implemented');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Resource Inventory"
      pageSubtitle="Manage provincial resource distribution"
      userRole="PDMA"
      userName="fz"
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
            Resource Inventory
          </h2>
          <button
            onClick={handleAddResource}
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
            Add Resource
          </button>
        </div>

        {/* Resource Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {resources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <div
                key={resource.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: resource.status === 'available' 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(107, 114, 128, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent 
                        size={24} 
                        style={{ 
                          color: resource.status === 'available' ? '#10b981' : '#6b7280' 
                        }} 
                      />
                    </div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#111',
                      textTransform: 'capitalize'
                    }}>
                      {resource.name}
                    </h3>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: resource.status === 'available' 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'rgba(107, 114, 128, 0.1)',
                    color: resource.status === 'available' ? '#10b981' : '#6b7280'
                  }}>
                    {resource.status}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    Quantity:
                  </div>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    Location:
                  </div>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    Province:
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shelter Registry Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>
              Shelter Registry
            </h2>
            <button
              onClick={() => alert('Register shelter - to be implemented')}
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
              Register Shelter
            </button>
          </div>

          {/* Shelter cards will be displayed here */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
            gap: '20px'
          }}>
            {/* Shelter cards will go here */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResourceDistribution;
