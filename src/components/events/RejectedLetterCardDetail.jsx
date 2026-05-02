import React from "react";
import PdfViewer from "../PdfViewer";
import { 
  Calendar, Clock, MapPin, User, AlertCircle, 
  History, FileText, ExternalLink, XCircle, ShieldAlert 
} from "lucide-react";
import { format } from "date-fns";

function RejectedLetterCardDetail({ letter }) {
  if (!letter) return null;

  const pdfUrl = `http://localhost:8081${letter.pdfPath}`;

  // Find the specific approver who rejected the request to pull their remarks if needed
  const rejectingApprover = letter.previousApprovers?.find(a => a.status === "REJECTED");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      
      {/* 🔴 BACKGROUND ACCENT */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none" />

      {/* 📄 LEFT COLUMN: PDF PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Digital Document</span>
          </div>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Open Full <ExternalLink size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
        
        <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl h-[600px] relative">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>

      {/* 📋 RIGHT COLUMN: DETAILS & STATUS */}
      <div className="flex flex-col space-y-6">
        
        {/* HEADER */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 inline-flex items-center gap-2">
              <ShieldAlert size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Action: Rejected</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            {letter.title}
          </h2>
          
          <p className="text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-4">
            {letter.description || "No project description provided."}
          </p>
        </div>

        {/* LOGISTICS GRID */}
        <div className="grid grid-cols-2 gap-3">
          <DetailTile 
            icon={<Calendar />} 
            label="Date" 
            value={letter.eventDate ? format(new Date(letter.eventDate), "MMM dd, yyyy") : "N/A"} 
          />
          <DetailTile 
            icon={<Clock />} 
            label="Schedule" 
            value={`${letter.eventTime.slice(0, 5)} - ${letter.eventEndTime.slice(0, 5)}`} 
          />
          <DetailTile 
            icon={<MapPin />} 
            label="Venue" 
            value={letter.eventPlace || "Unspecified Location"} 
          />
          <DetailTile 
            icon={<User />} 
            label="Initiator" 
            value={letter.sender?.name} 
          />
        </div>

        {/* 🔴 REJECTION REASON BLOCK */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 space-y-4 relative overflow-hidden group">
          <AlertCircle className="absolute -right-4 -bottom-4 text-red-500/5 group-hover:text-red-500/10 transition-colors" size={100} />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Rejection Reason</span>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-red-100 text-lg font-medium leading-relaxed">
              {letter.rejectionReason || 
               rejectingApprover?.remarks || 
               "Request declined during formal review. No specific digital remarks were recorded by the reviewer."}
            </p>
            
            <div className="mt-4 pt-4 border-t border-red-500/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-red-400/60">
              <span>Decision By: {rejectingApprover?.name || "System"}</span>
              <span>{letter.finalDecisionAt ? format(new Date(letter.finalDecisionAt), "p, MMM d") : ""}</span>
            </div>
          </div>
        </div>

        {/* APPROVAL HISTORY */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-slate-500 px-1">
            <History size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Approval History</span>
          </div>

          <div className="space-y-2">
            {letter.previousApprovers?.map((p, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'REJECTED' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-slate-200">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Step {p.stepOrder} • {p.regNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-2 py-1 rounded border ${
                    p.status === 'REJECTED' 
                    ? 'text-red-400 border-red-400/20 bg-red-400/5' 
                    : 'text-green-400 border-green-400/20 bg-green-400/5'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Detail Tile Sub-component
function DetailTile({ icon, label, value }) {
  return (
    <div className="p-4 rounded-[1.5rem] bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-all group">
      <div className="text-slate-500 mb-2 group-hover:text-cyan-400 transition-colors">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-slate-200 text-sm font-bold truncate leading-tight">{value}</p>
    </div>
  );
}

export default RejectedLetterCardDetail;