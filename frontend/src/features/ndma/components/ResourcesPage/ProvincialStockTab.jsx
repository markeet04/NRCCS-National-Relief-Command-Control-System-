import PropTypes from 'prop-types';
import ProvinceResourceCardV2 from './ProvinceResourceCardV2';

/**
 * ProvincialStockTab Component
 * Displays provincial allocation cards in a grid
 */
const ProvincialStockTab = ({
  provincialAllocations,
  onEdit,
  onViewHistory,
  getStatusConfig,
}) => {
  return (
    <div className="province-cards-grid">
      {provincialAllocations.map((allocation) => (
        <ProvinceResourceCardV2
          key={allocation.province}
          allocation={allocation}
          onEdit={onEdit}
          onViewHistory={() => onViewHistory(allocation.province)}
          getStatusConfig={getStatusConfig}
        />
      ))}
    </div>
  );
};

ProvincialStockTab.propTypes = {
  provincialAllocations: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func.isRequired,
  getStatusConfig: PropTypes.func.isRequired,
};

export default ProvincialStockTab;
