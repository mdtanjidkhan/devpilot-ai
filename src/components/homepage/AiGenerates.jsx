"use client";

import { 
  Layers, 
  Users, 
  Database, 
  Network, 
  FolderTree, 
  Layout, 
  Calendar, 
  FileText 
} from "lucide-react";

export default function AiGenerates() {
  // 
  const aiOutputs = [
    { 
      name: "Features", 
      desc: "Detailed breakdown of core product capabilities and scope.", 
      icon: Layers, 
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10" 
    },
    { 
      name: "User Roles", 
      desc: "Access control, user personas, and permission matrix.", 
      icon: Users, 
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10" 
    },
    { 
      name: "Database Schema", 
      desc: "Production-ready MongoDB collection structures and types.", 
      icon: Database, 
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
    },
    { 
      name: "REST APIs", 
      desc: "Complete architectural layout of backend endpoints.", 
      icon: Network, 
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10" 
    },
    { 
      name: "Folder Structure", 
      desc: "Standard Next.js and Express modular directory trees.", 
      icon: FolderTree, 
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10" 
    },
    { 
      name: "UI Pages", 
      desc: "Wireframe guides and dashboard interface routing schemas.", 
      icon: Layout, 
      color: "text-pink-600 dark:text-pink-400 bg-pink-500/10" 
    },
    { 
      name: "Development Roadmap", 
      desc: "Step-by-step phased development milestones and tasks.", 
      icon: Calendar, 
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10" 
    },
    { 
      name: "README.md", 
      desc: "Deployment-ready comprehensive documentation setup.", 
      icon: FileText, 
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10" 
    },
  ];

  return (
    <section className="max-w-6xl mx-auto py-16 px-4 space-y-12 bg-transparent">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
          Architect Engine Outputs
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Comprehensive Modular Blueprints
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          DevPilot AI acts as your Senior Software Architect. Each section is independent, meaning you can regenerate individual units without damaging the rest of your specification tree.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiOutputs.map((output, idx) => {
          const Icon = output.icon;
          return (
            <div 
              key={idx} 
              className="border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/40 backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-primary/5 group"
            >
              <div className="space-y-4">
                <div className={`p-2.5 w-fit rounded-xl transition-transform duration-300 group-hover:scale-110 ${output.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {output.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {output.desc}
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