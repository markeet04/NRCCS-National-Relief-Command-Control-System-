/**
 * ShelterStats Component
 * KPI cards for PDMA shelter management
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { Building, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import '@styles/css/main.css';

const ShelterStats = ({
  totalShelters = 0,
  totalCapacity = 0,
  currentOccupancy = 0,
  avgOccupancyPercent = 0
}) => {
  // Ensure values are numbers and not NaN
  const safeTotal = Number(totalShelters) || 0;
  const safeCapacity = Number(totalCapacity) || 0;
  const safeOccupancy = Number(currentOccupancy) || 0;
  const safePercent = Number(avgOccupancyPercent) || 0;

  return (
    <div className="district-stats-grid">
      {/* Total Shelters */}
      <div className="stat-card stat-card--blue">
        <div className="stat-card__header">
          <span className="stat-card__title">Total Shelters</span>
          <div className="stat-card__icon stat-card__icon--blue">
            <Building size={20} />
          </div>
        </div>
        <div className="stat-card__value">{safeTotal}</div>
        <span className="stat-card__subtitle">active shelters</span>
      </div>

      {/* Total Capacity */}
      <div className="stat-card stat-card--green">
        <div className="stat-card__header">
          <span className="stat-card__title">Total Capacity</span>
          <div className="stat-card__icon stat-card__icon--green">
            <Users size={20} />
          </div>
        </div>
        <div className="stat-card__value">{safeCapacity.toLocaleString()}</div>
        <span className="stat-card__subtitle">max capacity</span>
      </div>

      {/* Current Occupancy */}
      <div className="stat-card stat-card--amber">
        <div className="stat-card__header">
          <span className="stat-card__title">Current Occupancy</span>
          <div className="stat-card__icon stat-card__icon--amber">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="stat-card__value">{safeOccupancy.toLocaleString()}</div>
        <span className="stat-card__subtitle">people sheltered</span>
      </div>

      {/* Average Occupancy % */}
      <div className="stat-card stat-card--red">
        <div className="stat-card__header">
          <span className="stat-card__title">Avg Occupancy</span>
          <div className="stat-card__icon stat-card__icon--red">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="stat-card__value">{safePercent}%</div>
        <span className="stat-card__subtitle">utilization rate</span>
      </div>
    </div>
  );
};

export default ShelterStats;
