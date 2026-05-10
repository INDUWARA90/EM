import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { createClub } from "../../shared/api/endpoints";

function ClubCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clubName: "",
    secretaryRegNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createClub({
        clubName: form.clubName,
        secretaryRegNumber: form.secretaryRegNumber,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Club creation failed:", err);
      setError(
        err?.response?.data?.message || "Failed to create club. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-lg mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create New Club
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Register a new student club and assign its secretary
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
        >
          <div className="p-6 space-y-5">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Club Details
            </p>

            {/* Club Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Club Name
              </label>
              <input
                name="clubName"
                value={form.clubName}
                onChange={handleChange}
                placeholder="e.g. ICTSC"
                required
                className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            {/* Secretary Reg Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Secretary Reg. Number
              </label>
              <input
                name="secretaryRegNumber"
                value={form.secretaryRegNumber}
                onChange={handleChange}
                placeholder="e.g. ICTSC-SEC"
                required
                className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800/50 bg-slate-950/30">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Building2 size={15} />
              {loading ? "Creating..." : "Create Club"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default ClubCreate;