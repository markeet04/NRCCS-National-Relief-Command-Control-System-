/**
 * MissingPersonsKPICards Component
 * KPI cards for missing persons management
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { Users, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import '@styles/css/main.css';

const MissingPersonsKPICards = ({
    totalCases,
    activeCases,
    foundCases,
    criticalCases
}) => {
    return (
        <div className="district-stats-grid">
            {/* Total Cases */}
            <div className="stat-card stat-card--blue">
                <div className="stat-card__header">
                    <span className="stat-card__title">Total Reports</span>
                    <div className="stat-card__icon stat-card__icon--blue">
                        <Users />
                    </div>
                </div>
                <div className="stat-card__value">{totalCases}</div>
                <span className="stat-card__subtitle">all reported cases</span>
            </div>

            {/* Active Cases */}
            <div className="stat-card stat-card--amber">
                <div className="stat-card__header">
                    <span className="stat-card__title">Active Search</span>
                    <div className="stat-card__icon stat-card__icon--amber">
                        <Search />
                    </div>
                </div>
                <div className="stat-card__value">{activeCases}</div>
                <span className="stat-card__subtitle">ongoing investigations</span>
            </div>

            {/* Found Cases */}
            <div className="stat-card stat-card--green">
                <div className="stat-card__header">
                    <span className="stat-card__title">Found</span>
                    <div className="stat-card__icon stat-card__icon--green">
                        <CheckCircle />
                    </div>
                </div>
                <div className="stat-card__value">{foundCases}</div>
                <span className="stat-card__subtitle">located safely</span>
            </div>

            {/* Critical Cases */}
            <div className="stat-card stat-card--red">
                <div className="stat-card__header">
                    <span className="stat-card__title">Critical</span>
                    <div className="stat-card__icon stat-card__icon--red">
                        <AlertTriangle />
                    </div>
                </div>
                <div className="stat-card__value">{criticalCases}</div>
                <span className="stat-card__subtitle">urgent attention needed</span>
            </div>
        </div>
    );
};

export default MissingPersonsKPICards;
