import { Users, AlertTriangle, Activity } from 'lucide-react';

const DistrictsList = ({ districts, selectedDistrict, onSelectDistrict, colors }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>
      {districts.map((district) => (
        <div
          key={district.id}
          onClick={() => onSelectDistrict(district.id)}
          style={{
            padding: '16px',
            border: selectedDistrict === district.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: selectedDistrict === district.id ? colors.bgSecondary : colors.cardBg,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedDistrict === district.id ? `0 4px 12px rgba(59, 130, 246, 0.1)` : 'none',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '140px',
          }}
          onMouseEnter={(e) => {
            if (selectedDistrict !== district.id) {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.backgroundColor = colors.bgSecondary;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedDistrict !== district.id) {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.backgroundColor = colors.cardBg;
            }
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: 0,
              color: colors.textPrimary
            }}>
              {district.name}
            </h3>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: district.status === 'active' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: district.status === 'active' ? '#3b82f6' : '#ef4444'
            }}>
              {district.status}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: 'auto',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <Users size={16} color={colors.info} />
              <span style={{ color: colors.textSecondary }}>
                {district.teamSize} team members
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <AlertTriangle size={16} color={colors.warning} />
              <span style={{ color: colors.textSecondary }}>
                {district.alerts} alerts
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <Activity size={16} color={colors.success} />
              <span style={{ color: colors.textSecondary }}>
                {district.sosCount} SOS
              </span>
            </div>

            <div style={{
              fontSize: '14px',
              color: colors.textMuted
            }}>
              {district.lastUpdate}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistrictsList;
