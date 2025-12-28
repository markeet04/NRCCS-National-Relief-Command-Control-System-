/**
 * RescueTeamsKPICards Component
 * KPI cards for rescue teams management
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */

import { Users, CheckCircle, Truck, XCircle } from 'lucide-react';
import '@styles/css/main.css';

const RescueTeamsKPICards = ({
    totalTeams,
    availableTeams,
    deployedTeams,
    unavailableTeams,
    availablePercent
}) => {
    return (
        <div className="district-stats-grid">
            {/* Total Teams */}
            <div className="stat-card stat-card--blue">
                <div className="stat-card__header">
                    <span className="stat-card__title">Total Teams</span>
                    <div className="stat-card__icon stat-card__icon--blue">
                        <Users />
                    </div>
                </div>
                <div className="stat-card__value">{totalTeams}</div>
                <span className="stat-card__subtitle">registered teams</span>
            </div>

            {/* Available Teams */}
            <div className="stat-card stat-card--green">
                <div className="stat-card__header">
                    <span className="stat-card__title">Available</span>
                    <div className="stat-card__icon stat-card__icon--green">
                        <CheckCircle />
                    </div>
                </div>
                <div className="stat-card__value">{availableTeams}</div>
                <span className="stat-card__subtitle">ready for deployment</span>
            </div>

            {/* Deployed Teams */}
            <div className="stat-card stat-card--amber">
                <div className="stat-card__header">
                    <span className="stat-card__title">Deployed</span>
                    <div className="stat-card__icon stat-card__icon--amber">
                        <Truck />
                    </div>
                </div>
                <div className="stat-card__value">{deployedTeams}</div>
                <span className="stat-card__subtitle">active missions</span>
            </div>

            {/* Unavailable Teams */}
            <div className="stat-card stat-card--red">
                <div className="stat-card__header">
                    <span className="stat-card__title">Unavailable</span>
                    <div className="stat-card__icon stat-card__icon--red">
                        <XCircle />
                    </div>
                </div>
                <div className="stat-card__value">{unavailableTeams}</div>
                <span className="stat-card__subtitle">on standby or rest</span>
            </div>
        </div>
    );
};

export default RescueTeamsKPICards;
