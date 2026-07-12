"use client";

import { MessageSquareCode, Sparkles, Binary, FileCheck, ArrowRight, ArrowDown } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Describe Your Idea",
      desc: "Input your raw app concept, tech preferences, or features list into the AI prompt.",
      icon: MessageSquareCode,
      color: "from-blue-600 to-cyan-500 text-blue-600 dark:text-blue-400 bg-blue-500/10"
    },
    {
      num: "02",
      title: "AI Analyzes Project",
      desc: "DevPilot AI processes the scope, structure, requirements, and tech stack options.",
      icon: Sparkles,
      color: "from-purple-600 to-pink-500 text-purple-600 dark:text-purple-400 bg-purple-500/10"
    },
    {
      num: "03",
      title: "Generate Blueprint",
      desc: "Get independent, production-ready modules, DB schemas, and full directory trees.",
      icon: Binary,
      color: "from-emerald-600 to-teal-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
    },
    {
      num: "04",
      title: "Save & Export",
      desc: "Review your structured history dashboard and instantly export everything as Markdown.",
      icon: FileCheck,
      color: "from-orange-600 to-amber-500 text-orange-600 dark:text-orange-400 bg-orange-500/10"
    }
  ];

  return (
    <section id="roadmap" className="max-w-6xl mx-auto py-20 px-4 space-y-16 scroll-mt-20">
      
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
          Workflow Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          How DevPilot AI Works
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          From a simple text thought to a robust, modular architectural specification tree in 4 clear phases.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        
        <div className="absolute top-1/4 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-800 hidden lg:block -z-10" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left group relative space-y-4">
              
              <div className="flex items-center justify-between w-full max-w-[240px] lg:max-w-none px-4 lg:px-0">
                <div className={`p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 group-hover:scale-110 shadow-sm ${step.color.split(" ")[1]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-3xl font-mono font-black bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-800 dark:to-slate-900 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  {step.num}
                </span>
              </div>
              <div className="space-y-2 max-w-[280px] lg:max-w-none">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {idx < 3 && (
                <div className="flex lg:hidden pt-4 text-slate-300 dark:text-slate-800">
                  <ArrowDown className="h-5 w-5 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}