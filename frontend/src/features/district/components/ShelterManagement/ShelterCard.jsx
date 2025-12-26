/**
 * ShelterCard Component
 * Single shelter card with resource gauges and actions
 */
import { MapPin, Users } from 'lucide-react';
import ResourceGauge from './ResourceGauge';
import '@styles/css/main.css';
import './ShelterManagement.css';

const ShelterCard = ({
    shelter,
    onView,
    onEdit,
    getResourceColor,
    animated = false
}) => {
    const { name, address, capacity, occupancy, resources, status } = shelter;

    const occupancyPercent = capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;

    // Get occupancy bar color
    const getOccupancyColor = () => {
        if (occupancyPercent >= 90) return '#ef4444';
        if (occupancyPercent >= 70) return '#f59e0b';
        return '#22c55e';
    };

    // Get status class
    const getStatusClass = () => {
        if (status === 'available') return 'shelter-card__status--available';
        if (status === 'near-full') return 'shelter-card__status--near-full';
        return 'shelter-card__status--full';
    };

    // Get status label
    const getStatusLabel = (s) => {
        if (s === 'available') return 'Available';
        if (s === 'near-full') return 'Near Full';
        return 'Full';
    };

    return (
        <div className="shelter-card">
            {/* Header */}
            <div className="shelter-card__header">
                <div>
                    <h3 className="shelter-card__title">{name}</h3>
                    <div className="shelter-card__location">
                        <MapPin style={{ width: 12, height: 12 }} />
                        <span>{address || 'No address'}</span>
                    </div>
                </div>
                <span className={`shelter-card__status ${getStatusClass()}`}>
                    {getStatusLabel(status)}
                </span>
            </div>

            {/* Body with Resource Gauge and Levels */}
            <div className="shelter-card__body">
                <ResourceGauge
                    resources={resources}
                    getResourceColor={getResourceColor}
                    animated={animated}
                    size="md"
                />
                <div className="shelter-card__resources">
                    <p className="shelter-card__resources-title">Resource Levels</p>
                    <div className="shelter-card__resources-grid">
                        <div className="shelter-card__resource-item">
                            <span className="shelter-card__resource-dot" style={{ background: getResourceColor?.(resources.food) || '#22c55e' }} />
                            <span className="shelter-card__resource-label">Food:</span>
                            <span className="shelter-card__resource-value">{resources.food}%</span>
                        </div>
                        <div className="shelter-card__resource-item">
                            <span className="shelter-card__resource-dot" style={{ background: getResourceColor?.(resources.water) || '#22c55e' }} />
                            <span className="shelter-card__resource-label">Water:</span>
                            <span className="shelter-card__resource-value">{resources.water}%</span>
                        </div>
                        <div className="shelter-card__resource-item">
                            <span className="shelter-card__resource-dot" style={{ background: getResourceColor?.(resources.medical) || '#22c55e' }} />
                            <span className="shelter-card__resource-label">Medical:</span>
                            <span className="shelter-card__resource-value">{resources.medical}%</span>
                        </div>
                        <div className="shelter-card__resource-item">
                            <span className="shelter-card__resource-dot" style={{ background: getResourceColor?.(resources.tents) || '#22c55e' }} />
                            <span className="shelter-card__resource-label">Tents:</span>
                            <span className="shelter-card__resource-value">{resources.tents}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="shelter-card__stats">
                <div className="shelter-card__stat">
                    <span className="shelter-card__stat-label">
                        <Users style={{ width: 14, height: 14 }} />
                        Capacity
                    </span>
                    <span className="shelter-card__stat-value">{capacity.toLocaleString()}</span>
                </div>
                <div className="shelter-card__stat">
                    <span className="shelter-card__stat-label">Occupancy</span>
                    <span className="shelter-card__stat-value" style={{ color: getOccupancyColor() }}>
                        {occupancy} ({occupancyPercent}%)
                    </span>
                </div>
                <div className="shelter-card__occupancy-bar">
                    <div
                        className="shelter-card__occupancy-fill"
                        style={{
                            width: `${occupancyPercent}%`,
                            background: getOccupancyColor()
                        }}
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="shelter-card__footer">
                <button className="btn btn--secondary" onClick={() => onView?.(shelter)}>
                    <span>👁</span> View
                </button>
                <button className="btn btn--primary" onClick={() => onEdit?.(shelter)}>
                    <span>✏️</span> Edit
                </button>
            </div>
        </div>
    );
};

export default ShelterCard;
