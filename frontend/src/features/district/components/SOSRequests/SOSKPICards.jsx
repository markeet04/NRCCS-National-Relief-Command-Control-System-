/**
 * SOSKPICards Component
 * Displays KPI summary cards for SOS requests
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '@styles/css/main.css';

const SOSKPICards = ({ totalRequests, pendingCount, assignedCount, enrouteCount, rescuedCount }) => {
  const pendingPercent = totalRequests > 0 ? Math.round((pendingCount / totalRequests) * 100) : 0;

  const pendingRingData = [
    { name: 'Pending', value: pendingPercent, fill: '#ef4444' },
    { name: 'Others', value: 100 - pendingPercent, fill: 'var(--card-border)' }
  ];

  const statusPieData = [
    { name: 'Pending', value: pendingCount, color: '#ef4444' },
    { name: 'Assigned', value: assignedCount, color: '#3b82f6' },
    { name: 'En-route', value: enrouteCount, color: '#f59e0b' },
    { name: 'Rescued', value: rescuedCount, color: '#10b981' }
  ].filter(d => d.value > 0);

  return (
    <div className="district-stats-grid">
      {/* Total Requests */}
      <div className="stat-card stat-card--info transition-all">
        <div className="flex items-center gap-4">
          <div className="stat-card__icon stat-card__icon--info">
            <AlertTriangle />
          </div>
          <div>
            <p className="stat-card__title">All SOS Requests</p>
            <p className="stat-card__value">{totalRequests}</p>
          </div>
        </div>
      </div>

      {/* Pending Ring Gauge */}
      <div className="stat-card stat-card--danger transition-all">
        <div className="flex items-center gap-4">
          <div className="stat-card__chart relative">
            <ResponsiveContainer width={100} height={100}>
              <PieChart width={100} height={100}>
                <Pie
                  data={pendingRingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1000}
                >
                  {pendingRingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="stat-card__chart-label">
              <span className="text-danger font-bold">{pendingPercent}%</span>
            </div>
          </div>
          <div>
            <p className="stat-card__title">Pending</p>
            <p className="stat-card__value">{pendingCount}</p>
            <p className="text-xs text-muted mt-1">Urgent attention needed</p>
          </div>
        </div>
      </div>

      {/* Status Breakdown Pie */}
      <div className="stat-card stat-card--success transition-all">
        <div className="flex items-center gap-4">
          <div className="stat-card__chart">
            <ResponsiveContainer width={100} height={100}>
              <PieChart width={100} height={100}>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="stat-card__title">Status Breakdown</p>
            <div className="flex flex-col gap-1">
              {statusPieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="stat-card__legend-dot" style={{ background: item.color }} />
                  <span className="text-sm text-primary">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSKPICards;
