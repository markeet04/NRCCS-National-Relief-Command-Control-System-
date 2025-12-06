import { useState } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { Search, User, MapPin, Phone, Plus } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

const MissingPersons = () => {
  const [activeRoute, setActiveRoute] = useState('missing');
  const [searchQuery, setSearchQuery] = useState('');
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
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: colors.textPrimary }}>
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
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`,
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
                color: colors.textMuted
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
                background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                color: colors.textPrimary,
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
                background: colors.cardBg,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${colors.border}`
              }}
            >
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Avatar */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={40} style={{ color: colors.textMuted }} />
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
                        color: colors.textPrimary,
                        marginBottom: '4px'
                      }}>
                        {person.name}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: colors.textMuted
                      }}>
                        Age: {person.age}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)',
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
                      <MapPin size={16} style={{ color: colors.textMuted }} />
                      <div>
                        <div style={{ fontSize: '12px', color: colors.textMuted }}>
                          Last seen:
                        </div>
                        <div style={{ fontSize: '14px', color: colors.textPrimary }}>
                          {person.lastSeen}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} style={{ color: colors.textMuted }} />
                      <div>
                        <div style={{ fontSize: '12px', color: colors.textMuted }}>
                          Contact:
                        </div>
                        <div style={{ fontSize: '14px', color: colors.textPrimary }}>
                          {person.contact}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.textMuted }}>
                          Date:
                        </div>
                        <div style={{ fontSize: '14px', color: colors.textPrimary }}>
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
                        background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                        color: colors.textPrimary,
                        border: `1px solid ${colors.border}`,
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
