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
      className="group relative bg-slate-800/70 border border-slate-700 rounded-[2.5rem] overflow-hidden hover:border-slate-600 transition-all duration-500 cursor-pointer"
    >
      <div className={`h-32 bg-gradient-to-br ${colorGradient} relative`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        <div className="absolute -bottom-10 left-8">
          <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] shadow-xl flex items-center justify-center text-2xl font-black text-white border-4 border-slate-800 group-hover:scale-110 transition-transform duration-500">
            {clubName.charAt(0)}
          </div>
        </div>
      </div>

      <div className="p-8 pt-14">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-emerald-400 transition-colors">
          {clubName}
        </h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
          {club?.description || "Building community through shared interests and professional development at our university."}
        </p>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-700/70">
          <div className="ml-auto w-10 h-10 rounded-full bg-slate-700/70 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Search size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubCard;
