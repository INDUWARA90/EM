import { Plus, Trash2 } from "lucide-react";

function BoardEditor({
  members,
  onMemberChange,
  onAddMember,
  onRemoveMember,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
          Executive Board
        </label>
        <button
          type="button"
          onClick={onAddMember}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-800/60 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700/70 transition-colors"
        >
          <Plus size={14} />
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member, index) => (
          <div
            key={`${index}-${member.position}-${member.name}`}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
          >
            <input
              type="text"
              value={member.position}
              onChange={(e) => onMemberChange(index, "position", e.target.value)}
              placeholder="Position (e.g. President)"
              className="rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
            />
            <input
              type="text"
              value={member.name}
              onChange={(e) => onMemberChange(index, "name", e.target.value)}
              placeholder="Name (e.g. Harshana)"
              className="rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
            />
            <button
              type="button"
              onClick={() => onRemoveMember(index)}
              disabled={members.length === 1}
              className="inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Remove member"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardEditor;
