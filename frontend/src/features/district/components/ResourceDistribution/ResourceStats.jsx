/**
 * ResourceStats Component
 * KPI cards for resource distribution statistics
 */
import '@styles/css/main.css';
import './ResourceDistribution.css';

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

    const stats = [
        {
            title: 'Resource Types',
            value: totalResources,
            subtitle: 'Different types',
            color: '#3b82f6'
        },
        {
            title: 'Total Quantity',
            value: formatQuantity(totalQuantity),
            subtitle: 'Units available',
            color: '#10b981'
        },
        {
            title: 'Distributed',
            value: `${allocatedPercent}%`,
            subtitle: 'To shelters',
            color: '#f59e0b'
        },
        {
            title: 'Available',
            value: formatQuantity(availableQuantity),
            subtitle: 'For allocation',
            color: '#ef4444'
        }
    ];

    return (
        <div className="resource-stats-grid">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="resource-stat-card"
                    style={{ borderLeftColor: stat.color }}
                >
                    <p className="resource-stat-card__title">{stat.title}</p>
                    <p className="resource-stat-card__value" style={{ color: stat.color }}>
                        {stat.value}
                    </p>
                    <p className="resource-stat-card__subtitle">{stat.subtitle}</p>
                </div>
            ))}
        </div>
    );
};

export default ResourceStats;
