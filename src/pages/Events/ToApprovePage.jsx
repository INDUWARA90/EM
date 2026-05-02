import { useCallback, useEffect, useState } from "react";
import { ApprovalLetterCard } from "../../features/events/components";
import { getLettersToApprove, rejectLetter } from "../../api/approvalService";

function ToApprovePage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");

  // ================= FETCH LETTERS =================
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getLettersToApprove();

      const list =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.content)
          ? data.content
          : [];

      setLetters(list);
    } catch (err) {
      console.error("FETCH ERROR:", err.message);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= REFRESH AFTER APPROVE =================
  const handleApproveSuccess = () => {
    fetchData(); // reload list after sign-approve
  };

  // ================= REJECT =================
  const openRejectModal = (id) => {
    setSelectedId(id);
    setReason("");
    setShowModal(true);
  };

  const confirmReject = async () => {
    if (!reason.trim()) return;

    try {
      await rejectLetter(selectedId, reason);

      setLetters((prev) =>
        prev.filter((l) => l.letterId !== selectedId)
      );

      setShowModal(false);
      setSelectedId(null);
      setReason("");
    } catch (err) {
      console.error("Reject error:", err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050b1a] p-6 text-white">

      <div className="mb-6 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">To Approve</h1>
        <p className="text-slate-400 text-sm">Pending approvals</p>
      </div>

      {loading && (
        <p className="text-slate-400">Loading letters...</p>
      )}

      {!loading && letters.length === 0 && (
        <div className="text-center text-slate-400 mt-20">
          No letters pending approval 🎉
        </div>
      )}

      <div className="space-y-6">
        {letters.map((letter) => (
          <ApprovalLetterCard
            key={letter.letterId}
            letter={letter}
            onReject={openRejectModal}
            onApprove={handleApproveSuccess}   // ✅ IMPORTANT FIX
          />
        ))}
      </div>

      {/* REJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f172a] w-[400px] p-6 rounded-2xl border border-white/10">

            <h2 className="text-xl font-bold mb-4">
              Reject Letter
            </h2>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-28 p-3 rounded-lg bg-white/5 border border-white/10"
              placeholder="Enter rejection reason..."
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmReject}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ToApprovePage;
