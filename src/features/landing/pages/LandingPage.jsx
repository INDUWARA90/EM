import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { getClubs } from "../../../shared/api/endpoints";
import { ClubCard } from "../components";

function LandingPage() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await getClubs();
                const list = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data)
                        ? res.data
                        : [];

                setClubs(list);
                setFiltered(list);
            } catch (err) {
                console.error("Failed to fetch clubs:", err);
                setError("Could not load clubs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    useEffect(() => {
        const q = search.toLowerCase().trim();
        const source = Array.isArray(clubs) ? clubs : [];
        setFiltered(
            q
                ? source.filter((c) => (c?.clubName || "").toLowerCase().includes(q))
                : source
        );
    }, [search, clubs]);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* --- Modern Hero Section --- */}
            <header className="relative py-24 px-6 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-10 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 -right-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        Explore <span className="text-emerald-500 text-glow">Communities.</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mb-12 max-w-2xl mx-auto">
                        Connect with student-led organizations, stay updated with events,
                        and find your place on campus.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                        <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="pl-5 text-slate-400">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for a club or interest..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full p-5 outline-none text-slate-800 font-bold placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Content Area --- */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Clubs</h2>
                    <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-black text-slate-400 uppercase tracking-widest shadow-sm">
                        {filtered.length} Organizations
                    </div>
                </div>

                {loading ? (
                    /* Skeleton Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 font-bold">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((club, index) => (
                            <ClubCard
                                key={(club?.clubId ?? club?.id) ?? `${club?.clubName}-${index}`}
                                club={club}
                                index={index}
                                onOpen={(clubId) => navigate(`/club/${clubId}`)}
                            />
                        ))}
                    </div>
                )}

                {/* Empty Search Result */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-slate-900">No clubs match your search</h3>
                        <p className="text-slate-500 mt-2">Try checking for typos or use broader keywords.</p>
                    </div>
                )}
            </main>

        </div>
    );
}

export default LandingPage;
