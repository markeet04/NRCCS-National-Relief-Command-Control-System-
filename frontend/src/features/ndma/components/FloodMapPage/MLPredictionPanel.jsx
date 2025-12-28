import PropTypes from 'prop-types';
import { useSettings } from '@app/providers/ThemeProvider';

/**
 * Province ID mapping for backend
 */
const PROVINCE_ID_MAP = {
  'pb': 1,      // Punjab
  'sd': 2,      // Sindh
  'kp': 3,      // Khyber Pakhtunkhwa
  'bl': 4,      // Balochistan
  'gb': 5,      // Gilgit-Baltistan
  'ajk': 6,     // Azad Kashmir
  'ict': 1,     // Islamabad (defaults to Punjab region)
  // Legacy full names for backward compatibility
  'punjab': 1,
  'sindh': 2,
  'kpk': 3,
  'balochistan': 4,
  'gilgit': 5,
  'azadkashmir': 6
};

/**
 * Theme-aware colors for ML Prediction Panel
 */
const getThemeColors = (theme) => ({
  panelBg: theme === 'light'
    ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  borderColor: theme === 'light' ? '#cbd5e1' : 'rgba(59, 130, 246, 0.3)',
  textPrimary: theme === 'light' ? '#1e293b' : '#fff',
  textMuted: theme === 'light' ? '#64748b' : '#94a3b8',
  selectBg: theme === 'light' ? '#ffffff' : '#1e293b',
  selectBorder: theme === 'light' ? '#cbd5e1' : '#475569',
  weatherWidgetBg: theme === 'light' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.1)',
  weatherWidgetBorder: theme === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)',
});

/**
 * MLPredictionPanel Component
 * ML Flood Prediction control panel with simulation mode toggle
 */
const MLPredictionPanel = ({
  simulationEnabled,
  onSimulationToggle,
  simulationScenario,
  onScenarioChange,
  liveWeatherData,
  predictionResult,
  isPredicting,
  selectedProvince,
  onRunPrediction,
}) => {
  // Theme support
  const { theme } = useSettings();
  const colors = getThemeColors(theme);

  const handleRunPrediction = () => {
    const provinceId = selectedProvince?.id ?
      (PROVINCE_ID_MAP[selectedProvince.id.toLowerCase()] || 1) : 1;
    onRunPrediction(provinceId, true);
  };

  return (
    <div className="flood-province-card ml-prediction-card" style={{ marginBottom: '10px', background: colors.panelBg, flex: '0 0 auto' }}>
      {/* Compact Header */}
      <div className="flood-province-header" style={{ borderBottom: `1px solid ${colors.borderColor}`, padding: '8px 12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          🔮 ML Flood Prediction
        </h3>
        <span style={{
          background: simulationEnabled ? '#f59e0b' : '#22c55e',
          color: '#000',
          padding: '1px 6px',
          borderRadius: '3px',
          fontSize: '8px',
          fontWeight: '600'
        }}>
          {simulationEnabled ? 'SIM' : 'LIVE'}
        </span>
      </div>

      <div style={{ padding: '10px' }}>
        {/* Simulation Mode Toggle - Compact */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.textMuted, fontSize: '10px' }}>Simulation Mode</span>
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '44px',
            height: '24px'
          }}>
            <input
              type="checkbox"
              checked={simulationEnabled}
              onChange={(e) => onSimulationToggle(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              inset: 0,
              backgroundColor: simulationEnabled ? '#3b82f6' : '#475569',
              borderRadius: '24px',
              transition: '0.3s',
            }}>
              <span style={{
                position: 'absolute',
                height: '18px',
                width: '18px',
                left: simulationEnabled ? '22px' : '3px',
                bottom: '3px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                transition: '0.3s',
              }} />
            </span>
          </label>
        </div>

        {/* Scenario Selector (only when simulation enabled) - Compact */}
        {simulationEnabled && (
          <div style={{ marginBottom: '8px' }}>
            <label style={{ color: colors.textMuted, fontSize: '9px', display: 'block', marginBottom: '3px' }}>
              Scenario
            </label>
            <select
              value={simulationScenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: '5px',
                border: `1px solid ${colors.selectBorder}`,
                backgroundColor: colors.selectBg,
                color: colors.textPrimary,
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              <option value="normal">🌤️ Normal Weather</option>
              <option value="heavy_rain">🌧️ Heavy Rain</option>
              <option value="extreme_event">🌊 Extreme Event</option>
            </select>
          </div>
        )}

        {/* Live Weather Widget - Compact version */}
        {!simulationEnabled && liveWeatherData && (
          <div style={{
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '6px',
            background: colors.weatherWidgetBg,
            border: `1px solid ${colors.weatherWidgetBorder}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: '600' }}>
                🌤️ {liveWeatherData.provinceName}
              </span>
              <span style={{ color: '#64748b', fontSize: '9px' }}>
                {new Date(liveWeatherData.fetchedAt).toLocaleTimeString()}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px', color: colors.textMuted }}>
              <span>🌧️ 24h: <strong style={{ color: colors.textPrimary }}>{liveWeatherData.rainfall_24h}mm</strong></span>
              <span>🌧️ 48h: <strong style={{ color: colors.textPrimary }}>{liveWeatherData.rainfall_48h}mm</strong></span>
              <span>🌡️ <strong style={{ color: colors.textPrimary }}>{liveWeatherData.temperature}°C</strong></span>
              <span>💧 <strong style={{ color: colors.textPrimary }}>{liveWeatherData.humidity}%</strong></span>
            </div>
          </div>
        )}

        {/* Run Prediction Button - Compact */}
        <button
          onClick={handleRunPrediction}
          disabled={isPredicting}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            background: isPredicting ? '#475569' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '11px',
            cursor: isPredicting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {isPredicting ? '⏳ Analyzing...' : '🔍 Run Prediction'}
        </button>

        {/* Prediction Result */}
        {predictionResult && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            borderRadius: '8px',
            background: predictionResult.flood_risk === 'High' ? 'rgba(239, 68, 68, 0.15)' :
              predictionResult.flood_risk === 'Medium' ? 'rgba(245, 158, 11, 0.15)' :
                'rgba(34, 197, 94, 0.15)',
            border: `1px solid ${predictionResult.flood_risk === 'High' ? '#ef4444' :
              predictionResult.flood_risk === 'Medium' ? '#f59e0b' : '#22c55e'}`
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: predictionResult.flood_risk === 'High' ? '#ef4444' :
                predictionResult.flood_risk === 'Medium' ? '#f59e0b' : '#22c55e',
              marginBottom: '4px'
            }}>
              {predictionResult.flood_risk === 'High' ? '🚨' :
                predictionResult.flood_risk === 'Medium' ? '⚠️' : '✅'} {predictionResult.flood_risk} Risk
            </div>
            <div style={{ color: colors.textMuted, fontSize: '11px' }}>
              Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
            </div>
            {predictionResult.simulationMode && (
              <div style={{ color: '#f59e0b', fontSize: '10px', marginTop: '4px' }}>
                ⚡ Simulation: {predictionResult.simulationScenario}
              </div>
            )}
            {/* Show real weather data in LIVE mode */}
            {!predictionResult.simulationMode && liveWeatherData && (
              <div style={{
                color: '#3b82f6',
                fontSize: '10px',
                marginTop: '6px',
                padding: '6px',
                background: colors.weatherWidgetBg,
                borderRadius: '4px'
              }}>
                🌤️ <strong>Live Weather ({liveWeatherData.provinceName}):</strong><br />
                🌧️ Rain 24h: {liveWeatherData.rainfall_24h}mm | 48h: {liveWeatherData.rainfall_48h}mm<br />
                🌡️ Temp: {liveWeatherData.temperature}°C | 💧 Humidity: {liveWeatherData.humidity}%
              </div>
            )}
            {predictionResult.alertGenerated && (
              <div style={{ color: '#3b82f6', fontSize: '10px', marginTop: '4px' }}>
                🔔 Alert #{predictionResult.alertId} created
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

MLPredictionPanel.propTypes = {
  simulationEnabled: PropTypes.bool,
  onSimulationToggle: PropTypes.func.isRequired,
  simulationScenario: PropTypes.string,
  onScenarioChange: PropTypes.func.isRequired,
  liveWeatherData: PropTypes.object,
  predictionResult: PropTypes.object,
  isPredicting: PropTypes.bool,
  selectedProvince: PropTypes.object,
  onRunPrediction: PropTypes.func.isRequired,
};

MLPredictionPanel.defaultProps = {
  simulationEnabled: false,
  simulationScenario: 'normal',
  liveWeatherData: null,
  predictionResult: null,
  isPredicting: false,
  selectedProvince: null,
};

export default MLPredictionPanel;
