import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Timer, 
  Hash 
} from "lucide-react";
import { format } from "date-fns";

const ApprovalLetterSummary = ({ letter, onReject, onOpenApproveModal }) => {
  if (!letter) return null;

  return (
    <div className="text-white flex flex-col h-full">
      {/* 1. HEADER SECTION */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded">
            {letter.globalStatus}
          </span>
          <div className="flex items-center text-slate-500 text-[10px] font-bold">
            <Hash size={10} /> {letter.letterId}
          </div>
        </div>
        <h2 className="text-4xl font-black tracking-tight leading-tight uppercase">
          {letter.title}
        </h2>
        <p className="text-slate-400 mt-3 leading-relaxed border-l-2 border-slate-700 pl-4 italic">
          "{letter.description || "No description provided."}"
        </p>
      </div>

      {/* 2. LOGISTICS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <InfoTile 
          icon={<Calendar size={14} />} 
          label="Event Date" 
          value={letter.eventDate ? format(new Date(letter.eventDate), "MMM dd, yyyy") : "N/A"} 
        />
        <InfoTile 
          icon={<Clock size={14} />} 
          label="Timeline" 
          value={`${letter.eventTime?.slice(0, 5)} - ${letter.eventEndTime?.slice(0, 5)}`} 
        />
        <InfoTile 
          icon={<MapPin size={14} />} 
          label="Venue" 
          value={letter.eventPlace || "Not Specified"} 
        />
        <InfoTile 
          icon={<User size={14} />} 
          label="Requested By" 
          value={letter.sender?.name} 
          subValue={letter.sender?.regNumber}
        />
      </div>

      {/* 3. TRACKING & STATUS */}
      <div className="space-y-3 mb-8">
        <div className="p-4 bg-slate-800/40 border border-white/5 rounded-2xl flex items-start gap-4">
          <div className="mt-1 p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Timer size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Workflow Step</p>
            <p className="text-sm font-bold text-slate-200">
              Step {letter.currentApprover?.stepOrder}: {letter.currentApprover?.name}
            </p>
            <p className="text-[11px] text-slate-400">
              Assigned: {letter.currentApprover?.assignedAt ? format(new Date(letter.currentApprover.assignedAt), "p, MMM dd") : "Pending"}
            </p>
          </div>
        </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex gap-4 mt-auto">
        <button
          onClick={() => onReject(letter.letterId)}
          className="flex-1 group py-4 rounded-2xl bg-slate-800 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-400 hover:text-red-500 transition-all duration-200 inline-flex items-center justify-center gap-2 font-bold"
        >
          <XCircle size={18} className="group-hover:scale-110 transition-transform" /> 
          Reject
        </button>

        <button
          onClick={onOpenApproveModal}
          className="flex-1 group py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 inline-flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-600/20"
        >
          <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" /> 
          Approve
        </button>
      </div>
    </div>
  );
};

// Helper component for the grid tiles
const InfoTile = ({ icon, label, value, subValue }) => (
  <div className="p-3 bg-slate-900/50 border border-white/5 rounded-xl">
    <div className="flex items-center gap-2 text-slate-500 mb-1">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xs font-bold text-slate-200 truncate">{value}</p>
    {subValue && <p className="text-[10px] text-slate-500">{subValue}</p>}
  </div>
);

export default ApprovalLetterSummary;