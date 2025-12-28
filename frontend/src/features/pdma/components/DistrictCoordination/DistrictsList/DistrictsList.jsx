import { Users, AlertTriangle, Activity } from 'lucide-react';

const DistrictsList = ({ districts, selectedDistrict, onSelectDistrict, colors }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>
      {districts.map((district, index) => {
        // Rotating colors like stats cards: blue, green, amber, red
        const borderColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
        const glowColors = [
          'rgba(59, 130, 246, 0.15)',
          'rgba(34, 197, 94, 0.15)',
          'rgba(245, 158, 11, 0.15)',
          'rgba(239, 68, 68, 0.15)'
        ];
        const borderColor = borderColors[index % borderColors.length];
        const glowColor = glowColors[index % glowColors.length];

        return (
          <div
            key={district.id}
            onClick={() => onSelectDistrict(district.id)}
            style={{
              padding: '16px',
              border: `1px solid ${colors.border}`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '12px',
              backgroundColor: colors.cardBg,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${glowColor}, 0 2px 8px rgba(0, 0, 0, 0.2)`,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '140px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${glowColor}, 0 4px 12px rgba(0, 0, 0, 0.3)`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 20px ${glowColor}, 0 2px 8px rgba(0, 0, 0, 0.2)`;
              e.currentTarget.style.transform = 'translateY(0)';
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
        );
      })}
    </div>
  );
};

export default DistrictsList;
