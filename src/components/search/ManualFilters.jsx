import { Search, SlidersHorizontal } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";

export default function ManualFilters({
  query,
  setQuery,
  type,
  setType,
  types,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_260px]">
        <label className="flex h-14 items-center rounded-md border border-white/10 bg-slate-900/80 px-4 ring-blue-500/40 focus-within:ring-4">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />

            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Manual search by city, address, or property name"
                className="h-full w-full bg-transparent pl-3 text-white outline-none placeholder:text-slate-500"
            />
        </label>

        <div className="flex h-14 items-center rounded-md border border-white/10 bg-slate-900/80 px-4 ring-blue-500/40 focus-within:ring-4">
            <SlidersHorizontal className="h-5 w-5 shrink-0 text-slate-400" />

            <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                    //   className="h-full w-full appearance-none bg-transparent pl-3 rounded-md border border-white/10 bg-slate-900/80 pl-12 pr-4 text-white outline-none"
            className="h-14 w-full appearance-none rounded-md  border-white/10 bg-slate-900/80 pl-12 pr-4 text-white outline-none ring-blue-500/40 "
                      
            >
                {types.map((item) => (
                <option key={item}>{item}</option>
                ))}
            </select>
        </div>
              
        <div className="h-14 rounded-md border border-white/10 bg-slate-900/80 px-4 ">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Manual max price</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>

          <input
            type="range"
            min="250000"
            max="1300000"
            step="25000"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}