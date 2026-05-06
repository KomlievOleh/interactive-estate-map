import { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Home,
  Building2,
  Hotel,
  Warehouse,
  DoorOpen,
  LayoutGrid,
} from "lucide-react";

const typeIcons = {
  All: LayoutGrid,
  House: Home,
  Apartment: Building2,
  Townhouse: Warehouse,
  Villa: Hotel,
  Studio: DoorOpen,
};

export default function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const CurrentIcon = typeIcons[value] || SlidersHorizontal;

  useEffect(() => {
    function handleClickOutside(event) {
      if (!ref.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-[9999] w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-slate-100 px-4 ring-orange-500/40 transition focus:outline-none focus:ring-4 dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="flex items-center gap-3">
          <CurrentIcon className="h-5 w-5 text-orange-500" />
          <span className="text-slate-900 dark:text-white">{value}</span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition ${ open ? "rotate-180" : "" }`}
        />
      </button>  

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[99999] w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
          {options.map((item) => {
            const Icon = typeIcons[item] || SlidersHorizontal;
            const isActive = item === value;

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-400/20 dark:text-orange-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-orange-500"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />

                <span>{item}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}