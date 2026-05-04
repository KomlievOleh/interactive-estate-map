import PropertyCard from "./PropertyCard";

export default function PropertyList({
  properties,
  selected,
  onPropertyClick,
  favorites,
  toggleFavorite,
}) {
return (
  <div>
    <div className="mb-5">
      <p className="text-sm uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">
        Map matched results
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {properties.length} listings found
      </h2>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          selected={selected}
          onPropertyClick={onPropertyClick}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  </div>
);}