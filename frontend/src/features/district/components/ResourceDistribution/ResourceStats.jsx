/**
 * ResourceStats Component
 * KPI cards for resource distribution statistics
 * Refactored to use unified stat card CSS classes
 */
import { Package, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import '@styles/css/main.css';

const ResourceStats = ({
    totalResources,
    totalQuantity,
    allocatedPercent,
    availableQuantity
}) => {
    const formatQuantity = (qty) => {
        if (qty >= 1000) return `${(qty / 1000).toFixed(1)}K`;
        return qty.toString();
    };

    return (
        <div className="district-stats-grid">
            {/* Resource Types */}
            <div className="stat-card stat-card--blue">
                <div className="flex items-center gap-4">
                    <div className="stat-card__icon stat-card__icon--blue">
                        <Package />
                    </div>
                    <div>
                        <p className="stat-card__title">Resource Types</p>
                        <p className="stat-card__value">{totalResources}</p>
                        <p className="text-xs text-muted mt-1">Different types</p>
                    </div>
                </div>
            </div>

            {/* Total Quantity */}
            <div className="stat-card stat-card--green">
                <div className="flex items-center gap-4">
                    <div className="stat-card__icon stat-card__icon--green">
                        <BarChart3 />
                    </div>
                    <div>
                        <p className="stat-card__title">Total Quantity</p>
                        <p className="stat-card__value">{formatQuantity(totalQuantity)}</p>
                        <p className="text-xs text-muted mt-1">Units available</p>
                    </div>
                </div>
            </div>

            {/* Distributed */}
            <div className="stat-card stat-card--amber">
                <div className="flex items-center gap-4">
                    <div className="stat-card__icon stat-card__icon--amber">
                        <TrendingUp />
                    </div>
                    <div>
                        <p className="stat-card__title">Distributed</p>
                        <p className="stat-card__value">{allocatedPercent}%</p>
                        <p className="text-xs text-muted mt-1">To shelters</p>
                    </div>
                </div>
            </div>

            {/* Available */}
            <div className="stat-card stat-card--red">
                <div className="flex items-center gap-4">
                    <div className="stat-card__icon stat-card__icon--red">
                        <AlertCircle />
                    </div>
                    <div>
                        <p className="stat-card__title">Available</p>
                        <p className="stat-card__value">{formatQuantity(availableQuantity)}</p>
                        <p className="text-xs text-muted mt-1">For allocation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceStats;
