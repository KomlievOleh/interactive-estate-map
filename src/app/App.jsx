import { useMemo, useState } from "react";
import { properties as initialProperties } from "../data/properties";
import { parseAiSearch } from "../utils/aiSearch";

import PropertyMap from "../components/map/PropertyMap";
import AiSearchBar from "../components/search/AiSearchBar";
import ManualFilters from "../components/search/ManualFilters";
import PropertyList from "../components/properties/PropertyList";
import PropertyModal from "../components/properties/PropertyModal";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function App() {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1300000);
  const [modalProperty, setModalProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [aiFilters, setAiFilters] = useState(parseAiSearch(aiQuery));
    
  const [properties, setProperties] = useState(initialProperties);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selected, setSelected] = useState(initialProperties[0]);

  const types = ["All", ...new Set((properties || []).map((item) => item.type))];

  const filteredProperties = useMemo(() => {
      
    //   console.log(type);
    //   console.log(maxPrice);

      return (properties || []).filter((property) => {
        const searchable = `${property.title} ${property.city} ${property.address} ${property.type} ${property.tags?.join(" ") || ""}`.toLowerCase();
        return (
            searchable.includes(query.toLowerCase()) && (type === "All" || property.type === type) &&
            (aiFilters.type === "All" || property.type === aiFilters.type) &&
            (!aiFilters.city || property.city.toLowerCase().includes(aiFilters.city)) &&
            property.price <= Math.min(maxPrice, aiFilters.maxPrice) &&
            property.beds >= aiFilters.minBeds &&
            (aiFilters.tags.length === 0 ||
                aiFilters.tags.some((tag) => property.tags?.includes(tag)))
        );
    });
}, [properties, query, type, maxPrice, aiFilters]);
    
    
async function generatePropertiesWithAI(prompt) {
  const response = await fetch("http://localhost:3001/api/generate-properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
    
  if (!response.ok) {
    console.error("Server error:", data);
    throw new Error(data.message || "Failed to generate properties");
  }

  return data.properties;
}   

  function runAiSearch(value = aiQuery) {
    const nextFilters = parseAiSearch(value);
    
    setAiQuery(value);
    setAiFilters(nextFilters);
    setType("All");
    setMaxPrice(1300000);
    setModalProperty(null);
  }

    
  async function handleGenerateProperties(prompt) {
    if (!prompt?.trim()) {
        console.error("Prompt is required");
        return;
    }

    try {
        setIsGenerating(true);

        const aiProperties = await generatePropertiesWithAI(prompt);

        setProperties(aiProperties);
        setSelected(aiProperties[0]);
        setModalProperty(null);

        const nextFilters = parseAiSearch(prompt);
        setAiQuery(prompt);
        setAiFilters(nextFilters);
        setType("All");
        setMaxPrice(1300000);
    } catch (error) {
        console.error("Failed to generate properties:", error);
    } finally {
        setIsGenerating(false);
    }
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
    //   <main className="transition-colors min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
        <main className="min-h-screen bg-gray-100 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
          <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          {/* <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8"> */}
            <div className="absolute left-54 top-2">
                <ThemeToggle />
            </div>    
            <div className="flex flex-col justify-center">
                <div className="mb-5 inline-flex w-fit items-center gap-3 rounded-md border border-orange-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 backdrop-blur
                                dark:border-white/15 dark:bg-white/10 dark:text-slate-200">
                    <span>AI-powered real estate map</span>
                </div>

                <h1 className="max-w-3xl text-4xl font-light  tracking-tight md:text-6xl">
                    Search properties like you talk to an agent.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg
                                dark:text-slate-300">
                    Type requests like “cheap studio in New York” or “luxury villa with pool near beach”
                    and the app filters listings on a map-first interface.
                </p>

                <AiSearchBar
                    aiQuery={aiQuery}
                    setAiQuery={setAiQuery}
                    runAiSearch={runAiSearch}
                    generateProperties={handleGenerateProperties}
                    isGenerating={isGenerating}
                />
            </div>

            <PropertyMap
                properties={filteredProperties}
                selected={selected}
                onSelect={setSelected}
            />
              
            {/* <div className="absolute left-54 top-2">
                <ThemeToggle />
            </div>    
            <aside className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/10">
                <div className="mb-8 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-slate-950 dark:bg-white" />
                    <h2 className="text-2xl font-bold">EstateAI</h2>
                </div>

                <nav className="space-y-2">
                    <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-left font-semibold text-white dark:bg-white dark:text-slate-950">
                        Dashboard
                    </button>
                    <button className="w-full rounded-xl px-4 py-3 text-left text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10">
                        Properties
                    </button>
                    <button className="w-full rounded-xl px-4 py-3 text-left text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10">
                        Analytics
                    </button>
                    <button className="w-full rounded-xl px-4 py-3 text-left text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10">
                        Settings
                    </button>
                </nav>
            </aside>

            <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/10">
                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                        Search properties with AI.
                    </h1>

                    <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-300">
                        Find homes, apartments and villas using natural language and interactive map search.
                    </p>

                    <AiSearchBar
                        aiQuery={aiQuery}
                        setAiQuery={setAiQuery}
                        runAiSearch={runAiSearch}
                        generateProperties={handleGenerateProperties}
                        isGenerating={isGenerating}
                    />
                </div>

                <PropertyMap
                    properties={filteredProperties}
                    selected={selected}
                    onSelect={setSelected}
                />
            </div>               */}
        </section>

        <section className="mx-auto max-w-7xl px-6  py-8 lg:px-8">
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