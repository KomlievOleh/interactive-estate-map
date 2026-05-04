import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFlyToSelected({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected?.lat && selected?.lng) {
      map.flyTo([selected.lat, selected.lng], 12, { duration: 0.8 });
    }
  }, [selected, map]);

  return null;
}