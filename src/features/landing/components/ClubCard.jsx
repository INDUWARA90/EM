import { Search } from "lucide-react";

const AVATAR_COLORS = [
  "from-emerald-500 to-teal-600",
  "from-blue-600 to-indigo-700",
  "from-violet-600 to-purple-700",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function ClubCard({ club, index, onOpen }) {
  const colorGradient = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const clubId = club?.clubId ?? club?.id;
  const clubName = club?.clubName || "Club";

  return (
    <div
      onClick={() => clubId && onOpen(clubId)}
      className="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 cursor-pointer"
    >
      <div className={`h-32 bg-gradient-to-br ${colorGradient} relative`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        <div className="absolute -bottom-10 left-8">
          <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-2xl font-black text-slate-900 border-4 border-white group-hover:scale-110 transition-transform duration-500">
            {clubName.charAt(0)}
          </div>
        </div>
      </div>

      <div className="p-8 pt-14">
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
          {clubName}
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
          {club?.description || "Building community through shared interests and professional development at our university."}
        </p>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Admin Code</span>
            <span className="text-xs font-bold text-slate-700">{club?.secretaryRegNumber}</span>
          </div>
          <div className="ml-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Search size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubCard;
