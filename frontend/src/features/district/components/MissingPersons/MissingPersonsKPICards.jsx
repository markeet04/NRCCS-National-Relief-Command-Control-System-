/**
 * MissingPersonsKPICards Component
 * KPI cards for missing persons management
 * Now using shared StatCard component with gradient styling
 */

import { StatCard } from '@shared/components/dashboard';

const MissingPersonsKPICards = ({
    totalCases,
    activeCases,
    foundCases,
    criticalCases
}) => {
    return (
        <div className="district-stats-grid">
            <StatCard
                title="TOTAL REPORTS"
                value={totalCases}
                icon="users"
                gradientKey="blue"
                trendLabel="all reported cases"
            />
            <StatCard
                title="ACTIVE SEARCH"
                value={activeCases}
                icon="activity"
                gradientKey="amber"
                trendLabel="ongoing investigations"
            />
            <StatCard
                title="FOUND"
                value={foundCases}
                icon="shield"
                gradientKey="emerald"
                trendLabel="located safely"
            />
            <StatCard
                title="CRITICAL"
                value={criticalCases}
                icon="alert"
                gradientKey="rose"
                trendLabel="urgent attention needed"
            />
        </div>
    );
};

export default MissingPersonsKPICards;
