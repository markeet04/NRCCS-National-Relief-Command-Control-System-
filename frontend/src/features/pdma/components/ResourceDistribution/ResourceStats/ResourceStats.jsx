/**
 * ResourceStats Component
 * KPI cards for PDMA resource distribution
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { Package, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import '@styles/css/main.css';

const ResourceStats = ({
  totalResources = 0,
  totalQuantity = 0,
  allocatedPercent = 0,
  availableQuantity = 0
}) => {
  const formatQuantity = (qty) => {
    if (qty >= 1000) return `${(qty / 1000).toFixed(1)}K`;
    return qty.toString();
  };

  return (
    <div className="district-stats-grid">
      {/* Total Resources */}
      <div className="stat-card stat-card--blue">
        <div className="stat-card__header">
          <span className="stat-card__title">Total Resources</span>
          <div className="stat-card__icon stat-card__icon--blue">
            <Package size={20} />
          </div>
        </div>
        <div className="stat-card__value">{totalResources}</div>
        <span className="stat-card__subtitle">resource types</span>
      </div>

      {/* Total Quantity */}
      <div className="stat-card stat-card--green">
        <div className="stat-card__header">
          <span className="stat-card__title">Total Quantity</span>
          <div className="stat-card__icon stat-card__icon--green">
            <BarChart3 size={20} />
          </div>
        </div>
        <div className="stat-card__value">{formatQuantity(totalQuantity)}</div>
        <span className="stat-card__subtitle">units</span>
      </div>

      {/* Allocated % */}
      <div className="stat-card stat-card--amber">
        <div className="stat-card__header">
          <span className="stat-card__title">Allocated</span>
          <div className="stat-card__icon stat-card__icon--amber">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="stat-card__value">{allocatedPercent}%</div>
        <span className="stat-card__subtitle">distributed</span>
      </div>

      {/* Available */}
      <div className="stat-card stat-card--red">
        <div className="stat-card__header">
          <span className="stat-card__title">Available</span>
          <div className="stat-card__icon stat-card__icon--red">
            <AlertCircle size={20} />
          </div>
        </div>
        <div className="stat-card__value">{formatQuantity(availableQuantity)}</div>
        <span className="stat-card__subtitle">units</span>
      </div>
    </div>
  );
};

export default ResourceStats;
