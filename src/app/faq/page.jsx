"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqList = [
    {
      q: "What is DevPilot AI?",
      a: "DevPilot AI is a next-generation software architecture platform that transforms your raw development ideas into structured, production-ready blueprints, database schemas, and folder trees instantly."
    },
    {
      q: "Does it generate code?",
      a: "It focuses primarily on full structural architecture blueprints, configuration scaffolding, boilerplate directory layouts, and production database schema models rather than raw, long-form logic files."
    },
    {
      q: "Which AI model is used?",
      a: "We utilize highly advanced and fine-tuned large language models optimized specifically for complex technical scaffolding, logical dependency mapping, and software engineering planning."
    },
    {
      q: "Can I export README?",
      a: "Absolutely! Every architectural specification tree, API design, and database schema can be downloaded seamlessly as standard, beautifully formatted Markdown (.md) or README files with a single click."
    },
    {
      q: "Is there a free plan?",
      a: "Yes, our Free plan includes up to 3 comprehensive AI project blueprint generations per month with standard database schema design, markdown exports, and 24-hour project history retention."
    },
    {
      q: "Can I regenerate only one section?",
      a: "Yes! Our engine supports modular AI regeneration. You can tweak or update specific database fields, API routes, or features list without affecting or destroying the rest of your architecture tree."
    }
  ];

  return (
    
    <section id="faq" className="max-w-4xl mx-auto py-20 px-4 space-y-12 scroll-mt-20">
      
      <div className="text-center max-w-2xl mx-auto space-y-4 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
          Have Questions?
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Got questions about DevPilot AI architecture engine? Find your answers right here.
        </p>
      </div>
      <div className="space-y-4">
        {faqList.map((faq, idx) => {
          const isOpen = openIndex === idx;
          
          return (
            <div
              key={idx}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md
                ${isOpen 
                  ? "border-blue-500/50 dark:border-blue-400/40 bg-white dark:bg-slate-900 shadow-md" 
                  : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-800"
                }`}
            >
          
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors duration-300 select-none"
              >
                <div className="flex items-center gap-3 pr-4">
                  <HelpCircle className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`} />
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out font-sans ${
                  isOpen ? "max-h-[500px] border-t border-slate-100 dark:border-slate-800/60" : "max-h-0 pointer-events-none"
                }`}
              >
                <div className="p-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/10 animate-in fade-in duration-300">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}