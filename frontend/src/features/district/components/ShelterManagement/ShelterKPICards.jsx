/**
 * ShelterKPICards Component
 * KPI cards for shelter management
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { Building2, Users, BarChart2, PieChart } from 'lucide-react';
import '@styles/css/main.css';

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
            {/* Total Shelters */}
            <div className="stat-card stat-card--blue">
                <div className="stat-card__header">
                    <span className="stat-card__title">Total Shelters</span>
                    <div className="stat-card__icon stat-card__icon--blue">
                        <Building2 />
                    </div>
                </div>
                <div className="stat-card__value">{totalShelters}</div>
                <span className="stat-card__subtitle">active shelters</span>
            </div>

            {/* Total Capacity */}
            <div className="stat-card stat-card--purple">
                <div className="stat-card__header">
                    <span className="stat-card__title">Total Capacity</span>
                    <div className="stat-card__icon stat-card__icon--purple">
                        <Users />
                    </div>
                </div>
                <div className="stat-card__value">{totalCapacity.toLocaleString()}</div>
                <span className="stat-card__subtitle">{totalOccupancy} occupied ({occupancyPercent}%)</span>
            </div>

            {/* Status Breakdown */}
            <div className="stat-card stat-card--green">
                <div className="stat-card__header">
                    <span className="stat-card__title">Status Breakdown</span>
                    <div className="stat-card__icon stat-card__icon--green">
                        <PieChart />
                    </div>
                </div>
                <div className="stat-card__value" style={{ fontSize: '20px' }}>
                    <span style={{ color: '#22c55e' }}>● </span>{available} Available
                </div>
                <div className="stat-card__subtitle">
                    <span style={{ color: '#f59e0b' }}>● </span>{nearFull} Near Full &nbsp;
                    <span style={{ color: '#ef4444' }}>● </span>{full} Full
                </div>
            </div>

            {/* Population Stats */}
            <div className="stat-card stat-card--amber">
                <div className="stat-card__header">
                    <span className="stat-card__title">Current Occupancy</span>
                    <div className="stat-card__icon stat-card__icon--amber">
                        <BarChart2 />
                    </div>
                </div>
                <div className="stat-card__value">{occupancyPercent}%</div>
                <span className="stat-card__subtitle">{totalOccupancy.toLocaleString()} people sheltered</span>
            </div>
        </div>
    );
};

export default ShelterKPICards;
