import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapViewController = ({ center, zoom, selectedShelter }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedShelter) {
      map.flyTo([selectedShelter.latitude, selectedShelter.longitude], 14, {
        duration: 1
      });
    }
  }, [selectedShelter, map]);
  
  return null;
};

export default MapViewController;
