import PdfViewer from "../PdfViewer";

const LetterCard = ({ letter }) => {

  const pdfUrl = `http://localhost:8081/${letter.pdfPath}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">

      {/* ================= LEFT: PDF ================= */}
      <div className="relative bg-gradient-to-b from-black/60 to-black/30 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-md">

        {/* subtle glow border effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_0_60px_rgba(59,130,246,0.08)]" />

        {/* header bar */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-black/50 backdrop-blur-md flex items-center px-4 border-b border-white/10 z-10">
          <p className="text-xs text-slate-400 font-medium">
            📄 Document Preview
          </p>
        </div>

        {/* PDF content */}
        <div className="pt-10 h-full overflow-y-auto scroll-smooth">
          <PdfViewer fileUrl={pdfUrl} />
        </div>

      </div>

      {/* ================= RIGHT: DETAILS ================= */}
      <div className="text-white flex flex-col justify-between space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold">{letter.title}</h2>
          <p className="text-slate-400 text-sm mt-2">
            {letter.description}
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[10px] text-slate-500 uppercase">Status</p>
            <p className="text-yellow-400 font-semibold">
              {letter.globalStatus}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[10px] text-slate-500 uppercase">Event Date</p>
            <p className="text-slate-200">
              {letter.eventDate} {letter.eventTime}
            </p>
          </div>

          {letter.eventPlace && (
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 col-span-2">
              <p className="text-[10px] text-slate-500 uppercase">Location</p>
              <p className="text-slate-200">📍 {letter.eventPlace}</p>
            </div>
          )}

        </div>

        {/* SENDER INFO */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase mb-2">Sender</p>
          <p className="text-sm">
            {letter.sender?.name} ({letter.sender?.regNumber})
          </p>
        </div>

        {/* CURRENT APPROVER */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase mb-2">
            Current Approver
          </p>
          <p className="text-emerald-400 font-medium">
            {letter.currentApprover?.name || "No active approver"}
          </p>
        </div>

        {/* PREVIOUS APPROVERS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase mb-2">
            Previous Approvers
          </p>

          {letter.previousApprovers?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {letter.previousApprovers.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-green-500/10 border border-green-500/20 rounded-lg text-green-300"
                >
                  {a.name} ({a.status})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs">No previous approvals</p>
          )}
        </div>

        {/* NEXT APPROVERS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase mb-2">
            Next Approvers
          </p>

          {letter.nextApprovers?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {letter.nextApprovers.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-300"
                >
                  {a.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs">End of approval chain</p>
          )}
        </div>

        {/* REJECTION REASON */}
        {letter.rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
            <p className="text-[10px] text-red-300 uppercase mb-2">
              Rejection Reason
            </p>
            <p className="text-red-200 text-sm">
              {letter.rejectionReason}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LetterCard;