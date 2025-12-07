const ResourceStats = ({ totalResources, totalQuantity, allocatedPercent, availableQuantity, colors }) => {
  return (
    <div className="pdma-stats-grid" style={{ marginBottom: '28px' }}>
      <div
        className="pdma-card"
        style={{
          background: colors.cardBg,
          borderColor: colors.border,
          padding: '16px',
          borderLeft: '4px solid #3b82f6'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Resources</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '6px' }}>
          {totalResources}
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>Types</p>
      </div>

      <div
        className="pdma-card"
        style={{
          background: colors.cardBg,
          borderColor: colors.border,
          padding: '16px',
          borderLeft: '4px solid #10b981'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Total Quantity</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '6px' }}>
          {(totalQuantity / 1000).toFixed(1)}K
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>Units</p>
      </div>

      <div
        className="pdma-card"
        style={{
          background: colors.cardBg,
          borderColor: colors.border,
          padding: '16px',
          borderLeft: '4px solid #f59e0b'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Allocated %</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>
          {allocatedPercent}%
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>Distributed</p>
      </div>

      <div
        className="pdma-card"
        style={{
          background: colors.cardBg,
          borderColor: colors.border,
          padding: '16px',
          borderLeft: '4px solid #ef4444'
        }}
      >
        <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '6px' }}>Available</p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '6px' }}>
          {(availableQuantity / 1000).toFixed(1)}K
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted }}>Units</p>
      </div>
    </div>
  );
};

export default ResourceStats;
