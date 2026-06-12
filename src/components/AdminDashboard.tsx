import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ShieldAlert, 
  LogOut, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Database,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import SimulatorDashboard from "./SimulatorDashboard";
import { Destination } from "../types";

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validate admin token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await axios.get("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminUser(res.data.username);
        
        // Fetch current destinations to calculate statistics
        const destsRes = await axios.get<Destination[]>("/api/destinations");
        setDestinations(destsRes.data);
      } catch (err) {
        console.error("Session verification failed, logging out...", err);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_username");
        window.dispatchEvent(new Event("admin_login_change"));
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Listener to refresh stats when the Simulator changes values
  // Since we want the stats cards to update dynamically in real time, let's set up a periodic poll
  // or simple listener. Polling destinations every 3 seconds makes it extremely interactive and alive!
  useEffect(() => {
    if (!adminUser) return;
    const interval = setInterval(async () => {
      try {
        const destsRes = await axios.get<Destination[]>("/api/destinations");
        setDestinations(destsRes.data);
      } catch (err) {
        // Silent error to avoid console clutter
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [adminUser]);

  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      await axios.post("/api/admin/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn("Logout request error:", err);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_username");
      // Dispatch event to update App.tsx header state
      window.dispatchEvent(new Event("admin_login_change"));
      navigate("/admin/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-600 animate-spin" />
        <p className="text-xs font-mono font-bold text-emerald-800 animate-pulse">
          Establishing Secure Admin Session...
        </p>
      </div>
    );
  }

  // Calculate statistics
  const totalSites = destinations.length;
  const crowdedSites = destinations.filter(d => d.crowdLevel > 75).length;
  const optimalSites = totalSites - crowdedSites;
  const averageCrowd = totalSites > 0 
    ? Math.round(destinations.reduce((acc, d) => acc + d.crowdLevel, 0) / totalSites)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* ADMIN STATUS SUBHEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200/60 p-4 px-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Authenticated Operator:</span>
            <strong className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200">{adminUser}</strong>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100/80 text-rose-700 font-mono font-bold text-xs rounded-2xl border border-rose-200 cursor-pointer transition shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          TERMINATE SESSION
        </button>
      </div>

      {/* METRIC WIDGET PANELS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-55 border border-emerald-100 rounded-2xl text-emerald-700">
            <MapPin className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider font-bold">Monitored Zones</span>
            <span className="text-2xl font-display font-black text-dark-slate leading-none mt-1 block">
              {totalSites} Sites
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider font-bold">Surging Alerts</span>
            <span className="text-2xl font-display font-black text-rose-600 leading-none mt-1 block">
              {crowdedSites} Active
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-2xl text-teal-700">
            <CheckCircle2 className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider font-bold">Optimal Flow</span>
            <span className="text-2xl font-display font-black text-teal-700 leading-none mt-1 block">
              {optimalSites} Sites
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider font-bold">Average Crowd</span>
            <span className="text-2xl font-display font-black text-amber-700 leading-none mt-1 block">
              {averageCrowd}% Density
            </span>
          </div>
        </div>
      </div>

      {/* EMBEDDED SIMULATOR SANDBOX */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-150 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Interactive Simulator Console</span>
          </div>
          <h3 className="text-lg font-display font-black text-dark-slate mt-1">
            Realtime Overtourism Telemetry Override
          </h3>
        </div>
        
        {/* Render the actual Simulator Sandbox component */}
        <SimulatorDashboard />
      </div>

      {/* FOOTER SYSTEM DIAGNOSTICS */}
      <div className="bg-slate-900 text-slate-300 rounded-[28px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 text-slate-400 rounded-2xl">
            <Database className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-white">System Diagnostics</h4>
            <p className="text-xs text-slate-400 mt-0.5">Database status: Online • WebSockets: Simulated Polling Mode</p>
          </div>
        </div>
        <div className="text-[10px] font-mono bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-400 text-center md:text-right">
          SESSION EXPIRES: 24H FROM LOGIN • TOKEN PERSISTED IN SECURE BROWSER STORAGE
        </div>
      </div>

    </div>
  );
}
