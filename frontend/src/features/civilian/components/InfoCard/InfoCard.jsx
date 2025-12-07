const InfoCard = ({ icon, title, value, subtitle, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-300 text-blue-900',
    green: 'bg-green-50 border-green-300 text-green-900',
    red: 'bg-red-50 border-red-300 text-red-900',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-900',
    purple: 'bg-purple-50 border-purple-300 text-purple-900',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        ${colorClasses[color] || colorClasses.blue}
        border-2 rounded-lg p-5 shadow-md hover:shadow-lg 
        transition-all duration-300 
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        w-full
      `}
    >
      <div className="flex items-center gap-4">
        {icon && <span className="text-4xl">{icon}</span>}
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold opacity-80 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Component>
  );
};

export default InfoCard;
