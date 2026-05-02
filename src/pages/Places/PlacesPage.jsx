import React, { useState } from "react";
import { 
  MapPin, 
  Users, 
  Building2, 
  Search, 
  ChevronRight, 
  Filter,
  MoreVertical
} from "lucide-react";

const PlacesPage = () => {
  // 1. Mock data or state for API response
  const [placesData] = useState([
    { placeId: 1, placeName: "Auditorium", department: "All", capacity: 450 },
    { placeId: 2, placeName: "Lab11", department: "ICT", capacity: 80 },
    { placeId: 3, placeName: "Lab12", department: "ICT", capacity: 110 },
    { placeId: 4, placeName: "NBLLT", department: "ET", capacity: 200 },
    { placeId: 5, placeName: "LH210", department: "ET", capacity: 500 },
    { placeId: 6, placeName: "BST12", department: "BST", capacity: 120 },
    { placeId: 7, placeName: "Ground", department: "All", capacity: null },
    { placeId: 8, placeName: "King Road", department: "All", capacity: null },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlaces = placesData.filter((p) =>
    p.placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Facility Resources
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage and monitor campus locations and capacities.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search venue or dept..."
            className="bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STATS OVERVIEW (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Venues" value={placesData.length} icon={<MapPin />} color="blue" />
        <StatCard label="Highest Capacity" value="500" icon={<Users />} color="emerald" />
        <StatCard label="Departments" value="4" icon={<Building2 />} color="amber" />
      </div>

      {/* DATA TABLE */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/20">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Place Name</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Department</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Max Capacity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filteredPlaces.map((place) => (
              <tr key={place.placeId} className="group hover:bg-slate-700/20 transition-all duration-200">
                <td className="px-8 py-5 text-slate-500 font-mono text-xs">#{place.placeId}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <MapPin size={18} />
                    </div>
                    <span className="font-bold text-white text-sm tracking-wide">{place.placeName}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    place.department === 'All' 
                    ? 'bg-slate-500/10 border-slate-500/20 text-slate-400' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  }`}>
                    {place.department}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    {place.capacity ? (
                      <>
                        <Users size={14} className="text-slate-600" />
                        <span className="text-sm font-bold text-slate-300">{place.capacity}</span>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Outdoor/Unlimited</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPlaces.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No matching venues found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for Stats
const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  
  return (
    <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl flex items-center gap-5 transition-transform hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
      </div>
    </div>
  );
};

export default PlacesPage;
