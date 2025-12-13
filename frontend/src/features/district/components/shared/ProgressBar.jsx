/**
 * ProgressBar Component
 * Reusable progress/gauge bar with label and percentage
 */

const ProgressBar = ({
  label,
  value,
  max = 100,
  showPercentage = true,
  height = '10px',
  gradient = 'linear-gradient(90deg, #3b82f6, #60a5fa)',
  bgColor,
  colors,
  isLight = false,
  style: customStyle = {}
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const containerStyle = {
    ...customStyle
  };

  const labelRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    color: colors?.textSecondary || (isLight ? '#4b5563' : '#d1d5db')
  };

  const valueStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb')
  };

  const trackStyle = {
    width: '100%',
    height: height,
    borderRadius: '999px',
    background: bgColor || (isLight ? '#e5e7eb' : 'rgba(55, 65, 81, 0.5)'),
    overflow: 'hidden'
  };

  const fillStyle = {
    width: `${percentage}%`,
    height: '100%',
    borderRadius: '999px',
    background: gradient,
    transition: 'width 0.5s ease'
  };

  return (
    <div style={containerStyle}>
      {label && (
        <div style={labelRowStyle}>
          <span style={labelStyle}>{label}</span>
          {showPercentage && (
            <span style={valueStyle}>{percentage}%</span>
          )}
        </div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};

export default ProgressBar;
