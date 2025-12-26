/**
 * KPICard Component
 * Reusable KPI card with icon, value, and optional chart
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '@styles/css/main.css';

const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  borderColor = '#3b82f6',
  chartData,
  chartType = 'ring', // 'ring' or 'number'
  className = ''
}) => {
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">
            {centerValue}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`stat-card transition-all ${className}`}
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex items-center gap-4">
        {chartData && chartType === 'ring' ? (
          renderRingChart()
        ) : Icon && (
          <div
            className="stat-card__icon"
            style={{ background: `${borderColor}20` }}
          >
            <Icon style={{ width: '28px', height: '28px', color: borderColor }} />
          </div>
        )}
        <div>
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value}</p>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default KPICard;

