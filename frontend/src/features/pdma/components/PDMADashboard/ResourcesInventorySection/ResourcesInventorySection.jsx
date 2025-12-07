import { Package, Plus } from 'lucide-react';
import { STATUS_COLORS } from '../../../constants';

const ResourcesInventorySection = ({ resources, colors, onAddResource }) => {
  return (
    <div className="pdma-section">
      <div className="pdma-section-header">
        <div className="pdma-section-header-title">
          <div
            className="pdma-section-title-icon"
            style={{ background: 'rgba(34, 197, 94, 0.1)' }}
          >
            <Package size={18} color="#22c55e" />
          </div>
          <h2 className="pdma-section-title-text">Resources Inventory</h2>
        </div>
        <button 
          onClick={onAddResource}
          className="pdma-button pdma-button-success pdma-button-small"
        >
          <Plus size={14} />
          Add Resource
        </button>
      </div>

      <div className="pdma-resources-grid">
        {resources.map((resource) => {
          const statusColor = STATUS_COLORS[resource.status] || STATUS_COLORS.available;

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
                    style={{ background: statusColor.bg }}
                  >
                    <Package size={16} color={statusColor.text} />
                  </div>
                  <h3 className="pdma-resource-name" style={{ color: colors.textPrimary }}>
                    {resource.name}
                  </h3>
                </div>
                <span className="pdma-badge" style={{ background: statusColor.bg, color: statusColor.text }}>
                  {resource.status}
                </span>
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
                  <span className="pdma-resource-label">Quantity:</span>
                  <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                    {resource.quantity}
                  </span>
                </div>
                <div className="pdma-resource-info-row">
                  <span className="pdma-resource-label">Location:</span>
                  <span className="pdma-resource-value" style={{ color: colors.textPrimary }}>
                    {resource.location}
                  </span>
                </div>
              </div>

              <button
                className="pdma-button pdma-button-outline pdma-button-small"
                style={{
                  width: '100%',
                  marginTop: '12px',
                  color: '#3b82f6',
                  borderColor: 'rgba(59, 130, 246, 0.3)'
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

export default ResourcesInventorySection;
