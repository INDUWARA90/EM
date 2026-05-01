import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    regNumber: "",
    role: "lecturer",
  });

  const [loading, setLoading] = useState(false);

  const roles = ["admin", "secretary", "lecturer", "dean", "user"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      regNumber: form.regNumber,
      role: [form.role],
    };

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Registration failed");
      }
      
      alert("User registered successfully!");

      setForm({
        username: "",
        email: "",
        password: "",
        regNumber: "",
        role: "lecturer",
      });
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050b1a] p-6 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-5 text-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Join the university management system.
            </p>
          </div>

          {/* Username + Reg Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                Username
              </label>
              <input
                name="username"
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                Reg Number
              </label>
              <input
                name="regNumber"
                placeholder="TG/2023/2222"
                value={form.regNumber}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@university.com"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
              System Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-[#0f172a] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-500 mt-4"
          >
            {loading ? "Creating Account..." : "Register Now"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;