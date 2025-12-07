import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

const AlertBanner = ({ alert, onDismiss }) => {
  const { type, title, message, timestamp, priority } = alert;

  const typeStyles = {
    emergency: 'bg-red-50 border-red-500 text-red-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    success: 'bg-green-50 border-green-500 text-green-900',
  };

  const IconComponent = {
    emergency: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  }[type] || Info;

  return (
    <div
      className={`border-l-4 rounded-lg p-4 mb-4 shadow-md ${
        typeStyles[type] || typeStyles.info
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <IconComponent size={24} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base">{title}</h4>
              {priority === 'high' && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  HIGH PRIORITY
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed mb-2">{message}</p>
            {timestamp && (
              <p className="text-xs opacity-75">
                {new Date(timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold ml-4"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
