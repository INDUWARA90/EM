import React from "react";
import PdfViewer from "../PdfViewer";

function RejectedLetterCardDetail({ letter }) {
  const pdfUrl = `http://localhost:8081/${letter.pdfPath}`;

  const getStatusColor = (status) => {
    if (status === "REJECTED") return "text-red-400";
    if (status === "APPROVED") return "text-green-400";
    return "text-yellow-400";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-2xl p-6">

      {/* 📄 PDF */}
      <div className="bg-black/40 rounded-xl overflow-hidden border border-white/5 relative h-[450px]">
        <div className="absolute top-0 left-0 right-0 h-10 bg-black/50 backdrop-blur-md flex items-center px-4 border-b border-white/10 z-10">
          <p className="text-xs text-slate-400 font-medium">
            📄 Document Preview
          </p>
        </div>
        <div className="pt-10 h-full">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>

      {/* 📋 DETAILS */}
      <div className="flex flex-col justify-between space-y-5">

        {/* TITLE */}
        <div>
          <h2 className="text-2xl font-bold">
            {letter.title}
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            {letter.description}
          </p>
        </div>

        {/* INFO OBJECT */}
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <p>📅 {letter.eventDate}</p>
          <p>⏰ {letter.eventTime}</p>
          {letter.eventPlace && <p>📍 {letter.eventPlace}</p>}
          <p className={getStatusColor(letter.globalStatus)}>
            Status: {letter.globalStatus}
          </p>
        </div>

        {/* SENDER OBJECT */}
        <div className="text-sm text-slate-400">
          👤 {letter.sender?.name} ({letter.sender?.regNumber})
        </div>

        {/* REJECTION OBJECT */}
        {letter.rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-300 text-sm">
            ❌ Reason: {letter.rejectionReason}
          </div>
        )}

        {/* APPROVAL HISTORY OBJECT */}
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold mb-2">
            Approval History
          </p>

          <div className="flex flex-wrap gap-2">
            {letter.previousApprovers?.map((p, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs ${
                  p.status === "APPROVED"
                    ? "bg-green-600/20 text-green-400"
                    : p.status === "REJECTED"
                    ? "bg-red-600/20 text-red-400"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default RejectedLetterCardDetail;
