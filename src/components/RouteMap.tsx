import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass, Sparkles } from "lucide-react";

interface RouteMapProps {
  primaryName: string;
  alternativeName: string;
  isCrowded: boolean;
  crowdLevel: number;
  isRouting: boolean;
  onNodeClick?: () => void;
}

export default function RouteMap({
  primaryName,
  alternativeName,
  isCrowded,
  crowdLevel,
  isRouting,
  onNodeClick,
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const pathsGroupRef = useRef<L.FeatureGroup | null>(null);
  const ecoZonesGroupRef = useRef<L.FeatureGroup | null>(null);

  const getShortName = (fullName: string) => {
    const n = fullName.toLowerCase();
    if (n.includes("sigiriya")) return "Sigiriya";
    if (n.includes("dambulla") || n.includes("cave")) return "Cave Temple";
    if (n.includes("ibbankatuwa")) return "Ibbankatuwa";
    if (n.includes("peradeniya") || n.includes("botanic")) return "Botanic Gardens";
    if (n.includes("gannoruwa")) return "Agro Tech Park";
    if (n.includes("edison")) return "Edison Bungalow";
    if (n.includes("idalgashinna")) return "Idalgashinna Node";
    if (n.includes("tooth") || n.includes("temple of")) return "Temple of Tooth";
    if (n.includes("galle")) return "Galle Fort";
    if (n.includes("pidurangala")) return "Pidurangala";
    if (n.includes("museum")) return "Buddhist Museum";
    if (n.includes("pagoda") || n.includes("japanese")) return "Peace Pagoda";
    return fullName;
  };

  // Sri Lanka GPS Coordinates for Heritage Zones
  const getGeoCoordinates = () => {
    const name = primaryName.toLowerCase();
    if (name.includes("sigiriya")) {
      return {
        departureName: "Dambulla Corridor",
        departure: [7.8731, 80.6514] as [number, number],
        primary: [7.9570, 80.7601] as [number, number],
        alternative: [7.9659, 80.7628] as [number, number],
      };
    } else if (name.includes("dambulla") || name.includes("cave")) {
      return {
        departureName: "Dambulla Junction",
        departure: [7.8731, 80.6514] as [number, number],
        primary: [7.8608, 80.6517] as [number, number],
        alternative: [7.8529, 80.6152] as [number, number],
      };
    } else if (name.includes("peradeniya") || name.includes("botanic")) {
      return {
        departureName: "Peradeniya Junction",
        departure: [7.2682, 80.5925] as [number, number],
        primary: [7.2716, 80.5975] as [number, number],
        alternative: [7.2828, 80.5947] as [number, number],
      };
    } else if (name.includes("edison") || name.includes("bungalow")) {
      return {
        departureName: "Haputale Junction",
        departure: [6.7865, 80.9230] as [number, number],
        primary: [6.7801, 80.8931] as [number, number],
        alternative: [6.7852, 80.8876] as [number, number],
      };
    } else if (name.includes("tooth") || name.includes("temple")) {
      return {
        departureName: "Kandy Entrance",
        departure: [7.2911, 80.6360] as [number, number],
        primary: [7.2936, 80.6413] as [number, number],
        alternative: [7.2985, 80.6475] as [number, number],
      };
    } else {
      // Galle Dutch Fort
      return {
        departureName: "Galle Harbour Gate",
        departure: [6.0360, 80.2160] as [number, number],
        primary: [6.0263, 80.2176] as [number, number],
        alternative: [6.0125, 80.2504] as [number, number],
      };
    }
  };

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([7.9570, 80.7601], 13);

      // CARTO Voyager - premium, highly colorful and vibrant map tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.featureGroup().addTo(map);
      pathsGroupRef.current = L.featureGroup().addTo(map);
      ecoZonesGroupRef.current = L.featureGroup().addTo(map);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Draw Coordinates and paths dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    const pathsGroup = pathsGroupRef.current;
    const ecoZonesGroup = ecoZonesGroupRef.current;

    if (!map || !markersGroup || !pathsGroup || !ecoZonesGroup) return;

    // Reset current graphics
    markersGroup.clearLayers();
    pathsGroup.clearLayers();
    ecoZonesGroup.clearLayers();

    const geo = getGeoCoordinates();

    // 1. Render Eco Sanctuary Hotspots (light green glowing circles)
    // Create a glowing zone near alternative route
    L.circle(geo.alternative, {
      radius: geo.departureName.includes("Dambulla") ? 400 : 80,
      fillColor: "#10b981",
      fillOpacity: 0.15,
      color: "#10b981",
      weight: 1,
      dashArray: "4,4",
    }).addTo(ecoZonesGroup);

    // 2. Render Traffic Hotspot warning circles along primary path
    if (isCrowded) {
      const midpoint: [number, number] = [
        (geo.departure[0] + geo.primary[0]) / 2,
        (geo.departure[1] + geo.primary[1]) / 2,
      ];
      L.circle(midpoint, {
        radius: geo.departureName.includes("Dambulla") ? 600 : 100,
        fillColor: "#ef4444",
        fillOpacity: 0.12,
        color: "#ef4444",
        weight: 1.5,
        dashArray: "3,3",
      }).addTo(pathsGroup);
    }

    // 3. Define divIcons for our custom premium design
    const departureIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center relative">
            <svg class="w-4 h-4 text-[#2E7D32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span class="text-[8px] font-bold font-mono bg-white/95 text-slate-600 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 mt-1 whitespace-nowrap uppercase tracking-wider">${geo.departureName}</span>
        </div>
      `,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 32],
    });

    const primaryIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="relative w-11 h-11 rounded-full border-2 bg-white flex flex-col items-center justify-center shadow-md ${
            isCrowded
              ? "border-rose-500 text-rose-700 bg-rose-50"
              : isRouting
              ? "border-emerald-500 text-emerald-700 bg-emerald-50"
              : "border-slate-200 text-slate-400"
          }">
            ${
              isCrowded
                ? `<span class="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-35"></span>`
                : ""
            }
            <span class="text-[7px] font-bold font-mono uppercase leading-none z-10">CROWD</span>
            <span class="text-[10px] font-black mt-0.5 z-10">${crowdLevel}%</span>
          </div>
          <span class="text-[8px] font-bold font-mono bg-white/95 text-slate-800 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 mt-1 whitespace-nowrap">${getShortName(primaryName)}</span>
        </div>
      `,
      className: "",
      iconSize: [50, 50],
      iconAnchor: [25, 42],
    });

    const alternativeIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="relative w-11 h-11 rounded-full border-2 bg-white flex flex-col items-center justify-center shadow-md ${
            isRouting && isCrowded
              ? "bg-emerald-600 border-[#2E7D32] text-white"
              : "bg-white border-slate-200 text-slate-400"
          }">
            ${
              isRouting && isCrowded
                ? `<span class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30"></span>`
                : ""
            }
            <span class="text-[7px] font-bold font-mono uppercase leading-none z-10">ECO</span>
            <span class="text-[10px] z-10 mt-0.5">🍃</span>
          </div>
          <span class="text-[8px] font-bold font-mono bg-white/95 text-emerald-800 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 mt-1 whitespace-nowrap">${getShortName(alternativeName)}</span>
        </div>
      `,
      className: "",
      iconSize: [50, 50],
      iconAnchor: [25, 42],
    });

    // 4. Add Markers
    L.marker(geo.departure, { icon: departureIcon }).addTo(markersGroup);
    
    const primMarker = L.marker(geo.primary, { icon: primaryIcon }).addTo(markersGroup);
    if (onNodeClick) {
      primMarker.on("click", onNodeClick);
    }
    
    L.marker(geo.alternative, { icon: alternativeIcon }).addTo(markersGroup);

    // 5. Draw Routes (Polylines)
    // Primary path
    L.polyline([geo.departure, geo.primary], {
      color: !isRouting 
        ? "#94a3b8" 
        : isCrowded 
        ? "#ef4444" 
        : "#2E7D32",
      weight: isRouting && !isCrowded ? 4.5 : 2.5,
      dashArray: isRouting ? "6, 6" : undefined,
      opacity: 0.8,
    }).addTo(pathsGroup);

    // Alternative path
    L.polyline([geo.departure, geo.alternative], {
      color: isRouting && isCrowded 
        ? "#2E7D32" 
        : "#cbd5e1",
      weight: isRouting && isCrowded ? 4.5 : 2.5,
      dashArray: isRouting && isCrowded ? "6, 6" : undefined,
      opacity: 0.8,
    }).addTo(pathsGroup);

    // 6. Fit viewport bounds
    const groupBounds = L.latLngBounds([geo.departure, geo.primary, geo.alternative]);
    map.fitBounds(groupBounds, {
      padding: [40, 40],
      maxZoom: 15,
      animate: true,
      duration: 0.8,
    });

  }, [primaryName, alternativeName, isCrowded, crowdLevel, isRouting, onNodeClick]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 text-slate-800 overflow-hidden shadow-md relative">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#2E7D32 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Header */}
      <div className="mb-6 relative z-10">
        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-forest-green tracking-wider uppercase whitespace-nowrap flex-nowrap">
          <Compass className="w-4 h-4 text-emerald-green animate-spin-slow shrink-0" />
          Live Geographical GPS Map
        </span>
        <h4 className="text-lg font-display font-bold text-dark-slate mt-1">Live Telemetry Map</h4>
      </div>

      {/* Map Container */}
      <div className="relative h-72 md:h-80 bg-slate-100 rounded-2xl border border-slate-250/60 overflow-hidden shadow-inner z-10">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Floating Diverter Status Badge */}
        <div className="absolute top-4 left-4 z-[400] pointer-events-none">
          <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider shadow-md border ${
            !isRouting
              ? "bg-slate-900/90 text-white border-slate-800 backdrop-blur-md"
              : isCrowded
              ? "bg-rose-600/95 text-white border-rose-500 backdrop-blur-md animate-pulse"
              : "bg-emerald-600/95 text-white border-emerald-500 backdrop-blur-md"
          }`}>
            {!isRouting 
              ? "SYSTEM STANDBY" 
              : isCrowded 
              ? "⚠️ DIVERTER ACTIVE" 
              : "✓ PATHWAY CLEAR"}
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 text-xs">
        <div className="flex gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-green inline-block" />
            Sustainable Path
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            High Load Surge
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            Inactive Connection
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[10px]">
          GPS Latency: 12ms | Active Nodes: 6
        </div>
      </div>
    </div>
  );
}
