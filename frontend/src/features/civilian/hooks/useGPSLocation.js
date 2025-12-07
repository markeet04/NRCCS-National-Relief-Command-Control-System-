import { useState, useEffect } from 'react';
import { GPS_STATUS } from '../constants';

const useGPSLocation = () => {
  const [gpsStatus, setGpsStatus] = useState(GPS_STATUS.ACQUIRING);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setGpsStatus(GPS_STATUS.READY);
          },
          (error) => {
            console.error('GPS Error:', error);
            setGpsStatus(GPS_STATUS.DENIED);
          }
        );
      } else {
        // Fallback for testing
        setLocation({
          latitude: 33.6844,
          longitude: 73.0479,
        });
        setGpsStatus(GPS_STATUS.READY);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return { gpsStatus, location };
};

export default useGPSLocation;
