import { Users } from "lucide-react";

function ClubExecutiveBoardPanel({ members }) {
  return (
    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Executive Board</p>
        <Users size={16} className="text-slate-600" />
      </div>

      {members.length > 0 ? (
        <div className="space-y-2">
          {members.map((member, index) => (
            <div
              key={`${member.position}-${member.name}-${index}`}
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                {member.position || "Role"}
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                {member.name || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center border-2 border-dashed border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-600 font-medium italic text-balance px-4">
            Board members for the current term have not been updated.
          </p>
        </div>
      )}
    </div>
  );
}

export default ClubExecutiveBoardPanel;
