import { MapPin } from 'lucide-react';

const ShelterCard = ({ shelter }) => {
  const {
    name,
    address,
    distance,
    capacity,
    currentOccupancy,
    status,
    facilities,
  } = shelter;

  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-300',
    limited: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    full: 'bg-red-100 text-red-800 border-red-300',
  };

  const availableSpace = capacity - currentOccupancy;
  const occupancyPercent = (currentOccupancy / capacity) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            statusColors[status] || statusColors.available
          }`}
        >
          {status?.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <MapPin size={16} />
          <span>{address}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span>{distance} km away</span>
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Capacity</span>
          <span className="font-semibold text-gray-800">
            {currentOccupancy} / {capacity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              occupancyPercent > 80
                ? 'bg-red-500'
                : occupancyPercent > 50
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${occupancyPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {availableSpace} spaces available
        </p>
      </div>

      {facilities && facilities.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Facilities:</p>
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors">
        View Details
      </button>
    </div>
  );
};

export default ShelterCard;
