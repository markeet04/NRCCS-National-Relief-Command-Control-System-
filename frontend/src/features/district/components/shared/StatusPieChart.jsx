/**
 * StatusPieChart Component
 * Reusable pie chart for status breakdown visualization
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import '@styles/css/main.css';

const StatusPieChart = ({
  data,
  title = 'Status Breakdown',
  borderColor = '#10b981',
  showLegend = true
}) => {
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
    <div
      className="stat-card transition-all hover:scale-[1.02] hover:-translate-y-1"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex items-center gap-4">
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
            <p className="stat-card__title">{title}</p>
            <div className="flex flex-col gap-1">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="rounded-full"
                    style={{
                      width: '10px',
                      height: '10px',
                      background: item.color
                    }}
                  />
                  <span className="text-sm text-primary">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPieChart;

