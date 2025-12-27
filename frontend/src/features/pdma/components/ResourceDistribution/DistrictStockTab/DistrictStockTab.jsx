import PropTypes from 'prop-types';
import DistrictResourceCardV2 from '../DistrictResourceCardV2/DistrictResourceCardV2';

/**
 * DistrictStockTab Component
 * Displays district allocation cards in a grid (PDMA version of Provincial Stock)
 */
const DistrictStockTab = ({
  districtAllocations,
  onEdit,
  onViewHistory,
  getStatusConfig,
}) => {
  return (
    <div className="district-cards-grid">
      {districtAllocations.map((allocation) => (
        <DistrictResourceCardV2
          key={allocation.district}
          allocation={allocation}
          onEdit={onEdit}
          onViewHistory={() => onViewHistory(allocation.district)}
          getStatusConfig={getStatusConfig}
        />
      ))}
    </div>
  );
};

DistrictStockTab.propTypes = {
  districtAllocations: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func.isRequired,
  getStatusConfig: PropTypes.func.isRequired,
};

export default DistrictStockTab;
