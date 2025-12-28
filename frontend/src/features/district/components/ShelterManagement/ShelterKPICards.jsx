/**
 * ShelterKPICards Component
 * KPI cards for shelter management
 * Now using shared StatCard component with gradient styling
 */

import { StatCard } from '@shared/components/dashboard';

const ShelterKPICards = ({ stats, capacityRingData, statusPieData }) => {
    const totalShelters = stats?.totalShelters || 0;
    const totalCapacity = stats?.totalCapacity || 0;
    const totalOccupancy = stats?.totalOccupancy || 0;
    const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    // Calculate status breakdown
    const available = statusPieData?.find(s => s.name === 'Available')?.value || 0;
    const nearFull = statusPieData?.find(s => s.name === 'Near Full')?.value || 0;
    const full = statusPieData?.find(s => s.name === 'Full')?.value || 0;

    return (
        <div className="district-stats-grid">
            <StatCard
                title="TOTAL SHELTERS"
                value={totalShelters}
                icon="home"
                gradientKey="blue"
                trendLabel="active shelters"
            />
            <StatCard
                title="TOTAL CAPACITY"
                value={totalCapacity.toLocaleString()}
                icon="users"
                gradientKey="violet"
                trendLabel={`${totalOccupancy} occupied (${occupancyPercent}%)`}
            />
            <StatCard
                title="STATUS BREAKDOWN"
                value={`${available}`}
                icon="activity"
                gradientKey="emerald"
                trendLabel={`Available • ${nearFull} Near Full • ${full} Full`}
            />
            <StatCard
                title="CURRENT OCCUPANCY"
                value={`${occupancyPercent}%`}
                icon="users"
                gradientKey="amber"
                trendLabel={`${totalOccupancy.toLocaleString()} people sheltered`}
            />
        </div>
    );
};

export default ShelterKPICards;
