import PropTypes from 'prop-types';
import ProvincialStockCard from '../ProvincialStockCard';

/**
 * ProvincialStockTab Component
 * Displays provincial stock cards in a grid - NDMA style layout
 */
const ProvincialStockTab = ({ provincialStock, onViewHistory }) => {
    // Convert resources array to object format if needed
    const stockObject = Array.isArray(provincialStock)
        ? provincialStock.reduce((acc, resource) => {
            const key = resource.id || resource.name?.toLowerCase().replace(/\s+/g, '_') || `resource_${Math.random()}`;
            acc[key] = {
                name: resource.name,
                available: resource.quantity || resource.available || 0,
                allocated: resource.allocated || 0,
                unit: resource.unit || 'units',
                quantity: resource.quantity || resource.available || 0,
            };
            return acc;
        }, {})
        : provincialStock;

    return (
        <div className="national-stock-section">
            <div className="national-stock-grid">
                {Object.entries(stockObject).map(([resourceType, data]) => (
                    <ProvincialStockCard
                        key={resourceType}
                        resourceType={data.name || resourceType}
                        data={data}
                        onViewHistory={() => onViewHistory && onViewHistory({ name: data.name, type: resourceType })}
                    />
                ))}
            </div>
        </div>
    );
};

ProvincialStockTab.propTypes = {
    provincialStock: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
    onViewHistory: PropTypes.func,
};

export default ProvincialStockTab;
