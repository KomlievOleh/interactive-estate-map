import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Star, Building2, Phone, Mail } from "lucide-react";
import PropertyMetric from "./PropertyMetric";
import { formatPrice } from "../../utils/formatPrice";

export default function PropertyModal({ property, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
    {property && (
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-[2px] dark:bg-slate-950/45"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="iphone-scrollbar relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md border border-slate-200 bg-white text-slate-950 shadow-md dark:border-white/10 dark:bg-slate-950 dark:text-white"
                onClick={(event) => event.stopPropagation()}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
            >
                <div className="sticky top-0 z-30 h-80 bg-white dark:bg-slate-950">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-white/85 p-3 text-slate-900 shadow-sm backdrop-blur transition hover:bg-white dark:bg-slate-950/80 dark:text-white dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <img
                        src={property.image}
                        alt={property.title}
                        onClick={onClose}
                        className="h-full w-full cursor-pointer object-cover"
                    />
                </div>

                <div className="relative z-10 bg-white p-6 dark:bg-slate-950">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-400/20 dark:text-blue-200">
                            {property.type}
                        </span>

                        <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-200">
                            <Star className="h-4 w-4 fill-current" />
                            {property.rating}
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-950 dark:text-white">
                        {property.title}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-4 w-4" />
                        {property.address}
                    </p>

                    <p className="mt-5 text-4xl font-bold text-emerald-600 dark:text-emerald-300">
                        {formatPrice(property.price)}
                    </p>

                    <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                        {property.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {property.tags.slice(0, 6).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300"
                        >
                            #{tag}
                        </span>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <PropertyMetric label="Beds" value={property.beds} />
                        <PropertyMetric label="Baths" value={property.baths} />
                        <PropertyMetric label="Area" value={property.area} />
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/70">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                                <Building2 className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="font-semibold text-slate-950 dark:text-white">
                                    Premier Realty Agent
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Available today
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500">
                                <Phone className="mr-2 inline h-4 w-4" />
                                Call
                            </button>

                            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                <Mail className="mr-2 inline h-4 w-4" />
                                Email
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )}
  </AnimatePresence>
  );
}