const GPSStatusBanner = ({ gpsStatus, location }) => {
  return (
    <div className={`gps-status-banner ${gpsStatus}`}>
      {gpsStatus === 'acquiring' && (
        <>
          <div className="gps-spinner"></div>
          <span>Acquiring GPS location...</span>
        </>
      )}
      {gpsStatus === 'ready' && (
        <>
          <span className="gps-icon">✓</span>
          <span>
            Location Ready • {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
          </span>
        </>
      )}
      {gpsStatus === 'denied' && (
        <>
          <span className="gps-icon">⚠️</span>
          <span>GPS Unavailable • SOS will use network location</span>
        </>
      )}
    </div>
  );
};

export default GPSStatusBanner;
