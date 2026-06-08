import React from "react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Cpu, 
  Terminal, 
  Shield, 
  Award,
  Layers
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  focus: string;
  bio: string;
  avatarLetter: string;
  avatarColor: string;
  icon: React.ReactNode;
}

export default function MeetTheTeam() {
  const leader: TeamMember = {
    name: "Nimnadi",
    role: "Product Visionary & Research Lead",
    focus: "Global Telemetry Systems & Framework Design",
    bio: "Discovered and analyzed global telemetry systems, competitive gaps, and laid the conceptual framework for Crowd Whisper's overtourism mitigation loop.",
    avatarLetter: "N",
    avatarColor: "from-[#00C4B4] to-[#0A3D2B]",
    icon: <Award className="w-5 h-5 text-[#00C4B4]" />
  };

  const engineeringTeam: TeamMember[] = [
    {
      name: "Ginura",
      role: "Lead Systems Architect",
      focus: "MERN Architecture & API Integration",
      bio: "Engineers the core pipeline architecture, connecting robust Express servers to MongoDB databases and dynamic frontend maps.",
      avatarLetter: "G",
      avatarColor: "from-[#00C4B4] to-[#1A2521]",
      icon: <Layers className="w-4 h-4 text-[#00C4B4]" />
    },
    {
      name: "Kaveesha",
      role: "Backend Engineer",
      focus: "Express.js Routing & Data Scaling",
      bio: "Optimizes Routes API v2 traffic proxy controllers and implements Exponential Moving Average (EMA) pipeline smoothing algorithms.",
      avatarLetter: "K",
      avatarColor: "from-[#00C4B4] to-[#0A3D2B]",
      icon: <Terminal className="w-4 h-4 text-[#00C4B4]" />
    },
    {
      name: "Himandhi",
      role: "Frontend Developer",
      focus: "React UI & Route Visualization",
      bio: "Creates responsive, high-fidelity Leaflet routing layouts and telemetry dashboards matching SaaS engineering standards.",
      avatarLetter: "H",
      avatarColor: "from-[#00C4B4] to-[#1A2521]",
      icon: <Cpu className="w-4 h-4 text-[#00C4B4]" />
    },
    {
      name: "Anuga",
      role: "QA & Infrastructure",
      focus: "Proxy Metrics Validation & Polling Logic",
      bio: "Validates routing stability indices, automates endpoint pressure checks, and configures local sandbox telemetry mocks.",
      avatarLetter: "A",
      avatarColor: "from-[#00C4B4] to-[#0A3D2B]",
      icon: <Shield className="w-4 h-4 text-[#00C4B4]" />
    }
  ];

  return (
    <div className="bg-[#0A2018] text-[#F8F5F0] rounded-[32px] p-8 lg:p-12 border border-[#00C4B4]/25 shadow-2xl relative overflow-hidden flex flex-col items-center space-y-12">
      
      {/* Background radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00C4B4]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="text-center space-y-3 relative z-10 max-w-2xl">
        <span className="text-sm font-mono font-bold text-[#00C4B4] tracking-widest uppercase">
          Human Resource Architecture
        </span>
        <h2 className="text-3xl lg:text-5xl font-display font-black tracking-tight leading-tight">
          Meet the Innovation Team
        </h2>
        <p className="text-base text-slate-350 leading-relaxed font-medium">
          The engineering minds and product strategists behind Crowd Whisper's sustainable telemetry routing engine.
        </p>
      </div>

      {/* ROW 1: Lead Centered Profile */}
      <div className="w-full flex justify-center relative z-10">
        <div className="bg-[#102B22]/80 border-2 border-[#00C4B4]/40 hover:border-[#00C4B4] rounded-[24px] p-6 lg:p-8 max-w-lg w-full transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[#00C4B4]/5 text-center flex flex-col items-center space-y-4 relative group">
          <div className="absolute top-4 right-4 bg-[#00C4B4]/10 border border-[#00C4B4]/30 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-[#00C4B4] uppercase tracking-wider">
            Project Lead
          </div>
          
          {/* Avatar Area */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${leader.avatarColor} flex items-center justify-center text-3xl font-black text-white shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-300`}>
              {leader.avatarLetter}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#0A2018] border border-[#00C4B4]/40 p-2 rounded-full shadow-md">
              {leader.icon}
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-bold tracking-tight text-white">{leader.name}</h3>
            <span className="text-sm font-mono font-bold text-[#00C4B4] block uppercase tracking-wider">
              {leader.role}
            </span>
            <span className="text-xs text-slate-400 font-medium block">
              {leader.focus}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md font-medium">
            {leader.bio}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-1.5 bg-white/5 hover:bg-[#00C4B4]/10 rounded-lg text-slate-400 hover:text-white border border-white/5 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-white/5 hover:bg-[#00C4B4]/10 rounded-lg text-slate-400 hover:text-white border border-white/5 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-white/5 hover:bg-[#00C4B4]/10 rounded-lg text-slate-400 hover:text-white border border-white/5 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ROW 2: Core Engineering Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full relative z-10">
        {engineeringTeam.map((member, idx) => (
          <div 
            key={idx}
            className="bg-[#102B22]/40 hover:bg-[#102B22]/80 border border-[#00C4B4]/20 hover:border-[#00C4B4]/65 rounded-[20px] p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-[#00C4B4]/5 flex flex-col justify-between items-center text-center space-y-4 group relative"
          >
            <div className="absolute top-3 right-3 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-450">
              ENG_0{idx + 1}
            </div>

            <div className="flex flex-col items-center space-y-3.5 pt-2">
              {/* Avatar placeholder */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center text-xl font-black text-white border border-white/5 group-hover:scale-105 transition-transform duration-300`}>
                  {member.avatarLetter}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#0A2018] border border-[#00C4B4]/20 p-1.5 rounded-full">
                  {member.icon}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-white tracking-tight">{member.name}</h4>
                <span className="text-xs font-mono font-bold text-[#00C4B4] block uppercase tracking-wide">
                  {member.role}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">
                  {member.focus}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {member.bio}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-2.5 border-t border-white/5 w-full justify-center">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
