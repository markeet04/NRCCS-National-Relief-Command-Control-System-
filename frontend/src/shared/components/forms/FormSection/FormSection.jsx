/**
 * FormSection Component
 * Groups related form fields with optional title
 */
const FormSection = ({ 
  title,
  description,
  children,
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
