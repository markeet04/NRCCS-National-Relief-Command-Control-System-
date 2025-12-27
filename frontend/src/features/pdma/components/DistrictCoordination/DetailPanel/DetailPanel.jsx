import { Phone, Mail, MapPin, Clock, Users, AlertTriangle, Zap, X } from 'lucide-react';

const DetailPanel = ({ selectedDistrictData, colors, onClose }) => {
  if (!selectedDistrictData) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: colors.textMuted
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
      backgroundColor: colors.cardBg,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      position: 'relative'
    }}>
      {/* Close Button */}
      <button
        onClick={() => onClose?.()}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.bgSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <X size={20} color={colors.textSecondary} />
      </button>

      <div style={{
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
            color: colors.textPrimary
          }}>
            {selectedDistrictData.name}
          </h2>
          <p style={{
            fontSize: '14px',
            color: colors.textSecondary,
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
          backgroundColor: selectedDistrictData.status === 'active' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: selectedDistrictData.status === 'active' ? '#3b82f6' : '#ef4444',
          position: 'absolute',
          top: '20px',
          right: '60px'
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
            <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600' }}>TEAM SIZE</label>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: colors.textPrimary }}>
            {selectedDistrictData.teamSize}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={16} color={colors.warning} />
            <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600' }}>ALERTS</label>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: colors.textPrimary }}>
            {selectedDistrictData.alerts}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} color={colors.danger} />
            <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600' }}>SOS REQUESTS</label>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: colors.textPrimary }}>
            {selectedDistrictData.sosCount}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} color={colors.secondary} />
            <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600' }}>LAST UPDATE</label>
          </div>
          <p style={{ fontSize: '14px', margin: 0, color: colors.textSecondary }}>
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
          <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
            CONTACT
          </label>
          <p style={{ fontSize: '14px', margin: 0, color: colors.textPrimary }}>
            {selectedDistrictData.contact}
          </p>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
            EMAIL
          </label>
          <p style={{ fontSize: '14px', margin: 0, color: colors.textPrimary }}>
            {selectedDistrictData.email}
          </p>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
            LOCATION
          </label>
          <p style={{ fontSize: '14px', margin: 0, color: colors.textPrimary }}>
            {selectedDistrictData.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
