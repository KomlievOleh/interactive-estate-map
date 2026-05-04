export default function PropertyFeature({ icon, text }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-200/70 px-3 py-2 text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
        {icon}
        <span>{text}</span>
    </div>
  );
}