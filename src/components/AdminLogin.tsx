import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, User, Lock, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/admin/login", { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("admin_username", res.data.username);
        // Dispatch custom event to notify App.tsx navigation header about login status
        window.dispatchEvent(new Event("admin_login_change"));
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-slate-200/80 shadow-xl overflow-hidden p-8 lg:p-10 space-y-8 relative">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-forest-green/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand/Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-700 animate-pulse-slow" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black tracking-tight text-dark-slate">
              Admin Gateway
            </h2>
            <p className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mt-1">
              Crowd Whisper Control
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-start gap-2.5 text-xs animate-shake relative z-10">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-forest-green to-emerald-600 text-white font-mono font-bold text-xs rounded-2xl hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                AUTHENTICATE CONTROLLER
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
