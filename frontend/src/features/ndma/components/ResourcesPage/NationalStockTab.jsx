import PropTypes from 'prop-types';
import NationalStockCard from './NationalStockCard';

/**
 * NationalStockTab Component
 * Displays national stock cards in a grid
 */
const NationalStockTab = ({ nationalStock, onViewHistory }) => {
  return (
    <div className="national-stock-section">
      <div className="national-stock-grid">
        {Object.entries(nationalStock).map(([resourceType, data]) => (
          <NationalStockCard
            key={resourceType}
            resourceType={resourceType}
            data={data}
            onViewHistory={() => onViewHistory(resourceType, data.label || resourceType)}
          />
        ))}
      </div>
    </div>
  );
};

NationalStockTab.propTypes = {
  nationalStock: PropTypes.object.isRequired,
  onViewHistory: PropTypes.func.isRequired,
};

export default NationalStockTab;
