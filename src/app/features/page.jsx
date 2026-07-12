"use client";

import { 
  BrainCircuit, 
  Cpu, 
  Code2, 
  Database, 
  FileDown, 
  History, 
  RefreshCw, 
  LayoutDashboard 
} from "lucide-react";

export default function Features() {
  const featureList = [
    {
      title: "AI Project Planning",
      desc: "Turn raw ideas into solid project scope, defining modules and initial structure instantly.",
      icon: BrainCircuit,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20",
      delay: "animation-delay-100" 
    },
    {
      title: "Smart Architecture",
      desc: "Generate full software blueprints, tailored component layouts, and production tactics.",
      icon: Cpu,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 group-hover:bg-purple-500/20",
      delay: "animation-delay-200"
    },
    {
      title: "API Design",
      desc: "Plan clean, scalable RESTful API endpoints with structured request/response examples.",
      icon: Code2,
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 group-hover:bg-cyan-500/20",
      delay: "animation-delay-300"
    },
    {
      title: "Database Design",
      desc: "Model production-ready MongoDB structures, data types, and implicit relationship maps.",
      icon: Database,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20",
      delay: "animation-delay-400"
    },
    {
      title: "Markdown Export",
      desc: "Download all generated blueprints into standard Markdown format with a single click.",
      icon: FileDown,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20",
      delay: "animation-delay-100"
    },
    {
      title: "Project History",
      desc: "Never lose a blueprint. Access, review, and manage all your past AI architectures anytime.",
      icon: History,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 group-hover:bg-indigo-500/20",
      delay: "animation-delay-200"
    },
    {
      title: "AI Regeneration",
      desc: "Refine specifications modularly. Tweak individual sections without ruining the full tree.",
      icon: RefreshCw,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 group-hover:bg-rose-500/20",
      delay: "animation-delay-300"
    },
    {
      title: "Modern Dashboard",
      desc: "Track software designs, browse outputs, and manage tokens via a seamless, dark-mode interface.",
      icon: LayoutDashboard,
      color: "text-pink-600 dark:text-pink-400 bg-pink-500/10 group-hover:bg-pink-500/20",
      delay: "animation-delay-400"
    }
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto py-20 px-4 space-y-14 scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 transition-all duration-700 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Everything You Need to <br className="hidden sm:inline" />
          Blueprint Your App
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Skip the guesswork. Our AI architect engine delivers comprehensive technical breakdowns, scaffolding, and structural planning within seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {featureList.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div 
              key={idx} 
              className={`group relative border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/30 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between overflow-hidden
                transition-all duration-500 ease-out
                hover:-translate-y-1 hover:border-blue-500/50 dark:hover:border-blue-400/50
                hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-indigo-500/5
                animate-in fade-in slide-in-from-bottom-8 duration-700 ${feature.delay}`}
            >
        
              <div className="absolute -inset-px bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className={`p-3 w-fit rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${feature.color}`}>
                  <Icon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[15deg]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}