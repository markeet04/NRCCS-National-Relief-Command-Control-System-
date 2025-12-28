import { Building, Users, UserCheck, Percent } from 'lucide-react';
import '@features/ndma/styles/national-dashboard.css';

/**
 * ShelterStats Component
 * NDMA Dashboard-style stats cards with glow effects for Shelter Registry
 */
const ShelterStats = ({ totalShelters = 0, totalCapacity = 0, currentOccupancy = 0, avgOccupancyPercent = 0, colors }) => {
  // Ensure values are numbers and not NaN
  const safeTotal = Number(totalShelters) || 0;
  const safeCapacity = Number(totalCapacity) || 0;
  const safeOccupancy = Number(currentOccupancy) || 0;
  const safePercent = Number(avgOccupancyPercent) || 0;

  // Stats configuration with proper icons and colors
  const stats = [
    {
      title: 'TOTAL SHELTERS',
      value: safeTotal,
      icon: Building,
      borderClass: 'border-left-blue',
      iconClass: 'icon-blue',
      subtitle: 'Active facilities',
    },
    {
      title: 'TOTAL CAPACITY',
      value: safeCapacity.toLocaleString(),
      icon: Users,
      borderClass: 'border-left-green',
      iconClass: 'icon-green',
      subtitle: 'Maximum capacity',
    },
    {
      title: 'CURRENT OCCUPANCY',
      value: safeOccupancy.toLocaleString(),
      icon: UserCheck,
      borderClass: 'border-left-yellow',
      iconClass: 'icon-yellow',
      subtitle: 'People sheltered',
    },
    {
      title: 'AVG OCCUPANCY %',
      value: `${safePercent}%`,
      icon: Percent,
      borderClass: safePercent > 80 ? 'border-left-red' : safePercent > 60 ? 'border-left-yellow' : 'border-left-green',
      iconClass: safePercent > 80 ? 'icon-red' : safePercent > 60 ? 'icon-yellow' : 'icon-green',
      subtitle: safePercent > 80 ? 'Near capacity' : safePercent > 60 ? 'Moderate usage' : 'Available',
    },
  ];

  return (
    <div className="national-stats-grid" style={{ marginBottom: '24px' }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`national-stat-card ${stat.borderClass}`}>
            <div className="national-stat-card-header">
              <span className="national-stat-card-label">{stat.title}</span>
              <div className={`national-stat-card-icon ${stat.iconClass}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            <div className="national-stat-card-value">
              {stat.value}
            </div>
            <div className="national-stat-card-trend neutral">
              {stat.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShelterStats;
