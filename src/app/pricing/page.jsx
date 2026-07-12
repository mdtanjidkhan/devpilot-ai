"use client";

import { authClient } from "@/lib/auth-client"; 
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleAction = (planName) => {
    if (planName === "Enterprise") return;
    if (session?.user) {
      router.push("/dashboard/settings");
    } else {
      router.push("/login");
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Perfect for testing out raw developer blueprints and single modules.",
      features: [
        "3 AI Project Plans per month",
        "Basic Database Schema Design",
        "Markdown Export (.md)",
        "24-hour Project History retention",
      ],
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      desc: "For full-stack developers who need infinite structural architectures.",
      features: [
        "Unlimited AI Architect Blueprinting",
        "Advanced API Blueprint Design",
        "Full MongoDB & SQL Modeling",
        "Lifetime Project History Access",
        "Priority AI Regeneration speed",
        "Exclusive Modern Dashboard tools",
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "coming soon",
      desc: "Custom AI fine-tuning for development agencies and distributed teams.",
      features: [
        "Everything in Pro plan",
        "Custom Codebase Architecture training",
        "Team Collaboration workspaces",
        "Dedicated API limits & tokens",
      ],
      buttonText: "Future Plan",
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="max-w-6xl mx-auto py-20 px-4 space-y-14 scroll-mt-20">
      
      <div className="text-center max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Transparent, Predictable <br /> Pricing Plans
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Choose the blueprint plan that scales with your software engineering goals.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-6">
        {plans.map((plan, idx) => {
          const isEnterprise = plan.name === "Enterprise";
          
          return (
            <div
              key={idx}
              className={`group relative border rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between overflow-hidden
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:shadow-2xl
                ${plan.isPopular 
                  ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10" 
                  : isEnterprise
                    ? "border-slate-200/40 dark:border-slate-800/40 bg-white/20 dark:bg-slate-950/10 opacity-70"
                    : "border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/30 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
            >
              
              <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none bg-gradient-to-br ${
                plan.isPopular 
                  ? "from-blue-500/10 to-indigo-500/10" 
                  : "from-slate-500/5 to-transparent"
              }`} />

              {plan.isPopular && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-md animate-pulse">
                  <Sparkles className="h-2.5 w-2.5" /> Popular
                </div>
              )}

              <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 my-4 transition-transform duration-300 group-hover:scale-[1.02] origin-left">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                      /{plan.period}
                    </span>
                  </div>

                 
                  <ul className="space-y-3 text-xs sm:text-sm border-t border-slate-200/60 dark:border-slate-800/60 pt-5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          plan.isPopular ? "text-blue-500" : "text-emerald-500"
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleAction(plan.name)}
                  disabled={isEnterprise || isPending}
                  className={`w-full mt-8 font-semibold text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10
                    ${isPending ? "opacity-50 cursor-wait" : ""}
                    ${isEnterprise
                      ? "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed border border-dashed border-slate-200 dark:border-slate-800"
                      : plan.isPopular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                >
                  {isPending ? "Checking session..." : plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}