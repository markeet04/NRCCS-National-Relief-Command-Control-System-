/**
 * ActionButton Component
 * Reusable button with icon support and multiple variants
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import '@styles/css/main.css';

const ActionButton = ({
  children,
  onClick,
  icon: Icon,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  // Map variants to CSS classes
  const variantClass = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    danger: 'btn--danger',
    success: 'btn--success'
  }[variant] || 'btn--primary';

  // Map sizes to CSS classes
  const sizeClass = {
    small: 'btn--sm',
    medium: '',
    large: 'btn--lg'
  }[size] || '';

  const iconSize = {
    small: 14,
    medium: 18,
    large: 20
  }[size] || 18;

  const classes = [
    'btn',
    variantClass,
    sizeClass,
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {Icon && <Icon style={{ width: iconSize, height: iconSize }} />}
      {children}
    </button>
  );
};

export default ActionButton;

