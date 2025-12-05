import { useId } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * ChartCard Component
 * Displays multi-factor disaster metrics visualization using a line graph
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {Array} props.data - Chart data points
 */
const ChartCard = ({ title = 'Disaster Metrics', data = [] }) => {
  const chartData = data.length ? data : [{ label: 'Metric', value: 0 }];
  const maxValue = Math.max(...chartData.map(d => d.value)) || 1;
  const baseId = useId().replace(/:/g, '');
  const strokeGradientId = `${baseId}-stroke`;
  const fillGradientId = `${baseId}-fill`;

  const coordinates = chartData.map((item, index) => {
    const x = chartData.length > 1 ? (index / (chartData.length - 1)) * 100 : 50;
    const y = 100 - (item.value / maxValue) * 100;
    return { x, y };
  });

  const polylinePoints = coordinates.map(point => `${point.x},${point.y}`).join(' ');
  const areaPoints = `${polylinePoints} 100,100 0,100`;

  const getTrendMeta = (trend) => {
    if (typeof trend !== 'number') return null;

    if (trend === 0) {
      return {
        icon: <Minus className="w-3.5 h-3.5" />,
        color: 'var(--text-muted)'
      };
    }

    return {
      icon: trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />,
      color: trend > 0 ? '#ef4444' : '#22c55e'
    };
  };

  return (
    <div className="rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Live overview of critical indicators</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{chartData[0].value.toLocaleString()}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{chartData[0].label}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full" style={{ height: '220px' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={strokeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
              </linearGradient>
            </defs>

            {[20, 40, 60, 80].map((value) => (
              <line
                key={value}
                x1="0"
                x2="100"
                y1={value}
                y2={value}
                stroke="var(--border-color)"
                strokeWidth="0.25"
                strokeDasharray="2 4"
              />
            ))}

            {coordinates.length > 1 && (
              <polygon points={areaPoints} fill={`url(#${fillGradientId})`} stroke="none" />
            )}

            <polyline
              points={polylinePoints}
              fill="none"
              stroke={`url(#${strokeGradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {coordinates.map((point, index) => (
              <circle
                key={`${chartData[index].label}-${index}`}
                cx={point.x}
                cy={point.y}
                r="1.8"
                fill="#0ea5e9"
                stroke="var(--bg-secondary)"
                strokeWidth="0.6"
              />
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {chartData.map((item, index) => {
            const trendMeta = getTrendMeta(item.trend);

            return (
              <div
                key={`${item.label}-${index}`}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.value.toLocaleString()}
                  </p>
                </div>

                {trendMeta && (
                  <div className="flex items-center gap-1 text-sm font-medium" style={{ color: trendMeta.color }}>
                    {trendMeta.icon}
                    <span>{Math.abs(item.trend)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
      trend: PropTypes.number,
    })
  )
};

export default ChartCard;
