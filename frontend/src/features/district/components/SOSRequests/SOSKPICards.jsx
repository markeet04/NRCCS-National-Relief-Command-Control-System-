/**
 * SOSKPICards Component
 * Displays KPI summary cards for SOS requests
 * Now using shared StatCard component with gradient styling
 */

import { StatCard } from '@shared/components/dashboard';

const SOSKPICards = ({ totalRequests, pendingCount, assignedCount, enrouteCount, rescuedCount }) => {
  const inProgressCount = assignedCount + enrouteCount;

  return (
    <div className="district-stats-grid">
      <StatCard
        title="ALL SOS REQUESTS"
        value={totalRequests}
        icon="alert"
        gradientKey="blue"
        trendLabel="total requests"
      />
      <StatCard
        title="PENDING"
        value={pendingCount}
        icon="alert"
        gradientKey="rose"
        trendLabel="urgent attention needed"
      />
      <StatCard
        title="IN PROGRESS"
        value={inProgressCount}
        icon="truck"
        gradientKey="amber"
        trendLabel="assigned & en-route"
      />
      <StatCard
        title="RESCUED"
        value={rescuedCount}
        icon="shield"
        gradientKey="emerald"
        trendLabel="successfully rescued"
      />
    </div>
  );
};

export default SOSKPICards;
