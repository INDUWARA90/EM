import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  // ✅ separate state (cleaner)
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = {
      regNumber,
      password,
    };

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

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
      
      // ✅ STORE USER IN LOCAL STORAGE
      const userToStore = data.user || data;

      localStorage.setItem("user", JSON.stringify(userToStore));

      // optional: store username separately if needed
      localStorage.setItem("username", userToStore.username || "");

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

          {/* Reg Number */}
          <input
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            placeholder="Registration ID"
            className="w-full p-3 rounded bg-white/10 text-white"
          />

          {/* Password */}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white/10 text-white"
          />

          {/* Button */}
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