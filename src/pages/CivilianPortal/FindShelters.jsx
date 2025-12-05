import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { MapPin, Phone, Plus } from 'lucide-react';

const FindShelters = () => {
  const [activeRoute, setActiveRoute] = useState('shelters');
  
  const menuItems = [
    { route: 'home', label: 'Home', icon: 'dashboard' },
    { route: 'sos', label: 'Emergency SOS', icon: 'alerts' },
    { route: 'shelters', label: 'Find Shelters', icon: 'map' },
    { route: 'missing', label: 'Missing Persons', icon: 'users' },
    { route: 'alerts', label: 'Alerts & Notices', icon: 'alerts' }
  ];

  const [shelters] = useState([
    {
      id: 1,
      name: 'Government School Shelter',
      location: 'Main Road, Sukkur',
      phone: '+92-300-111111',
      capacity: 320,
      maxCapacity: 500,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical', 'Sanitation']
    },
    {
      id: 2,
      name: 'Community Center Shelter',
      location: 'Civil Lines, Hyderabad',
      phone: '+92-300-2222222',
      capacity: 280,
      maxCapacity: 300,
      status: 'operational',
      amenities: ['Food', 'Water', 'Medical']
    }
  ]);

  const handleRegisterShelter = () => {
    alert('Register new shelter functionality - to be implemented');
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Shelter Registry"
      pageSubtitle="Find and register emergency shelters"
      userRole="Civilian Portal"
      userName="sgb"
    >
      <div style={{ padding: '24px' }}>
        {/* Header with Register Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
            Shelter Registry
          </h2>
          <button
            onClick={handleRegisterShelter}
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

        {/* Shelters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
          gap: '20px'
        }}>
          {shelters.map((shelter) => {
            const percentage = (shelter.capacity / shelter.maxCapacity) * 100;
            return (
              <div
                key={shelter.id}
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
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#fff',
                      marginBottom: '8px'
                    }}>
                      {shelter.name}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '13px',
                      marginBottom: '4px'
                    }}>
                      <MapPin size={14} />
                      {shelter.location}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981'
                  }}>
                    {shelter.status}
                  </span>
                </div>

                {/* Capacity */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Capacity
                    </span>
                    <span style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>
                      {shelter.capacity} / {shelter.maxCapacity}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
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

                {/* Phone */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <Phone size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                    {shelter.phone}
                  </span>
                </div>

                {/* Amenities */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {shelter.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindShelters;
