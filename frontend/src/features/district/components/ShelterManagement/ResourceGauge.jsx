/**
 * ResourceGauge Component
 * Radial bar chart showing average resource levels
 */
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import '@styles/css/main.css';
import './ShelterManagement.css';

// Custom tooltip for resource gauge
const ResourceTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip__title">{data.name}</p>
                <p className="chart-tooltip__value" style={{ color: data.fill }}>
                    {data.value}% remaining
                </p>
            </div>
        );
    }
    return null;
};

const ResourceGauge = ({
    resources = { food: 0, water: 0, medical: 0, tents: 0 },
    getResourceColor,
    animated = false,
    size = 'md' // 'sm', 'md', 'lg'
}) => {
    // Calculate average resources
    const avgResources = Math.round(
        (resources.food + resources.water + resources.medical + resources.tents) / 4
    );

    // Get gauge data for the radial chart
    const getResourceGaugeData = () => {
        const resourceTypes = [
            { name: 'Food', value: resources.food, key: 'food' },
            { name: 'Water', value: resources.water, key: 'water' },
            { name: 'Medical', value: resources.medical, key: 'medical' },
            { name: 'Tents', value: resources.tents, key: 'tents' }
        ];

        return resourceTypes.map((r, index) => ({
            name: r.name,
            value: animated ? r.value : 0,
            fill: getResourceColor ? getResourceColor(r.value) : getDefaultColor(r.value),
            innerRadius: 20 + (index * 10),
            outerRadius: 28 + (index * 10)
        }));
    };

    const getDefaultColor = (value) => {
        if (value >= 70) return '#22c55e';
        if (value >= 40) return '#f59e0b';
        return '#ef4444';
    };

    const sizeConfig = {
        sm: { width: 80, height: 80 },
        md: { width: 100, height: 100 },
        lg: { width: 120, height: 120 }
    };

    const { width, height } = sizeConfig[size] || sizeConfig.md;

    return (
        <div className="resource-gauge" style={{ width, height, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="25%"
                    outerRadius="100%"
                    data={getResourceGaugeData()}
                    startAngle={90}
                    endAngle={-270}
                >
                    <RadialBar
                        background={{ fill: 'rgba(255,255,255,0.05)' }}
                        dataKey="value"
                        cornerRadius={4}
                        animationDuration={1000}
                    />
                    <Tooltip content={<ResourceTooltip />} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="resource-gauge__center">
                <span className="resource-gauge__value">{avgResources}%</span>
                <span className="resource-gauge__label">AVG</span>
            </div>
        </div>
    );
};

export default ResourceGauge;
