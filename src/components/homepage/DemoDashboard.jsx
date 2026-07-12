"use client";

import { useState } from "react";
import { 
  Folder, 
  History, 
  Layers, 
  Database, 
  Network, 
  FolderTree, 
  Sparkles,
  ChevronRight,
  Code2
} from "lucide-react";

export default function DemoDashboard() {
  const [activeTab, setActiveTab] = useState("schema");

  const historyProjects = [
    { name: "Job Tracker Pro", date: "2 hours ago" },
    { name: "KinKeeper App", date: "1 day ago" },
    { name: "E-Commerce Core", date: "3 days ago" }
  ];

  const tabContent = {
    features: {
      title: "Core Product Features",
      code: `# Core Functional Scope

1. User Authentication
   - Email/Password login via Better Auth
   - Session tracking & security route guards

2. Workspace Management
   - Create, rename, and modularly regenerate blueprints
   - Export specifications tree to Markdown`
    },
    schema: {
      title: "Database Schema (MongoDB)",
      code: `// models/User.js
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['admin', 'developer'], default: 'developer' },
  createdAt: { type: Date, default: Date.now }
});`
    },
    apis: {
      title: "RESTful API Blueprint",
      code: `// GET /api/v1/blueprints
export async function GET(req) {
  const session = await authClient.getSession(req);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  const blueprints = await db.blueprints.find({ userId: session.user.id });
  return Response.json({ success: true, data: blueprints });
}`
    },
    structure: {
      title: "Project Directory Tree",
      code: `📁 my-awesome-app/
├── 📁 app/
│   ├── 📁 api/
│   │   └── 📁 blueprints/
│   │       └── route.js
│   ├── 📁 dashboard/
│   │   └── page.jsx
│   └── page.jsx
├── 📁 components/
└── 📁 models/`
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-20 px-4 space-y-12 bg-transparent">
      
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          Interactive Live Preview
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Experience the Powerful Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Interact with the live mock UI below to see how seamlessly DevPilot AI organizes blueprints, histories, and code architectures.
        </p>
      </div>

      <div className="w-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
        
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 p-4 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            
            <div className="flex items-center gap-2 px-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Active Workspace
              </span>
            </div>

           
            <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm">
              <Folder className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">Job Application Tracker</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Next.js + Express</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2 mb-2">
                Blueprint Trees
              </span>
              
              <button 
                onClick={() => setActiveTab("features")}
                className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "features" 
                    ? "bg-blue-600 text-white dark:bg-blue-500/10 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2"><Layers className="h-3.5 w-3.5" /> Features</div>
                <ChevronRight className="h-3 w-3 opacity-50" />
              </button>

              <button 
                onClick={() => setActiveTab("schema")}
                className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "schema" 
                    ? "bg-blue-600 text-white dark:bg-blue-500/10 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2"><Database className="h-3.5 w-3.5" /> DB Schema</div>
                <ChevronRight className="h-3 w-3 opacity-50" />
              </button>

              <button 
                onClick={() => setActiveTab("apis")}
                className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "apis" 
                    ? "bg-blue-600 text-white dark:bg-blue-500/10 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2"><Network className="h-3.5 w-3.5" /> REST APIs</div>
                <ChevronRight className="h-3 w-3 opacity-50" />
              </button>

              <button 
                onClick={() => setActiveTab("structure")}
                className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "structure" 
                    ? "bg-blue-600 text-white dark:bg-blue-500/10 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2"><FolderTree className="h-3.5 w-3.5" /> Folder Tree</div>
                <ChevronRight className="h-3 w-3 opacity-50" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 hidden lg:block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-2 px-1">
              <History className="h-3 w-3" /> Recent History
            </span>
            <div className="space-y-1">
              {historyProjects.map((item, i) => (
                <div key={i} className="px-2 py-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-900 cursor-pointer transition-colors">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{item.name}</p>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        <div className="lg:col-span-9 flex flex-col bg-white dark:bg-slate-950">
          
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {tabContent[activeTab].title}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-800" />
            </div>
          </div>

         
          <div className="p-5 flex-1 font-mono text-xs overflow-x-auto bg-slate-50/50 dark:bg-slate-900/10 min-h-[350px] lg:min-h-0">
            <pre className="text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre animate-in fade-in duration-200">
              <code>{tabContent[activeTab].code}</code>
            </pre>
          </div>
        
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-yellow-500 dark:text-yellow-400 animate-spin" /> Ready for engineering hand-off
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">Tokens used: 1.2k</span>
          </div>

        </div>

      </div>

    </section>
  );
}