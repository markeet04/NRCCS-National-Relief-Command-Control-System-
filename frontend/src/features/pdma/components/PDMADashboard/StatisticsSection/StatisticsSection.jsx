import { StatCard } from '@shared/components/dashboard';

const StatisticsSection = ({ stats, colors }) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      style={{ gap: '20px', marginBottom: '24px' }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatisticsSection;
