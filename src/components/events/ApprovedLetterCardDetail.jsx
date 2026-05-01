import React from "react";
import PdfViewer from "../PdfViewer";

function ApprovedLetterCardDetail({ letter }) {
  const pdfUrl = `http://localhost:8081/${letter.pdfPath}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-2xl p-6">

      {/* LEFT → PDF */}
      <div className="h-[450px] bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-10 bg-black/50 backdrop-blur-md flex items-center px-4 border-b border-white/10 z-10">
          <p className="text-xs text-slate-400 font-medium">
            📄 Document Preview
          </p>
        </div>
        <div className="pt-10 h-full">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>

      {/* RIGHT → DETAILS */}
      <div className="flex flex-col justify-between">

        <div className="space-y-5">

          {/* TITLE */}
          <div>
            <h2 className="text-2xl font-bold">
              {letter.title}
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              {letter.description}
            </p>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
            <p>📅 {letter.eventDate}</p>
            <p>⏰ {letter.eventTime}</p>
            {letter.eventPlace && <p>📍 {letter.eventPlace}</p>}
            <p>
              Status:{" "}
              <span className="text-green-400 font-semibold">
                {letter.globalStatus}
              </span>
            </p>
          </div>

          {/* SENDER */}
          <div className="text-sm text-slate-400">
            👤 {letter.sender?.name} ({letter.sender?.regNumber})
          </div>

          {/* APPROVAL INFO */}
          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-green-300 text-sm">
            ✅ You approved this letter
          </div>

          {/* APPROVAL HISTORY */}
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">
              Approval History
            </p>

            <div className="flex flex-wrap gap-2">
              {letter.previousApprovers?.map((p, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs"
                >
                  ✔ {p.name} ({p.status})
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ApprovedLetterCardDetail;
