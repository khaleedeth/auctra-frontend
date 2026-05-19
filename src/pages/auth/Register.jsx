import { useState } from "react";
import { registerUser } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auction-bg flex items-center justify-center px-4">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-auction-accent opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">

        <div className="text-center mb-10">
          <h1 className="font-display text-6xl text-auction-accent tracking-widest mb-2">
            AUCTRA
          </h1>
          <p className="text-auction-muted text-sm tracking-widest uppercase">
            Real-time Auction Platform
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-auction-text font-semibold text-xl mb-6">
            Create Account
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
                Username
              </label>
              <input
                className="input-field"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-auction-text-dim text-xs uppercase tracking-widest block mb-2">
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-4 bg-red-400/10 px-4 py-2 border border-red-400/20">
              {error}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-auction-muted text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-auction-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}