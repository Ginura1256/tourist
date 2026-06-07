import React from "react";
import { Compass, Sparkles, MapPin, CheckCircle2 } from "lucide-react";

export default function AlternativesWiki() {
  const alternatives = [
    {
      name: "Pidurangala & Lion Rocks viewpoint",
      primaryTarget: "Sigiriya Rock Fortress",
      environmentValue: "Untouched environment, 88% less footsteps, stunning 360 view of Sigiriya.",
      description: "A beautiful, massive rock located a few kilometers north of Sigiriya. It has a peaceful temple at the base, ancient reclining Buddha, and offers a peerless view overlooking Sigiriya Rock itself.",
      howToGetThere: "Take a quiet 10-minute tuk-tuk ride north of Sigiriya main entrance road.",
      benefit: "Avoids the long ticketing queues (and steep admission) of Sigiriya while offering a marvelous vista.",
      image: "https://destinationlesstravel.com/wp-content/uploads/2019/04/Sigiriya-Rock-view-from-Pidurangala-at-sunset.jpg"
    },
    {
      name: "International Buddhist Museum",
      primaryTarget: "Temple of the Tooth",
      environmentValue: "Climate-controlled smart indoor preservation, regulated hourly visitor capacities.",
      description: "The world's first International Buddhist Museum, located within the same palace grounds but boasting a highly managed, quiet indoor space that showcases Buddhist culture and artifacts from 17 participating nations.",
      howToGetThere: "Walk a peaceful 2-minute pathway adjacent to the main Temple of the Tooth entrance.",
      benefit: "Allows tourists to explore Buddhist history in a tranquil museum environment, reducing central shrine congestions.",
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Japanese Peace Temple Pagoda",
      primaryTarget: "Galle Dutch Fort",
      environmentValue: "Pristine ocean breeze, exceptionally peaceful hilltop, zero sound pollution.",
      description: "A gorgeous, pristine white Buddhist stupa nestled on the Rumassala headland, built by Nipponzan Myohoji order of monks to inspire global peace and offer panoramic bay vistas.",
      howToGetThere: "Take a scenic tuk-tuk ride up the Rumassala hill road overlooking Galle bay.",
      benefit: "Bypasses the heavy walking congestion of the packed fort ramparts while nourishing spiritual eagerness.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=800&q=80"
    }
  ];
  return (
    <div className="space-y-8 animate-fade-in text-slate-850">
      <div className="bg-gradient-to-r from-emerald-850 to-green-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Compass className="w-36 h-36 text-green-200" />
        </div>
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/40 text-green-50 text-xs font-mono rounded-full w-max mb-4 border border-green-400/30">
            <Sparkles className="w-3 h-3 text-green-200" />
            ECO-TOURISM BLUEPRINT
          </div>
          <h2 className="text-3xl font-display font-semibold tracking-tight mb-3 text-white">
            Sustainable Travel Mitigation System
          </h2>
          <p className="text-emerald-50 text-sm leading-relaxed">
            By shifting high-volume passenger surges into under-utilized historic alternates, we reduce heavy physical wear-and-tear and soil compaction, support local outer neighborhoods, and restore respect to ancient monuments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alternatives.map((alt) => (
          <div key={alt.name} className="bg-white border border-slate-200/85 rounded-3xl shadow-xs hover:shadow-sm hover:border-green-300 transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 bg-slate-50">
                <img 
                  referrerPolicy="no-referrer"
                  src={alt.image} 
                  alt={alt.name}
                  className="w-full h-full object-cover opacity-95"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl shadow-xs">
                    ALTERNATIVE
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold mb-2 uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5" />
                  Bypassing: {alt.primaryTarget}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{alt.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{alt.description}</p>
                
                <div className="bg-green-50 text-slate-700 p-3 rounded-2xl mb-4 border border-green-200">
                  <p className="text-2xs font-mono uppercase tracking-wider font-bold text-green-800">ECO SAVINGS</p>
                  <p className="text-2xs mt-1 font-medium">{alt.environmentValue}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0 border-t border-slate-100 mt-4">
              <div className="flex items-start gap-2 mt-4 text-slate-600 text-2xs">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Sustainable Tip:</span> {alt.benefit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-100/20 border border-green-200/80 rounded-2xl p-6 text-slate-700">
        <h4 className="text-sm font-bold flex items-center gap-2 mb-2 text-green-800 font-mono">
          🍀 Sustainable Footprint Core Goals
        </h4>
        <p className="text-xs leading-relaxed text-slate-600">
          The Dynamic Overtourism Mitigation Router constantly evaluates tourist density levels at vulnerable UNESCO world heritage places. High crowd quotients (over 75%) automatically route inbound ticket requests to pre-approved alternative micro-communities. This preserves standard tourist experiences while dynamically spreading the physical load.
        </p>
      </div>
    </div>
  );
}
