import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Search, User, MapPin, Phone, Plus } from 'lucide-react';

const MissingPersons = () => {
  const [activeRoute, setActiveRoute] = useState('missing');
  const [searchQuery, setSearchQuery] = useState('');
  
  const menuItems = [
    { route: 'home', label: 'Home', icon: 'dashboard' },
    { route: 'sos', label: 'Emergency SOS', icon: 'alerts' },
    { route: 'shelters', label: 'Find Shelters', icon: 'map' },
    { route: 'missing', label: 'Missing Persons', icon: 'users' },
    { route: 'alerts', label: 'Alerts & Notices', icon: 'alerts' }
  ];

  const [missingPersons] = useState([
    {
      id: 1,
      name: 'Muhammad Ali',
      age: 45,
      lastSeen: 'Village Kot Diji, Khairpur',
      date: '2024-03-15',
      contact: '+92-300-1234567',
      status: 'missing'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      age: 28,
      lastSeen: 'Main Bazaar, Sukkur',
      date: '2024-03-14',
      contact: '+92-301-9876543',
      status: 'missing'
    }
  ]);

  const filteredPersons = missingPersons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.lastSeen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReportMissing = () => {
    alert('Report missing person functionality - to be implemented');
  };

  const handleMarkAsFound = (id) => {
    alert(`Marking person ${id} as found...`);
  };

  const handleViewDetails = (id) => {
    alert(`Viewing details for person ${id}...`);
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Missing Persons"
      pageSubtitle="Report and search for missing persons"
      userRole="Civilian Portal"
      userName="sgb"
    >
      <div style={{ padding: '24px' }}>
        {/* Header with Report Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
            Missing Persons
          </h2>
          <button
            onClick={handleReportMissing}
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
            Report Missing Person
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px'
        }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.4)'
              }}
            />
            <input
              type="text"
              placeholder="Search by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Missing Persons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredPersons.map((person) => (
            <div
              key={person.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Avatar */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={40} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        color: '#fff',
                        marginBottom: '4px'
                      }}>
                        {person.name}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        Age: {person.age}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444'
                    }}>
                      {person.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Last seen:
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                          {person.lastSeen}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Contact:
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                          {person.contact}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Date:
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                          {person.date}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleViewDetails(person.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleMarkAsFound(person.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      Mark as Found
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MissingPersons;
