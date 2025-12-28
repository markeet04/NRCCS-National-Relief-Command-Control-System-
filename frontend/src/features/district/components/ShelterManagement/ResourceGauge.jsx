/**
 * ResourceDonut Component
 * Full circle donut chart showing resource distribution ratio
 */
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '@styles/css/main.css';
import './ShelterManagement.css';

// Unique colors for each resource type
const RESOURCE_COLORS = {
    food: '#f59e0b',    // Orange
    water: '#3b82f6',   // Blue
    medical: '#ef4444', // Red
    shelter: '#22c55e'  // Green (renamed from tents)
};

// Resource labels
const RESOURCE_LABELS = {
    food: 'Food',
    water: 'Water',
    medical: 'Medical',
    shelter: 'Shelter'
};

// Custom tooltip for donut chart
const DonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip__title">{data.name}</p>
                <p className="chart-tooltip__value" style={{ color: data.fill }}>
                    {data.quantity} units ({data.percentage}%)
                </p>
            </div>
        );
    }
    return null;
};

const ResourceDonut = ({
    resources = { food: 0, water: 0, medical: 0, shelter: 0 },
    capacity = 500,
    animated = true
}) => {
    // Calculate quantities based on capacity and percentage
    // Each resource percentage represents how much of that type is available
    // We estimate quantities proportionally to capacity
    const calculateQuantity = (percentage) => {
        // Base quantity calculation: percentage of capacity
        return Math.round((percentage / 100) * capacity);
    };

    const quantities = {
        food: calculateQuantity(resources.food),
        water: calculateQuantity(resources.water),
        medical: calculateQuantity(resources.medical),
        shelter: calculateQuantity(resources.shelter ?? resources.tents ?? 0)
    };

    const totalQuantity = quantities.food + quantities.water + quantities.medical + quantities.shelter;

    // Get donut chart data
    const getDonutData = () => {
        const data = [
            { name: 'Food', quantity: quantities.food, key: 'food' },
            { name: 'Water', quantity: quantities.water, key: 'water' },
            { name: 'Medical', quantity: quantities.medical, key: 'medical' },
            { name: 'Shelter', quantity: quantities.shelter, key: 'shelter' }
        ];

        // Filter out zero values for cleaner chart, but keep at least one segment
        const filteredData = data.filter(d => d.quantity > 0);
        
        // If all are zero, show empty state
        if (filteredData.length === 0) {
            return [{ name: 'No Resources', quantity: 1, key: 'empty', percentage: 0 }];
        }

        return filteredData.map(d => ({
            ...d,
            fill: RESOURCE_COLORS[d.key],
            percentage: totalQuantity > 0 ? Math.round((d.quantity / totalQuantity) * 100) : 0
        }));
    };

    const donutData = getDonutData();
    const isEmpty = donutData[0]?.key === 'empty';

    return (
        <div className="resource-donut-wrapper">
            {/* Donut Chart */}
            <div className="resource-donut-chart">
                <ResponsiveContainer width={100} height={100}>
                    <PieChart>
                        <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={28}
                            outerRadius={45}
                            paddingAngle={isEmpty ? 0 : 2}
                            dataKey="quantity"
                            animationDuration={animated ? 800 : 0}
                            stroke="none"
                        >
                            {donutData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={isEmpty ? 'rgba(128,128,128,0.3)' : entry.fill} 
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="resource-donut-center">
                    <span className="resource-donut-center__value">{totalQuantity}</span>
                    <span className="resource-donut-center__label">units</span>
                </div>
            </div>
        </div>
    );
};

// Export for quantity display
export const getQuantities = (resources, capacity) => {
    const calculateQuantity = (percentage) => Math.round((percentage / 100) * capacity);
    return {
        food: calculateQuantity(resources.food),
        water: calculateQuantity(resources.water),
        medical: calculateQuantity(resources.medical),
        shelter: calculateQuantity(resources.shelter ?? resources.tents ?? 0)
    };
};

// Export colors for use elsewhere
export const getResourceTypeColor = (key) => RESOURCE_COLORS[key] || '#22c55e';
export { RESOURCE_COLORS, RESOURCE_LABELS };

export default ResourceDonut;
