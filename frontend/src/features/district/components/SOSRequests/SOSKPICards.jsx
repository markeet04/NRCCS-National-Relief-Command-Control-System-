/**
 * SOSKPICards Component
 * Displays KPI summary cards for SOS requests
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { AlertTriangle, Clock, Truck, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '@styles/css/main.css';

const SOSKPICards = ({ totalRequests, pendingCount, assignedCount, enrouteCount, rescuedCount }) => {
  const pendingPercent = totalRequests > 0 ? Math.round((pendingCount / totalRequests) * 100) : 0;

  const statusPieData = [
    { name: 'Pending', value: pendingCount, color: '#ef4444' },
    { name: 'Assigned', value: assignedCount, color: '#3b82f6' },
    { name: 'En-route', value: enrouteCount, color: '#f59e0b' },
    { name: 'Rescued', value: rescuedCount, color: '#10b981' }
  ].filter(d => d.value > 0);

  return (
    <div className="district-stats-grid">
      {/* Total Requests Card */}
      <div className="stat-card stat-card--blue">
        <div className="stat-card__header">
          <span className="stat-card__title">All SOS Requests</span>
          <div className="stat-card__icon stat-card__icon--blue">
            <AlertTriangle />
          </div>
        </div>
        <div className="stat-card__value">{totalRequests}</div>
        <span className="stat-card__subtitle">total requests</span>
      </div>

      {/* Pending Card */}
      <div className="stat-card stat-card--red">
        <div className="stat-card__header">
          <span className="stat-card__title">Pending</span>
          <div className="stat-card__icon stat-card__icon--red">
            <Clock />
          </div>
        </div>
        <div className="stat-card__value">{pendingCount}</div>
        <span className="stat-card__subtitle">urgent attention needed</span>
      </div>

      {/* Assigned/En-route Card */}
      <div className="stat-card stat-card--amber">
        <div className="stat-card__header">
          <span className="stat-card__title">In Progress</span>
          <div className="stat-card__icon stat-card__icon--amber">
            <Truck />
          </div>
        </div>
        <div className="stat-card__value">{assignedCount + enrouteCount}</div>
        <span className="stat-card__subtitle">assigned & en-route</span>
      </div>

      {/* Rescued Card */}
      <div className="stat-card stat-card--green">
        <div className="stat-card__header">
          <span className="stat-card__title">Rescued</span>
          <div className="stat-card__icon stat-card__icon--green">
            <CheckCircle />
          </div>
        </div>
        <div className="stat-card__value">{rescuedCount}</div>
        <span className="stat-card__subtitle">successfully rescued</span>
      </div>
    </div>
  );
};

export default SOSKPICards;
