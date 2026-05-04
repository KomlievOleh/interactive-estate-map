export default function PropertyMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/70 p-3 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}