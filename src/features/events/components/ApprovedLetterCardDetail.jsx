import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  History,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { buildServerFileUrl } from "../../../shared/api/fileUrl";
import { formatAppDate, formatAppDateTime, formatAppTime } from "../../../shared/utils/dateTime";
import PdfViewer from "../../../shared/ui/PdfViewer";

function ApprovedLetterCardDetail({ letter }) {
  if (!letter) return null;

  const pdfUrl = buildServerFileUrl(letter.pdfPath);
  const previousApprovers = Array.isArray(letter.previousApprovers)
    ? [...letter.previousApprovers].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
    : [];
  const nextApprovers = Array.isArray(letter.nextApprovers)
    ? [...letter.nextApprovers].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
    : [];
  const myAction = letter.myAction || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Approved Document</span>
          </div>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Full View <ExternalLink size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl h-[550px] relative">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>

      <div className="flex flex-col space-y-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {letter.globalStatus || "APPROVED"}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Letter #{letter.letterId}
            </span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            {letter.title || "Event Approval Request"}
          </h2>

          <p className="text-slate-400 leading-relaxed border-l-2 border-emerald-500/30 pl-4">
            {letter.description || "No description provided."}
          </p>
        </div>

        {letter.approvalNote && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Approval Note</p>
            <p className="mt-1 text-sm text-emerald-100">{letter.approvalNote}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <DetailTile icon={<Calendar />} label="Event Date" value={formatAppDate(letter.eventDate)} />
          <DetailTile
            icon={<Clock />}
            label="Timeline"
            value={`${formatAppTime(letter.eventTime)} - ${formatAppTime(letter.eventEndTime)}`}
          />
          <DetailTile icon={<MapPin />} label="Place" value={letter.eventPlace || "Not specified"} />
          <DetailTile
            icon={<User />}
            label="Sender"
            value={`${letter.sender?.name || "Unknown"} (${letter.sender?.regNumber || "N/A"})`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetaItem label="Created" value={formatAppDateTime(letter.createdAt)} />
          <MetaItem label="Updated" value={formatAppDateTime(letter.updatedAt)} />
          <MetaItem label="Final Decision" value={formatAppDateTime(letter.finalDecisionAt)} />
        </div>

        {myAction && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">My Action</p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              <p>
                <span className="text-slate-400">Name:</span> {myAction.name || "N/A"}
              </p>
              <p>
                <span className="text-slate-400">Reg:</span> {myAction.regNumber || "N/A"}
              </p>
              <p>
                <span className="text-slate-400">Step:</span> {myAction.stepOrder || "N/A"}
              </p>
              <p>
                <span className="text-slate-400">Status:</span> {myAction.status || "N/A"}
              </p>
              <p>
                <span className="text-slate-400">Assigned:</span> {formatAppDateTime(myAction.assignedAt)}
              </p>
              <p>
                <span className="text-slate-400">Acted:</span> {formatAppDateTime(myAction.actedAt)}
              </p>
            </div>
            {myAction.remarks && <p className="mt-2 text-xs text-slate-300">{myAction.remarks}</p>}
          </div>
        )}

        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-slate-500 px-1">
            <History size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Approval Trail</span>
          </div>

          {previousApprovers.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-400">
              No previous approver records.
            </div>
          ) : (
            <div className="space-y-2">
              {previousApprovers.map((approver, index) => (
                <div
                  key={`${approver.stepOrder}-${approver.regNumber}-${index}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        {approver.name || "Approver"} ({approver.regNumber || "N/A"})
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                        Step {approver.stepOrder || "N/A"} • {approver.status || "N/A"}
                      </p>
                      {approver.remarks && <p className="text-xs text-slate-400 mt-1">{approver.remarks}</p>}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">{formatAppDateTime(approver.actedAt, "HH:mm", "")}</p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3 text-xs text-slate-400">
            {letter.currentApprover
              ? `Current approver: ${letter.currentApprover.name || "N/A"}`
              : "Current approver: None"}
            <br />
            {nextApprovers.length > 0
              ? `Next approvers: ${nextApprovers.map((a) => a.name || "N/A").join(", ")}`
              : "Next approvers: None"}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailTile({ icon, label, value }) {
  return (
    <div className="p-4 rounded-[1.5rem] bg-slate-900/30 border border-slate-800/50">
      <div className="text-slate-500 mb-2">{React.cloneElement(icon, { size: 16 })}</div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-slate-200 text-sm font-bold truncate leading-tight">{value}</p>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-xs font-semibold text-slate-300">{value}</p>
    </div>
  );
}

export default ApprovedLetterCardDetail;
