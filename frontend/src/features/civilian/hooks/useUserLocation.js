import { useState, useEffect } from 'react';
import { DEFAULT_LOCATION } from '../constants';

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Fallback location
          setUserLocation(DEFAULT_LOCATION);
        }
      );
    } else {
      setUserLocation(DEFAULT_LOCATION);
    }
  }, []);

  return userLocation;
};

export default useUserLocation;
