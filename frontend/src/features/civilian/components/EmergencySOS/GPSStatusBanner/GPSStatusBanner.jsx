import { Check, AlertTriangle, Loader } from 'lucide-react';

const GPSStatusBanner = ({ gpsStatus, location }) => {
  return (
    <div className={`gps-status-banner ${gpsStatus}`}>
      {gpsStatus === 'acquiring' && (
        <>
          <Loader className="gps-spinner" size={20} />
          <span>Acquiring GPS location...</span>
        </>
      )}
      {gpsStatus === 'ready' && (
        <>
          <span className="gps-icon">
            <Check size={20} />
          </span>
          <span>
            Location Ready • {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
          </span>
        </>
      )}
      {gpsStatus === 'denied' && (
        <>
          <span className="gps-icon">
            <AlertTriangle size={20} />
          </span>
          <span>GPS Unavailable • SOS will use network location</span>
        </>
      )}
    </div>
  );
};

export default GPSStatusBanner;
