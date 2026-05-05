import { Heart, MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import PropertyFeature from "./PropertyFeature";
import { formatPrice } from "../../utils/formatPrice";

export default function PropertyCard({
  property,
  selected,
  onPropertyClick,
  favorites,
  toggleFavorite,
}) {
  const isSelected = selected?.id === property.id;

    return (
    <article
        onClick={() => onPropertyClick(property)}
        className={`cursor-pointer overflow-hidden rounded-md border transition hover:-translate-y-1 shadow-md backdrop-blur
        bg-white/80 text-slate-900 hover:bg-white
        dark:bg-white/10 dark:text-white dark:hover:bg-white/15
        ${
            isSelected
            ? "border-blue-500 ring-2 ring-blue-500/30"
            : "border-slate-200 dark:border-white/10"
        }`}
    >
      <div className="relative">
        <img
            src={property.image}
            alt={property.title}
            className="h-56 w-full object-cover"
        />

        <button
            onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(property.id);
            }}
            className="absolute right-4 top-4 rounded-full p-3 backdrop-blur transition hover:scale-105
            bg-white/90 text-slate-900
            dark:bg-slate-950/75 dark:text-white"
        >
            <Heart
                className={`h-5 w-5 ${
                    favorites.includes(property.id)
                    ? "fill-red-500"
                    : "text-slate-400 dark:text-white"
                }`}
            />
        </button>

        {property.featured && (
            <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold
            bg-emerald-500 text-white">
            Featured
            </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
            <div>
            <h3 className="text-xl font-bold">
                {property.title}
            </h3>

            <p className="mt-1 flex items-center gap-2 text-sm
                text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4" />
                {property.city}
            </p>
            </div>

            <p className="text-lg font-bold text-emerald-500">
            {formatPrice(property.price)}
            </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm
            text-slate-600 dark:text-slate-300">
            <PropertyFeature
            icon={<BedDouble className="h-4 w-4" />}
            text={`${property.beds} beds`}
            />

            <PropertyFeature
            icon={<Bath className="h-4 w-4" />}
            text={`${property.baths} baths`}
            />

            <PropertyFeature
            icon={<Ruler className="h-4 w-4" />}
            text={`${property.area} ft²`}
            />
        </div>
      </div>
    </article>
  );
}