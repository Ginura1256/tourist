import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Play, 
  Square, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MapPin, 
  Sliders, 
  Clock, 
  Activity, 
  AlertCircle,
  Compass
} from "lucide-react";
import { Destination, RouteStatus } from "../types";
import RouteMap from "./RouteMap";

export default function RouterDashboard() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestName, setSelectedDestName] = useState<string>("Sigiriya Rock Fortress");
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeStatus, setRouteStatus] = useState<RouteStatus | null>(null);
  const [showClearAlert, setShowClearAlert] = useState<boolean>(false);
  const [clearedDestinationName, setClearedDestinationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [simulatorMode, setSimulatorMode] = useState<"random" | "manual">("random");
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [currentDestination, setCurrentDestination] = useState<string>("Sigiriya Rock Fortress");
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Active polling timer reference
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  // Keep previous crowding state in ref to detect transition from crowded to clear
  const prevCrowdedStatusRef = useRef<boolean | null>(null);

  // Fetch all destinations on mount
  useEffect(() => {
    fetchDestinations();
    return () => stopPolling();
  }, []);

  const fetchDestinations = async () => {
    try {
      setError("");
      const res = await axios.get<Destination[]>("/api/destinations");
      setDestinations(res.data);
      if (res.data.length > 0 && !selectedDestName) {
        setSelectedDestName(res.data[0].name);
      }
    } catch (err: any) {
      console.error("Error fetching destinations:", err);
      setError("Failed to fetch destinations from server database.");
    }
  };

  const checkRouteTraffic = async () => {
    try {
      setError("");
      const res = await axios.post("/api/check-congestion");
      const data = res.data;
      if (data.isCrowded) {
        setCurrentDestination("Pidurangala & Lion Rocks viewpoint");
        setAlertMessage(`Warning: Heavy traffic was detected on the route to Sigiriya Rock Fortress. Congestion ratio: ${data.ratio.toFixed(2)}. Rerouting to Pidurangala & Lion Rocks viewpoint.`);
      } else {
        setCurrentDestination("Sigiriya Rock Fortress");
        setAlertMessage(`Traffic clear. Congestion ratio: ${data.ratio.toFixed(2)}. Routing directly to Sigiriya Rock Fortress.`);
      }
    } catch (err: any) {
      console.error("Traffic proxy check failure:", err);
      setError("Unable to retrieve real-time traffic proxy data from Google Maps Routes API (v2).");
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = () => {
    stopPolling();
    // Run immediate check
    performCrowdCheck();
    
    // Set up polling interval every 3 minutes (180000ms)
    pollingRef.current = setInterval(() => {
      performCrowdCheck();
    }, 180000);
  };

  const performCrowdCheck = async () => {
    if (!selectedDestName) return;
    setIsLoading(true);
    try {
      let res;
      if (simulatorMode === "random") {
        // Fetch simulated crowd factor from the backend
        res = await axios.get<RouteStatus>(`/api/check-crowd/${encodeURIComponent(selectedDestName)}`);
      } else {
        // Read current local state crowdLevel and update via set-crowd for continuity
        const currentTarget = destinations.find(d => d.name === selectedDestName);
        const level = currentTarget ? currentTarget.crowdLevel : 40;
        res = await axios.post<RouteStatus>("/api/set-crowd", {
          name: selectedDestName,
          crowdLevel: level
        });
      }

      const status: RouteStatus = res.data;
      setRouteStatus(status);
      setError("");

      // Refresh destination list to synchronize levels in local sliders
      const listRes = await axios.get<Destination[]>("/api/destinations");
      setDestinations(listRes.data);

      const isCurrentlyCrowded = status.isCrowded;
      const wasCrowded = prevCrowdedStatusRef.current;

      // Detection logic: Was crowded (true) -> Now clear (false)
      if (wasCrowded === true && isCurrentlyCrowded === false) {
        setClearedDestinationName(status.primaryDestination);
        setShowClearAlert(true);
      }

      // Record this state for next evaluation tick
      prevCrowdedStatusRef.current = isCurrentlyCrowded;
    } catch (err: any) {
      console.error("Error checking crowd density status:", err);
      setError("Communication failed with the dynamic router API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Router
  const handleStartRoute = () => {
    setIsRouting(true);
    prevCrowdedStatusRef.current = null; // Clear history on restart
    setShowClearAlert(false);
    startPolling();
  };

  const handleStopRoute = () => {
    setIsRouting(false);
    stopPolling();
    setRouteStatus(null);
    prevCrowdedStatusRef.current = null;
    setShowClearAlert(false);
  };

  // Modify manual crowd slider level in database
  const handleManualSliderChange = async (name: string, value: number) => {
    // Optimistically update locally for immediate slider responsiveness
    setDestinations(prev => prev.map(d => d.name === name ? { ...d, crowdLevel: value, isCrowded: value > 75 } : d));
    
    try {
      const res = await axios.post<RouteStatus>("/api/set-crowd", {
        name,
        crowdLevel: value
      });
      
      // If active routing applies to this location, immediately update current routing telemetry!
      if (isRouting && selectedDestName === name) {
        const isCurrentlyCrowded = res.data.isCrowded;
        const wasCrowded = prevCrowdedStatusRef.current;
        
        // Check for safe clearing criteria in manual mode
        if (wasCrowded === true && isCurrentlyCrowded === false) {
          setClearedDestinationName(res.data.primaryDestination);
          setShowClearAlert(true);
        }
        
        setRouteStatus(res.data);
        prevCrowdedStatusRef.current = isCurrentlyCrowded;
      }
    } catch (err: any) {
      console.error("Error setting custom crowd limit override:", err);
      setError("Failed to register custom manual crowd override.");
    }
  };

  // Restore seeded state on Express
  const handleResetSystem = async () => {
    setIsResetting(true);
    handleStopRoute();
    try {
      const res = await axios.post("/api/reset");
      setDestinations(res.data.list);
      // Select first item as default choice after resets
      if (res.data.list.length > 0) {
        setSelectedDestName(res.data.list[0].name);
      }
      setError("");
    } catch (err: any) {
      console.error("Failed to reset system configuration:", err);
      setError("Reset command rejected by server controller.");
    } finally {
      setIsResetting(false);
    }
  };

  const activeDest = destinations.find(d => d.name === selectedDestName);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Dynamic Cleared Route Status Toast Banner */}
      {showClearAlert && (
        <div className="bg-green-50 border-2 border-green-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-bounce relative z-50">
          <div className="p-2 bg-green-100 border border-green-200 rounded-xl text-green-700 shadow-xs">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-800 font-mono tracking-tight uppercase">
              Update: {clearedDestinationName} is now clear!
            </h4>
            <p className="text-xs text-slate-650 mt-1 leading-relaxed">
              Live crowd levels have dropped to safe levels (&le; 75%). The passenger routing system has successfully routed travelers back to the primary historical zone.
            </p>
          </div>
          <button 
            onClick={() => setShowClearAlert(false)}
            className="text-2xs font-mono font-bold text-slate-500 hover:text-green-800 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer shadow-2xs"
          >
            DISMISS
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Controls & Destination Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-green-700 uppercase mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-green-600" />
              1. CHOOSE MONUMENT SITE
            </h3>
            
            <div className="space-y-3">
              {destinations.map((d) => (
                <button
                  key={d.name}
                  disabled={isRouting}
                  onClick={() => {
                     setSelectedDestName(d.name);
                     setShowClearAlert(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    selectedDestName === d.name
                      ? "border-green-400 bg-green-50/50 shadow-[0_4px_12px_rgba(22,163,74,0.06)] text-slate-900 font-bold"
                      : "border-slate-100 bg-slate-50/20 text-slate-600 hover:border-green-200 hover:bg-green-50/20 hover:text-green-700"
                  } ${isRouting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm ${selectedDestName === d.name ? "text-green-900 font-bold" : "text-slate-700 font-semibold"}`}>{d.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{d.category}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                      d.isCrowded 
                        ? "bg-rose-50 text-rose-700 border border-rose-200" 
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {d.crowdLevel}% density
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {activeDest && (
              <div className="mt-4 p-4 bg-green-50/30 rounded-2xl border border-dashed border-green-200 text-xs text-slate-600">
                <span className="font-bold text-green-900 block mb-1">♻ Sustainable Alternate:</span>
                <span className="text-slate-600 leading-relaxed text-2xs block">
                  {activeDest.name} overrides to <strong className="text-green-700 font-bold">{activeDest.alternativeDestination}</strong> if crowds breach 75%.
                </span>
                <span className="text-2xs text-slate-500 mt-1 block italic">"{activeDest.alternativeDesc}"</span>
              </div>
            )}
          </div>

          {/* Core Route Control Panel */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-green-700 uppercase mb-4 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-green-600" />
              2. NAVIGATION EMITTER
            </h3>

            <div className="space-y-4">
              {!isRouting ? (
                <button
                  onClick={handleStartRoute}
                  className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer text-sm font-mono tracking-wider"
                >
                  <Play className="w-4 h-4 fill-white animate-pulse" />
                  INITIALIZE ROUTE
                </button>
              ) : (
                <button
                  onClick={handleStopRoute}
                  className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer text-sm font-mono tracking-wider"
                >
                  <Square className="w-4 h-4 fill-white" />
                  HALT PASSENGER STREAM
                </button>
              )}

              <button
                onClick={handleResetSystem}
                disabled={isResetting}
                className="w-full py-2.5 px-6 border border-slate-205 hover:border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-mono font-bold rounded-2xl flex items-center justify-center gap-1.5 transition duration-155 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
                RESTORE FACTORY SETTINGS
              </button>
            </div>
          </div>

          {/* Traffic Congestion Detector */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-green-700 uppercase mb-4 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-green-600" />
              3. GOOGLE MAPS TRAFFIC PROXY
            </h3>

            <div className="space-y-4">
              <p className="text-2xs text-slate-500 leading-relaxed">
                Check active traffic congestion on the DRIVE route from <strong>Dambulla</strong> to <strong>Sigiriya Rock Fortress</strong> using the modern Google Maps Routes API (v2).
              </p>

              <button
                onClick={checkRouteTraffic}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-mono text-2xs font-bold rounded-2xl shadow-xs transition duration-150 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Compass className="w-3.5 h-3.5" />
                QUERY TRAFFIC METRICS
              </button>

              {alertMessage && (
                <div className={`p-4 rounded-2xl border text-2xs leading-relaxed space-y-2 ${
                  currentDestination !== "Sigiriya Rock Fortress" 
                    ? "bg-amber-50 border-amber-200 text-amber-800" 
                    : "bg-green-50 border-green-200 text-green-850"
                }`}>
                  <div className="flex justify-between items-center font-bold font-mono">
                    <span>ACTIVE TARGET:</span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 uppercase">
                      {currentDestination}
                    </span>
                  </div>
                  <div>
                    {alertMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column Visual Map & Navigation Diagnostics */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active SVG dynamic schematic map component */}
          <RouteMap
            primaryName={selectedDestName}
            alternativeName={activeDest?.alternativeDestination || "Alternative"}
            isCrowded={routeStatus?.isCrowded || false}
            crowdLevel={routeStatus?.crowdLevel || activeDest?.crowdLevel || 0}
            isRouting={isRouting}
          />

          {/* Real-time Diagnostics HUD */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600 animate-pulse" />
                ROUTER CONTROL & STATUS
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSimulatorMode("random")}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition cursor-pointer ${
                    simulatorMode === "random" 
                      ? "bg-green-600 text-white" 
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  RANDOM LIVE FLUCTUATIONS
                </button>
                <button
                  onClick={() => setSimulatorMode("manual")}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition cursor-pointer ${
                    simulatorMode === "manual" 
                      ? "bg-green-600 text-white" 
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  MANUAL STRESS CONTROLS
                </button>
              </div>
            </div>

            {isRouting && routeStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-full px-6 bg-slate-50 border border-slate-150 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">Original Intent</span>
                      <span className="text-xs font-bold text-slate-705">{routeStatus.primaryDestination}</span>
                    </div>
                    <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-600">PRIMARY</span>
                  </div>
                  
                  <div className="p-4 rounded-full px-6 bg-green-50/50 border border-green-200/50 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-green-700 block uppercase tracking-wider">Assigned Path</span>
                      <span className="text-xs font-bold text-green-800">{routeStatus.currentDestinationName}</span>
                    </div>
                    {routeStatus.isRedirected ? (
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                        BYPASSED
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-850 border border-green-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                        DIRECT
                      </span>
                    )}
                  </div>
                </div>

                {routeStatus.isCrowded ? (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-4">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-800 font-mono">CONGESTION DETECTED: BYPASS ROUTING ENABLED</p>
                      <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                        Physical congestion factor is at <strong className="font-bold text-rose-700">{routeStatus.crowdLevel}%</strong> (exceeds 75% system cap). 
                        To prevent physical degradation of monument soil and extreme visitor queue friction, travelers on this branch have been seamlessly auto-diverted to <span className="font-bold underline text-green-705">{routeStatus.alternativeDestination}</span>. We continue to monitor the primary location in the background.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-green-800 font-mono">DENSITY OPTIMAL - NORMAL ROUTING ACTIVE</p>
                      <p className="text-2xs text-slate-650 mt-1 leading-relaxed">
                        Active visitor count is currently optimal (<strong className="font-bold text-slate-800">{routeStatus.crowdLevel}%</strong>). No safety limits violated. It is fully safe for tourists to continue into the main historic courtyard.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Live Status Log console visualizer */}
                <div className="mt-4 bg-[#f2f8f2] border border-green-100 rounded-xl p-4 font-mono text-[10px] space-y-1.5 min-h-[75px] shadow-inner">
                  <div className="flex gap-4">
                    <span className="text-slate-500">[{new Date(routeStatus.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-green-700 font-bold italic shrink-0">ROUTER:</span>
                    <span className="text-slate-600">Crowd density verified for: "{routeStatus.primaryDestination}"</span>
                  </div>
                  {routeStatus.isCrowded ? (
                    <div className="flex gap-4">
                      <span className="text-slate-500">[{new Date(routeStatus.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-rose-600 font-bold italic shrink-0">BYPASS_ON:</span>
                      <span className="text-slate-600">Density level ({routeStatus.crowdLevel}%) exceeds critical 75% limit. Automatic diversion active.</span>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <span className="text-slate-500">[{new Date(routeStatus.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-green-800 font-bold italic shrink-0">NORMAL_FLOW:</span>
                      <span className="text-slate-600 flex-1">Density level ({routeStatus.crowdLevel}%) clear. Primary entrance stream active.</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                  <span>AUTOMATIC ROUTING ACTIVE</span>
                  <span>SYNC TIME: {new Date(routeStatus.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <Info className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400">No Active Passenger Stream</p>
                <p className="text-2xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                  Choose a destination and press "INITIALIZE ROUTE" above to fire up the dynamic telemetry engine and start real-time monitors.
                </p>
              </div>
            )}
          </div>

          {/* Slider Controllers (shown when manual mode or always as system testing cockpit) */}
          <div className="bg-[#fcfdfc] border border-green-100/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-green-600" />
              <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                OVERTOURISM STRESS TESTING COCKPIT
              </h3>
            </div>
            
            <p className="text-2xs text-slate-600 mb-4 bg-white p-3 rounded-xl border border-dashed border-green-100 leading-relaxed">
              💡 <strong>How to test extreme parameters:</strong> Slip the slides below to increase or decrease the crowd levels. If you raise any primary bar past <strong>75%</strong>, you will watch the active telemetry automatically activate the <strong>Emergency Bypass</strong>. Bringing it back down immediately alerts you that the zone has cleared!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinations.map((d) => (
                <div key={d.name} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-green-305 transition">
                  <span className="font-bold text-slate-800 text-xs text-ellipsis overflow-hidden block">{d.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono block">Control Station</span>
                  
                  <div className="mt-4 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500">Density:</span>
                    <span className={`font-mono font-bold ${
                      d.crowdLevel > 75 ? "text-rose-600" : "text-green-600"
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
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-600 py-2 mt-1"
                  />
                  
                  <span className="text-[10px] text-slate-550 mt-1 block font-mono text-center uppercase tracking-wider">
                    {d.crowdLevel > 75 ? "🔴 SURGE" : "🟢 OPTIMAL"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
