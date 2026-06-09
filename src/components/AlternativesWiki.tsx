import React, { useState } from "react";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Trees, 
  Search, 
  X, 
  Eye, 
  Copy, 
  Check, 
  Car, 
  Clock, 
  Star, 
  ShieldCheck, 
  Info,
  Activity
} from "lucide-react";
import pidurangalaImg from "@/assets/pidurangala.jpg";
import japanesePeaceImg from "@/assets/Japanese Peace.jpg";
import museumImg from "@/assets/museum.jpg";
import ibbankatuwaImg from "@/assets/ibbankatuwa.jpg";
import gannoruwaImg from "@/assets/gannoruwa.jpg";
import idalgashinnaImg from "@/assets/idalgashinna.jpg";

interface AlternativePlace {
  name: string;
  primaryTarget: string;
  category: string;
  environmentValue: string;
  description: string;
  howToGetThere: string;
  benefit: string;
  image: string;
  ecoScore: string;
  rating: number;
  reviewsCount: number;
  history: string;
  bestTimeToVisit: string;
  entryFee: string;
  duration: string;
  activityLevel: string;
  dressCode: string;
  communityImpact: {
    homestays: number;
    localTransport: number;
    footsteps: number;
  };
  details: {
    monumentStress: string;
    carbonOffset: string;
    communityBenefit: string;
  };
}

export default function AlternativesWiki() {
  const alternatives: AlternativePlace[] = [
    {
      name: "Pidurangala viewpoint",
      primaryTarget: "Sigiriya Rock Fortress",
      category: "Nature & Peaks",
      environmentValue: "Untouched environment, 88% fewer footsteps, stunning 360 view of Sigiriya.",
      description: "A beautiful, massive rock located a few kilometers north of Sigiriya. It has a peaceful temple at the base, ancient reclining Buddha, and offers a peerless view overlooking Sigiriya Rock itself.",
      howToGetThere: "Take a quiet 10-minute tuk-tuk ride north of Sigiriya main entrance road.",
      benefit: "Avoids the long ticketing queues (and steep admission) of Sigiriya while offering a marvelous vista.",
      image: pidurangalaImg,
      ecoScore: "9.8",
      rating: 4.9,
      reviewsCount: 1840,
      history: "Dating back to the 2nd century BC, Pidurangala was established as a Buddhist monastery by King Kashyapa to house the monks who previously resided at Sigiriya Rock, clearing Sigiriya for his fortress palace.",
      bestTimeToVisit: "5:00 AM - 7:00 AM (Sunrise) or 4:30 PM - 6:30 PM (Sunset)",
      entryFee: "LKR 1,000 (Approx. $3 USD) - vs. Sigiriya ($36 USD)",
      duration: "2 hours",
      activityLevel: "Challenging climb (staircase followed by climbing over giant boulders at the summit)",
      dressCode: "Shoulders and knees must be covered at the temple entrance at the base (sarongs available for rent). Shoes must be removed.",
      communityImpact: {
        homestays: 45,
        localTransport: 25,
        footsteps: 1200
      },
      details: {
        monumentStress: "Reduces congestion by diverting up to 15,000 weekly footsteps away from Sigiriya's ancient spiral stairs.",
        carbonOffset: "Reduces shuttle idling and traffic jams around the main Sigiriya biosphere by 18%.",
        communityBenefit: "Directly funds the Sigiriya rural community via local guide hires and roadside fruit stalls."
      }
    },
    {
      name: "International Buddhist Museum",
      primaryTarget: "Temple of the Tooth",
      category: "Culture & History",
      environmentValue: "Climate-controlled smart indoor preservation, regulated hourly visitor capacities.",
      description: "The world's first International Buddhist Museum, located within the same palace grounds but boasting a highly managed, quiet indoor space that showcases Buddhist culture and artifacts from 17 participating nations.",
      howToGetThere: "Walk a peaceful 2-minute pathway adjacent to the main Temple of the Tooth entrance.",
      benefit: "Allows tourists to explore Buddhist history in a tranquil museum environment, reducing central shrine congestions.",
      image: museumImg,
      ecoScore: "9.6",
      rating: 4.7,
      reviewsCount: 920,
      history: "Housed in the restored Victorian-era High Court building (originally the Palace of Kandy), the museum was opened in 2011 to celebrate global Buddhist history and preserve the architectural glory of the Kandyan kingdom.",
      bestTimeToVisit: "10:00 AM - 1:00 PM (Avoids afternoon heat and prayer crowd surges)",
      entryFee: "LKR 1,500 (Approx. $5 USD) - vs. Temple of the Tooth ($10 USD)",
      duration: "1.5 hours",
      activityLevel: "Easy (Flat indoor museum halls, fully wheelchair accessible)",
      dressCode: "Modest dress is required (shoulders and knees covered). Respectful demeanor appropriate for sacred grounds.",
      communityImpact: {
        homestays: 20,
        localTransport: 15,
        footsteps: 800
      },
      details: {
        monumentStress: "Spreads visitors evenly across the outer palace complex, lowering peak sound decibels in the main shrine by 24%.",
        carbonOffset: "Promotes foot-based museum trails, keeping tourists in the complex without adding vehicular emissions.",
        communityBenefit: "Funds joint cultural heritage projects between Kandy curators and regional historical conservation societies."
      }
    },
    {
      name: "Japanese Peace Temple Pagoda",
      primaryTarget: "Galle Dutch Fort",
      category: "Coastal & Shrines",
      environmentValue: "Pristine ocean breeze, exceptionally peaceful hilltop, zero sound pollution.",
      description: "A gorgeous, pristine white Buddhist stupa nestled on the Rumassala headland, built by Nipponzan Myohoji order of monks to inspire global peace and offer panoramic bay vistas.",
      howToGetThere: "Take a scenic tuk-tuk ride up the Rumassala hill road overlooking Galle bay.",
      benefit: "Bypasses the heavy walking congestion of the packed fort ramparts while nourishing spiritual eagerness.",
      image: japanesePeaceImg,
      ecoScore: "9.7",
      rating: 4.8,
      reviewsCount: 1250,
      history: "Constructed in 2004 by Japanese Buddhist monks as part of an initiative to build Peace Pagodas globally to promote non-violence and harmony, especially following the 2004 Indian Ocean tsunami.",
      bestTimeToVisit: "4:30 PM - 6:30 PM (Stunning sunset overlooking Galle Bay and the historic fort)",
      entryFee: "Free / Donation-based (Donations appreciated for temple maintenance)",
      duration: "1 hour",
      activityLevel: "Moderate (Short steep walk from the vehicle parking bay to the stupa platform)",
      dressCode: "Shoulders and knees must be covered when walking around the pagoda. Shoes must be removed before climbing the stupa steps.",
      communityImpact: {
        homestays: 35,
        localTransport: 30,
        footsteps: 1000
      },
      details: {
        monumentStress: "Reduces peak sunset foot-traffic load on the fragile Galle Fort ramparts, preserving historical stonemasonry.",
        carbonOffset: "Diverts traffic away from Galle city center, helping reduce congestion index by 15% in Galle bay.",
        communityBenefit: "Drives tourism revenue to small shops, fruit stands, and local tuk-tuk drivers operating in the Rumassala nature reserve."
      }
    },
    {
      name: "Ibbankatuwa Megalithic Burial Site",
      primaryTarget: "Dambulla Cave Temple",
      category: "Culture & History",
      environmentValue: "Open-air archaeological site, 95% fewer footprints, protects fragile cave murals.",
      description: "An ancient prehistoric burial site dating back to 750 BC to 400 BC. It features well-preserved cist graves made of massive granite slabs, where clay urns with ashes, beads, and iron tools were unearthed.",
      howToGetThere: "Take a 10-minute tuk-tuk ride southwest from Dambulla Town along Kurunegala road, then turn left at the signpost.",
      benefit: "Visiting this open-air site reduces carbon dioxide and moisture buildup inside Dambulla's enclosed caves, preserving centuries-old frescoes.",
      image: ibbankatuwaImg,
      ecoScore: "9.9",
      rating: 4.8,
      reviewsCount: 420,
      history: "First discovered in 1970, this prehistoric site covers more than 10 hectares. It provides evidence of a highly organized early Sri Lankan civilization with trade links reaching as far as India and Persia.",
      bestTimeToVisit: "8:00 AM - 10:30 AM or 4:00 PM - 5:30 PM (Avoids midday direct sun)",
      entryFee: "LKR 500 (Approx. $1.50 USD) - vs. Dambulla Cave Temple ($10 USD)",
      duration: "1 hour",
      activityLevel: "Easy (Flat walking pathways between stone tomb clusters)",
      dressCode: "Casual. No religious clothing constraints apply, but comfortable walking shoes, hats, and sunscreen are highly recommended.",
      communityImpact: {
        homestays: 30,
        localTransport: 20,
        footsteps: 600
      },
      details: {
        monumentStress: "Diverts up to 8,000 monthly visitors away from the enclosed cave chambers, preventing high temperature and humidity spikes.",
        carbonOffset: "Eases vehicular emissions at the crowded Golden Temple entrance, improving Dambulla's air quality index.",
        communityBenefit: "Brings essential tourism income to the rural pottery makers and farmers of the local Ibbankatuwa community."
      }
    },
    {
      name: "Gannoruwa Agro Technology Park",
      primaryTarget: "Royal Botanic Gardens, Peradeniya",
      category: "Nature & Peaks",
      environmentValue: "Interactive agricultural ecosystems, hydroponics, 90% fewer visitor footprints.",
      description: "A comprehensive agricultural demonstration park located just across the Mahaweli River from Peradeniya. It features organic farms, plant nurseries, an insect museum, and models for sustainable household agriculture.",
      howToGetThere: "Take a 5-minute drive north from the Peradeniya main entrance across the Gannoruwa Bridge.",
      benefit: "Saves Peradeniya's century-old tree roots and lawn ecosystems from soil compaction caused by heavy tourist congestion.",
      image: gannoruwaImg,
      ecoScore: "9.7",
      rating: 4.7,
      reviewsCount: 310,
      history: "Established by the Sri Lanka Department of Agriculture, this park acts as a live educational and research hub to demonstrate modern green technology and traditional farming methods to school children and tourists.",
      bestTimeToVisit: "8:30 AM - 11:30 AM or 3:00 PM - 5:00 PM (Ideal temperature for outdoor walking tours)",
      entryFee: "LKR 200 (Approx. $0.60 USD) - vs. Peradeniya Gardens ($10 USD)",
      duration: "1.5 hours",
      activityLevel: "Easy to Moderate (Flat walking paths between crop plots and nurseries)",
      dressCode: "Casual. No religious clothing constraints, but sunscreen, hats, and comfortable footwear are recommended.",
      communityImpact: {
        homestays: 25,
        localTransport: 20,
        footsteps: 500
      },
      details: {
        monumentStress: "Reduces root compaction and branch stress on Peradeniya's ancient giant trees by redistributing weekend family tour surges.",
        carbonOffset: "Promotes foot-based farm trails, lowering heavy tour-bus idling emissions along the main Kandy highway corridor.",
        communityBenefit: "Directly funds regional agro-technology conservation projects and drives traffic to the local organic farmers' market."
      }
    },
    {
      name: "Idalgashinna Colonial Railway Node",
      primaryTarget: "Edison Bungalow",
      category: "Nature & Peaks",
      environmentValue: "Pristine mountain ecosystems, 95% fewer footprints, nil noise pollution.",
      description: "A highly scenic, remote railway station on the Main Line in Sri Lanka, situated on a narrow ridge 1,615 meters above sea level. Famous for its frequent mist, 14 railway tunnels, and panoramic mountain drops on both sides.",
      howToGetThere: "Take a scenic train ride from Haputale Station to Idalgashinna Station, or hire a 4WD vehicle for a rugged mountain road drive.",
      benefit: "Diverts foot pressure and vehicle traffic away from Edison Bungalow's historic manicured estate, protecting the surrounding forest sanctuary buffer zone.",
      image: idalgashinnaImg,
      ecoScore: "9.9",
      rating: 4.9,
      reviewsCount: 520,
      history: "Built in 1893 during the British colonial expansion to transport tea, the station remains a marvel of engineering. When the mist clears, it offers a view that stretches all the way to the southern coast of Sri Lanka.",
      bestTimeToVisit: "7:00 AM - 10:30 AM (Best chance of clear skies before the afternoon mist rolls in)",
      entryFee: "Free (Train ticket from Haputale is approx. LKR 80 / $0.25 USD)",
      duration: "2 hours",
      activityLevel: "Moderate (Walking along the railway track or climbing hillside trails)",
      dressCode: "Casual. Layers are highly recommended since temperature drops rapidly with the mist and wind.",
      communityImpact: {
        homestays: 40,
        localTransport: 30,
        footsteps: 800
      },
      details: {
        monumentStress: "Protects Edison Bungalow's delicate gardens and heritage stone structure from excessive weekend tour groups.",
        carbonOffset: "Promotes train-based eco-travel, bypassing vehicle emissions on steep, narrow mountain curves.",
        communityBenefit: "Brings essential income to the small Idalgashinna hamlet, including local tea shops, guide services, and rural homestays."
      }
    }
  ];

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAlt, setSelectedAlt] = useState<AlternativePlace | null>(null);
  
  // Interactive states inside modal
  const [modalTab, setModalTab] = useState<"overview" | "eco" | "guide">("overview");
  const [groupSize, setGroupSize] = useState(2);
  const [isTrafficLoading, setIsTrafficLoading] = useState(false);
  const [trafficStatus, setTrafficStatus] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Filter alternatives
  const filteredAlternatives = alternatives.filter((alt) => {
    const matchesSearch = 
      alt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.primaryTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || alt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Unique categories
  const categories = ["All", "Nature & Peaks", "Culture & History", "Coastal & Shrines"];

  // Open modal
  const handleOpenModal = (alt: AlternativePlace) => {
    setSelectedAlt(alt);
    setModalTab("overview");
    setGroupSize(2);
    setTrafficStatus(null);
    setCopySuccess(false);
  };

  // Simulate traffic check inside modal
  const handleCheckTraffic = () => {
    setIsTrafficLoading(true);
    setTrafficStatus(null);
    setTimeout(() => {
      setIsTrafficLoading(false);
      const statusOptions = [
        "🟢 Clear Route (10 mins away) - 0% traffic delay",
        "🟢 Light Flow (12 mins away) - 5% delay",
        "🟡 Moderate Traffic (15 mins away) - 15% delay due to village crossing"
      ];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      setTrafficStatus(randomStatus);
    }, 1000);
  };

  // Copy directions helper
  const handleCopyDirections = (directions: string) => {
    navigator.clipboard.writeText(directions).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="space-y-10 animate-fade-in text-slate-800 pb-12">
      
      {/* 1. HERO HERO SECTION */}
      <div className="bg-gradient-to-br from-forest-green via-[#2b612e] to-dark-slate rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-[0.08] pointer-events-none">
          <Compass className="w-56 h-56 text-white animate-spin-slow" />
        </div>
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-full w-max border border-emerald-450/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Eco-Tourism Wiki
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-black tracking-tight text-white leading-tight">
            Sustainable Sri Lanka Alternates
          </h2>
          <p className="text-emerald-100/90 text-sm lg:text-base leading-relaxed font-medium">
            Explore carefully vetted, high-value alternative destinations that distribute economic benefits to local communities, preserve fragile world heritage monuments, and provide you with a peaceful, authentic travel experience.
          </p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center justify-between md:gap-4 md:space-y-0">
        
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by destination or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 rounded-full transition"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Filter tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-white border border-slate-200/50 text-forest-green shadow-xs"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CARDS GRID */}
      {filteredAlternatives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredAlternatives.map((alt) => (
            <div 
              key={alt.name} 
              className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 bg-slate-50 overflow-hidden">
                  <img 
                    referrerPolicy="no-referrer"
                    src={alt.image} 
                    alt={alt.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                      {alt.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/95 text-forest-green text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                      🍃 Score: {alt.ecoScore}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wide">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Bypassing: {alt.primaryTarget}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-extrabold text-dark-slate group-hover:text-forest-green transition-colors leading-tight">
                      {alt.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span className="font-bold">{alt.rating}</span>
                      <span className="text-slate-400 font-normal">({alt.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {alt.description}
                  </p>
                  
                  <div className="bg-slate-50 text-slate-700 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                      <Trees className="w-3 h-3 text-emerald-600" /> ECO VALUE SUMMARY
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">{alt.environmentValue}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-4 border-t border-slate-100/80 mt-2 space-y-3">
                <button
                  onClick={() => handleOpenModal(alt)}
                  className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-forest-green font-mono font-bold text-xs rounded-xl shadow-xs transition duration-250 flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Explore Eco-Metrics & Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center max-w-lg mx-auto">
          <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-display font-bold text-dark-slate">No Alternates Found</h3>
          <p className="text-sm text-slate-500 mt-1">
            We couldn't find any alternative places matching your search. Please try a different query.
          </p>
        </div>
      )}

      {/* 4. CORE GOALS EXPLANATION */}
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-[24px] p-6 lg:p-8 text-slate-750 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-emerald-100 text-emerald-800 rounded-3xl shrink-0">
          <Trees className="w-8 h-8 text-emerald-700" />
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-display font-bold text-forest-green flex items-center gap-2">
            EcoDiverter Sustainable Footprint Core Goals
          </h4>
          <p className="text-xs lg:text-sm leading-relaxed text-slate-600">
            The Dynamic Overtourism Mitigation Router constantly evaluates tourist density levels at vulnerable UNESCO world heritage places. High crowd quotients (over 75%) automatically route inbound ticket requests to pre-approved alternative micro-communities. This preserves standard tourist experiences while dynamically spreading the physical load.
          </p>
        </div>
      </div>

      {/* 5. DETAILED PREMIUM MODAL OVERLAY */}
      {selectedAlt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          
          <div className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
            
            {/* Modal Left Column: Hero Cover */}
            <div className="md:w-5/12 bg-slate-900 text-white relative flex flex-col justify-between p-6 overflow-hidden min-h-[260px] md:min-h-auto shrink-0">
              <div className="absolute inset-0">
                <img 
                  src={selectedAlt.image} 
                  alt={selectedAlt.name} 
                  className="w-full h-full object-cover opacity-65" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-emerald-600 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {selectedAlt.category}
                </span>
                
                <span className="bg-white/95 text-slate-800 text-sm font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  🍃 Eco: {selectedAlt.ecoScore}
                </span>
              </div>
              
              <div className="relative z-10 space-y-3 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-emerald-350 font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Bypassing: {selectedAlt.primaryTarget}
                </div>
                <h3 className="text-xl md:text-3xl font-display font-black leading-tight">
                  {selectedAlt.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-450">
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="font-bold text-white">{selectedAlt.rating} Rating</span>
                  <span className="text-slate-350">({selectedAlt.reviewsCount} visitor reviews)</span>
                </div>
              </div>
            </div>

            {/* Modal Right Column: Interactive Cockpit */}
            <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50 relative">
              
              {/* Close button */}
              <button 
                onClick={() => setSelectedAlt(null)}
                className="absolute top-4 right-4 p-2 bg-slate-200 hover:bg-slate-350 text-slate-600 hover:text-slate-900 rounded-full transition cursor-pointer z-30"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                
                {/* Header title */}
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-display font-extrabold text-dark-slate">Heritage Alternate cockpit</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold leading-none mt-0.5">
                      Explore Vetted Travel Alternate
                    </span>
                  </div>
                </div>

                {/* Tab select bar */}
                <div className="flex bg-slate-200/70 p-1 rounded-2xl border border-slate-300/20 text-xs font-mono font-bold">
                  <button
                    onClick={() => setModalTab("overview")}
                    className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                      modalTab === "overview" 
                        ? "bg-white text-forest-green shadow-xs" 
                        : "text-slate-550 hover:text-slate-900"
                    }`}
                  >
                    OVERVIEW
                  </button>
                  <button
                    onClick={() => setModalTab("eco")}
                    className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                      modalTab === "eco" 
                        ? "bg-white text-forest-green shadow-xs" 
                        : "text-slate-550 hover:text-slate-900"
                    }`}
                  >
                    ECO-COMMUNITY
                  </button>
                  <button
                    onClick={() => setModalTab("guide")}
                    className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                      modalTab === "guide" 
                        ? "bg-white text-forest-green shadow-xs" 
                        : "text-slate-550 hover:text-slate-900"
                    }`}
                  >
                    TRAVEL GUIDE
                  </button>
                </div>

                {/* Tab content panels */}
                <div className="min-h-[220px]">
                  
                  {/* TAB 1: OVERVIEW */}
                  {modalTab === "overview" && (
                    <div className="space-y-4 animate-fade-in text-slate-650 text-xs md:text-sm leading-relaxed">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold mb-1">
                          Core Experience
                        </span>
                        <p>{selectedAlt.description}</p>
                      </div>
                      
                      <div className="bg-slate-100 border border-slate-200/60 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-forest-green block font-bold mb-1.5 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" /> Historical Roots
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {selectedAlt.history}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ECO IMPACT & COMMUNITY CALCULATOR */}
                  {modalTab === "eco" && (
                    <div className="space-y-5 animate-fade-in text-xs">
                      
                      {/* Metric Bullet list */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                          <span className="font-mono text-[9px] text-slate-450 block font-bold uppercase">STRESS MITIGATION</span>
                          <p className="text-[10px] text-slate-700 leading-tight font-medium">{selectedAlt.details.monumentStress}</p>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                          <span className="font-mono text-[9px] text-slate-450 block font-bold uppercase">EMISSION OFFSET</span>
                          <p className="text-[10px] text-slate-700 leading-tight font-medium">{selectedAlt.details.carbonOffset}</p>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                          <span className="font-mono text-[9px] text-slate-450 block font-bold uppercase">COMMUNITY DIVIDEND</span>
                          <p className="text-[10px] text-slate-700 leading-tight font-medium">{selectedAlt.details.communityBenefit}</p>
                        </div>
                      </div>

                      {/* Interactive Community Impact Calculator */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3.5">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-mono text-emerald-800 font-black block uppercase tracking-wider">
                              Interactive Eco & Community Impact Calculator
                            </span>
                            <span className="text-[9px] text-slate-450 font-medium block">
                              Slide to project your group's local contribution!
                            </span>
                          </div>
                          <div className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-mono font-bold text-xs">
                            {groupSize} Travelers
                          </div>
                        </div>

                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={groupSize} 
                          onChange={(e) => setGroupSize(parseInt(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                        />

                        {/* Calculations outputs */}
                        <div className="grid grid-cols-3 gap-2 text-center pt-2">
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100/50">
                            <span className="text-[8px] font-mono text-slate-400 block font-bold uppercase">TUK-TUK INCOME</span>
                            <span className="text-sm font-black text-emerald-600 block mt-0.5">
                              ${(groupSize * selectedAlt.communityImpact.localTransport).toFixed(0)}
                            </span>
                          </div>
                          
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100/50">
                            <span className="text-[8px] font-mono text-slate-400 block font-bold uppercase">HOMESTAY INCOME</span>
                            <span className="text-sm font-black text-emerald-600 block mt-0.5">
                              ${(groupSize * selectedAlt.communityImpact.homestays).toFixed(0)}
                            </span>
                          </div>
                          
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100/50">
                            <span className="text-[8px] font-mono text-slate-400 block font-bold uppercase">HERITAGE FOOTSTEPS RELIEVED</span>
                            <span className="text-sm font-black text-forest-green block mt-0.5">
                              {(groupSize * selectedAlt.communityImpact.footsteps).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: TRAVELER GUIDE */}
                  {modalTab === "guide" && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      
                      {/* Comparison Details Grid */}
                      <div className="grid grid-cols-2 gap-3.5">
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-slate-650 font-bold">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            <span>Timing & Fees</span>
                          </div>
                          <div className="space-y-1.5 font-medium text-slate-600">
                            <div>
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">BEST VISIT HOUR</span>
                              <span className="text-slate-800">{selectedAlt.bestTimeToVisit}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">ENTRY COST COMPARISON</span>
                              <span className="text-slate-800">{selectedAlt.entryFee}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-slate-650 font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Access & Rules</span>
                          </div>
                          <div className="space-y-1.5 font-medium text-slate-600">
                            <div>
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">ACTIVITY & CLIMB DIFFICULTY</span>
                              <span className="text-slate-800">{selectedAlt.activityLevel}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">DRESS PROTOCOLS</span>
                              <span className="text-slate-800">{selectedAlt.dressCode}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Interactive Actions block */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
                            Interactive Traveler Tools
                          </span>
                          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                            Live API Simulators
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          
                          {/* Live Traffic Check button */}
                          <button
                            onClick={handleCheckTraffic}
                            disabled={isTrafficLoading}
                            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                          >
                            <Car className={`w-3.5 h-3.5 ${isTrafficLoading ? "animate-bounce" : ""}`} />
                            {isTrafficLoading ? "Querying Routes..." : "Check Route Traffic"}
                          </button>

                          {/* Directions copy button */}
                          <button
                            onClick={() => handleCopyDirections(selectedAlt.howToGetThere)}
                            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                          >
                            {copySuccess ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-300" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Directions
                              </>
                            )}
                          </button>

                        </div>

                        {/* Traffic response text */}
                        {trafficStatus && (
                          <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-950 font-mono text-2xs rounded-xl leading-relaxed animate-fade-in flex items-start gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-650 shrink-0 mt-0.5" />
                            <span>{trafficStatus}</span>
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* Subtext tips */}
                <div className="flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed border-t border-slate-200/60 pt-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-slate-700">Sustainable Tip:</span> {selectedAlt.benefit}
                  </p>
                </div>

              </div>

            </div>

          </div>
          
        </div>
      )}

    </div>
  );
}
