export default function PropertyMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-900/70">
        <p className="text-xl font-bold text-slate-900 dark:text-white">
            {value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
            {label}
        </p>
    </div>
  );
}