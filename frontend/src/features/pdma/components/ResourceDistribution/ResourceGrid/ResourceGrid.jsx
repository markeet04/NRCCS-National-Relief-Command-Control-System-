import { MapPin } from 'lucide-react';
import { RESOURCE_STATUS_COLORS } from '../../../constants';

const ResourceGrid = ({ resources, isLight, colors, onAllocate }) => {
  return (
    <div className="pdma-section">
      <div className="pdma-resources-grid">
        {resources.map((resource) => {
          const statusColor = RESOURCE_STATUS_COLORS[resource.status];
          const usagePercentage = (resource.allocated / resource.quantity) * 100;

          return (
            <div
              key={resource.id}
              className="pdma-resource-card"
              style={{
                background: colors.cardBg,
                borderColor: colors.border
              }}
            >
              <div className="pdma-resource-header">
                <div className="pdma-resource-title-group">
                  <div
                    className="pdma-resource-icon"
                    style={{ background: statusColor.light }}
                  >
                    <resource.icon size={16} style={{ color: statusColor.bg }} />
                  </div>
                  <div>
                    <h3 className="pdma-resource-name" style={{ color: colors.textPrimary }}>
                      {resource.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {resource.unit}
                    </p>
                  </div>
                </div>
                <span className="pdma-badge" style={{ background: statusColor.light, color: statusColor.bg }}>
                  {resource.status}
                </span>
              </div>

              <div style={{ marginBottom: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: colors.textSecondary }}>Usage</span>
                  <span style={{ color: colors.textPrimary }}>{resource.allocated}/{resource.quantity}</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      width: `${usagePercentage}%`,
                      height: '100%',
                      background: statusColor.bg,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div
                className="pdma-resource-info"
                style={{
                  borderTopColor: colors.border,
                  borderBottomColor: colors.border,
                  color: colors.textSecondary
                }}
              >
                <div className="pdma-resource-info-row">
                  <span className="pdma-resource-label">
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Location:
                  </span>
                  <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                    {resource.location}
                  </span>
                </div>
                <div className="pdma-resource-info-row">
                  <span className="pdma-resource-label">Updated:</span>
                  <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                    {resource.lastUpdated}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onAllocate(resource)}
                className="pdma-button pdma-button-small"
                style={{
                  width: '100%',
                  marginTop: '12px',
                  background: `${statusColor.bg}15`,
                  color: statusColor.bg,
                  border: `1px solid ${statusColor.light}`
                }}
              >
                Allocate
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceGrid;
