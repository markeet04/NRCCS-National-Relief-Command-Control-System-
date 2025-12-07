import { Building, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const ShelterStats = ({ totalShelters, totalCapacity, currentOccupancy, avgOccupancyPercent, colors }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: `1px solid #E5E7EB`,
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
            color: '#6B7280',
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
          color: '#1F2937'
        }}>
          {totalShelters}
        </p>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: `1px solid #E5E7EB`,
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
            color: '#6B7280',
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
          color: '#1F2937'
        }}>
          {totalCapacity.toLocaleString()}
        </p>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: `1px solid #E5E7EB`,
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
            color: '#6B7280',
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
          color: '#1F2937'
        }}>
          {currentOccupancy.toLocaleString()}
        </p>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: `1px solid #E5E7EB`,
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
            color: '#6B7280',
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
          color: '#1F2937'
        }}>
          {avgOccupancyPercent}%
        </p>
      </div>
    </div>
  );
};

export default ShelterStats;
