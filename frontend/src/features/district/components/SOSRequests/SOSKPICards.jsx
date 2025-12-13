/**
 * SOSKPICards Component
 * Displays KPI summary cards for SOS requests
 */

import { AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react';
import { PieChart, Pie, Cell, RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const SOSKPICards = ({ totalRequests, pendingCount, assignedCount, enrouteCount, rescuedCount, colors, isLight }) => {
  const pendingPercent = totalRequests > 0 ? Math.round((pendingCount / totalRequests) * 100) : 0;

  const pendingRingData = [
    { name: 'Pending', value: pendingPercent, fill: '#ef4444' },
    { name: 'Others', value: 100 - pendingPercent, fill: isLight ? '#e5e7eb' : '#374151' }
  ];

  const statusPieData = [
    { name: 'Pending', value: pendingCount, color: '#ef4444' },
    { name: 'Assigned', value: assignedCount, color: '#3b82f6' },
    { name: 'En-route', value: enrouteCount, color: '#f59e0b' },
    { name: 'Rescued', value: rescuedCount, color: '#10b981' }
  ].filter(d => d.value > 0);

  const cardStyle = {
    background: colors.cardBg,
    border: `2px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Total Requests */}
      <div 
        className="hover:scale-[1.02] hover:-translate-y-1"
        style={{ 
          ...cardStyle,
          borderLeft: `4px solid #3b82f6`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(59, 130, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertTriangle style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
        </div>
        <div>
          <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            All SOS Requests
          </p>
          <p style={{ color: colors.textPrimary, fontSize: '42px', fontWeight: '700', lineHeight: '1' }}>
            {totalRequests}
          </p>
        </div>
      </div>

      {/* Pending Ring Gauge */}
      <div 
        className="hover:scale-[1.02] hover:-translate-y-1"
        style={{ 
          ...cardStyle,
          borderLeft: `4px solid #ef4444`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{ width: '100px', height: '100px', position: 'relative', minWidth: '100px', minHeight: '100px' }}>
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
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <span style={{ color: '#ef4444', fontSize: '16px', fontWeight: '700' }}>
              {pendingPercent}%
            </span>
          </div>
        </div>
        <div>
          <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pending
          </p>
          <p style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: '700', lineHeight: '1' }}>
            {pendingCount}
          </p>
          <p style={{ color: colors.textMuted, fontSize: '12px', marginTop: '4px' }}>
            Urgent attention needed
          </p>
        </div>
      </div>

      {/* Status Breakdown Pie */}
      <div 
        className="hover:scale-[1.02] hover:-translate-y-1"
        style={{ 
          ...cardStyle,
          borderLeft: `4px solid #10b981`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{ width: '100px', height: '100px', minWidth: '100px', minHeight: '100px' }}>
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
          <p style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Status Breakdown
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {statusPieData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: colors.textPrimary, fontSize: '13px' }}>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSKPICards;
