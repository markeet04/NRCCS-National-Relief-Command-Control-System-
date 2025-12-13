import { Building } from 'lucide-react';

const DistrictStatusSection = ({ districts, colors, isLight }) => {
  return (
    <div
      className="lg:col-span-2"
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderLeft: !isLight ? '4px solid #3b82f6' : `1px solid ${colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <div className="pdma-section-title" style={{ margin: 0 }}>
          <div
            className="pdma-section-title-icon"
            style={{ background: 'rgba(59, 130, 246, 0.1)' }}
          >
            <Building size={18} color="#3b82f6" />
          </div>
          <h2 className="pdma-section-title-text">District Status</h2>
        </div>
      </div>

      <div
        style={{
          padding: '20px',
          flex: 1,
          overflowY: 'auto'
        }}
      >
        {districts.map((district, idx) => (
          <div
            key={idx}
            className="pdma-district-item"
            style={{
              borderBottomColor: colors.border,
              color: colors.textSecondary
            }}
          >
            <div className="pdma-district-header">
              <span className="pdma-district-name" style={{ color: colors.textPrimary }}>
                {district.name}
              </span>
              <span
                className="pdma-badge"
                style={{
                  background: `${district.severity}20`,
                  color: district.severity
                }}
              >
                {district.status}
              </span>
            </div>
            <div className="pdma-district-stats">
              <span>⚠️ {district.alerts}</span>
              <span>📞 {district.sos}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictStatusSection;
