import { StatCard } from '@shared/components/dashboard';
import './StatsGrid.css';

const StatsGrid = ({ stats }) => {
  return (
    <div className="superadmin-stats-grid">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
