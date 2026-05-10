function FormField({ label, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <textarea
        {...props}
        className={`w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors ${className}`}
      />
    </div>
  );
}

export default FormField;
