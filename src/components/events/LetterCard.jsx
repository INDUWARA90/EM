import React from "react";
import PdfViewer from "../PdfViewer";
import { 
  Calendar, Clock, MapPin, User, ShieldAlert, 
  History, FileText, ExternalLink, ChevronRight,
  Info, ArrowRight
} from "lucide-react";

const LetterCard = ({ letter }) => {
  if (!letter) return null;

  const pdfUrl = `http://localhost:8081${letter.pdfPath}`;

  // Helper to format time strings (20:36:00 -> 20:36)
  const formatTime = (timeStr) => timeStr ? timeStr.slice(0, 5) : "--:--";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      
      {/* 🟦 DECORATIVE BACKGROUND */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* ================= LEFT: PDF ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Request Documentation</span>
          </div>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
          >
            Expand <ExternalLink size={12} />
          </a>
        </div>

        <div className="h-[550px] bg-black/60 rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-inner relative">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>

      {/* ================= RIGHT: DETAILS ================= */}
      <div className="text-white flex flex-col justify-between py-2">
        <div className="space-y-6">
          
          {/* HEADER & GLOBAL STATUS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase border border-yellow-500/20 tracking-widest">
                {letter.globalStatus}
              </span>
            </div>

            <h2 className="text-4xl font-black tracking-tight leading-tight">
              {letter.title}
            </h2>

            <div className="flex items-start gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-slate-400 text-sm leading-relaxed italic">
                "{letter.description}"
              </p>
            </div>
          </div>

          {/* LOGISTICS GRID (Updated with End Time) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Event Date</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" /> {letter.eventDate}
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Schedule</p>
              <p className="text-sm font-bold flex items-center gap-1.5 truncate">
                <Clock size={14} className="text-cyan-400 shrink-0" /> 
                {formatTime(letter.eventTime)} 
                <ArrowRight size={10} className="text-slate-600" /> 
                {formatTime(letter.eventEndTime)}
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors col-span-2">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Location</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <MapPin size={14} className="text-cyan-400" /> {letter.eventPlace || "Venue not assigned"}
              </p>
            </div>
          </div>

          {/* SENDER INFO */}
          <div className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/50">
             <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
               <User size={20} />
             </div>
             <div>
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Initiated By</p>
               <p className="text-sm font-bold text-slate-200">{letter.sender?.name} <span className="text-slate-500 font-medium ml-1">({letter.sender?.regNumber})</span></p>
             </div>
          </div>

          {/* PIPELINE VISUALIZER */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-slate-500">
              <History size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Pipeline Visualization</span>
            </div>

            <div className="flex flex-col gap-2">
              {/* CURRENT */}
              <div className="flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-900 shadow-lg shadow-cyan-500/20">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-cyan-500 font-black uppercase tracking-tighter">Current Action (Step {letter.currentApprover?.stepOrder})</p>
                    <p className="text-sm font-bold text-slate-100">{letter.currentApprover?.name || "Permission permitted"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded uppercase">Pending</span>
                </div>
              </div>

              {/* NEXT */}
              {letter.nextApprovers?.map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                      <ChevronRight size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Next (Step {n.stepOrder})</p>
                      <p className="text-sm font-bold text-slate-400">{n.name}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Waiting</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterCard;