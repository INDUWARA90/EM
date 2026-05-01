import React from "react";
import PdfViewer from "../PdfViewer";
import { 
  Calendar, Clock, MapPin, User, ShieldAlert, 
  History, FileText, ExternalLink, CheckCircle2, XCircle 
} from "lucide-react";
import { format } from "date-fns";

const ApprovalLetterCard = ({ letter, onApprove, onReject }) => {
  if (!letter) return null;

  const totalSteps =
    (letter.previousApprovers?.length || 0) +
    (letter.nextApprovers?.length || 0) +
    1;

  const pdfUrl = `http://localhost:8081/${letter.pdfPath}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
      
      {/* 🟦 BLUE GLOW FOR PENDING STATUS */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* LEFT → PDF VIEWER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Request Document</span>
          </div>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
          >
            Full View <ExternalLink size={12} />
          </a>
        </div>
        
        <div className="h-[500px] bg-black/60 rounded-[2rem] overflow-hidden border border-white/5 shadow-inner">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>

      {/* RIGHT → DETAILS */}
      <div className="text-white flex flex-col justify-between py-2">
        <div className="space-y-6">
          
          {/* HEADER & STEP INDICATOR */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase border border-blue-600/20 tracking-tighter">
                Step {letter.currentApprover?.stepOrder} of {totalSteps}
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase border border-yellow-500/20 tracking-tighter">
                {letter.globalStatus}
              </span>
            </div>

            <h2 className="text-4xl font-black tracking-tight leading-tight">
              {letter.title}
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-slate-700 pl-4">
              "{letter.description}"
            </p>
          </div>

          {/* LOGISTICS GRID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Date</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Calendar size={14} className="text-blue-400" /> {letter.eventDate}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Time</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Clock size={14} className="text-blue-400" /> {letter.eventTime.slice(0, 5)}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 col-span-2">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Requested By</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <User size={14} className="text-blue-400" /> {letter.sender?.name} ({letter.sender?.regNumber})
              </p>
            </div>
          </div>

          {/* APPROVAL FLOW VISUALIZER */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-slate-500">
              <History size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Workflow Timeline</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Completed Steps */}
              {letter.previousApprovers?.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-[11px] font-bold">
                  <CheckCircle2 size={12} /> {p.name}
                </div>
              ))}

              {/* Current Step (Action Needed) */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold shadow-lg shadow-blue-600/20 animate-pulse">
                <ShieldAlert size={12} /> {letter.currentApprover?.name} (You)
              </div>

              {/* Future Steps */}
              {letter.nextApprovers?.map((n, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-white/5 text-slate-500 rounded-xl text-[11px] font-bold">
                  <Clock size={12} /> {n.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={() => onReject(letter.letterId)}
            className="group flex-1 bg-slate-800 hover:bg-red-600/20 border border-white/5 hover:border-red-500/40 text-slate-400 hover:text-red-400 p-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={16} className="group-hover:scale-110 transition-transform" /> Reject
          </button>

          <button
            onClick={() => onApprove(letter.letterId)}
            className="group flex-1 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /> Approve Request
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApprovalLetterCard;