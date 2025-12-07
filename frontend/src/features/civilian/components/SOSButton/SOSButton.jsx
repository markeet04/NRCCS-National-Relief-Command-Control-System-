import { Link } from 'react-router-dom';

const SOSButton = ({ onClick, size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'text-sm py-2 px-4',
    medium: 'text-base py-3 px-6',
    large: 'text-lg py-4 px-8',
  };

  return (
    <button
      onClick={onClick}
      className={`
        bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg
        transition-all duration-200 transform hover:scale-105
        shadow-lg hover:shadow-xl border-2 border-red-700
        ${sizeClasses[size]}
        ${className}
      `}
    >
      🚨 EMERGENCY SOS
    </button>
  );
};

export default SOSButton;
