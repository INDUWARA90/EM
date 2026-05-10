import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, UserRound, FileText, Target, Rocket } from "lucide-react";
import { getClubs } from "../../../shared/api/endpoints";
import { ClubExecutiveBoardPanel } from "../components";
import { parseExecutiveBoard, resolveImageUrl } from "../lib/clubUtils";

function ClubDetailsPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizedId = useMemo(() => String(clubId || ""), [clubId]);
  const executiveBoardMembers = useMemo(
    () => parseExecutiveBoard(club?.executiveBoardJson ?? club?.executiveBoard),
    [club]
  );

  useEffect(() => {
    const loadClub = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getClubs();
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        const match = list.find((item) => String(item?.clubId ?? item?.id) === normalizedId);

        if (!match) {
          setError("Club not found.");
          return;
        }
        setClub(match);
      } catch {
        setError("Failed to load club details.");
      } finally {
        setLoading(false);
      }
    };
    loadClub();
  }, [normalizedId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-400 transition-all mb-8"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-slate-900 rounded-3xl" />
            <div className="h-24 bg-slate-900 rounded-3xl" />
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/5 text-red-400 text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* --- Hero Header Card --- */}
            <div className="relative rounded-[2.5rem] border border-slate-800 bg-slate-900/40 overflow-hidden shadow-2xl">
              <div className="h-48 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-blue-600/20 relative">
                {/* Visual Placeholder for bgImageUrl */}
                {resolveImageUrl(club.bgImageUrl || club.bgImagePath || club.backgroundImage) ? (
                  <img
                    src={resolveImageUrl(club.bgImageUrl || club.bgImagePath || club.backgroundImage)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                     <Building2 size={120} />
                  </div>
                )}
              </div>

              <div className="px-8 pb-8 -mt-3 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-2xl text-emerald-500">
                    <Building2 size={40} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-black text-white tracking-tighter">{club.clubName}</h1>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        Official Club
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1">Reg: {club.secretaryRegNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Info Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Main Content Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Vision & Mission Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                      <Target size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Our Vision</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {club.vision || "To inspire and lead the next generation of innovators within our university community."}
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                      <Rocket size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {club.mission || "Providing a platform for students to collaborate, learn, and excel in their respective fields."}
                    </p>
                  </div>
                </div>

                {/* About Section */}
                <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/20">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                    <FileText size={20} className="text-emerald-500" />
                    About the Organization
                  </h3>
                  <p className="text-slate-400 leading-relaxed italic">
                    {club.description || "Information technology and communication are at the heart of modern innovation. ICTSC serves as the hub for tech enthusiasts to explore beyond the classroom."}
                  </p>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* Secretary Info */}
                <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Administration</p>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <UserRound size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Secretary Reg</p>
                      <p className="text-sm font-bold text-white tracking-tight">{club.secretaryRegNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Executive Board Placeholder */}
                <ClubExecutiveBoardPanel members={executiveBoardMembers} />
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubDetailsPage;
