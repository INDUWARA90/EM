import React from "react";
import PdfViewer from "../../../shared/ui/PdfViewer";
import { buildServerFileUrl } from "../../../shared/api/fileUrl";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldAlert,
  History,
  FileText,
  ExternalLink,
  Info,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Circle,
} from "lucide-react";
import {
  formatAppDate,
  formatAppDateTime,
  formatAppTime,
} from "../../../shared/utils/dateTime";

const LetterCard = ({ letter }) => {
  if (!letter) return null;

  const pdfUrl = buildServerFileUrl(letter.pdfPath);
  const conflictSource = letter.bookingConflict || letter.conflictDetails || letter;
  const conflicts = Array.isArray(conflictSource?.conflicts)
    ? conflictSource.conflicts
    : [];
  const hasBookingConflict =
    Boolean(conflictSource?.conflict) ||
    conflicts.length > 0 ||
    letter.status === "PENDING_BOOKING" ||
    letter.globalStatus === "PENDING_BOOKING";
  const conflictMessage =
    conflictSource?.message ||
    letter.conflictMessage ||
    "Place is already booked for this date/time.";

  const previousApprovers = Array.isArray(letter.previousApprovers)
    ? [...letter.previousApprovers].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
    : [];
  const nextApprovers = Array.isArray(letter.nextApprovers)
    ? [...letter.nextApprovers].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
    : [];

  const latestRemark =
    letter.approvalNote ||
    previousApprovers[previousApprovers.length - 1]?.remarks ||
    letter.rejectionReason ||
    null;
  
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
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-black uppercase border border-blue-500/20 tracking-widest">
                {letter.globalStatus}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Letter #{letter.letterId}
              </span>
            </div>

            {hasBookingConflict && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                      Booking Conflict
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-amber-100/90">
                      {conflictMessage}
                    </p>
                  </div>
                </div>

                {conflicts.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {conflicts.map((conflict) => (
                      <div
                        key={`${conflict.calendarEventId || conflict.letterId}-${conflict.eventDate}-${conflict.eventTime}`}
                        className="rounded-xl border border-amber-400/20 bg-slate-950/40 p-3 text-xs text-slate-200"
                      >
                        <p className="font-bold">{conflict.title || "Existing booking"}</p>
                        <p className="mt-1 text-slate-400">
                          {conflict.eventDate} {formatAppTime(conflict.eventTime)} - {formatAppTime(conflict.endTime || conflict.eventEndTime)} at {conflict.placeName || conflict.eventPlace || "same place"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <h2 className="text-4xl font-black tracking-tight leading-tight">
              {letter.title || "Event Approval Request"}
            </h2>

            <div className="flex items-start gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-slate-400 text-sm leading-relaxed italic">
                "{letter.description || "No description provided."}"
              </p>
            </div>
          </div>

          {latestRemark && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Approval Note</p>
              <p className="mt-1 text-sm text-slate-200">{latestRemark}</p>
            </div>
          )}

          {/* LOGISTICS GRID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Event Date</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" /> {formatAppDate(letter.eventDate)}
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Schedule</p>
              <p className="text-sm font-bold flex items-center gap-1.5 truncate">
                <Clock size={14} className="text-cyan-400 shrink-0" /> 
                {formatAppTime(letter.eventTime)} 
                <ArrowRight size={10} className="text-slate-600" /> 
                {formatAppTime(letter.eventEndTime)}
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
               <p className="text-sm font-bold text-slate-200">
                 {letter.sender?.name || "Unknown"}
                 <span className="text-slate-500 font-medium ml-1">
                   ({letter.sender?.regNumber || "N/A"})
                 </span>
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Created</p>
              <p className="mt-1 text-xs font-semibold text-slate-300">{formatAppDateTime(letter.createdAt)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Updated</p>
              <p className="mt-1 text-xs font-semibold text-slate-300">{formatAppDateTime(letter.updatedAt)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Final Decision</p>
              <p className="mt-1 text-xs font-semibold text-slate-300">{formatAppDateTime(letter.finalDecisionAt)}</p>
            </div>
          </div>

          {/* APPROVAL FLOW */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-slate-500">
              <History size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Approval Flow</span>
            </div>

            <div className="flex flex-col gap-2">
              {previousApprovers.map((approver, index) => (
                <div key={`${approver.stepOrder}-${approver.regNumber}-${index}`} className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
                        Step {approver.stepOrder} Approved
                      </p>
                      <p className="text-sm font-semibold text-slate-100">
                        {approver.name || "Approver"} ({approver.regNumber || "N/A"})
                      </p>
                      {approver.remarks && <p className="text-xs text-slate-300 mt-1">{approver.remarks}</p>}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">{formatAppDateTime(approver.actedAt)}</p>
                </div>
              ))}

              {letter.currentApprover && (
                <div className="flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                      <CircleDot size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                        Current Approver (Step {letter.currentApprover?.stepOrder})
                      </p>
                      <p className="text-sm font-semibold text-slate-100">
                        {letter.currentApprover?.name || "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {nextApprovers.map((approver, index) => (
                <div key={`${approver.stepOrder}-${approver.regNumber}-${index}`} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                      <Circle size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        Next Step {approver.stepOrder}
                      </p>
                      <p className="text-sm font-bold text-slate-300">
                        {approver.name || "Upcoming approver"} ({approver.regNumber || "N/A"})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase">Waiting</span>
                </div>
              ))}

              {!letter.currentApprover && nextApprovers.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-400">
                  No pending approvers.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterCard;
