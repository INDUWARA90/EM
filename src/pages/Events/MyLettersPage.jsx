import React, { useEffect, useState } from "react";
import LetterCard from "../../components/events/LetterCard";
import { getMyLetters } from "../../api/eventService";

function MyLettersPage() {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyLetters();

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
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050b1a] p-6 space-y-8 overflow-hidden">

      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            My Documents
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and track your event proposals.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-blue-400 text-sm font-medium">
          {letters.length} Total Letters
        </div>
      </header>

      {/* Letters List */}
      <main className="relative z-10 space-y-6">
        {letters.length > 0 ? (
          letters.map((letter) => (
            <LetterCard key={letter.letterId} letter={letter} />
          ))
        ) : (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500">
              No documents found in your history.
            </p>
          </div>
        )}
      </main>

    </div>
  );
}

export default MyLettersPage;