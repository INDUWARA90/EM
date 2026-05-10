import { Building2 } from "lucide-react";

function ClubPageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Building2 size={20} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-white">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default ClubPageHeader;
