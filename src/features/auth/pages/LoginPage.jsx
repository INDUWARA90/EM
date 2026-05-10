import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { checkApi, login } from "../../../shared/api/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const callCheckApi = async () => {
    try {
      const res = await checkApi();
      console.info("SYSTEM CHECK:", res || "Online");
    } catch (err) {
      console.error("System check failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(regNumber, password);
      const userData = data.user ? data : data;

      localStorage.setItem("user", JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      await callCheckApi();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            <ShieldCheck className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            SYSTEM<span className="text-cyan-500">ACCESS</span>
          </h1>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Registration ID
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors"
                  size={18}
                />
                <input
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="TG/2023/001"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors"
                  size={18}
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="group relative w-full overflow-hidden bg-white hover:bg-cyan-50 text-slate-900 font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHORIZING...</span>
                </div>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-sm">Don't have a account?</p>
            <Link
              to="/register"
              className="text-cyan-400 font-bold text-sm hover:text-cyan-300 transition-colors mt-1 inline-block"
            >
              Create New Identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
