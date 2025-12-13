/**
 * FormField Component
 * Reusable form field with label and various input types
 */

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  options = [], // For select type
  required = false,
  rows = 4, // For textarea
  colors,
  isLight = false,
  style: customStyle = {}
}) => {
  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: colors?.textSecondary || (isLight ? '#374151' : '#d1d5db'),
    marginBottom: '8px'
  };

  const inputBaseStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    background: colors?.inputBg || (isLight ? '#ffffff' : 'rgba(31, 41, 55, 0.5)'),
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
    ...customStyle
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = colors?.border || (isLight ? '#e5e7eb' : '#374151');
    e.target.style.boxShadow = 'none';
  };

  const renderInput = () => {
    const commonProps = {
      name,
      value,
      onChange,
      placeholder,
      required,
      style: inputBaseStyle,
      onFocus: handleFocus,
      onBlur: handleBlur
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={rows} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default FormField;
