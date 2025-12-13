import { Activity } from 'lucide-react';
import { MapContainer } from '@shared/components/dashboard';

const FloodMapSection = ({ provinceName, colors, isLight }) => {
  return (
    <div className="pdma-section">
      <div className="pdma-section-title">
        <div
          className="pdma-section-title-icon"
          style={{ background: 'rgba(16, 185, 129, 0.1)' }}
        >
          <Activity size={18} color="#10b981" />
        </div>
        <h2 className="pdma-section-title-text">Flood Risk Map</h2>
      </div>
      <div
        className="pdma-map-container"
        style={{
          background: colors.cardBg,
          borderColor: colors.border,
          borderLeft: !isLight ? '4px solid #10b981' : `1px solid ${colors.border}`
        }}
      >
        <MapContainer
          title={`${provinceName} Flood Risk`}
          onExpand={() => console.log('Expand map')}
        />
      </div>
    </div>
  );
};

export default FloodMapSection;
