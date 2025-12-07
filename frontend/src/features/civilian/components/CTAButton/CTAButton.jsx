const CTAButton = ({ children, onClick, variant = 'primary', size = 'medium', icon, className = '' }) => {
  const variants = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white border-sky-600',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white border-gray-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-red-600',
    success: 'bg-green-500 hover:bg-green-600 text-white border-green-600',
    outline: 'bg-transparent border-sky-500 text-sky-600 hover:bg-sky-50',
  };

  const sizes = {
    small: 'text-sm py-2 px-4',
    medium: 'text-base py-3 px-6',
    large: 'text-lg py-4 px-8',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-lg border-2
        transition-all duration-200
        hover:shadow-lg
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default CTAButton;
