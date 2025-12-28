/**
 * RescueTeamsKPICards Component
 * KPI cards for rescue teams management
 * Now using shared StatCard component with gradient styling
 */

import { StatCard } from '@shared/components/dashboard';

const RescueTeamsKPICards = ({
    totalTeams,
    availableTeams,
    deployedTeams,
    unavailableTeams
}) => {
    return (
        <div className="district-stats-grid">
            <StatCard
                title="TOTAL TEAMS"
                value={totalTeams}
                icon="users"
                gradientKey="blue"
                trendLabel="registered teams"
            />
            <StatCard
                title="AVAILABLE"
                value={availableTeams}
                icon="shield"
                gradientKey="emerald"
                trendLabel="ready for deployment"
            />
            <StatCard
                title="DEPLOYED"
                value={deployedTeams}
                icon="truck"
                gradientKey="amber"
                trendLabel="active missions"
            />
            <StatCard
                title="UNAVAILABLE"
                value={unavailableTeams}
                icon="alert"
                gradientKey="rose"
                trendLabel="on standby or rest"
            />
        </div>
    );
};

export default RescueTeamsKPICards;
