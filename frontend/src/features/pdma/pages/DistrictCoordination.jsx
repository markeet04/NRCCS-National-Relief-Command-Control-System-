import { useState, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { MapPin, Users, Phone, MessageSquare, Clock, AlertTriangle, Plus, Send, Search } from 'lucide-react';
import '../styles/pdma.css';

const DistrictCoordination = () => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  const [activeRoute, setActiveRoute] = useState('districts');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get role configuration and menu items from shared config
  const roleConfig = ROLE_CONFIG.pdma;
  const menuItems = useMemo(() => getMenuItemsByRole('pdma'), []);

  const districts = [
    {
      id: 1,
      name: 'Karachi',
      officers: ['Muhammad Ali (DC)', 'Fatima Khan (DDO)'],
      contactPhone: '+92-300-1111111',
      email: 'karachi@pdma.pk',
      status: 'critical',
      activeTeams: 8,
      sosRequests: 12,
      lastUpdate: '2 mins ago'
    },
    {
      id: 2,
      name: 'Sukkur',
      officers: ['Ahmed Hassan (DC)', 'Saira Malik (DDO)'],
      contactPhone: '+92-300-2222222',
      email: 'sukkur@pdma.pk',
      status: 'high',
      activeTeams: 5,
      sosRequests: 8,
      lastUpdate: '5 mins ago'
    },
    {
      id: 3,
      name: 'Hyderabad',
      officers: ['Hassan Raza (DC)', 'Aisha Khan (DDO)'],
      contactPhone: '+92-300-3333333',
      email: 'hyderabad@pdma.pk',
      status: 'medium',
      activeTeams: 3,
      sosRequests: 3,
      lastUpdate: '10 mins ago'
    },
    {
      id: 4,
      name: 'Larkana',
      officers: ['Khalid Ahmed (DC)', 'Sara Hassan (DDO)'],
      contactPhone: '+92-300-4444444',
      email: 'larkana@pdma.pk',
      status: 'stable',
      activeTeams: 1,
      sosRequests: 0,
      lastUpdate: '15 mins ago'
    },
    {
      id: 5,
      name: 'Mirpur Khas',
      officers: ['Ali Nawaz (DC)', 'Hira Khan (DDO)'],
      contactPhone: '+92-300-5555555',
      email: 'mipur@pdma.pk',
      status: 'medium',
      activeTeams: 2,
      sosRequests: 2,
      lastUpdate: '8 mins ago'
    },
    {
      id: 6,
      name: 'Nawabshah',
      officers: ['Hassan Ali (DC)', 'Samina Khan (DDO)'],
      contactPhone: '+92-300-6666666',
      email: 'nawabshah@pdma.pk',
      status: 'high',
      activeTeams: 4,
      sosRequests: 6,
      lastUpdate: '3 mins ago'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
      high: { bg: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
      medium: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
      stable: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
    };
    return statusColors[status] || statusColors.stable;
  };

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="District Coordination"
      pageSubtitle="Coordinate with district authorities and oversee operations"
      pageIcon={MapPin}
      pageIconColor="#f59e0b"
      userRole="PDMA"
      userName="fz"
    >
      <div className="pdma-container" style={{ background: colors.bgPrimary, color: colors.textPrimary }}>
        {/* Search Bar */}
        <div
          className="pdma-search-box"
          style={{
            background: colors.cardBg,
            borderColor: colors.border,
            color: colors.textPrimary,
            marginBottom: '24px'
          }}
        >
          <Search size={16} style={{ color: colors.textSecondary }} />
          <input
            type="text"
            placeholder="Search districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              color: colors.textPrimary
            }}
          />
        </div>

        {/* Districts Grid */}
        <div className="pdma-main-grid">
          {filteredDistricts.map((district) => {
            const statusColor = getStatusColor(district.status);
            const isSelected = selectedDistrict?.id === district.id;

            return (
              <div
                key={district.id}
                onClick={() => setSelectedDistrict(district)}
                className="pdma-card"
                style={{
                  background: colors.cardBg,
                  borderColor: isSelected ? statusColor.bg : colors.border,
                  borderWidth: isSelected ? '2px' : '1px',
                  boxShadow: isSelected ? `0 0 16px ${statusColor.light}` : 'none',
                  cursor: 'pointer'
                }}
              >
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary }}>
                        {district.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px', color: colors.textSecondary }}>
                        <Clock size={10} />
                        {district.lastUpdate}
                      </div>
                    </div>
                    <span
                      className="pdma-badge"
                      style={{
                        background: statusColor.light,
                        color: statusColor.bg
                      }}
                    >
                      {district.status}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    padding: '12px 20px',
                    borderBottom: `1px solid ${colors.border}`,
                    fontSize: '14px'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Active Teams</p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: statusColor.bg }}>
                      {district.activeTeams}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>SOS Requests</p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: statusColor.bg }}>
                      {district.sosRequests}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '16px 20px' }}>
                  {/* Officers */}
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary }}>
                      Officers
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {district.officers.map((officer, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.textPrimary }}>
                          <Users size={12} style={{ color: colors.textMuted, flexShrink: 0 }} />
                          <span>{officer}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${colors.border}`, marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: colors.textSecondary }}>
                      Contact Information
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.textPrimary }}>
                        <Phone size={12} style={{ color: colors.textMuted, flexShrink: 0 }} />
                        <span>{district.contactPhone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.textPrimary }}>
                        <MessageSquare size={12} style={{ color: colors.textMuted, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{district.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="pdma-button pdma-button-small"
                      style={{
                        flex: 1,
                        background: `${statusColor.bg}20`,
                        color: statusColor.bg,
                        border: `1px solid ${statusColor.light}`
                      }}
                    >
                      <Send size={12} />
                      Message
                    </button>
                    <button
                      className="pdma-button pdma-button-small"
                      style={{
                        flex: 1,
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredDistricts.length === 0 && (
          <div
            className="pdma-card"
            style={{
              background: colors.cardBg,
              borderColor: colors.border,
              textAlign: 'center',
              padding: '40px 20px'
            }}
          >
            <Search size={32} style={{ color: colors.textMuted, margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '14px', color: colors.textPrimary }}>
              No districts found
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DistrictCoordination;
