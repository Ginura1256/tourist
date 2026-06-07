import { motion } from "motion/react";

interface RouteMapProps {
  primaryName: string;
  alternativeName: string;
  isCrowded: boolean;
  crowdLevel: number;
  isRouting: boolean;
}

export default function RouteMap({
  primaryName,
  alternativeName,
  isCrowded,
  crowdLevel,
  isRouting,
}: RouteMapProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-800 overflow-hidden shadow-xs relative">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#16a34a 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-xs font-mono tracking-wider text-slate-500 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-600 animate-pulse" />
          DYNAMIC SCHEMATIC ROUTE MAP
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Scale: 1 : 12,000
        </span>
      </div>

      <div className="relative h-64 flex items-center justify-center">
        {/* Connection paths */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main Departure point coordinates: near (10%, 50%) */}
          {/* Primary target: near (80%, 25%) */}
          {/* Alternative target: near (80%, 75%) */}

          {/* Path to Primary */}
          <path
            d="M 50 128 Q 200 60 450 60"
            fill="none"
            stroke={isRouting && !isCrowded ? "#16a34a" : isRouting && isCrowded ? "#ef4444" : "#cbd5e1"}
            strokeWidth={isRouting && !isCrowded ? "4" : "2"}
            strokeDasharray={isRouting ? "8, 6" : "0"}
            className={isRouting ? "stroke-dash-animate" : ""}
            style={{ transition: "stroke 0.5s ease, stroke-width 0.3s ease" }}
          />

          {/* Path to Alternative */}
          <path
            d="M 50 128 Q 200 196 450 196"
            fill="none"
            stroke={isRouting && isCrowded ? "#16a34a" : "#cbd5e1"}
            strokeWidth={isRouting && isCrowded ? "4" : "2"}
            strokeDasharray={isRouting && isCrowded ? "8, 6" : "0"}
            className={isRouting && isCrowded ? "stroke-dash-animate" : ""}
            style={{ transition: "stroke 0.5s ease, stroke-width 0.3s ease" }}
          />

          {/* Base Split coordinate point marker */}
          <circle cx="210" cy="128" r="4" fill="#94a3b8" />
        </svg>

        {/* Departure Point Node */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <motion.div
            animate={isRouting ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-10 h-10 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center shadow-xs"
          >
            <span className="text-xs font-mono font-bold text-green-700">DEP</span>
          </motion.div>
          <span className="text-2xs font-mono mt-1 text-slate-500">Hub Terminal</span>
        </div>

        {/* Primary Destination Node */}
        <div className="absolute right-12 top-4 flex flex-col items-end z-10 text-right">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">{primaryName}</span>
              <span className="text-2xs font-mono text-slate-500">Primary Target</span>
            </div>
            
            <motion.div
              animate={isRouting && !isCrowded ? { scale: [1, 1.2, 1], borderColor: ["#16a34a", "#4ade80", "#16a34a"] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-xs transition-all duration-500 ${
                isCrowded 
                  ? "border-red-500 text-red-650 bg-red-50" 
                  : isRouting 
                  ? "border-green-500 text-green-700 bg-green-50/50" 
                  : "border-slate-200 text-slate-400 bg-slate-50"
              }`}
            >
              <div className="text-center">
                <p className="text-2xs font-mono leading-none">CROWD</p>
                <p className="text-xs font-bold leading-none mt-1">{crowdLevel}%</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alternative Destination Node */}
        <div className="absolute right-12 bottom-4 flex flex-col items-end z-10 text-right">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">{alternativeName}</span>
              <span className="text-2xs font-mono text-green-700 font-bold">Alternative Route</span>
            </div>
            
            <motion.div
              animate={isRouting && isCrowded ? { scale: [1, 1.15, 1], borderColor: ["#16a34a", "#4ade80", "#16a34a"] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-xs transition-all duration-500 ${
                isRouting && isCrowded 
                  ? "border-green-500 text-green-700 bg-green-50/50" 
                  : "border-slate-200 text-slate-400 bg-slate-50"
              }`}
            >
              <div className="text-center">
                <p className="text-3xs font-mono leading-none">AUTO</p>
                <p className="text-2xs font-bold mt-0.5 text-green-600">CLEAR</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic center indicator badge */}
        <div className="absolute left-[40%] top-[45%] z-20">
          <motion.div
            key={isCrowded ? "rerouting" : "normal"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`px-3 py-1 rounded-full text-2xs font-bold font-mono tracking-wider shadow-sm backdrop-blur-md ${
              !isRouting
                ? "bg-slate-100 text-slate-500 border border-slate-200"
                : isCrowded
                ? "bg-rose-600 text-white border border-rose-500 animate-pulse"
                : "bg-green-650 text-white border border-green-500"
            }`}
          >
            {!isRouting 
              ? "STANDBY" 
              : isCrowded 
              ? "⚠️ REROUTING ACTIVATED" 
              : "✓ PASSENGER STREAM DISPATCHED"}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes strokeDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .stroke-dash-animate {
          animation: strokeDash 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
