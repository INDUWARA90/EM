import ReadOnlyField from "./ReadOnlyField";

function BoardReadOnly({ members }) {
  if (!Array.isArray(members) || members.length === 0) {
    return <ReadOnlyField label="Executive Board" value="No board members saved." />;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        Executive Board
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 divide-y divide-slate-800">
        {members.map((member, index) => (
          <div key={`${member.position}-${member.name}-${index}`} className="px-4 py-3 flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400 min-w-24">{member.position || "Role"}</span>
            <span className="text-sm text-slate-300">{member.name || "Unknown"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardReadOnly;
