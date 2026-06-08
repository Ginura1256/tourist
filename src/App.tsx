import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Compass, Leaf, Server, Landmark, ShieldCheck, Sliders, Cpu, Menu, X, ArrowRight } from "lucide-react";
const RouterDashboard = React.lazy(() => import("./components/RouterDashboard"));
const AlternativesWiki = React.lazy(() => import("./components/AlternativesWiki"));
const SimulatorDashboard = React.lazy(() => import("./components/SimulatorDashboard"));
const BehindInnovation = React.lazy(() => import("./components/BehindInnovation"));
const MeetTheTeam = React.lazy(() => import("./components/MeetTheTeam"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div className="w-12 h-12 rounded-full border-4 border-[#00C4B4]/10 border-t-[#00C4B4] animate-spin" />
    <p className="text-xs font-mono font-bold text-[#0A3D2B] animate-pulse">
      Loading interface...
    </p>
  </div>
);

// Top Header Component showing active states using React Router
function NavigationHeader() {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-250/50 bg-white/80 backdrop-blur-md transition-all duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="p-2.5 bg-forest-green text-white rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5.5 h-5.5 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base font-display font-black tracking-tight text-dark-slate leading-none">
                EcoDiverter
              </h1>
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 uppercase mt-1 block">
                Sustainable Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/40">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 border ${
                location.pathname === "/"
                  ? "bg-white border-slate-200/50 text-forest-green shadow-xs"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Live Crowds & Routing
            </Link>
            
            <Link
              to="/alternatives"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                location.pathname === "/alternatives"
                  ? "bg-white border-slate-200/50 text-forest-green shadow-xs"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Alternative Places
            </Link>

            <Link
              to="/simulator"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                location.pathname === "/simulator"
                  ? "bg-white border-slate-200/50 text-forest-green shadow-xs"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Simulator Sandbox
            </Link>

            <Link
              to="/innovation"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                location.pathname === "/innovation"
                  ? "bg-white border-slate-200/50 text-forest-green shadow-xs"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Behind Innovation
            </Link>
          </nav>

          {/* Desktop Status Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold bg-emerald-50 border border-emerald-250/60 text-emerald-700 py-2 px-4 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              ROUTER STANDBY
            </span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-slate-650 hover:text-slate-900 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 shadow-sm transition cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md animate-fade-in shadow-lg absolute left-0 right-0 py-4 px-6 space-y-3 z-50">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-mono font-bold transition border ${
              location.pathname === "/"
                ? "bg-[#0A3D2B]/5 border-emerald-500/20 text-[#0A3D2B]"
                : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Live Crowds & Routing</span>
            <Compass className="w-4.5 h-4.5 text-slate-400" />
          </Link>

          <Link
            to="/alternatives"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-mono font-bold transition border ${
              location.pathname === "/alternatives"
                ? "bg-[#0A3D2B]/5 border-emerald-500/20 text-[#0A3D2B]"
                : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Alternative Places
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/simulator"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-mono font-bold transition border ${
              location.pathname === "/simulator"
                ? "bg-[#0A3D2B]/5 border-emerald-500/20 text-[#0A3D2B]"
                : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Simulator Sandbox
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/innovation"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-mono font-bold transition border ${
              location.pathname === "/innovation"
                ? "bg-[#0A3D2B]/5 border-emerald-500/20 text-[#0A3D2B]"
                : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Behind Innovation
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      )}
    </header>
  );
}

// Subtitle footer containing details & attribution
function UnifiedAppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-500 text-xs font-mono">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Leaf className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="font-bold text-dark-slate">EcoDiverter Platform</span>
          </div>
          
          <div className="flex justify-center items-center gap-2 text-center">
            <Landmark className="w-4 h-4 text-slate-400" />
            <span>Overtourism Mitigation & Heritage Conservation Initiative</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-400">&copy; {new Date().getFullYear()} EcoDiverter</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400">Sri Lanka</span>
          </div>
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
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Home Path - Telemetry Dashboard */}
                <Route path="/" element={<RouterDashboard />} />

                {/* Alternatives Guide */}
                <Route path="/alternatives" element={<AlternativesWiki />} />

                {/* Simulator Dashboard */}
                <Route path="/simulator" element={<SimulatorDashboard />} />

                {/* Behind Innovation */}
                <Route path="/innovation" element={<BehindInnovation />} />

                {/* Meet the Team */}
                <Route path="/team" element={<MeetTheTeam />} />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </main>
        </div>

        {/* Cohesive design system footer */}
        <UnifiedAppFooter />
      </div>
    </BrowserRouter>
  );
}
