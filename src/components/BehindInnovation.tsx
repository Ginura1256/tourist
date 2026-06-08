import React, { useState } from "react";
import { 
  Sparkles, 
  AlertTriangle, 
  Cpu, 
  Network, 
  ShieldCheck, 
  Server, 
  ArrowRight,
  Globe,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Info
} from "lucide-react";
import sigiriyaImg from "@/assets/Sigiriya-Main.jpg";
import MeetTheTeam from "./MeetTheTeam";

export default function BehindInnovation() {
  const [activeStage, setActiveStage] = useState<number>(2); // for animated flowchart interaction

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1A2521] font-sans antialiased pb-20 space-y-16">
      
      {/* 1. HERO SECTION (Full-bleed cinematic background of Sigiriya) */}
      <section className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 bg-[#0A3D2B] text-white min-h-[550px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={sigiriyaImg} 
            alt="Sigiriya Fortress at Golden Hour" 
            className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
          />
          {/* Soft premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D2B] via-[#0A3D2B]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D2B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 lg:py-24 space-y-8">
          
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/30 text-xs font-mono font-bold text-[#00C4B4] uppercase tracking-widest">
              <span className="w-2.5 h-2.5 bg-[#00C4B4] rounded-full animate-ping shrink-0" />
              ROUTER STANDBY
            </span>
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider hidden sm:inline">
              SLTDA CORE v2.4
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight max-w-3xl">
              Protecting Sigiriya Through <span className="text-[#00C4B4]">Intelligent Tourism Flow</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-350 max-w-2xl leading-relaxed font-medium">
              EcoDiverter is an enterprise-grade crowd routing engine. By dynamically shifting high-volume tourist surges, we actively protect ancient Sri Lankan heritage biospheres.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => scrollToSection("problem")}
              className="px-6 py-4 bg-[#00C4B4] hover:bg-[#00b0a2] text-[#0A3D2B] font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer text-sm flex items-center gap-2 group"
            >
              Analyze the Blueprint
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection("architecture")}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold rounded-xl transition-all duration-200 cursor-pointer text-sm"
            >
              System Data Flow
            </button>
          </div>
        </div>
      </section>


      {/* 3. SECTION 01 – THE ORIGIN STORY */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 lg:p-10 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-4 max-w-xl">
            <span className="text-xs font-mono font-bold text-[#00C4B4] tracking-widest uppercase">01. The Problem Definition</span>
            <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-[#1A2521] mt-1">
              The Overtourism Crisis
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Text description */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Sigiriya Rock Fortress is a delicate UNESCO archaeological site under constant threat. Every year, millions of concentrated tourist steps fatigue its ancient brickwork, erode spiral staircases, compact delicate soils, and cause high vehicle emissions in the biological buffer zone.
                </p>
                <p className="font-semibold text-[#0A3D2B] bg-[#E8D5B8]/20 border-l-4 border-[#0A3D2B] p-4 rounded-r-xl italic">
                  "Traditional tourist guides and maps act purely like weather forecasts. They report that a destination is congested but leave travelers stranded in lines. EcoDiverter acts as an active, real-time diversion engine."
                </p>
              </div>

              {/* Checkmarks comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 pt-2">
                <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                  <span className="text-rose-600 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <XCircle className="w-4 h-4 shrink-0" /> PASSIVE TELEMETRY
                  </span>
                  <p className="text-slate-500 font-normal leading-normal">報告 only. Tells tourists when a location is already packed, forcing travelers to wait or turn back.</p>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <CheckCircle className="w-4 h-4 shrink-0" /> ECO DIVERTER ACTIVE ROUTING
                  </span>
                  <p className="text-slate-500 font-normal leading-normal">Mitigates density by redirecting ticket booking streams 45 minutes before congestion peak hits.</p>
                </div>
              </div>
            </div>

            {/* Visual Threat Vectors */}
            <div className="lg:col-span-5 bg-[#F8F5F0] border border-slate-200/50 p-6 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
                  SIGIRIYA ARCHAEOLOGICAL BIOSPHERE THREATS
                </span>
                
                <div className="space-y-4">
                  {/* Vector 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">Stonemasonry & Staircase Fatigue</span>
                      <span className="text-rose-600">92% CRITICAL</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00C4B4] to-rose-500 h-full w-[92%]" />
                    </div>
                  </div>

                  {/* Vector 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">Soil Compaction / Root Stress</span>
                      <span className="text-rose-600">84% HIGH RISK</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00C4B4] to-amber-500 h-full w-[84%]" />
                    </div>
                  </div>

                  {/* Vector 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">Buffer Zone Vehicle Idling Emissions</span>
                      <span className="text-amber-700 font-bold">76% ELEVATED</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00C4B4] to-blue-500 h-full w-[76%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-start gap-2 text-2xs text-slate-500 leading-normal">
                <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Sigiriya's UNESCO rating is directly affected by visitor density score. Keeping crowd index under 75% secures structural status.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 02 – STRATEGIC PIVOTS (THE ENGINEERING JOURNEY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="border-b border-slate-200/80 pb-4 max-w-xl">
            <span className="text-xs font-mono font-bold text-[#00C4B4] tracking-widest uppercase">02. Engineering Journey</span>
            <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-[#1A2521] mt-1">
              Strategic Pivots & Adaptation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Phase 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-350" />
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider">
                    Phase 01
                  </span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="w-2.5 h-2.5" /> Abandoned
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-800">
                  Enterprise SDK Telemetry
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Evaluated major global mobile footprint suppliers (like Placer.ai) for tracking tourist crowd indices.
                </p>
                <div className="p-3.5 bg-rose-50/30 rounded-xl text-2xs text-rose-800/90 leading-relaxed border border-rose-150/40">
                  <strong>The Bottleneck:</strong> Mobile telemetry providers had huge blind spots in Sri Lanka and the Global South, tracking less than 4% of active regional tourist footprints.
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-6 text-[10px] font-mono text-slate-400">
                Technology: Mobile SDK Aggregations
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-450" />
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider">
                    Phase 02
                  </span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Rejected
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-800">
                  Scraping Gray-Area
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Constructed high-frequency web scrapers to parse live Google Maps "Popular Times" bar values.
                </p>
                <div className="p-3.5 bg-amber-50/30 rounded-xl text-2xs text-amber-800/90 leading-relaxed border border-amber-200/40">
                  <strong>The Bottleneck:</strong> Terminated during engineering review. Violates Google’s strict Terms of Service for commercial products and risks IP blockages.
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-6 text-[10px] font-mono text-slate-400">
                Technology: Puppeteer & Proxy Rotate
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-white border border-[#00C4B4]/30 ring-2 ring-[#00C4B4]/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00C4B4] transition-all duration-300 shadow-md hover:shadow-lg group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00C4B4]" />
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider">
                    Phase 03
                  </span>
                  <span className="px-2 py-0.5 bg-[#00C4B4]/10 text-emerald-850 border border-[#00C4B4]/20 font-mono text-[9px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-2.5 h-2.5 text-[#00C4B4]" /> Active Production
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-[#0A3D2B]">
                  Routes API Traffic Proxy
                </h3>
                <p className="text-xs text-slate-650 leading-relaxed">
                  Engineered a compliant, commercially legal proxy index using official Google Maps Routes API (v2).
                </p>
                <div className="p-3.5 bg-[#00C4B4]/5 rounded-xl text-2xs text-slate-750 leading-relaxed border border-[#00C4B4]/15">
                  <strong>The Solution:</strong> Compares active, traffic-aware trip duration against static baseline (empty roadway) travel times to calculate a highly precise Congestion Ratio.
                </div>
              </div>
              <div className="pt-4 border-t border-[#00C4B4]/10 mt-6 text-[10px] font-mono text-forest-green font-bold">
                Technology: Google Routes v2 / Protobuf / C++
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECTION 03 – PIPELINE ARCHITECTURE (DATA SMOOTHING) */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 lg:p-10 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-4 max-w-xl">
            <span className="text-xs font-mono font-bold text-[#00C4B4] tracking-widest uppercase">03. Telemetry Architecture</span>
            <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-[#1A2521] mt-1">
              Data Pipeline & Smoothing
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                When the router detects high density at Sigiriya Rock and switches to alternatives, redirecting all incoming travelers instantly creates crowd spikes at the alternate site. 
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                To prevent this <strong className="font-bold text-[#0A3D2B]">route-switching feedback loop oscillation</strong> (where tourists are rapidly switched back and forth), we engineered a telemetry smoothing pipeline.
              </p>

              <div className="bg-[#F8F5F0] border border-slate-200/60 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                  SMOOTHING MECHANISMS
                </span>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C4B4] mt-0.5">•</span>
                    <span><strong>Exponential Moving Average (EMA)</strong> filter: Damps sudden traffic fluctuations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C4B4] mt-0.5">•</span>
                    <span><strong>15-Minute Telemetry Buffer</strong>: Prevents rapid UI toggling and traveler confusion.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C4B4] mt-0.5">•</span>
                    <span><strong>Dynamic Alpha Parameter (α)</strong>: Adjusts damping weight based on raw data volatility.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Animated Interactive Flowchart Diagram */}
            <div className="lg:col-span-7 bg-[#0A3D2B] rounded-2xl p-6 text-white font-mono text-xs shadow-inner space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[9px] font-bold text-[#00C4B4] uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00C4B4] rounded-full animate-ping" />
                Pipeline Active
              </div>

              <div className="border-b border-white/10 pb-2">
                <span className="text-xs text-slate-400 font-bold block">FLOWCHART: TELEMETRY FILTER PIPELINE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-stretch relative">
                
                {/* Stage 0 */}
                <div 
                  onClick={() => setActiveStage(0)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeStage === 0 
                      ? "bg-[#00C4B4]/20 border-[#00C4B4] text-white" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[8px] block font-bold text-slate-400">STAGE 01</span>
                  <span className="font-bold block text-2xs truncate mt-1">Routes API v2</span>
                  <p className="text-[9px] leading-tight font-normal text-slate-300 mt-2">Queries raw travel times.</p>
                </div>

                {/* Stage 1 */}
                <div 
                  onClick={() => setActiveStage(1)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeStage === 1 
                      ? "bg-[#00C4B4]/20 border-[#00C4B4] text-white" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[8px] block font-bold text-slate-400">STAGE 02</span>
                  <span className="font-bold block text-2xs truncate mt-1">Noise Filter</span>
                  <p className="text-[9px] leading-tight font-normal text-slate-300 mt-2">Removes brief traffic stalls.</p>
                </div>

                {/* Stage 2 */}
                <div 
                  onClick={() => setActiveStage(2)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeStage === 2 
                      ? "bg-[#00C4B4]/20 border-[#00C4B4] text-white" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[8px] block font-bold text-slate-400">STAGE 03</span>
                  <span className="font-bold block text-2xs truncate mt-1">EMA Engine</span>
                  <p className="text-[9px] leading-tight font-normal text-slate-300 mt-2">Damps out oscillation loops.</p>
                </div>

                {/* Stage 3 */}
                <div 
                  onClick={() => setActiveStage(3)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeStage === 3 
                      ? "bg-[#00C4B4]/20 border-[#00C4B4] text-white" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[8px] block font-bold text-slate-400">STAGE 04</span>
                  <span className="font-bold block text-2xs truncate mt-1">Diverter UI</span>
                  <p className="text-[9px] leading-tight font-normal text-slate-300 mt-2">Renders stable routing instructions.</p>
                </div>

              </div>

              {/* Stage interactive description */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[#00C4B4] text-[9px] font-bold block uppercase tracking-wider">
                  {activeStage === 0 && "STAGE 01: GOOGLE ROUTES v2 INGESTION"}
                  {activeStage === 1 && "STAGE 02: HIGH-FREQUENCY FILTER"}
                  {activeStage === 2 && "STAGE 03: EXPONENTIAL MOVING AVERAGE (EMA) MATH"}
                  {activeStage === 3 && "STAGE 04: MITIGATION SYSTEM UI DISPATCH"}
                </span>
                <p className="text-2xs text-slate-300 leading-relaxed font-medium">
                  {activeStage === 0 && "Queries the official routes endpoint every 3 minutes. Computes raw ratio of duration / staticDuration to establish a baseline traffic value."}
                  {activeStage === 1 && "Filters out brief anomalous spikes (such as individual breakdown vehicles or minor local crossing queues) which shouldn't trigger site-wide diversions."}
                  {activeStage === 2 && "Calculates S_t = α · Y_t + (1 - α) · S_t-1 with an alpha factor of 0.22, smoothing the curve so ticket flows are rerouted gradually."}
                  {activeStage === 3 && "Translates dampened crowd scores into clean color-coded status banners and dynamic suggestions, guaranteeing a non-flickering user experience."}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. SECTION 04 – THE BUSINESS MODEL (DATA BARTER ECOSYSTEM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 lg:p-10 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-4 max-w-xl">
            <span className="text-xs font-mono font-bold text-[#00C4B4] tracking-widest uppercase">04. Commercial Architecture</span>
            <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-[#1A2521] mt-1">
              The Data Barter Ecosystem (B2B2G)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Context */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <p className="text-slate-650 text-sm leading-relaxed">
                  Real-time cellular mobile subscriber footprint licensing is prohibitively expensive for sustainable startups. CrowdWhisper bypassed these telemetry licensing fees entirely by engineering a tripartite value exchange.
                </p>
                <p className="text-slate-650 text-sm leading-relaxed">
                  Instead of paying cash, we trade our high-value <strong className="font-bold text-[#0A3D2B]">Predictive Intent Data</strong>—which anticipates where tourist waves will arrive 45 minutes in advance—to public ministries and telecom networks.
                </p>
              </div>

              <div className="p-4 bg-[#F8F5F0] rounded-xl border border-slate-200/60 text-xs space-y-2">
                <span className="font-bold text-[#0A3D2B] block uppercase tracking-wider text-[10px]">
                  WIN-WIN PARTNERSHIP VALUE:
                </span>
                <ul className="space-y-1.5 font-semibold text-slate-700 list-disc list-inside">
                  <li>Government: Gains zero-cost site structural preservation.</li>
                  <li>Telcos: Gain traffic-shaping maps for network cell allocation.</li>
                  <li>EcoDiverter: Gains free, commercial-grade live crowd counts.</li>
                </ul>
              </div>
            </div>

            {/* Visual Value Exchange Diagram */}
            <div className="lg:col-span-7 bg-[#0A3D2B] rounded-2xl p-6 text-white flex flex-col justify-between space-y-6">
              
              <span className="font-mono text-2xs uppercase tracking-widest text-[#00C4B4] block font-bold">
                TRIPARTITE VALUE EXCHANGE BLUEPRINT
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                
                {/* Column: We Provide */}
                <div className="bg-white/5 border border-white/15 rounded-xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-[#00C4B4] font-bold uppercase tracking-wider">
                    <ArrowRightLeft className="w-4 h-4" /> What We Provide
                  </div>
                  <ul className="space-y-2 font-mono text-3xs text-slate-300">
                    <li className="flex items-start gap-1">
                      <span className="text-[#00C4B4]">•</span>
                      <span><strong>Predictive Intent Data:</strong> Rerouting schedules projecting tourist arrivals 45 mins in advance.</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#00C4B4]">•</span>
                      <span><strong>Footprint Distribution:</strong> Directing traffic away from choked choke points.</span>
                    </li>
                  </ul>
                </div>

                {/* Column: We Receive */}
                <div className="bg-white/5 border border-white/15 rounded-xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-[#00C4B4] font-bold uppercase tracking-wider">
                    <ArrowRightLeft className="w-4 h-4" /> What We Receive
                  </div>
                  <ul className="space-y-2 font-mono text-3xs text-slate-300">
                    <li className="flex items-start gap-1">
                      <span className="text-[#00C4B4]">•</span>
                      <span><strong>Cell-Tower Heatmaps:</strong> Free access to localized crowd statistics and density records.</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#00C4B4]">•</span>
                      <span><strong>SLTDA Support:</strong> Regulatory approval and official ticketing gateway integration.</span>
                    </li>
                  </ul>
                </div>

              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center text-2xs font-mono text-slate-300">
                Data exchange loop runs every <strong className="text-white">60 seconds</strong>, completely bypassing cellular footprint licensing expenses.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. SECTION 05 – MEET THE TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MeetTheTeam />
      </section>

    </div>
  );
}
