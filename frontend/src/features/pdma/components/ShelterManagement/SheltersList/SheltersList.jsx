import { Building, AlertTriangle, MapPin } from 'lucide-react';

const SheltersList = ({ shelters, colors, onSelectShelter, selectedShelter }) => {
  return (
    <div
      className="shelter-cards-grid"
      style={{
        marginBottom: '1.25rem'
      }}>
      {shelters.map((shelter, index) => {
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
            key={shelter.id}
            className="shelter-card"
            style={{
              padding: '1rem',
              border: `1px solid ${colors.border}`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '0.75rem',
              backgroundColor: colors.cardBg,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${glowColor}, 0 2px 8px rgba(0, 0, 0, 0.2)`,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: '160px',
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
              marginTop: 'auto',
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
              fontSize: '13px',
            }}>
              <AlertTriangle size={16} color={shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) >= 100 ? colors.danger : shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) > 80 ? colors.warning : colors.success} />
              <span style={{ color: colors.textSecondary }}>
                {shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) >= 100 ? 'Fully occupied' : shelter.capacity > 0 && Math.round((shelter.currentOccupancy / shelter.capacity) * 100) > 80 ? 'Near capacity' : 'Space available'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SheltersList;
