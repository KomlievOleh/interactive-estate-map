import { Search, SlidersHorizontal } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import CustomSelect from "../ui/customSelect";

export default function ManualFilters({
  query,
  setQuery,
  type,
  setType,
  types,
  maxPrice,
  setMaxPrice,
})
{
  const min = 250000;
  const max = 1300000;
  const percentage = ((maxPrice - min) / (max - min)) * 100;   
    
  return (
    <div className="relative z-50 overflow-visible rounded-md border border-slate-200 bg-white p-4 backdrop-blur dark:border-white/10 dark:bg-white/10">
        <div className="grid gap-4 overflow-visible lg:grid-cols-[1fr_220px_260px]">              
            {/* SEARCH */}
            <label className="flex h-14 items-center rounded-md border border-slate-200 bg-slate-100 px-4 ring-orange-500/40 focus-within:ring-4 
                              dark:border-white/10 dark:bg-slate-900/80">
                <Search className="h-5 w-5 shrink-0 text-orange-500 dark:text-orange-400" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Manual search by city, address, or property name"
                    className="h-full w-full bg-transparent pl-3 text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
                />
            </label>

            {/* SELECT */}
            <CustomSelect
                value={type}
                onChange={setType}
                options={types}
            />

            {/* RANGE */}
            <div className="h-14 rounded-md border border-slate-200 bg-slate-100 px-4 py-1 dark:border-white/10 dark:bg-slate-900/80">
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Manual max price</span>
                    <span>{formatPrice(maxPrice)}</span>
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step="25000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="custom-range w-full"
                    style={{
                        "--value": `${percentage}%`,
                    }}
                />
            </div>
        </div>
    </div>
  );
}