import React from "react";
import PdfViewer from "../PdfViewer";

const ApprovalLetterCard = ({ letter, onApprove, onReject }) => {
  const totalSteps =
    (letter.previousApprovers?.length || 0) +
    (letter.nextApprovers?.length || 0) +
    1;

  // ✅ FIXED PDF URL
  const pdfUrl = `http://localhost:8081/${letter.pdfPath}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl overflow-hidden">

      {/* LEFT → PDF VIEWER */}
      <div className="h-[450px] bg-black/40 rounded-xl overflow-hidden overflow-y-auto border border-white/5">
        <PdfViewer fileUrl={pdfUrl} />
      </div>

      {/* RIGHT → DETAILS */}
      <div className="text-white flex flex-col justify-between">

        <div className="space-y-6">

          {/* HEADER */}
          <div>
            <span className="px-2 py-1 rounded bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-600/20">
              Step {letter.currentApprover?.stepOrder} of {totalSteps}
            </span>

            <h2 className="text-2xl font-bold mt-3">
              {letter.title}
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              {letter.description}
            </p>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>📅 {letter.eventDate}</p>
            <p>⏰ {letter.eventTime}</p>
            {letter.eventPlace && <p>📍 {letter.eventPlace}</p>}
            <p>
              Status:{" "}
              <span className="text-yellow-400 font-semibold">
                {letter.globalStatus}
              </span>
            </p>
          </div>

          {/* SENDER */}
          <div className="text-sm text-slate-400">
            👤 {letter.sender?.name} ({letter.sender?.regNumber})
          </div>

          {/* APPROVAL FLOW */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase font-bold">
              Approval Flow
            </p>

            <div className="flex flex-wrap gap-2">

              {/* PREVIOUS */}
              {letter.previousApprovers?.map((p, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs"
                >
                  ✔ {p.name}
                </span>
              ))}

              {/* CURRENT */}
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs">
                ● {letter.currentApprover?.name}
              </span>

              {/* NEXT */}
              {letter.nextApprovers?.map((n, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs"
                >
                  ⏳ {n.name}
                </span>
              ))}

            </div>
          </div>

          {/* REJECTION REASON */}
          {letter.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm text-red-400">
              Rejected: {letter.rejectionReason}
            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => onApprove(letter.letterId)}
            className="flex-1 bg-green-600 hover:bg-green-500 p-3 rounded-xl font-bold"
          >
            Approve
          </button>

          <button
            onClick={() => onReject(letter.letterId)}
            className="flex-1 bg-red-600 hover:bg-red-500 p-3 rounded-xl font-bold"
          >
            Reject
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApprovalLetterCard;