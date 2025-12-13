/**
 * ActionButton Component
 * Reusable button with icon support and multiple variants
 */

const ActionButton = ({
  children,
  onClick,
  icon: Icon,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success'
  size = 'medium', // 'small', 'medium', 'large'
  colors,
  isLight = false,
  disabled = false,
  fullWidth = false,
  style: customStyle = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
          border: 'none'
        };
      case 'secondary':
        return {
          background: isLight 
            ? 'rgba(107, 114, 128, 0.1)' 
            : 'rgba(107, 114, 128, 0.2)',
          color: colors?.textPrimary || (isLight ? '#374151' : '#f9fafb'),
          border: `1px solid ${colors?.border || (isLight ? '#d1d5db' : '#4b5563')}`
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          border: 'none'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          color: '#ffffff',
          border: 'none'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '13px',
          borderRadius: '8px',
          iconSize: 14
        };
      case 'medium':
        return {
          padding: '12px 20px',
          fontSize: '14px',
          borderRadius: '12px',
          iconSize: 18
        };
      case 'large':
        return {
          padding: '16px 28px',
          fontSize: '15px',
          borderRadius: '14px',
          iconSize: 20
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles,
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    borderRadius: sizeStyles.borderRadius,
    ...customStyle
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {Icon && <Icon style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }} />}
      {children}
    </button>
  );
};

export default ActionButton;
