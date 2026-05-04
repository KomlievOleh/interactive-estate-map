import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Search, MapPin, BedDouble, Bath, Ruler, Heart, SlidersHorizontal, Building2, Star, Phone, Mail, Sparkles, Navigation, Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const properties = [
  { id: 1, title: "Modern Family House", type: "House", city: "Austin", address: "West Lake Hills, Austin, TX", price: 685000, beds: 4, baths: 3, area: 2450, rating: 4.9, featured: true, lat: 30.297, lng: -97.801, tags: ["family", "quiet", "backyard", "schools", "garage"], image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", description: "Spacious family home with open-plan living, private backyard, premium kitchen, and quiet neighborhood access." },
  { id: 2, title: "Downtown Skyline Apartment", type: "Apartment", city: "Miami", address: "Brickell Avenue, Miami, FL", price: 425000, beds: 2, baths: 2, area: 1180, rating: 4.8, featured: true, lat: 25.7617, lng: -80.1918, tags: ["downtown", "gym", "parking", "view", "walkable"], image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", description: "Bright city apartment with panoramic skyline views, gym access, secure parking, and walkable lifestyle." },
  { id: 3, title: "Cozy Suburban Townhouse", type: "Townhouse", city: "Denver", address: "Cherry Creek, Denver, CO", price: 355000, beds: 3, baths: 2, area: 1640, rating: 4.7, featured: false, lat: 39.7178, lng: -104.948, tags: ["parks", "schools", "family", "suburban", "transport"], image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", description: "Comfortable townhouse near parks, schools, local cafes, and public transport connections." },
  { id: 4, title: "Luxury Beach Villa", type: "Villa", city: "Malibu", address: "Pacific Coast Highway, Malibu, CA", price: 1250000, beds: 5, baths: 4, area: 3820, rating: 5.0, featured: true, lat: 34.0259, lng: -118.7798, tags: ["luxury", "beach", "pool", "ocean", "terrace"], image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", description: "Premium coastal villa with ocean views, large terrace, pool area, and designer interior details." },
  { id: 5, title: "Minimal Studio Loft", type: "Studio", city: "New York", address: "Williamsburg, Brooklyn, NY", price: 295000, beds: 1, baths: 1, area: 720, rating: 4.6, featured: false, lat: 40.7081, lng: -73.9571, tags: ["cheap", "studio", "loft", "city", "compact"], image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", description: "Compact studio loft with modern finishes, exposed brick, natural light, and efficient city living." },
  { id: 6, title: "Green Hills Residence", type: "House", city: "Seattle", address: "Queen Anne, Seattle, WA", price: 735000, beds: 4, baths: 3, area: 2680, rating: 4.9, featured: false, lat: 47.6379, lng: -122.357, tags: ["green", "eco", "garden", "garage", "quiet"], image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80", description: "Elegant hillside residence with large windows, eco-friendly materials, garage, and garden space." },
];

const examples = ["cheap studio in New York", "family house near schools", "luxury villa with pool near beach", "apartment downtown with parking", "quiet eco house with garden"];

const formatPrice = (price) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

function parseAiSearch(input) {
  const text = input.toLowerCase();
  const filters = { city: "", type: "All", maxPrice: 1300000, minBeds: 0, tags: [] };
  const cities = ["austin", "miami", "denver", "malibu", "new york", "seattle"];
  const foundCity = cities.find((city) => text.includes(city));
  if (foundCity) filters.city = foundCity;
  if (text.includes("studio")) filters.type = "Studio";
  if (text.includes("apartment") || text.includes("flat")) filters.type = "Apartment";
  if (text.includes("house") || text.includes("home")) filters.type = "House";
  if (text.includes("townhouse")) filters.type = "Townhouse";
  if (text.includes("villa")) filters.type = "Villa";
  if (text.includes("cheap") || text.includes("budget") || text.includes("affordable")) filters.maxPrice = 400000;
  if (text.includes("mid") || text.includes("medium")) filters.maxPrice = 750000;
  if (text.includes("2 bed") || text.includes("2 bedroom")) filters.minBeds = 2;
  if (text.includes("3 bed") || text.includes("3 bedroom")) filters.minBeds = 3;
  if (text.includes("4 bed") || text.includes("4 bedroom")) filters.minBeds = 4;
  const tagWords = ["family", "quiet", "backyard", "schools", "garage", "downtown", "gym", "parking", "view", "walkable", "parks", "suburban", "transport", "luxury", "beach", "pool", "ocean", "terrace", "cheap", "loft", "city", "green", "eco", "garden"];
  filters.tags = tagWords.filter((tag) => text.includes(tag));
  return filters;
}

function getMapBounds(items) {
  if (!items.length) return null;
  const lats = items.map((item) => item.lat);
  const lngs = items.map((item) => item.lng);
  return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
}

export default function RealEstateDemo() {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("family house near schools");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1300000);
  const [selected, setSelected] = useState(properties[0]);
  const [favorites, setFavorites] = useState([]);
  const [aiFilters, setAiFilters] = useState(parseAiSearch("family house near schools"));

  const types = ["All", ...new Set(properties.map((item) => item.type))];

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchable = `${property.title} ${property.city} ${property.address} ${property.type} ${property.tags.join(" ")}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesManualType = type === "All" || property.type === type;
      const matchesAiType = aiFilters.type === "All" || property.type === aiFilters.type;
      const matchesCity = !aiFilters.city || property.city.toLowerCase().includes(aiFilters.city);
      const matchesPrice = property.price <= Math.min(maxPrice, aiFilters.maxPrice);
      const matchesBeds = property.beds >= aiFilters.minBeds;
      const matchesTags = aiFilters.tags.length === 0 || aiFilters.tags.some((tag) => property.tags.includes(tag));
      return matchesQuery && matchesManualType && matchesAiType && matchesCity && matchesPrice && matchesBeds && matchesTags;
    });
  }, [query, type, maxPrice, aiFilters]);

  const runAiSearch = (value = aiQuery) => {
    const nextFilters = parseAiSearch(value);
    setAiQuery(value);
    setAiFilters(nextFilters);
    setType("All");
    setMaxPrice(1300000);
    const firstMatch = properties.find((property) => {
      const matchesType = nextFilters.type === "All" || property.type === nextFilters.type;
      const matchesCity = !nextFilters.city || property.city.toLowerCase().includes(nextFilters.city);
      const matchesPrice = property.price <= nextFilters.maxPrice;
      const matchesBeds = property.beds >= nextFilters.minBeds;
      const matchesTags = nextFilters.tags.length === 0 || nextFilters.tags.some((tag) => property.tags.includes(tag));
      return matchesType && matchesCity && matchesPrice && matchesBeds && matchesTags;
    });
    if (firstMatch) setSelected(firstMatch);
  };

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <Sparkles className="h-4 w-4" /> AI-powered real estate map
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">Search properties like you talk to an agent.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">Type requests like “cheap studio in New York” or “luxury villa with pool near beach” and the app filters listings on a map-first interface.</p>
            <Card className="mt-8 rounded-[2rem] border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <Wand2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300" />
                  <input value={aiQuery} onChange={(event) => setAiQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runAiSearch()} placeholder="Try: family house near schools" className="h-14 w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-12 pr-4 text-white outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-4" />
                </label>
                <Button onClick={() => runAiSearch()} className="h-14 rounded-2xl px-6">AI Search</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {examples.map((example) => <button key={example} onClick={() => runAiSearch(example)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">{example}</button>)}
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65 }}>
            <MapHero properties={filteredProperties} selected={selected} onSelect={setSelected} bounds={getMapBounds(filteredProperties)} />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Card className="rounded-[2rem] border-white/10 bg-white/10 p-4 backdrop-blur">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_260px]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Manual search by city, address, or property name" className="h-14 w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-12 pr-4 text-white outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-4" />
            </label>
            <div className="relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select value={type} onChange={(event) => setType(event.target.value)} className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/80 pl-12 pr-4 text-white outline-none ring-blue-500/40 focus:ring-4">
                {types.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>Manual max price</span><span>{formatPrice(maxPrice)}</span></div>
              <input type="range" min="250000" max="1300000" step="25000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full" />
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-12 lg:grid-cols-[1fr_390px] lg:px-8">
        <div>
          <div className="mb-5"><p className="text-sm uppercase tracking-[0.25em] text-blue-300">Map matched results</p><h2 className="mt-2 text-3xl font-bold">{filteredProperties.length} listings found</h2></div>
          <div className="grid gap-5 md:grid-cols-2">
            {filteredProperties.map((property, index) => (
              <motion.article key={property.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.04 }} onClick={() => setSelected(property)} className={`cursor-pointer overflow-hidden rounded-[1.75rem] border bg-white/10 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/15 ${selected.id === property.id ? "border-blue-400" : "border-white/10"}`}>
                <div className="relative">
                  <img src={property.image} alt={property.title} className="h-56 w-full object-cover" />
                  <button onClick={(event) => { event.stopPropagation(); toggleFavorite(property.id); }} className="absolute right-4 top-4 rounded-full bg-slate-950/75 p-3 backdrop-blur transition hover:scale-105" aria-label="Add to favorites"><Heart className={`h-5 w-5 ${favorites.includes(property.id) ? "fill-white" : ""}`} /></button>
                  {property.featured && <span className="absolute left-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-sm font-semibold text-slate-950">Featured</span>}
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold">{property.title}</h3><p className="mt-1 flex items-center gap-2 text-sm text-slate-300"><MapPin className="h-4 w-4" /> {property.city}</p></div><p className="text-lg font-bold text-emerald-300">{formatPrice(property.price)}</p></div>
                  <div className="grid grid-cols-3 gap-3 text-sm text-slate-300"><Feature icon={<BedDouble className="h-4 w-4" />} text={`${property.beds} beds`} /><Feature icon={<Bath className="h-4 w-4" />} text={`${property.baths} baths`} /><Feature icon={<Ruler className="h-4 w-4" />} text={`${property.area} ft²`} /></div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
        <aside className="lg:sticky lg:top-6 lg:h-fit"><PropertyDetails selected={selected} /></aside>
      </section>
    </main>
  );
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapFlyToSelected({ selected }) {
  const map = useMap();

  React.useEffect(() => {
    if (selected?.lat && selected?.lng) {
      map.flyTo([selected.lat, selected.lng], 12, { duration: 0.8 });
    }
  }, [selected, map]);

  return null;
}

function MapHero({ properties, selected, onSelect }) {
  const center = selected?.lat && selected?.lng ? [selected.lat, selected.lng] : [39.8283, -98.5795];

  return (
    <Card className="relative min-h-[520px] overflow-hidden rounded-[2rem] border-white/10 bg-slate-900/90 shadow-2xl">
      <div className="absolute left-5 top-5 z-[500] rounded-3xl border border-white/10 bg-slate-950/85 p-4 backdrop-blur">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Navigation className="h-4 w-4 text-blue-300" /> Live Leaflet map
        </div>
        <p className="mt-1 text-2xl font-bold">{properties.length} pins</p>
      </div>

      <MapContainer center={center} zoom={5} scrollWheelZoom className="h-[520px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFlyToSelected selected={selected} />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onSelect(property),
            }}
          >
            <Popup>
              <div className="w-52 text-slate-900">
                <img src={property.image} alt={property.title} className="mb-2 h-24 w-full rounded-lg object-cover" />
                <strong>{property.title}</strong>
                <p>{property.city}</p>
                <p>{formatPrice(property.price)}</p>
                <button
                  onClick={() => onSelect(property)}
                  className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}

function PropertyDetails({ selected }) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-white/10 shadow-2xl backdrop-blur">
      <img src={selected.image} alt={selected.title} className="h-56 w-full object-cover" />
      <CardContent className="p-6 text-white">
        <div className="mb-4 flex items-center justify-between gap-3"><span className="rounded-full bg-blue-400/20 px-3 py-1 text-sm text-blue-200">{selected.type}</span><span className="flex items-center gap-1 text-sm text-amber-200"><Star className="h-4 w-4 fill-current" /> {selected.rating}</span></div>
        <h2 className="text-2xl font-bold">{selected.title}</h2>
        <p className="mt-2 flex items-center gap-2 text-slate-300"><MapPin className="h-4 w-4" /> {selected.address}</p>
        <p className="mt-5 text-3xl font-bold text-emerald-300">{formatPrice(selected.price)}</p>
        <p className="mt-4 leading-7 text-slate-300">{selected.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">{selected.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">#{tag}</span>)}</div>
        <div className="mt-6 grid grid-cols-3 gap-3"><Metric label="Beds" value={selected.beds} /><Metric label="Baths" value={selected.baths} /><Metric label="Area" value={selected.area} /></div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-4"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950"><Building2 className="h-6 w-6" /></div><div><p className="font-semibold">Premier Realty Agent</p><p className="text-sm text-slate-400">Available today</p></div></div><div className="mt-4 grid grid-cols-2 gap-3"><Button className="rounded-2xl"><Phone className="mr-2 h-4 w-4" /> Call</Button><Button variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"><Mail className="mr-2 h-4 w-4" /> Email</Button></div></div>
      </CardContent>
    </Card>
  );
}

function Feature({ icon, text }) {
  return <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900/70 px-3 py-2">{icon}<span>{text}</span></div>;
}

function Metric({ label, value }) {
  return <div className="rounded-2xl bg-slate-900/70 p-3 text-center"><p className="text-xl font-bold">{value}</p><p className="text-xs text-slate-400">{label}</p></div>;
}
