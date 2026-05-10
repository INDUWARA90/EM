import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Check, 
  CircleDot, 
  Circle 
} from "lucide-react";
import { formatAppDate, formatAppTime } from "../../../shared/utils/dateTime";

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
          value={formatAppDate(letter.eventDate)} 
        />
        <InfoTile 
          icon={<Clock size={14} />} 
          label="Timeline" 
          value={`${formatAppTime(letter.eventTime)} - ${formatAppTime(letter.eventEndTime)}`} 
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
        <div className="p-4 bg-slate-800/40 border border-white/5 rounded-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            Approval Progress
          </p>
          <WorkflowProgress letter={letter} />
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

const WorkflowProgress = ({ letter }) => {
  const previous = Array.isArray(letter.previousApprovers) ? [...letter.previousApprovers] : [];
  previous.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));

  const next = Array.isArray(letter.nextApprovers) ? [...letter.nextApprovers] : [];
  next.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));

  const stages = [
    ...previous.map((approver) => ({ ...approver, state: "approved" })),
    ...(letter.currentApprover ? [{ ...letter.currentApprover, state: "current" }] : []),
    ...next.map((approver) => ({ ...approver, state: "waiting" })),
  ];

  if (stages.length === 0) {
    return <p className="text-xs text-slate-400">No workflow steps available.</p>;
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-start gap-0 min-w-max pr-2">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;

        return (
          <div key={`${stage.stepOrder}-${stage.name}-${index}`} className="flex items-center">
            <div className="min-w-[150px] max-w-[170px]">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                stage.state === "approved"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : stage.state === "current"
                  ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                  : "bg-slate-900 border-slate-700 text-slate-500"
              }`}>
                {stage.state === "approved" ? <Check size={13} /> : stage.state === "current" ? <CircleDot size={13} /> : <Circle size={13} />}
              </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 truncate">
                    Step {stage.stepOrder}: {stage.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    {stage.state === "approved" ? "Approved" : stage.state === "current" ? "Current" : "Waiting"}
                  </p>
                </div>
              </div>
            </div>

            {!isLast && (
              <div className={`mx-2 w-10 h-0.5 ${
                stage.state === "approved" ? "bg-emerald-500/40" : "bg-slate-700"
              }`} />
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default ApprovalLetterSummary;
