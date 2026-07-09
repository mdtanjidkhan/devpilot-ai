"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowRight, Sparkles, Play, Terminal } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <section className="relative max-w-6xl mx-auto pt-16 md:pt-24 pb-12 px-4 overflow-hidden bg-transparent">
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] md:blur-[120px] pointer-events-none rounded-full" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-mono">
            <Terminal className="h-3.5 w-3.5" />
            <span>v1.0.0 • AI Software Architect</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-slate-900 dark:text-slate-50">
            Plan Your Next <br className="hidden sm:inline" />
            Software Project <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>

        
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Transform a simple idea into a complete software development blueprint with AI-powered architecture, database design, API planning, and documentation.
          </p>

        
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full">
            {isPending ? (
              
              <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
            ) : session?.user ? (
             
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 transition-all duration-200 text-sm"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 transition-all duration-200 text-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </Link>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium px-8 py-3.5 rounded-full transition-all duration-200 text-sm shadow-sm"
                >
                  <Play className="h-3.5 w-3.5 fill-current text-slate-600 dark:text-slate-400" />
                  Watch Demo
                </button>
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-5 relative group w-full max-w-md mx-auto lg:max-w-none">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 blur-lg opacity-70 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative border border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md p-2 rounded-2xl shadow-xl dark:shadow-2xl">
            <img
              src="https://i.ibb.co.com/1GNsg5Kf/Chat-GPT-Image-Jul-10-2026-12-03-02-AM.png" 
              alt="DevPilot AI Dashboard Mockup"
              className="rounded-xl w-full h-auto object-cover border border-slate-100 dark:border-slate-800/40"
              
            />
          </div>
        </div>

      </div>
    </section>
  );
}