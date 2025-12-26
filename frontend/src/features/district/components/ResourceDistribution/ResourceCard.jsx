/**
 * ResourceCard Component
 * Single resource card with progress bar and allocate button
 */
import { MapPin, Package } from 'lucide-react';
import { RESOURCE_STATUS_COLORS } from '../../constants';
import '@styles/css/main.css';
import './ResourceDistribution.css';

const ResourceCard = ({
    resource,
    onAllocate,
    selectedFilter,
    isLight = false
}) => {
    const statusColor = RESOURCE_STATUS_COLORS[resource.status] || RESOURCE_STATUS_COLORS.available;
    const availableQty = resource.quantity - resource.allocated;
    const isFullyAllocated = availableQty <= 0;

    const showAvailableView = selectedFilter === 'available';
    const showAllocatedView = selectedFilter === 'allocated';

    // Calculate progress
    let progressPercentage, progressLabel, progressValues;

    if (showAvailableView) {
        progressPercentage = resource.quantity > 0 ? (availableQty / resource.quantity) * 100 : 0;
        progressLabel = 'Available';
        progressValues = `${availableQty}/${resource.quantity}`;
    } else if (showAllocatedView) {
        progressPercentage = resource.quantity > 0 ? (resource.allocated / resource.quantity) * 100 : 100;
        progressLabel = 'Distributed';
        progressValues = `${resource.allocated}/${resource.quantity}`;
    } else {
        progressPercentage = resource.quantity > 0 ? (resource.allocated / resource.quantity) * 100 : 100;
        progressLabel = 'Usage';
        progressValues = `${resource.allocated}/${resource.quantity}`;
    }

    // Calculate bar color
    let barColor;
    if (showAvailableView) {
        if (progressPercentage <= 10) {
            barColor = '#ef4444';
        } else if (progressPercentage <= 30) {
            barColor = '#f97316';
        } else {
            barColor = '#22c55e';
        }
    } else {
        barColor = statusColor.bg;
    }

    const IconComponent = resource.icon || Package;

    return (
        <div className="resource-card">
            {/* Header */}
            <div className="resource-card__header">
                <div className="resource-card__info">
                    <div
                        className="resource-card__icon"
                        style={{ background: statusColor.light }}
                    >
                        <IconComponent size={18} style={{ color: statusColor.bg }} />
                    </div>
                    <div>
                        <h3 className="resource-card__title">{resource.name}</h3>
                        <p className="resource-card__unit">{resource.unit}</p>
                    </div>
                </div>
                <span
                    className="resource-card__status"
                    style={{ background: statusColor.light, color: statusColor.bg }}
                >
                    {resource.status}
                </span>
            </div>

            {/* Progress */}
            <div className="resource-card__progress">
                <div className="resource-card__progress-header">
                    <span className="resource-card__progress-label">{progressLabel}</span>
                    <span className="resource-card__progress-value">{progressValues}</span>
                </div>
                <div
                    className="resource-card__progress-bar"
                    style={{ background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)' }}
                >
                    <div
                        className="resource-card__progress-fill"
                        style={{ width: `${progressPercentage}%`, background: barColor }}
                    />
                </div>
            </div>

            {/* Meta */}
            <div className="resource-card__meta">
                <div className="resource-card__location">
                    <MapPin size={12} />
                    <span>{resource.location}</span>
                </div>
                <div>Updated: {resource.lastUpdated}</div>
            </div>

            {/* Allocate Button */}
            <button
                onClick={() => !isFullyAllocated && onAllocate?.(resource)}
                disabled={isFullyAllocated}
                className="resource-card__allocate-btn"
                style={{
                    border: `1px solid ${isFullyAllocated ? '#9ca3af' : statusColor.light}`,
                    background: isFullyAllocated ? '#9ca3af' : `${statusColor.bg}15`,
                    color: isFullyAllocated ? '#ffffff' : statusColor.bg,
                }}
            >
                {isFullyAllocated ? 'Fully Distributed' : 'Allocate to Shelter'}
            </button>
        </div>
    );
};

export default ResourceCard;
