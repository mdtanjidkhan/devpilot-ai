'use client';

import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-slate-950 px-6 py-12 text-center antialiased transition-colors duration-200">
      <div className="relative flex flex-col items-center max-w-md w-full">
        
        {/* Glowing Gradient Background Behind Icon (Only visible in dark mode) */}
        <div className="absolute -top-12 h-36 w-36 rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-3xl" />

        {/* Dynamic Animated Warning Icon */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 shadow-md dark:bg-slate-900 dark:border-slate-800 text-blue-600 dark:text-blue-500 shadow-xl animate-bounce">
          <AlertTriangle className="h-10 w-10" />
        </div>

        {/* 404 Heading */}
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-500 dark:via-indigo-400 dark:to-purple-500 bg-clip-text text-8xl font-black tracking-tight text-transparent sm:text-9xl">
          404
        </h1>

        {/* Error Messages */}
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
          This page could not be found
        </h2>
        
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Call to Action Button */}
        <div className="mt-8 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}