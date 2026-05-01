import { useCallback, useEffect, useState } from "react";
import ApprovalLetterCard from "../../components/events/ApprovalLetterCard";

function ToApprovePage() {
  const [letters, setLetters] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");

  // ✅ GET letters to approve
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/letter/to-approve",
        {
          method: "GET",
          credentials: "include", // ✅ IMPORTANT
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch letters to approve");
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : data?.data
        ? data.data
        : [];

      setLetters(list);
    } catch (err) {
      console.error("ERROR:", err.message);
      setLetters([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ APPROVE (POST)
  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/letter/${id}/approve`,
        {
          method: "POST", // ✅ FIXED
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Approve failed");

      setLetters((prev) =>
        prev.filter((l) => l.letterId !== id)
      );
    } catch (err) {
      console.error("Approve error:", err.message);
    }
  };

  // ❌ OPEN MODAL
  const openRejectModal = (id) => {
    setSelectedId(id);
    setReason("");
    setShowModal(true);
  };

  // ❌ REJECT (POST)
  const confirmReject = async () => {
    try {
      if (!reason.trim()) return;

      const res = await fetch(
        `http://localhost:8081/api/letter/${selectedId}/reject`,
        {
          method: "POST", // ✅ FIXED (you said POST)
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!res.ok) throw new Error("Reject failed");

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
    <div className="relative min-h-screen bg-[#050b1a] p-6 text-white overflow-hidden">

      {/* header */}
      <div className="mb-6 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">To Approve</h1>
        <p className="text-slate-400 text-sm">Pending approvals</p>
      </div>

      {/* cards */}
      <div className="space-y-6">
        {letters.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            No letters pending approval 🎉
          </div>
        ) : (
          letters.map((letter) => (
            <ApprovalLetterCard
              key={letter.letterId}
              letter={letter}
              onApprove={handleApprove}
              onReject={openRejectModal}
            />
          ))
        )}
      </div>

      {/* MODAL */}
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
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={confirmReject}>
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