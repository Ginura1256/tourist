import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Compass, Leaf, Server, Landmark, ShieldCheck } from "lucide-react";
import RouterDashboard from "./components/RouterDashboard";
import AlternativesWiki from "./components/AlternativesWiki";

// Top Header Component showing active states using React Router
function NavigationHeader() {
  const location = useLocation();

  return (
    <header className="border-b border-green-100 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-green-600 text-white rounded-xl shadow-sm">
              <Compass className="w-5 h-5 text-green-50 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-800 leading-none uppercase">
                EcoDiverter
              </h1>
              <span className="text-[9px] font-mono font-bold tracking-widest text-green-600 uppercase mt-0.5 block">
                Overtourism Mitigation Router
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 border ${
                location.pathname === "/"
                  ? "bg-green-50 border-green-200 text-green-700 shadow-xs"
                  : "bg-transparent border-transparent text-slate-600 hover:bg-green-50/50 hover:text-green-700"
              }`}
            >
              Live Crowds & Routing
            </Link>
            
            <Link
              to="/alternatives"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 flex items-center gap-1.5 border ${
                location.pathname === "/alternatives"
                  ? "bg-green-50 border-green-200 text-green-700 shadow-xs"
                  : "bg-transparent border-transparent text-slate-600 hover:bg-green-50/50 hover:text-green-700"
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-green-600" />
              Alternative Places
            </Link>
          </nav>

          {/* Human-Centered Health Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-green-50 border border-green-200 text-green-700 py-1.5 px-3 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              ROUTER STANDBY
            </span>
          </div>
          
        </div>
      </div>
    </header>
  );
}

// Subtitle footer containing details & attribution
function UnifiedAppFooter() {
  return (
    <footer className="border-t border-green-150 bg-white/85 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs font-mono">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <span className="text-slate-400">&copy; {new Date().getFullYear()} EcoDiverter</span>
          <div className="flex justify-center items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-400" />
            <span>EcoDiverter Overtourism Router Proof-of-Concept</span>
          </div>
          <span className="text-slate-400">Sri Lanka Travel Preservation</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-[#fafdfa] to-[#f4faf4] font-sans antialiased text-slate-800 flex flex-col justify-between">
        <div className="flex-1">
          {/* Sticky Navigation bar */}
          <NavigationHeader />

          {/* Main Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Home Path - Telemetry Dashboard */}
              <Route path="/" element={<RouterDashboard />} />

              {/* Alternatives Guide */}
              <Route path="/alternatives" element={<AlternativesWiki />} />

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Cohesive design system footer */}
        <UnifiedAppFooter />
      </div>
    </BrowserRouter>
  );
}
