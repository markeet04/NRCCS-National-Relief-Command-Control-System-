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
    animated = true
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
                <div className="shelter-card__header-info">
                    <h3 className="shelter-card__title">{name}</h3>
                    <div className="shelter-card__location">
                        <MapPin size={12} />
                        <span>{address || 'No address'}</span>
                    </div>
                </div>
                <span className={`shelter-card__status ${getStatusClass()}`}>
                    {getStatusLabel(status)}
                </span>
            </div>

            {/* Resources Section - Gauge Left, Levels Right */}
            <div className="shelter-card__resources-section">
                <div className="shelter-card__gauge">
                    <ResourceGauge resources={resources} animated={animated} />
                </div>
                <div className="shelter-card__levels">
                    <p className="shelter-card__levels-title">RESOURCE LEVELS</p>
                    <div className="shelter-card__levels-grid">
                        <div className="shelter-card__level-row">
                            <span className="shelter-card__level-dot" style={{ background: '#f59e0b' }} />
                            <span>Food: <strong>{resources.food}%</strong></span>
                        </div>
                        <div className="shelter-card__level-row">
                            <span className="shelter-card__level-dot" style={{ background: '#3b82f6' }} />
                            <span>Water: <strong>{resources.water}%</strong></span>
                        </div>
                        <div className="shelter-card__level-row">
                            <span className="shelter-card__level-dot" style={{ background: '#ef4444' }} />
                            <span>Medical: <strong>{resources.medical}%</strong></span>
                        </div>
                        <div className="shelter-card__level-row">
                            <span className="shelter-card__level-dot" style={{ background: '#22c55e' }} />
                            <span>Tents: <strong>{resources.tents}%</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="shelter-card__stats">
                <div className="shelter-card__stat">
                    <span className="shelter-card__stat-label">
                        <Users size={14} />
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
                    👁 View
                </button>
                <button className="btn btn--primary" onClick={() => onEdit?.(shelter)}>
                    ✏️ Edit
                </button>
            </div>
        </div>
    );
};

export default ShelterCard;
