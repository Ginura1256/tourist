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
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Heart,
  Trees,
  Coins,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Destination, RouteStatus } from "../types";
import RouteMap from "./RouteMap";
import { useDeviceDetect } from "../hooks/useDeviceDetect";

import sigiriyaImg from "@/assets/Sigiriya-Main.jpg";
import templeImg from "@/assets/tample of tooth.jpg";
import galleImg from "@/assets/galle dutch.jpg";
import pidurangalaImg from "@/assets/pidurangala.jpg";
import museumImg from "@/assets/museum.jpg";
import peaceTempleImg from "@/assets/Japanese Peace.jpg";

const getDestinationImage = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("sigiriya")) return sigiriyaImg;
  if (n.includes("tooth") || n.includes("temple")) return templeImg;
  if (n.includes("galle") || n.includes("fort")) return galleImg;
  if (n.includes("pidurangala")) return pidurangalaImg;
  if (n.includes("museum")) return museumImg;
  if (n.includes("japanese") || n.includes("peace") || n.includes("pagoda")) return peaceTempleImg;
  return sigiriyaImg; // fallback
};


export default function RouterDashboard() {
  const { isMobile } = useDeviceDetect();
  const [mobileTab, setMobileTab] = useState<"dashboard" | "map">("map");
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
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  // Live ticking statistics
  const [impactStats, setImpactStats] = useState({
    redirected: 1240,
    co2Saved: 184.2,
    stressReduction: 84.5,
    localRevenue: 14230
  });

  // Hero carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [
    {
      url: sigiriyaImg,
      title: "Sigiriya Rock Fortress",
      tagline: "The Ancient Citadel in the Clouds"
    },
    {
      url: templeImg,
      title: "Temple of the Tooth",
      tagline: "Sacred Guardian of Buddhist Heritage"
    },
    {
      url: galleImg,
      title: "Galle Dutch Fort",
      tagline: "Living Colonial Maritime History"
    },
    {
      url: pidurangalaImg,
      title: "Pidurangala viewpoint",
      tagline: "Untouched panoramic serenity"
    }
  ];

  // Active polling timer reference
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  // Keep previous crowding state in ref to detect transition from crowded to clear
  const prevCrowdedStatusRef = useRef<boolean | null>(null);

  // Fetch all destinations on mount
  useEffect(() => {
    fetchDestinations();
    return () => stopPolling();
  }, []);

  // Carousel transition timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Live impact stats ticking effect
  useEffect(() => {
    let statInterval: NodeJS.Timeout;
    if (isRouting) {
      statInterval = setInterval(() => {
        // Ticks stats up incrementally when routing is active
        setImpactStats((prev) => {
          const isRedirected = routeStatus?.isRedirected;
          return {
            redirected: prev.redirected + (isRedirected ? 1 : 0),
            co2Saved: +(prev.co2Saved + (isRedirected ? 0.15 : 0.02)).toFixed(2),
            stressReduction: +(prev.stressReduction + 0.01).toFixed(2),
            localRevenue: prev.localRevenue + (isRedirected ? 15 : 2)
          };
        });
      }, 4000);
    }
    return () => clearInterval(statInterval);
  }, [isRouting, routeStatus]);

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
    performCrowdCheck();
    
    // Set up polling interval every 3 minutes (180000ms)
    pollingRef.current = setInterval(() => {
      performCrowdCheck();
    }, 180000);
  };

  const performCrowdCheck = async (targetName: string = selectedDestName) => {
    if (!targetName) return;
    setIsLoading(true);
    try {
      let res;
      if (simulatorMode === "random") {
        res = await axios.get<RouteStatus>(`/api/check-crowd/${encodeURIComponent(targetName)}`);
      } else {
        const currentTarget = destinations.find(d => d.name === targetName);
        const level = currentTarget ? currentTarget.crowdLevel : 40;
        res = await axios.post<RouteStatus>("/api/set-crowd", {
          name: targetName,
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

      if (wasCrowded === true && isCurrentlyCrowded === false) {
        setClearedDestinationName(status.primaryDestination);
        setShowClearAlert(true);
      }

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
    prevCrowdedStatusRef.current = null; 
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
    setDestinations(prev => prev.map(d => d.name === name ? { ...d, crowdLevel: value, isCrowded: value > 75 } : d));
    
    try {
      const res = await axios.post<RouteStatus>("/api/set-crowd", {
        name,
        crowdLevel: value
      });
      
      if (isRouting && selectedDestName === name) {
        const isCurrentlyCrowded = res.data.isCrowded;
        const wasCrowded = prevCrowdedStatusRef.current;
        
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

  const handleResetSystem = async () => {
    setIsResetting(true);
    handleStopRoute();
    try {
      const res = await axios.post("/api/reset");
      setDestinations(res.data.list);
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

  // Helper functions for Destination UI metrics
  const getRating = (name: string) => {
    if (name.includes("Sigiriya")) return { score: "4.9", count: "4,210 reviews" };
    if (name.includes("Tooth")) return { score: "4.8", count: "3,150 reviews" };
    return { score: "4.7", count: "2,840 reviews" };
  };

  const getEcoScore = (name: string) => {
    if (name.includes("Sigiriya")) return "8.4";
    if (name.includes("Tooth")) return "8.6";
    return "8.1";
  };

  const calculateWaitTime = (crowdLevel: number) => {
    if (crowdLevel < 30) return `${Math.max(5, Math.round(crowdLevel * 0.4))} mins`;
    if (crowdLevel <= 75) return `${Math.round(crowdLevel * 1.2)} mins`;
    return `${Math.round(crowdLevel * 1.8)} mins`;
  };

  const getCrowdBadge = (crowdLevel: number) => {
    if (crowdLevel <= 40) return { label: "Low", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (crowdLevel <= 75) return { label: "Moderate", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "High Capacity", color: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  // Get customized recommendation details based on selected destination
  const getAIRecommendation = () => {
    const crowd = activeDest?.crowdLevel || 0;
    const isOver = crowd > 75;
    
    if (selectedDestName.includes("Sigiriya")) {
      return {
        text: isOver 
          ? "Sigiriya Rock is currently highly congested. Diverting to Pidurangala Rock immediately is advised to experience the same historic view with zero stair congestion." 
          : "Sigiriya is currently open with optimal foot traffic. However, congestion usually builds up around 11:00 AM. Consider starting your route now or standby.",
        reason: "Peak tour buses arrive at Sigiriya Lion Gate between 10 AM and 1 PM.",
        sustainability: "+18% soil erosion prevention index on historical stairs",
        timeSaved: isOver ? "2.5 hours saved in stair queues" : "30 mins saved",
        traffic: "Avoids 12% Tuk-Tuk idling emissions in the buffer zone"
      };
    } else if (selectedDestName.includes("Tooth")) {
      return {
        text: isOver
          ? "The temple main courtyard is highly congested due to local puja ritual traffic. The International Buddhist Museum next door is serene and cool."
          : "Puja queue flows are steady. We advise visiting the tranquil inner palace compound and Buddhist Museum in the next hour to avoid crowd peaks.",
        reason: "Afternoon prayers in the central relic chamber are creating minor queues.",
        sustainability: "+14% visitor mass distribution across museum grounds",
        timeSaved: isOver ? "1 hour saved in main chamber gate" : "15 mins saved",
        traffic: "Saves 8% local pedestrian lane blockages"
      };
    } else {
      return {
        text: isOver
          ? "Galle Dutch Fort ramparts are heavily congested. Redirecting to Japanese Peace Temple Pagoda ensures a peaceful spiritual panorama with sea breeze."
          : "Galle Fort walkways are optimal. Sunset usually brings boutique visitor surges. Consider routing early to capture colonial history at ease.",
        reason: "Boutique shopping and ocean rampart paths are bottlenecked at sunset.",
        sustainability: "Diverts foot pressure, protecting critical seaside rampart integrity",
        timeSaved: isOver ? "1.5 hours saved in fort parking congestion" : "20 mins saved",
        traffic: "Eases 15% city center traffic choke points"
      };
    }
  };

  const aiRec = getAIRecommendation();

  // Scroll helpers
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-[32px] overflow-hidden shadow-xl border border-slate-100 bg-dark-slate text-white">
        {/* Scenic Background image with glassmorphism overlay */}
        <div className="absolute inset-0">
          <img 
            src={carouselImages[carouselIndex].url} 
            alt={carouselImages[carouselIndex].title} 
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out scale-105 opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-slate via-dark-slate/85 to-transparent" />
        </div>

        {/* Carousel controls */}
        <div className="absolute right-6 bottom-6 flex gap-2 z-20">
          <button 
            onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselImages.length)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-14 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
              <Trees className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Preserving Sri Lanka's Heritage
            </span>
            <h1 className="text-4xl lg:text-6xl font-display font-black tracking-tight leading-tight">
              EcoDiverter
            </h1>
            <p className="text-lg lg:text-xl text-emerald-100/90 font-semibold font-display">
              Smart Sustainable Tourism Routing for Sri Lanka
            </p>
            <p className="text-sm lg:text-base text-slate-300 leading-relaxed">
              Protect ancient heritage sites while discovering beautiful, less congested alternative destinations. Guided by real-time crowd dynamics, we route you sustainably.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => scrollToSection("destinations-section")}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/20 transition-all duration-200 cursor-pointer text-sm flex items-center gap-2"
              >
                Explore Destinations
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollToSection("crowd-section")}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold rounded-2xl transition-all duration-200 cursor-pointer text-sm flex items-center gap-2"
              >
                View Live Crowds
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SYSTEM ALERT TOAST */}
      {showClearAlert && (
        <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-3xl flex items-start gap-4 shadow-md animate-float relative z-35 max-w-4xl mx-auto">
          <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-sm">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-base font-display font-bold text-forest-green tracking-tight">
              Update: {clearedDestinationName} Congestion Cleared!
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Live telemetry confirms crowd levels have dropped to safe limits (&le; 75%). The passenger routing system has successfully returned travelers to the primary historical zone.
            </p>
          </div>
          <button 
            onClick={() => setShowClearAlert(false)}
            className="text-xs font-mono font-bold text-slate-500 hover:text-forest-green bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer shadow-sm transition"
          >
            DISMISS
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-5 rounded-3xl flex items-center gap-3 text-sm max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 animate-bounce" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. APP INTERACTION BLOCK */}
      {isMobile && (
        <div className="flex bg-slate-105 p-1 rounded-2xl border border-slate-200 text-xs font-mono font-bold w-full max-w-md mx-auto sticky top-[80px] z-30 shadow-sm backdrop-blur-md bg-white/95 mb-4">
          <button
            onClick={() => setMobileTab("dashboard")}
            className={`flex-1 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              mobileTab === "dashboard" 
                ? "bg-[#0A3D2B] text-white shadow-sm font-black" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            🏛️ LANDMARKS
          </button>
          <button
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              mobileTab === "map" 
                ? "bg-[#0A3D2B] text-white shadow-sm font-black" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            🗺️ LIVE GPS MAP
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DESTINATION CARDS & AI ENGINE */}
        {(!isMobile || mobileTab === "dashboard") && (
          <div className="lg:col-span-8 space-y-10 w-full">
          
          {/* A. EXPLORE DESTINATIONS SECTION */}
          <div id="destinations-section" className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-mono font-bold text-forest-green tracking-wider uppercase">Choose Your Journey</span>
                <h2 className="text-2xl font-display font-extrabold text-dark-slate mt-1">Heritage Landmarks</h2>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-105 px-3 py-1 rounded-xl">
                Active Sites: {destinations.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinations.map((d) => {
                const ratingInfo = getRating(d.name);
                const score = getEcoScore(d.name);
                const wait = calculateWaitTime(d.crowdLevel);
                const badge = getCrowdBadge(d.crowdLevel);
                const isSelected = selectedDestName === d.name;

                return (
                  <div 
                    key={d.name} 
                    onClick={() => {
                      setSelectedDestName(d.name);
                      setShowClearAlert(false);
                      performCrowdCheck(d.name);
                      setShowAIModal(true);
                    }}
                    className={`bg-white rounded-[28px] overflow-hidden border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? "border-emerald-500 ring-2 ring-emerald-500/25 shadow-lg scale-[1.01]" 
                        : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350"
                    }`}
                  >
                    {/* Destination Image */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={getDestinationImage(d.name)} 
                        alt={d.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                      />
                      
                      {/* Category Badge overlay */}
                      <span className="absolute top-4 left-4 bg-dark-slate/80 text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-full backdrop-blur-md tracking-wider uppercase">
                        {d.category}
                      </span>

                      {/* Crowd Status Badge overlay */}
                      <span className={`absolute top-4 right-4 text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${badge.color}`}>
                        {badge.label}: {d.crowdLevel}%
                      </span>
                    </div>

                    {/* Card details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="text-amber-500">★</span> {ratingInfo.score} <span className="text-slate-400">({ratingInfo.count})</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            🍃 Eco Score: {score}
                          </span>
                        </div>
                        <h3 className="text-lg font-display font-bold text-dark-slate">{d.name}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{d.description}</p>
                      </div>

                      {/* Metrical Footer */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">EST. WAIT TIME</span>
                            <span className="text-xs font-bold text-slate-700">{wait}</span>
                          </div>
                        </div>

                        <button
                          disabled={isRouting}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDestName(d.name);
                            setShowClearAlert(false);
                            performCrowdCheck(d.name);
                            setShowAIModal(true);
                          }}
                          className={`px-4 py-2.5 rounded-xl font-mono font-bold text-xs transition cursor-pointer ${
                            isSelected 
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                              : isRouting
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {isSelected ? "EXPLORE ADVISOR" : "CONFIGURE ROUTE"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          </div>
        )}

        {/* RIGHT COLUMN: CONTROLS, TELEMETRY MAP, LIVE CROWD DIALS */}
        {(!isMobile || mobileTab === "map") && (
          <div className="lg:col-span-4 space-y-10 w-full">
          


          {/* B. INTERACTIVE MAP TARGET COMPONENT */}
          <RouteMap
            primaryName={selectedDestName}
            alternativeName={activeDest?.alternativeDestination || "Alternative"}
            isCrowded={routeStatus?.isCrowded || false}
            crowdLevel={routeStatus?.crowdLevel || activeDest?.crowdLevel || 0}
            isRouting={isRouting}
            onNodeClick={() => setShowAIModal(true)}
          />

          {/* C. LIVE CROWD INTELLIGENCE */}
          <div id="crowd-section" className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-md space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-display font-extrabold text-dark-slate">Crowd Intelligence</h3>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest font-bold">Real-time Density Factors</span>
                </div>
              </div>
            </div>

            {/* Circular Progress & Info */}
            <div className="flex items-center justify-around py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    stroke={
                      (activeDest?.crowdLevel || 0) > 75 
                        ? "#ef4444" 
                        : (activeDest?.crowdLevel || 0) > 40 
                        ? "#f59e0b" 
                        : "#10b981"
                    } 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - (activeDest?.crowdLevel || 0) / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center space-y-0.5">
                  <span className="text-2xl font-black font-mono tracking-tight text-slate-800">
                    {activeDest?.crowdLevel || 0}%
                  </span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Density</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-450 block font-mono text-[9px] uppercase tracking-wider">CURRENT STATE</span>
                  <span className={`font-bold text-sm ${
                    (activeDest?.crowdLevel || 0) > 75 
                      ? "text-rose-600" 
                      : (activeDest?.crowdLevel || 0) > 40 
                      ? "text-amber-600" 
                      : "text-emerald-600"
                  }`}>
                    {(activeDest?.crowdLevel || 0) > 75 ? "🔴 Heavy Surge" : (activeDest?.crowdLevel || 0) > 40 ? "🟡 Moderate Flow" : "🟢 Clear / Optimal"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-450 block font-mono text-[9px] uppercase tracking-wider">EST. WAIT DELAY</span>
                  <span className="font-bold text-slate-700 text-sm">
                    {calculateWaitTime(activeDest?.crowdLevel || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Trend graph using beautiful SVG bar chart */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                Daily Crowd Trend (2-Hour Intervals)
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 h-40 flex flex-col justify-between">
                {/* SVG Column Chart */}
                <div className="relative flex-1">
                  <svg className="w-full h-full" viewBox="0 0 240 80" preserveAspectRatio="none">
                    {/* Horizontal Gridlines */}
                    <line x1="0" y1="20" x2="240" y2="20" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="0" y1="40" x2="240" y2="40" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="0" y1="60" x2="240" y2="60" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
                    
                    {/* Y-Axis Grid labels on right */}
                    <text x="238" y="24" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="end">75%</text>
                    <text x="238" y="44" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="end">50%</text>
                    <text x="238" y="64" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="end">25%</text>

                    {(() => {
                      const crowdLevel = activeDest?.crowdLevel || 0;
                      // Simulated factors for 8am, 10am, 12pm, 2pm, 4pm, 6pm
                      const factors = [0.4, 0.75, 1.0, 0.85, 0.6, 0.3];
                      
                      return factors.map((factor, idx) => {
                        const level = Math.min(100, Math.round(crowdLevel * factor));
                        // Max height of the bar is 60px (from y=20 to y=80)
                        const barHeight = Math.max(2, (level / 100) * 55);
                        const y = 75 - barHeight;
                        const x = 20 + idx * 40;
                        
                        // Select color based on bar density
                        const barColor = level > 75 
                          ? "#ef4444" 
                          : level > 40 
                          ? "#f59e0b" 
                          : "#10b981";
                          
                        return (
                          <g key={idx}>
                            {/* Bar background path for styling */}
                            <rect
                              x={x - 6}
                              y="15"
                              width="12"
                              height="60"
                              rx="2.5"
                              fill="#f1f5f9"
                            />
                            
                            {/* Filled Bar */}
                            <rect
                              x={x - 6}
                              y={y}
                              width="12"
                              height={barHeight}
                              rx="2.5"
                              fill={barColor}
                              opacity="0.85"
                              className="transition-all duration-500"
                            />
                            
                            {/* Percentage Label */}
                            <text
                              x={x}
                              y={Math.max(12, y - 3)}
                              fill={barColor}
                              fontSize="6"
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {level}%
                            </text>
                          </g>
                        );
                      });
                    })()}
                  </svg>
                </div>
                
                {/* Timeline axis labels */}
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-450 font-bold uppercase mt-2 px-1">
                  <span>08:00 AM</span>
                  <span>10:00 AM</span>
                  <span>12:00 PM</span>
                  <span>02:00 PM</span>
                  <span>04:00 PM</span>
                  <span>06:00 PM</span>
                </div>
              </div>
            </div>

            {/* Heatmap sector breakdown */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                Monument sector densities
              </span>
              <div className="grid grid-cols-2 gap-2 text-2xs font-mono font-bold">
                <div className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-slate-500">Access Steps</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    (activeDest?.crowdLevel || 0) > 75 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {Math.min(100, Math.round((activeDest?.crowdLevel || 0) * 1.15))}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-slate-500">Outer Buffer</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {Math.round((activeDest?.crowdLevel || 0) * 0.7)}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-slate-500">Main Gateway</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    (activeDest?.crowdLevel || 0) > 75 ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {Math.min(100, Math.round((activeDest?.crowdLevel || 0) * 1.25))}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-slate-500">Summit Area</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {Math.round((activeDest?.crowdLevel || 0) * 0.5)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* 4. SIDE-BY-SIDE SUSTAINABLE COMPARISON SECTION */}
      {(!isMobile || mobileTab === "dashboard") && activeDest && (
        <section className="bg-white border border-slate-200/80 rounded-[32px] p-6 lg:p-8 shadow-md space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-forest-green tracking-wider uppercase">Sustainable comparison</span>
            <h3 className="text-xl lg:text-2xl font-display font-extrabold text-dark-slate mt-1">
              Primary Monument vs. Eco-Alternate
            </h3>
            <p className="text-slate-550 text-xs lg:text-sm mt-1">
              Explore how choosing alternative paths reduces crowds, preserves cultural sites, and supports local homestay businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Primary Site Details */}
            <div className="bg-slate-50 border border-slate-150 p-6 rounded-3xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono text-slate-405 block uppercase font-bold tracking-widest mb-1">SELECTED PRIMARY TARGET</span>
                <h4 className="text-lg font-display font-bold text-dark-slate">{activeDest.name}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{activeDest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">CROWD STATUS</span>
                  <span className={`text-base font-extrabold block mt-0.5 ${
                    activeDest.crowdLevel > 75 ? "text-rose-600" : "text-amber-600"
                  }`}>
                    {activeDest.crowdLevel}% Capacity
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">ESTIMATED WAIT</span>
                  <span className="text-base font-extrabold block text-slate-700 mt-0.5">
                    {calculateWaitTime(activeDest.crowdLevel)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-2xl border border-dashed border-rose-200/80 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Severe crowding causes path erosion, delays visitor movement, and spikes local vehicle emissions.
                </p>
              </div>
            </div>

            {/* Alternate Site Details */}
            <div className="bg-emerald-50/30 border border-emerald-100 p-6 rounded-3xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 block uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5" /> RECOMMENDED GREEN ALTERNATE
                </span>
                <h4 className="text-lg font-display font-bold text-forest-green">{activeDest.alternativeDestination}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{activeDest.alternativeDesc}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-2xl border border-emerald-100/30">
                  <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">CROWD STATUS</span>
                  <span className="text-base font-extrabold block text-emerald-600 mt-0.5">
                    {Math.max(5, Math.round(activeDest.crowdLevel * 0.25))}% Capacity
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-emerald-100/30">
                  <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">ESTIMATED WAIT</span>
                  <span className="text-base font-extrabold block text-emerald-600 mt-0.5">
                    5 mins max
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-dashed border-emerald-200/80 text-xs text-emerald-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <span className="font-bold">Key Benefits:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Bypasses ticket queue bottlenecks completely</li>
                    <li>Protects historic soil and structural monument brickwork</li>
                    <li>Distributes entry revenue directly to rural community homestays</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. DIAGNOSTIC CONTROL & HUD PANEL */}
      {(!isMobile || mobileTab === "map") && (
        <section className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest-green animate-pulse" />
            <h3 className="text-base font-display font-extrabold text-slate-800">
              Live Router Control & Debug Status
            </h3>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 text-xs font-mono font-semibold">
            <button
              onClick={() => setSimulatorMode("random")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                simulatorMode === "random" 
                  ? "bg-white text-forest-green shadow-sm font-bold" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              RANDOM FLUCTUATIONS
            </button>
            <button
              onClick={() => setSimulatorMode("manual")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                simulatorMode === "manual" 
                  ? "bg-white text-forest-green shadow-sm font-bold" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              MANUAL CONTROLS
            </button>
          </div>
        </div>

        {isRouting && routeStatus ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">ORIGINAL TARGETED SITE</span>
                  <span className="text-sm font-bold text-slate-800">{routeStatus.primaryDestination}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-650 font-bold uppercase">PRIMARY</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-emerald-700 block uppercase font-bold">SYSTEM ASSIGNED PATHWAY</span>
                  <span className="text-sm font-bold text-emerald-900">{routeStatus.currentDestinationName}</span>
                </div>
                {routeStatus.isRedirected ? (
                  <span className="bg-amber-100 text-amber-800 border border-amber-250 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                    BYPASS DIVERTER ACTIVE
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-850 border border-emerald-250 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                    DIRECT FLOW ACTIVE
                  </span>
                )}
              </div>
            </div>

            {routeStatus.isCrowded ? (
              <div className="bg-rose-50 border border-rose-150 p-4 rounded-2xl flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-rose-800 font-mono uppercase">CONGESTION DETECTED: AUTO DIVERSION RUNNING</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Physical congestion factor is at <strong className="font-bold text-rose-700">{routeStatus.crowdLevel}%</strong> (exceeds 75% system cap). 
                    To protect ancient site stairs from stress damage and reduce delay times, travelers have been seamlessly auto-diverted to <span className="font-bold underline text-emerald-700">{routeStatus.alternativeDestination}</span>. Live monitors continue to trace the primary sector.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl flex items-start gap-3.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-800 font-mono uppercase">CAPACITY OPTIMAL - DIRECT STREAM ACTIVE</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Active visitor count is currently optimal (<strong className="font-bold text-slate-800">{routeStatus.crowdLevel}%</strong>). No safety limits violated. It is fully safe for tourists to continue into the primary monument space.
                  </p>
                </div>
              </div>
            )}

            {/* Console Log Log HUD */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 font-mono text-[11px] text-slate-300 space-y-1.5 min-h-[75px] shadow-inner">
              <div className="flex gap-4">
                <span className="text-slate-550">[{new Date(routeStatus.timestamp).toLocaleTimeString()}]</span>
                <span className="text-emerald-400 font-bold shrink-0">ROUTER_AGENT:</span>
                <span className="text-slate-400">Crowd density verified for: "{routeStatus.primaryDestination}"</span>
              </div>
              {routeStatus.isCrowded ? (
                <div className="flex gap-4">
                  <span className="text-slate-550">[{new Date(routeStatus.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-rose-450 font-bold shrink-0">AUTO_DIVERTER:</span>
                  <span className="text-slate-350">Density ({routeStatus.crowdLevel}%) exceeds 75%. Redirected to "{routeStatus.alternativeDestination}".</span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <span className="text-slate-550">[{new Date(routeStatus.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-emerald-300 font-bold shrink-0">FLOW_NORMAL:</span>
                  <span className="text-slate-350">Density level ({routeStatus.crowdLevel}%) clear. Primary entrance stream active.</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              <span>SYNC LATENCY: 12ms</span>
              <span>LAST POLLED: {new Date(routeStatus.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Info className="w-7 h-7 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-550">Standby: Passenger stream is inactive</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              Press "INITIALIZE DIVERTER" above to spin up the real-time simulation, query API endpoints, and monitor overtourism routing.
            </p>
          </div>
        )}
      </section>
      )}
      
      {/* Premium Fullscreen Overlay Modal for Heritage Site details & AI Features */}
      {showAIModal && activeDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
            
            {/* Left Column: Location Visual Card */}
            <div className="md:w-5/12 bg-slate-900 text-white relative flex flex-col justify-between p-6 overflow-hidden min-h-[300px] md:min-h-auto">
              <div className="absolute inset-0">
                <img 
                  src={getDestinationImage(activeDest.name)} 
                  alt={activeDest.name} 
                  className="w-full h-full object-cover opacity-65" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-emerald-600 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {activeDest.category}
                </span>
                
                <span className="bg-white/95 text-slate-800 text-sm font-mono font-bold px-2.5 py-1 rounded-full">
                  🍃 Eco: {getEcoScore(activeDest.name)}
                </span>
              </div>
              
              <div className="relative z-10 space-y-3 mt-auto">
                <div className="flex items-center gap-1.5 text-sm text-emerald-350 font-bold uppercase tracking-wider">
                  <MapPin className="w-4.5 h-4.5 text-emerald-400" />
                  Primary Destination
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-black leading-tight">
                  {activeDest.name}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed line-clamp-4">
                  {activeDest.description}
                </p>
                
                {/* Live indicators */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[11px] font-mono text-slate-300 block uppercase">LIVE CROWD</span>
                    <span className="text-lg font-black font-mono mt-0.5 block text-emerald-400">{activeDest.crowdLevel}%</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[11px] font-mono text-slate-300 block uppercase">EST. WAIT</span>
                    <span className="text-base font-bold mt-0.5 block">{calculateWaitTime(activeDest.crowdLevel)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Assistant & Cockpit Controls */}
            <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowAIModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 rounded-full transition cursor-pointer z-35"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold text-dark-slate">AI Sustainable Travel Assistant</h4>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold leading-none mt-0.5">Autonomous Agent & Route Controller</span>
                  </div>
                </div>

                {/* AI Advice statement */}
                <div className="bg-emerald-50/70 border border-emerald-150 p-4 rounded-2xl space-y-2 shadow-sm">
                  <p className="text-sm text-forest-green font-semibold italic leading-relaxed">
                    "{aiRec.text}"
                  </p>
                </div>

                {/* AI Metrical Breakdown grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">REASON FOR REDIRECT</span>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium leading-normal">{aiRec.reason}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">EST. TIME SAVED</span>
                    <p className="text-xs text-emerald-700 mt-0.5 font-extrabold leading-normal">{aiRec.timeSaved}</p>
                  </div>
                </div>

                {/* 1. ROUTING DISPATCHER */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-widest">
                      1. ROUTING DISPATCHER
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isRouting 
                        ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse" 
                        : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}>
                      {isRouting ? "ACTIVE REROUTE" : "STANDBY"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!isRouting ? (
                      <button
                        onClick={handleStartRoute}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Initialize Diverter
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRoute}
                        className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        Halt Diverter
                      </button>
                    )}

                    <button
                      onClick={checkRouteTraffic}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Check Traffic
                    </button>
                  </div>

                  {alertMessage && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl leading-relaxed">
                      {alertMessage}
                    </div>
                  )}
                </div>

                {/* Side by side comparison snippet */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                  <span className="text-[11px] font-mono text-slate-400 block font-bold uppercase tracking-widest">
                    2. ALTERNATIVE COMPARISON PATHS
                  </span>
                  
                  <div className="flex items-center justify-between gap-4 text-xs font-mono">
                    <div className="flex-1 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                      <span className="text-slate-650 font-bold block truncate">{activeDest.name.split(" ")[0]}</span>
                      <span className="text-rose-600 font-black block mt-0.5">{activeDest.crowdLevel}% crowd</span>
                    </div>
                    <div className="text-slate-400 font-black text-xs">VS</div>
                    <div className="flex-1 text-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                      <span className="text-forest-green font-bold block truncate">{activeDest.alternativeDestination.split(" ")[0]}</span>
                      <span className="text-emerald-600 font-black block mt-0.5">
                        {Math.max(5, Math.round(activeDest.crowdLevel * 0.25))}% crowd
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
