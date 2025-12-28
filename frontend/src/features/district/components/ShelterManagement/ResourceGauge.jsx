/**
 * ResourceGauge Component
 * Half-gauge speedometer style showing resource levels
 */
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import '@styles/css/main.css';
import './ShelterManagement.css';

// Unique colors for each resource type
const RESOURCE_COLORS = {
    food: '#f59e0b',    // Orange
    water: '#3b82f6',   // Blue
    medical: '#ef4444', // Red
    tents: '#22c55e'    // Green
};

// Custom tooltip for resource gauge
const ResourceTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip__title">{data.name}</p>
                <p className="chart-tooltip__value" style={{ color: data.fill }}>
                    {data.actualValue}% remaining
                </p>
            </div>
        );
    }
    return null;
};

const ResourceGauge = ({
    resources = { food: 0, water: 0, medical: 0, tents: 0 },
    animated = true
}) => {
    // Calculate average resources
    const avgResources = Math.round(
        (resources.food + resources.water + resources.medical + resources.tents) / 4
    );

    // Get gauge data for the radial chart with unique colors per resource
    const getResourceGaugeData = () => {
        const resourceTypes = [
            { name: 'Tents', value: resources.tents, key: 'tents' },
            { name: 'Medical', value: resources.medical, key: 'medical' },
            { name: 'Water', value: resources.water, key: 'water' },
            { name: 'Food', value: resources.food, key: 'food' }
        ];

        return resourceTypes.map((r) => ({
            name: r.name,
            value: r.value,
            actualValue: r.value,
            fill: RESOURCE_COLORS[r.key]
        }));
    };

    return (
        <div className="resource-gauge-wrapper">
            {/* Gauge Chart - Larger size */}
            <div className="resource-gauge-chart">
                <ResponsiveContainer width={220} height={170}>
                    <RadialBarChart
                        cx="50%"
                        cy="100%"
                        innerRadius="35%"
                        outerRadius="100%"
                        barSize={10}
                        data={getResourceGaugeData()}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: 'rgba(255,255,255,0.1)' }}
                            dataKey="value"
                            cornerRadius={5}
                            animationDuration={animated ? 1000 : 0}
                        />
                        <Tooltip content={<ResourceTooltip />} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            {/* Label Below Gauge */}
            <div className="resource-gauge-avg">
                <span className="resource-gauge-avg__value">{avgResources}%</span>
                <span className="resource-gauge-avg__label">AVG</span>
            </div>
        </div>
    );
};

// Export colors for use elsewhere
export const getResourceTypeColor = (key) => RESOURCE_COLORS[key] || '#22c55e';

export default ResourceGauge;
