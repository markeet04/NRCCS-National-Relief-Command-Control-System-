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
            border: selectedDistrict === district.id ? `2px solid ${colors.primary}` : '1px solid #E5E7EB',
            borderRadius: '8px',
            backgroundColor: selectedDistrict === district.id ? '#F0F9FF' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedDistrict === district.id ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (selectedDistrict !== district.id) {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.backgroundColor = '#F9FAFB';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedDistrict !== district.id) {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
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
              color: '#1F2937'
            }}>
              {district.name}
            </h3>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: district.status === 'active' ? '#DBEAFE' : '#FEE2E2',
              color: district.status === 'active' ? '#1E40AF' : '#991B1B'
            }}>
              {district.status}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <Users size={16} color={colors.info} />
              <span style={{ color: '#6B7280' }}>
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
              <span style={{ color: '#6B7280' }}>
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
              <span style={{ color: '#6B7280' }}>
                {district.sosCount} SOS
              </span>
            </div>

            <div style={{
              fontSize: '14px',
              color: '#6B7280'
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
