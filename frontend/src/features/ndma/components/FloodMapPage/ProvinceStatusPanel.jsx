import PropTypes from 'prop-types';
import { Droplets, Building2, Users } from 'lucide-react';

/**
 * Get risk level class based on water level percentage
 */
const getRiskLevel = (waterLevel) => {
  if (waterLevel >= 90) return 'critical';
  if (waterLevel >= 75) return 'high';
  if (waterLevel >= 50) return 'medium';
  return 'low';
};

/**
 * Format number with commas
 */
const formatNumber = (num) => {
  return num?.toLocaleString() || '0';
};

/**
 * ProvinceStatusPanel Component
 * Right column panel showing province list with status cards
 */
const ProvinceStatusPanel = ({
  provinces,
  selectedProvince,
  onProvinceSelect,
  simulationEnabled,
  onRefreshWeather,
}) => {
  return (
    <div className="flood-province-card">
      <div className="flood-province-header">
        <h3>Province Status</h3>
        <span className="flood-province-count">{provinces.length} regions</span>
      </div>

      <div className="flood-province-list">
        {provinces.map(province => {
          const riskLevel = getRiskLevel(province.waterLevel);
          const isSelected = selectedProvince?.id === province.id;

          return (
            <div
              key={province.id}
              className={`flood-province-item ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                onProvinceSelect(province);
                // Auto-fetch weather when selecting a province (in LIVE mode only)
                if (!simulationEnabled && onRefreshWeather) {
                  onRefreshWeather(province.id);
                }
              }}
            >
              {/* Header: Name + Risk Badge */}
              <div className="flood-province-item-header">
                <span className="flood-province-name">{province.name}</span>
                <span className={`flood-risk-badge ${province.floodRisk}`}>
                  {province.floodRisk}
                </span>
              </div>

              {/* Water Level Progress Bar */}
              <div className="flood-water-level">
                <div className="flood-water-level-header">
                  <span className="flood-water-level-label">
                    <Droplets className="w-3 h-3" />
                    Water Level
                  </span>
                  <span className={`flood-water-level-value ${riskLevel}`}>
                    {province.waterLevel}%
                  </span>
                </div>
                <div className="flood-progress-bar">
                  <div
                    className={`flood-progress-fill ${riskLevel}`}
                    style={{ width: `${province.waterLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flood-province-stats">
                <div className="flood-province-stat">
                  <Building2 className="flood-province-stat-icon" />
                  <span className="flood-province-stat-value">{province.affectedDistricts}</span>
                  <span className="flood-province-stat-label">districts</span>
                </div>
                <div className="flood-province-stat">
                  <Users className="flood-province-stat-icon" />
                  <span className="flood-province-stat-value">{formatNumber(province.evacuated)}</span>
                  <span className="flood-province-stat-label">evacuated</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ProvinceStatusPanel.propTypes = {
  provinces: PropTypes.array.isRequired,
  selectedProvince: PropTypes.object,
  onProvinceSelect: PropTypes.func.isRequired,
  simulationEnabled: PropTypes.bool,
  onRefreshWeather: PropTypes.func,
};

ProvinceStatusPanel.defaultProps = {
  selectedProvince: null,
  simulationEnabled: false,
  onRefreshWeather: null,
};

export default ProvinceStatusPanel;
