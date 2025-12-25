/**
 * KPICard Component
 * Reusable KPI card with icon, value, and optional chart
 */

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle,
  borderColor = '#3b82f6',
  chartData,
  chartType = 'ring', // 'ring' or 'number'
  colors,
  isLight = false,
  className = ''
}) => {
  const cardStyle = {
    background: colors?.cardBg || (isLight ? '#ffffff' : '#1f2937'),
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    borderRadius: '16px',
    padding: chartData ? '20px 24px' : '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderLeft: `4px solid ${borderColor}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden'
  };

  const iconContainerStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: `${borderColor}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle = {
    color: colors?.textSecondary || (isLight ? '#6b7280' : '#9ca3af'),
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const valueStyle = {
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    fontSize: chartData ? '32px' : '36px',
    fontWeight: '700',
    lineHeight: '1'
  };

  const subtitleStyle = {
    color: colors?.textMuted || (isLight ? '#9ca3af' : '#6b7280'),
    fontSize: '11px',
    marginTop: '2px'
  };

  // Ring chart rendering
  const renderRingChart = () => {
    if (!chartData || chartType !== 'ring') return null;
    
    const centerValue = chartData[0]?.value || 0;
    
    return (
      <div style={{ width: '90px', height: '90px', minWidth: '90px', minHeight: '90px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={40}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <span style={{ 
            color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'), 
            fontSize: '14px', 
            fontWeight: '700' 
          }}>
            {centerValue}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`hover:scale-[1.02] hover:-translate-y-1 ${className}`} style={cardStyle}>
      {chartData && chartType === 'ring' ? (
        renderRingChart()
      ) : Icon && (
        <div style={iconContainerStyle}>
          <Icon style={{ width: '28px', height: '28px', color: borderColor }} />
        </div>
      )}
      <div>
        <p style={titleStyle}>{title}</p>
        <p style={valueStyle}>{value}</p>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default KPICard;
