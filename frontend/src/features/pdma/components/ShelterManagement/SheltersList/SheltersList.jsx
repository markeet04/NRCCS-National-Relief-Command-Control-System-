import { Building, AlertTriangle, MapPin } from 'lucide-react';

const SheltersList = ({ shelters, colors, onSelectShelter, selectedShelter }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>
      {shelters.map((shelter) => (
        <div
          key={shelter.id}
          style={{
            padding: '16px',
            border: selectedShelter === shelter.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: selectedShelter === shelter.id ? colors.bgSecondary : colors.cardBg,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedShelter === shelter.id ? `0 4px 12px rgba(59, 130, 246, 0.1)` : 'none'
          }}
          onMouseEnter={(e) => {
            if (selectedShelter !== shelter.id) {
              e.currentTarget.style.borderColor = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedShelter !== shelter.id) {
              e.currentTarget.style.borderColor = colors.border;
            }
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Building size={20} color={colors.info} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: colors.textPrimary
              }}>
                {shelter.name}
              </h3>
            </div>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: shelter.status === 'operational' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: shelter.status === 'operational' ? '#10b981' : '#ef4444'
            }}>
              {shelter.status}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            fontSize: '14px',
            color: colors.textSecondary
          }}>
            <MapPin size={16} color={colors.secondary} />
            {shelter.location}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${colors.border}`
          }}>
            <div>
              <label style={{
                fontSize: '11px',
                color: colors.textMuted,
                fontWeight: '600',
                display: 'block',
                marginBottom: '4px'
              }}>
                CAPACITY
              </label>
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                margin: 0,
                color: colors.textPrimary
              }}>
                {shelter.currentOccupancy || 0}/{shelter.capacity || 0}
              </p>
            </div>

            <div>
              <label style={{
                fontSize: '11px',
                color: colors.textMuted,
                fontWeight: '600',
                display: 'block',
                marginBottom: '4px'
              }}>
                OCCUPANCY %
              </label>
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                margin: 0,
                color: colors.textPrimary
              }}>
                {shelter.capacity > 0 ? Math.round((shelter.currentOccupancy / shelter.capacity) * 100) : 0}%
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}>
            <AlertTriangle size={16} color={shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) >= 100 ? colors.danger : shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) > 80 ? colors.warning : colors.success} />
            <span style={{ color: colors.textSecondary }}>
              {shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) >= 100 ? 'Fully occupied' : shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) > 80 ? 'Near capacity' : 'Space available'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SheltersList;
