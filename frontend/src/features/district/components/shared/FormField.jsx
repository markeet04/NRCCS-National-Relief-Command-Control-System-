/**
 * FormField Component
 * Reusable form field with label and various input types
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import '@styles/css/main.css';

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
  className = ''
}) => {
  const renderInput = () => {
    const commonProps = {
      name,
      value,
      onChange,
      placeholder,
      required,
      className: type === 'select' ? 'select' : (type === 'textarea' ? 'textarea' : 'input')
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
    <div className={`form-group ${className}`}>
      {label && (
        <label className={`form-label ${required ? 'form-label--required' : ''}`}>
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default FormField;

