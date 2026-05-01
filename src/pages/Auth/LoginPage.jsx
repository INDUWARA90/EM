import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const callCheckApi = async () => {
  try {
    const res = await fetch("http://localhost:8081/api/check", {
      method: "GET",
      credentials: "include",
    });

    const text = await res.text();

    console.log("🔎 CHECK API STATUS:", res.status);
    console.log("✅ CHECK API SUCCESS:", res.ok);
    console.log("📩 CHECK API RESPONSE:", text || "(empty response from backend)");

  } catch (err) {
    console.error("❌ Check API failed:", err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = {
      regNumber,
      password,
    };

    try {
      // 1️⃣ LOGIN REQUEST
      const response = await fetch(
        "http://localhost:8081/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 👈 IMPORTANT (same as your first code)
          body: JSON.stringify(form),
        }
      );

      // safer parsing (handles JSON + non-JSON responses)
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Login failed"
        );
      }

      console.log("LOGIN SUCCESS:", data);

      // 2️⃣ STORE USER
      const userToStore = data.user || data;

      localStorage.setItem("user", JSON.stringify(userToStore));
      localStorage.setItem("username", userToStore.username || "");

      // 3️⃣ CALL CHECK API AFTER LOGIN
      await callCheckApi();

      // 4️⃣ REDIRECT
      navigate("/dashboard");

    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b1a]">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10">

        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          System Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            placeholder="Registration ID"
            className="w-full p-3 rounded bg-white/10 text-white"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white/10 text-white"
          />

          <button
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          New user?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;