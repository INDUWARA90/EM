function ReadOnlyField({ label, value, mono = false }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <div
        className={`w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 whitespace-pre-wrap break-words ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}

export default ReadOnlyField;
