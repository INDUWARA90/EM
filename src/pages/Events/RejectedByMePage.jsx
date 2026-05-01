import React, { useEffect, useState } from "react";
import RejectedLetterCardDetail from "../../components/events/RejectedLetterCardDetail";

function RejectedByMePage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedLetters();
  }, []);

  const fetchRejectedLetters = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/letter/rejected-by-me",
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rejected letters");
      }

      const data = await response.json();

      console.log("Rejected letters:", data);

      // handle array or single object safely
      const list = Array.isArray(data)
        ? data
        : data
        ? [data]
        : [];

      setLetters(list);
    } catch (err) {
      console.error("Rejected fetch error:", err.message);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        Loading rejected letters...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b1a] p-6 text-white">

      {/* HEADER */}
      <div className="mb-6 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-red-400">
          Rejected By Me
        </h1>
        <p className="text-slate-400 text-sm">
          Letters you have rejected
        </p>
      </div>

      {/* EMPTY STATE */}
      {letters.length === 0 ? (
        <div className="text-center text-slate-400 mt-20">
          No rejected letters found
        </div>
      ) : (
        <div className="space-y-8">
          {letters.map((letter) => (
            <RejectedLetterCardDetail
              key={letter.letterId}
              letter={letter}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RejectedByMePage;