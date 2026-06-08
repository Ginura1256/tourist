import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sliders, Sparkles, Activity, Info, RefreshCw } from "lucide-react";
import { Destination } from "../types";

export default function SimulatorDashboard() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Fetch all destinations
  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<Destination[]>("/api/destinations");
      setDestinations(res.data);
      setError("");
    } catch (err: any) {
      setError("Failed to fetch destinations list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Update slider value
  const handleManualSliderChange = async (name: string, level: number) => {
    try {
      // Optimistic local update
      setDestinations(prev => 
        prev.map(d => d.name === name ? { ...d, crowdLevel: level, isCrowded: level > 75 } : d)
      );

      // Post to backend
      await axios.post("/api/set-crowd", {
        name,
        crowdLevel: level
      });
    } catch (err: any) {
      console.error("Failed to post crowd override update: ", err.message);
    }
  };

  // Restore seeded state
  const handleRestoreDefaults = async () => {
    setIsResetting(true);
    try {
      const res = await axios.post("/api/reset");
      if (res.data && res.data.list) {
        setDestinations(res.data.list);
      } else {
        await fetchDestinations();
      }
      setError("");
    } catch (err: any) {
      setError("Failed to restore initial seeded database status.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in text-slate-800">
      
      {/* HEADER HERO AREA */}
      <div className="bg-gradient-to-br from-[#1b5e20] via-forest-green to-dark-slate rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-[0.08] pointer-events-none">
          <Sliders className="w-56 h-56 text-white" />
        </div>
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-full w-max border border-emerald-450/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Administrative Controls
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-black tracking-tight text-white leading-tight">
            Overtourism Simulator Dashboard
          </h2>
          <p className="text-emerald-100/90 text-sm lg:text-base leading-relaxed font-medium">
            This stress-testing cockpit allows you to manually override tourist counts and test the overtourism mitigation algorithms. Adjusting the values past <strong>75%</strong> automatically triggers the <strong>Emergency Diverter</strong> and changes the live routing paths.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-5 rounded-3xl flex items-center gap-3 text-sm max-w-4xl mx-auto">
          <Info className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CORE SANDBOX CARD SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-forest-green tracking-wider uppercase">Administrative Sandbox</span>
            <h3 className="text-xl lg:text-2xl font-display font-extrabold text-dark-slate mt-1">
              Active Control Stations
            </h3>
          </div>

          <button
            onClick={handleRestoreDefaults}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-mono font-bold text-xs rounded-2xl border border-slate-250 cursor-pointer transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            RESET TELEMETRY DEFAULTS
          </button>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((d) => (
              <div 
                key={d.name} 
                className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-300 space-y-6"
              >
                <div>
                  <span className="font-display font-extrabold text-dark-slate text-lg block tracking-tight leading-tight">{d.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1 uppercase tracking-wider font-bold">Primary Target Site</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono uppercase tracking-wider text-[10px]">Live Crowd Level</span>
                    <span className={`font-mono font-black text-sm ${
                      d.crowdLevel > 75 ? "text-rose-600 animate-pulse" : "text-emerald-600"
                    }`}>
                      {d.crowdLevel}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={d.crowdLevel}
                    onChange={(e) => handleManualSliderChange(d.name, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 py-1"
                  />

                  <div className="flex justify-between items-center text-[10px] font-mono font-bold pt-2 border-t border-slate-200/60">
                    <span className="text-slate-400">STATUS:</span>
                    <span className={d.crowdLevel > 75 ? "text-rose-600" : "text-emerald-600"}>
                      {d.crowdLevel > 75 ? "🔴 SURGE REDIRECT" : "🟢 OPTIMAL FLOW"}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-2 pt-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px]">Alternative:</span>
                    <span className="font-bold text-slate-700">{d.alternativeDestination.split(" ")[0]}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 italic">
                    "{d.alternativeDesc}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER TIPS */}
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-[24px] p-6 lg:p-8 text-slate-750 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-emerald-100 text-emerald-800 rounded-3xl shrink-0">
          <Activity className="w-8 h-8 text-emerald-700" />
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-display font-bold text-forest-green flex items-center gap-2">
            Simulating Diverter Operations
          </h4>
          <p className="text-xs lg:text-sm leading-relaxed text-slate-600">
            When a destination exceeds the 75% overtourism threshold, the backend automatically flags it as crowded. This will dynamically re-route passengers to the designated eco-alternative on the map, trigger the warning notifications, and update the telemetry graphs. Move a slider below 75% to return the status to optimal flow.
          </p>
        </div>
      </div>

    </div>
  );
}
