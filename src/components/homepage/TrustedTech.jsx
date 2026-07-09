"use client";

import { Cpu, Terminal, Database, ShieldCheck, Layers, Sparkles } from "lucide-react";

export default function TrustedTech() {
  const techStack = [
    { 
      name: "Next.js", 
      icon: Terminal, 
      badgeStyle: "text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-400 dark:hover:border-slate-600" 
    },
    { 
      name: "Express.js", 
      icon: Cpu, 
      badgeStyle: "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-400 dark:hover:border-slate-600" 
    },
    { 
      name: "MongoDB", 
      icon: Database, 
      badgeStyle: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-950/30 bg-emerald-50/30 dark:bg-emerald-950/20 hover:border-emerald-400 dark:hover:border-emerald-700" 
    },
    { 
      name: "Gemini AI", 
      icon: Sparkles, 
      badgeStyle: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-950/30 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-400 dark:hover:border-blue-700" 
    },
    { 
      name: "Better Auth", 
      icon: ShieldCheck, 
      badgeStyle: "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-950/30 bg-orange-50/30 dark:bg-orange-950/20 hover:border-orange-400 dark:hover:border-orange-700" 
    },
    { 
      name: "Tailwind CSS", 
      icon: Layers, 
      badgeStyle: "text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-950/30 bg-cyan-50/30 dark:bg-cyan-950/20 hover:border-cyan-400 dark:hover:border-cyan-700" 
    }
  ];

  return (
    <section className="max-w-6xl mx-auto py-8 px-4">
      <div className="py-8 border-t border-b border-slate-200/60 dark:border-slate-800/60">
    
        <p className="text-center text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">
          Engineered Architecture Specs Backed By
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-mono font-semibold tracking-wide backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] shadow-sm group ${tech.badgeStyle}`}
              >
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>{tech.name}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}