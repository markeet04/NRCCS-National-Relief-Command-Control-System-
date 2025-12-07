import { User } from 'lucide-react';

const MissingPersonCard = ({ person }) => {
  const {
    name,
    age,
    gender,
    lastSeen,
    location,
    description,
    contact,
    photo,
    reportedDate,
    caseNumber,
  } = person;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Photo Section */}
        <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-4">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-full h-48 object-cover rounded"
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 rounded flex items-center justify-center text-gray-500">
              <User size={64} />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="md:w-2/3 p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-600">
                {age} years old • {gender}
              </p>
            </div>
            <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-semibold border border-orange-300">
              MISSING
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-gray-700 min-w-[100px]">
                Last Seen:
              </span>
              <span className="text-sm text-gray-600">{lastSeen}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-gray-700 min-w-[100px]">
                Location:
              </span>
              <span className="text-sm text-gray-600">{location}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-gray-700 min-w-[100px]">
                Description:
              </span>
              <span className="text-sm text-gray-600">{description}</span>
            </div>
            {caseNumber && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-gray-700 min-w-[100px]">
                  Case #:
                </span>
                <span className="text-sm text-gray-600 font-mono">
                  {caseNumber}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Report Information
            </button>
            <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Share
            </button>
          </div>

          {reportedDate && (
            <p className="text-xs text-gray-500 mt-3">
              Reported: {new Date(reportedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonCard;
