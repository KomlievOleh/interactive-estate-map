import { MapPin, Star, Building2, Phone, Mail } from "lucide-react";
import PropertyMetric from "./PropertyMetric";
import { formatPrice } from "../../utils/formatPrice";

export default function PropertyDetails({ selected }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur">
      <img
        src={selected.image}
        alt={selected.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-6 text-white">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-orange-400/20 px-3 py-1 text-sm text-orange-200">
            {selected.type}
          </span>

          <span className="flex items-center gap-1 text-sm text-amber-200">
            <Star className="h-4 w-4 fill-current" />
            {selected.rating}
          </span>
        </div>

        <h2 className="text-2xl font-bold">{selected.title}</h2>

        <p className="mt-2 flex items-center gap-2 text-slate-300">
          <MapPin className="h-4 w-4" />
          {selected.address}
        </p>

        <p className="mt-5 text-3xl font-bold text-emerald-300">
          {formatPrice(selected.price)}
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          {selected.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {selected.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <PropertyMetric label="Beds" value={selected.beds} />
          <PropertyMetric label="Baths" value={selected.baths} />
          <PropertyMetric label="Area" value={selected.area} />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <p className="font-semibold">Premier Realty Agent</p>
              <p className="text-sm text-slate-400">Available today</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-500">
              <Phone className="mr-2 inline h-4 w-4" />
              Call
            </button>

            <button className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10">
              <Mail className="mr-2 inline h-4 w-4" />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}