/**
 * ShelterStats Component
 * Displays shelter statistics using shared StatCard component
 */

import PropTypes from 'prop-types';
import { StatCard } from '@shared/components/dashboard';

/**
 * ShelterStats Component
 * Displays shelter statistics using shared StatCard component
 */
const ShelterStats = ({
  totalShelters = 0,
  totalCapacity = 0,
  currentOccupancy = 0,
  avgOccupancyPercent = 0
}) => {
  // Ensure values are numbers
  const safeTotal = Number(totalShelters) || 0;
  const safeCapacity = Number(totalCapacity) || 0;
  const safeOccupancy = Number(currentOccupancy) || 0;
  const safePercent = Number(avgOccupancyPercent) || 0;

  const statCards = [
    {
      title: 'TOTAL SHELTERS',
      value: safeTotal,
      gradientKey: 'blue',
      icon: 'home',
      trendLabel: 'active shelters'
    },
    {
      title: 'TOTAL CAPACITY',
      value: safeCapacity.toLocaleString(),
      gradientKey: 'emerald',
      icon: 'users',
      trendLabel: 'max capacity'
    },
    {
      title: 'CURRENT OCCUPANCY',
      value: safeOccupancy.toLocaleString(),
      gradientKey: 'amber',
      icon: 'users',
      trendLabel: 'people sheltered'
    },
    {
      title: 'AVG OCCUPANCY',
      value: `${safePercent}%`,
      gradientKey: 'violet',
      icon: 'activity',
      trendLabel: 'average utilization'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          gradientKey={card.gradientKey}
          trendLabel={card.trendLabel}
        />
      ))}
    </div>
  );
};

ShelterStats.propTypes = {
  totalShelters: PropTypes.number,
  totalCapacity: PropTypes.number,
  currentOccupancy: PropTypes.number,
  avgOccupancyPercent: PropTypes.number,
};

export default ShelterStats;
