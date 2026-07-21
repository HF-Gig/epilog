import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to log in");
      }

      localStorage.setItem("session", JSON.stringify(json.session || {}));
      localStorage.setItem("user", JSON.stringify(json.user || {}));
      localStorage.setItem("session_token", json.token || "");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-100 font-sans text-base-content antialiased">
      <section className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 md:p-16 overflow-hidden bg-neutral text-neutral-content select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none animate-pulse" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

        <div className="z-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-black tracking-wider uppercase text-white hover:opacity-90 transition-opacity"
          >
            Epilog
          </Link>
        </div>

        <div className="my-auto max-w-md space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Knowledge, <br />
              captured instantly.
            </h1>
            <p className="text-neutral-content/85 text-sm leading-relaxed">
              Epilog watches for emoji reactions in Slack and turns those
              fleeting, valuable discussions into permanent, indexed company
              wiki pages automatically.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
            <p className="text-xs text-white/90 italic leading-relaxed">
              "Epilog has completely changed how our engineering onboarding
              works. Every time we solve a weird environment bug, a quick 📝
              reaction captures it forever. No more answering the same question
              twice!"
            </p>
            <div className="flex items-center gap-3">
              <div className="avatar circular placeholder">
                <div className="w-9 h-9 rounded-full ring-2 ring-primary">
                  <img
                    src="https://picsum.photos/id/1012/80/80"
                    alt="David Chen avatar"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">David Chen</h4>
                <p className="text-[10px] text-neutral-content/70">
                  Engineering Manager, Vanta
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="z-10 text-[10px] text-neutral-content/40 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Epilog Inc.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none" />

        <div className="w-full max-w-sm space-y-8 z-10">
          <div className="md:hidden flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent"
            >
              Epilog
            </Link>
          </div>

          <div className="space-y-1.5 text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-base-content">
              Welcome back
            </h2>
            <p className="text-xs text-base-content/65">
              New to Epilog?{" "}
              <Link to="/signup" className="link link-primary font-medium">
                Create an account
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="https://azaria-gastrocnemial-decidedly.ngrok-free.dev/api/auth/slack"
              className="btn btn-outline w-full gap-3 font-semibold border-base-300 hover:bg-base-200 hover:text-base-content transition-all duration-200"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523v-2.522h2.522a2.528 2.528 0 0 1 2.52 2.522z" fill="#36C5F0"/>
                <path d="M6.303 15.165a2.528 2.528 0 0 1 2.52-2.522h5.045a2.528 2.528 0 0 1 2.522 2.522v5.045a2.528 2.528 0 0 1-2.522 2.522H8.823a2.528 2.528 0 0 1-2.52-2.522v-5.045z" fill="#36C5F0"/>
                <path d="M8.823 5.043a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.522h-2.522a2.528 2.528 0 0 1-2.52-2.522z" fill="#2EB67D"/>
                <path d="M8.823 6.304a2.528 2.528 0 0 1 2.52 2.52v5.045a2.528 2.528 0 0 1-2.52 2.522H3.778A2.528 2.528 0 0 1 1.256 13.83V8.824A2.528 2.528 0 0 1 3.778 6.304h5.045z" fill="#2EB67D"/>
                <path d="M18.958 8.835a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.522h-2.522a2.528 2.528 0 0 1-2.52-2.522z" fill="#ECB22E"/>
                <path d="M17.696 8.835a2.528 2.528 0 0 1-2.52 2.522h-5.045a2.528 2.528 0 0 1-2.522-2.522V3.79a2.528 2.528 0 0 1 2.522-2.52h5.045a2.528 2.528 0 0 1 2.52 2.52v5.045z" fill="#ECB22E"/>
                <path d="M13.914 18.968a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.522h2.522a2.528 2.528 0 0 1 2.52 2.522z" fill="#E01E5A"/>
                <path d="M13.914 17.707a2.528 2.528 0 0 1-2.52-2.52v-5.045a2.528 2.528 0 0 1 2.52-2.522h5.045a2.528 2.528 0 0 1 2.522 2.522v5.045a2.528 2.528 0 0 1-2.522 2.522h-5.045z" fill="#E01E5A"/>
              </svg>
              Sign in with Slack
            </a>
          </div>

          <div className="divider font-bold text-[10px] uppercase opacity-50 my-6">
            or email
          </div>

           {error && (
            <div className="alert alert-error text-sm rounded-lg mb-4 text-white">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control w-full">
              <label className="label pb-1.5">
                <span className="label-text font-bold text-[11px] text-base-content/75 uppercase tracking-wider">
                  Work Email
                </span>
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-control w-full">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-base-content/75 uppercase tracking-wider">
                  Password
                </span>
                <a
                  href="#"
                  className="text-xs link link-primary font-medium hover:text-primary-focus transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full shadow-lg shadow-primary/10 font-bold mt-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <Link
            to="/"
            className="link link-hover text-xs text-base-content/50 block text-center mt-6 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Login;
