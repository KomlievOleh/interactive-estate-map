import { useMemo, useState } from "react";
import { properties } from "../data/properties";
import { parseAiSearch } from "../utils/aiSearch";

import PropertyMap from "../components/map/PropertyMap";
import AiSearchBar from "../components/search/AiSearchBar";
import ManualFilters from "../components/search/ManualFilters";
import PropertyList from "../components/properties/PropertyList";
import PropertyModal from "../components/properties/PropertyModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("family house near schools");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1300000);
  const [selected, setSelected] = useState(properties[0]);
  const [modalProperty, setModalProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [aiFilters, setAiFilters] = useState(parseAiSearch(aiQuery));

  const types = ["All", ...new Set(properties.map((item) => item.type))];

  const filteredProperties = useMemo(() => {
    // return properties.filter((property) => {
    //   const searchable = `${property.title} ${property.city} ${property.address} ${property.type} ${property.tags.join(" ")}`.toLowerCase();

    //   return (
    //     searchable.includes(query.toLowerCase()) &&
    //     (type === "All" || property.type === type) &&
    //     (aiFilters.type === "All" || property.type === aiFilters.type) &&
    //     (!aiFilters.city || property.city.toLowerCase().includes(aiFilters.city)) &&
    //     property.price <= Math.min(maxPrice, aiFilters.maxPrice) &&
    //     property.beds >= aiFilters.minBeds &&
    //     (aiFilters.tags.length === 0 ||
    //       aiFilters.tags.some((tag) => property.tags.includes(tag)))
    //   );
      // });
      
      return properties;
      
  }, [query, type, maxPrice, aiFilters]);

  function runAiSearch(value = aiQuery) {
    const nextFilters = parseAiSearch(value);
    setAiQuery(value);
    setAiFilters(nextFilters);
    setType("All");
    setMaxPrice(1300000);
    setModalProperty(null);
  }

  function handlePropertyClick(property) {
    setSelected(property);

    setModalProperty((current) =>
      current?.id === property.id ? null : property
    );
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            AI-powered real estate map
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Search properties like you talk to an agent.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Type requests like “cheap studio in New York” or “luxury villa with pool near beach”
            and the app filters listings on a map-first interface.
          </p>

          <AiSearchBar
            aiQuery={aiQuery}
            setAiQuery={setAiQuery}
            runAiSearch={runAiSearch}
          />
        </div>

        <PropertyMap
          properties={filteredProperties}
          selected={selected}
          onSelect={setSelected}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <ManualFilters
          query={query}
          setQuery={setQuery}
          type={type}
          setType={setType}
          types={types}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <PropertyList
          properties={filteredProperties}
          selected={selected}
          onPropertyClick={handlePropertyClick}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </section>

      <PropertyModal
        property={modalProperty}
        onClose={() => setModalProperty(null)}
      />
    </main>
  );
}