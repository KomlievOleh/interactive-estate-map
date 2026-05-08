import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import { useEffect, useMemo } from "react";
import { Navigation, BedDouble, Bath, Ruler } from "lucide-react";
import L from "leaflet";
import { formatPrice } from "../../utils/formatPrice";

function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [map]);

  return null;
}

function createPriceIcon(property, isActive) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background:${isActive ? "rgb(235, 126, 37)" : "#ffffff"};
        color:${isActive ? "#ffffff" : "#0f172a"};
        border:2px solid ${isActive ? "#bfdbfe" : "#e2e8f0"};
        border-radius:999px;
        padding:8px 12px;
        font-weight:800;
        font-size:13px;
        box-shadow:0 14px 30px rgba(0,0,0,.28);
        white-space:nowrap;
        transform:${isActive ? "scale(1.08)" : "scale(1)"};
      ">
        ${formatPrice(property.price).replace(",000", "k")}
      </div>
    `,
    iconSize: [90, 38],
    iconAnchor: [45, 19],
  });
}

function MapController({ selected, properties }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 1) {
      const bounds = L.latLngBounds(
        properties.map((property) => [property.lat, property.lng])
      );

      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 11,
      });
    }
  }, [properties, map]);


  return null;
}



function MarkerWithCenter({ property, isActive, onSelect, icon }) {
  const map = useMap();

  return (
    <Marker
      position={[property.lat, property.lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onSelect(property);

          // 🔥 головна логіка центрування
        //   const offsetLat = property.lat + 0.01; // підбирається
          map.flyTo([property.lat, property.lng], map.getZoom(), {
            duration: 0.6,
          });
        
          setTimeout(() => {
            map.panBy([0, -200], {
            animate: true,
            duration: 0.3,
            });
          }, 650);          
        },
      }}
    >
      <Popup >
        <div className="w-64 text-slate-900">
            <img
                src={property.image}
                alt={property.title}
                className="mb-3 h-28 w-full rounded-xl object-cover"
            />
            <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                    <strong className="block text-base">{property.title}</strong>
                    <p className="text-sm text-slate-500">{property.city}</p>
                </div>

                <span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-bold text-white">
                    {property.type}
                </span>
            </div>

            <p className="mb-3 text-lg font-bold text-emerald-700">
                {formatPrice(property.price)}
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                    <BedDouble className="h-3 w-3" />
                    {property.beds}
                </span>

                <span className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {property.baths}
                </span>

                <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    {property.area} ft²
                </span>
            </div>

            <button
                onClick={() => onSelect(property)}
                className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-500"
            >
                View details
            </button>
        </div>
      </Popup>
    </Marker>
  );
}


export default function PropertyMap({ properties, selected, onSelect }) {
  const center = selected?.lat && selected?.lng
    ? [selected.lat, selected.lng] : [39.8283, -98.5795];
    
  const markerIcons = useMemo(() => {
    return properties.reduce((acc, property) => {
      acc[property.id] = createPriceIcon(property, selected?.id === property.id);
      return acc;
    }, {});
  }, [properties, selected]);
    
    return (
    <div className="relative min-h-[560px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-md dark:border-white/10 dark:bg-slate-900">
        <div className="absolute left-3 top-3 z-[500] flex items-center gap-4 rounded-md border border-slate-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Navigation className="h-4 w-4 text-orange-500 dark:text-orange-300" />
                <span>Interactive property map</span>
            </div>
            <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {properties.length} pins
            </p>
        </div>
        <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom
            zoomControl={false} 
            // className="h-[80vh] w-full"
            style={{ height: "560px", width: "100%" }}    
        >
            {/* <ZoomControl position="topright" /> */}
            <FixMapSize />
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController selected={selected} properties={properties} />
            {properties.map((property) => (
                <MarkerWithCenter
                    key={property.id}
                    property={property}
                    icon={markerIcons[property.id]}
                    onSelect={onSelect}
                />
            ))}
        </MapContainer>
            
        {/* <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom
            zoomControl={false}
            style={{ height: "560px", width: "100%" }}
            >
            <FixMapSize />

            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

        </MapContainer> */}



    </div>
  );
}