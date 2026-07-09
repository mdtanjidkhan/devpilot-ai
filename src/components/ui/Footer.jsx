"use client";

// npm i react-icons ইনস্টল করা থাকতে হবে
import { FaSquareGithub, FaLinkedin } from "react-icons/fa6"; 
import { Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold tracking-tight">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                <Terminal className="h-4 w-4" />
              </div>
              <span>DevPilot AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              The Next-Gen AI Software Architect Platform. Convert your raw development ideas into comprehensive structural blueprints instantly.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#roadmap" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#docs" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#changelog" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pricing
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#plans" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Plans
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#support" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#email" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            © {currentYear} DevPilot AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FaSquareGithub className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}