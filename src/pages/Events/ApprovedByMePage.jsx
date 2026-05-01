import { useEffect, useState } from "react";
import ApprovedLetterCardDetail from "../../components/events/ApprovedLetterCardDetail";
import { getApprovedByMe } from "../../api/approvalService";

function ApprovedByMePage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedLetters();
  }, []);

  const fetchApprovedLetters = async () => {
    try {
      setLoading(true);

      const data = await getApprovedByMe();

      console.log("Approved letters:", data);

      // handle array or single object safely
      const list = Array.isArray(data)
        ? data
        : data
        ? [data]
        : [];

      setLetters(list);
    } catch (err) {
      console.error("Approved fetch error:", err.message);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        Loading approved letters...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b1a] p-6 text-white">

      {/* HEADER */}
      <div className="mb-6 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-green-400">
          Approved By Me
        </h1>
        <p className="text-slate-400 text-sm">
          Letters you have approved
        </p>
      </div>

      {/* EMPTY STATE */}
      {letters.length === 0 ? (
        <div className="text-center text-slate-400 mt-20">
          No approved letters found
        </div>
      ) : (
        <div className="space-y-8">
          {letters.map((letter) => (
            <ApprovedLetterCardDetail
              key={letter.letterId}
              letter={letter}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ApprovedByMePage;