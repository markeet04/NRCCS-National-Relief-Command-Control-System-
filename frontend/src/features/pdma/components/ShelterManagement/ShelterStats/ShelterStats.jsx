import { Building, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const ShelterStats = ({ totalShelters = 0, totalCapacity = 0, currentOccupancy = 0, avgOccupancyPercent = 0, colors }) => {
  // Ensure values are numbers and not NaN
  const safeTotal = Number(totalShelters) || 0;
  const safeCapacity = Number(totalCapacity) || 0;
  const safeOccupancy = Number(currentOccupancy) || 0;
  const safePercent = Number(avgOccupancyPercent) || 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        padding: '16px',
        backgroundColor: colors.cardBg,
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.primary}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <label style={{
            fontSize: '12px',
            color: colors.textMuted,
            fontWeight: '600',
            margin: 0
          }}>
            TOTAL SHELTERS
          </label>
          <Building size={18} color={colors.primary} />
        </div>
        <p style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: 0,
          color: colors.textPrimary
        }}>
          {safeTotal}
        </p>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: colors.cardBg,
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.success}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <label style={{
            fontSize: '12px',
            color: colors.textMuted,
            fontWeight: '600',
            margin: 0
          }}>
            TOTAL CAPACITY
          </label>
          <Users size={18} color={colors.success} />
        </div>
        <p style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: 0,
          color: colors.textPrimary
        }}>
          {safeCapacity.toLocaleString()}
        </p>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: colors.cardBg,
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.warning}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <label style={{
            fontSize: '12px',
            color: colors.textMuted,
            fontWeight: '600',
            margin: 0
          }}>
            CURRENT OCCUPANCY
          </label>
          <TrendingUp size={18} color={colors.warning} />
        </div>
        <p style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: 0,
          color: colors.textPrimary
        }}>
          {safeOccupancy.toLocaleString()}
        </p>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: colors.cardBg,
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.danger}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <label style={{
            fontSize: '12px',
            color: colors.textMuted,
            fontWeight: '600',
            margin: 0
          }}>
            AVG OCCUPANCY %
          </label>
          <AlertTriangle size={18} color={colors.danger} />
        </div>
        <p style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: 0,
          color: colors.textPrimary
        }}>
          {safePercent}%
        </p>
      </div>
    </div>
  );
};

export default ShelterStats;
