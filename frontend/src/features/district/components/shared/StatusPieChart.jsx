/**
 * StatusPieChart Component
 * Reusable pie chart for status breakdown visualization
 */

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const StatusPieChart = ({ 
  data, 
  title = 'Status Breakdown',
  colors,
  isLight = false,
  borderColor = '#10b981',
  showLegend = true
}) => {
  const cardStyle = {
    background: colors?.cardBg || (isLight ? '#ffffff' : '#1f2937'),
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderLeft: `4px solid ${borderColor}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden'
  };

  const titleStyle = {
    color: colors?.textSecondary || (isLight ? '#6b7280' : '#9ca3af'),
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ 
            color: payload[0].payload.color, 
            fontSize: '12px', 
            fontWeight: '600' 
          }}>
            {payload[0].name}: {payload[0].value}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hover:scale-[1.02] hover:-translate-y-1" style={cardStyle}>
      <div style={{ width: '100px', height: '100px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={45}
              paddingAngle={3}
              dataKey="value"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showLegend && (
        <div>
          <p style={titleStyle}>{title}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {data.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: item.color 
                }} />
                <span style={{ 
                  color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'), 
                  fontSize: '13px' 
                }}>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPieChart;
