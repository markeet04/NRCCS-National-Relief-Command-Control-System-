import { Phone, Mail, MapPin, Clock, Users, AlertTriangle, Zap } from 'lucide-react';

const DetailPanel = ({ selectedDistrictData, colors, onAssignTeam, onUpdateStatus }) => {
  if (!selectedDistrictData) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#9CA3AF'
      }}>
        <Users size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
        <p style={{ fontSize: '16px', margin: 0 }}>
          Select a district to view details
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
            color: '#1F2937'
          }}>
            {selectedDistrictData.name}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '4px 0 0 0'
          }}>
            District Coordinator Details
          </p>
        </div>
        <span style={{
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: selectedDistrictData.status === 'active' ? '#DBEAFE' : '#FEE2E2',
          color: selectedDistrictData.status === 'active' ? '#1E40AF' : '#991B1B'
        }}>
          {selectedDistrictData.status.toUpperCase()}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} color={colors.info} />
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>TEAM SIZE</label>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#1F2937' }}>
            {selectedDistrictData.teamSize}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={16} color={colors.warning} />
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>ALERTS</label>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#1F2937' }}>
            {selectedDistrictData.alerts}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} color={colors.danger} />
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>SOS REQUESTS</label>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#1F2937' }}>
            {selectedDistrictData.sosCount}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} color={colors.secondary} />
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>LAST UPDATE</label>
          </div>
          <p style={{ fontSize: '14px', margin: 0, color: '#6B7280' }}>
            {selectedDistrictData.lastUpdate}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div>
          <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
            CONTACT
          </label>
          <p style={{ fontSize: '14px', margin: 0, color: '#1F2937' }}>
            {selectedDistrictData.contact}
          </p>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
            EMAIL
          </label>
          <p style={{ fontSize: '14px', margin: 0, color: '#1F2937' }}>
            {selectedDistrictData.email}
          </p>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
            LOCATION
          </label>
          <p style={{ fontSize: '14px', margin: 0, color: '#1F2937' }}>
            {selectedDistrictData.location}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}>
        <button
          onClick={() => onAssignTeam(selectedDistrictData.id)}
          style={{
            padding: '10px 16px',
            backgroundColor: colors.primary,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primaryDark || '#1E40AF';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Assign Team
        </button>
        <button
          onClick={() => onUpdateStatus(selectedDistrictData.id)}
          style={{
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: colors.primary,
            border: `1px solid ${colors.primary}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primaryLight || '#F0F9FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default DetailPanel;
