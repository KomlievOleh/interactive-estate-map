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
    <div className="rounded-md border border-slate-200 bg-white p-4 backdrop-blur dark:border-white/10 dark:bg-white/10">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_260px]">
            {/* SEARCH */}
            <label className="flex h-14 items-center rounded-md border border-slate-200 bg-slate-100 px-4 ring-blue-500/40 focus-within:ring-4 dark:border-white/10 dark:bg-slate-900/80">
                <Search className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Manual search by city, address, or property name"
                    className="h-full w-full bg-transparent pl-3 text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
                />
            </label>

            {/* SELECT */}
              <div className="flex h-14 items-center rounded-md border border-slate-200 bg-slate-100 px-4 ring-blue-500/40 focus-within:ring-4 
                              dark:border-white/10 dark:bg-slate-900/80">
                <SlidersHorizontal className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="h-full w-full appearance-none bg-transparent pl-3 text-slate-900 outline-none dark:text-white"
                >
                    {types.map((item) => (
                        <option key={item}>{item}</option>
                    ))}
                </select>
            </div>

            {/* RANGE */}
            <div className="h-14 rounded-md border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-slate-900/80">
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
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