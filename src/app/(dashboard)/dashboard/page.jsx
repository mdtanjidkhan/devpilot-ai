"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import { 
  FolderPlus, 
  Layers, 
  Cpu, 
  Clock, 
  ArrowUpRight, 
  Code2, 
  Database, 
  LayoutGrid,
  TrendingUp
} from "lucide-react";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]); 
  const [subscription, setSubscription] = useState(null); 
  const [dynamicStats, setDynamicStats] = useState({
    totalProjects: 0,
    totalAiGenerations: 0,
    savedBlueprints: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/dashboard/stats?userId=${session.user.id}`);
        const data = await res.json();
        
        if (data.success) {
          setProjects(data.projects || []);
          setChartData(data.chartData || []); 
          setSubscription(data.subscription || null); 
          setDynamicStats(data.stats || { totalProjects: 0, totalAiGenerations: 0, savedBlueprints: 0 });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard matrix:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session]);

  const statsConfig = [
    { name: "Total Projects", value: dynamicStats.totalProjects, icon: Layers, color: "text-blue-500 bg-blue-100" },
    { name: "AI Generations", value: dynamicStats.totalAiGenerations, icon: Cpu, color: "text-success bg-success/10" },
    { name: "Saved Blueprints", value: dynamicStats.savedBlueprints, icon: Code2, color: "text-warning bg-warning/10" },
  ];

  if (isPending || (session?.user?.id && loading)) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-4">
        <Spinner size="lg" label="Synchronizing dashboard matrix..." color="primary" />
      </div>
    );
  }

  const displayName = session?.user?.name || "Developer";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-500">
      
      {/* WELCOME SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider/50 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, <span className="from-primary to-indigo-500 bg-gradient-to-r bg-clip-text text-transparent">{firstName}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-default-400 mt-1">
            Here is the latest blueprint summary of your AI architecture workspace.
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-divider/30">
          {subscription && (
            <Chip color={subscription.plan === "Pro" ? "secondary" : "default"} variant="flat" size="sm" className="font-mono text-xs">
              Plan: {subscription.plan}
            </Chip>
          )}
          <Button 
            color="primary" 
            endContent={<FolderPlus className="h-4 w-4" />}
            className="font-medium shadow-md shadow-primary/10 bg-gradient-to-r from-primary to-indigo-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
          >
            Create Blueprint
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-divider/50 bg-background/50 backdrop-blur-md shadow-sm p-4 sm:p-5 flex flex-row items-center gap-4" radius="xl">
              <div className={`p-2.5 sm:p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-default-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-xl sm:text-2xl font-bold mt-0.5">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* NEW VISUAL CHART SECTION (Fully Mobile Responsive) */}
      <Card className="border border-divider/50 bg-background/40 backdrop-blur-md p-4 sm:p-6 w-full overflow-hidden" radius="xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-default-500 font-medium text-sm mb-6 border-b border-divider/30 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-foreground font-bold text-sm sm:text-base">AI Token Consumption Timeline</h2>
          </div>
          <p className="text-[11px] sm:text-xs text-default-400 sm:ml-6">Track your daily prompt usage over the last 7 days.</p>
        </div>
        
        {/* Responsive Container for Recharts Chart */}
        <div className="h-[200px] sm:h-[260px] w-full text-[10px] sm:text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardTokenColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0072F5" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0072F5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
              <XAxis dataKey="name" stroke="#a1a1aa" tickMargin={8} />
              <YAxis stroke="#a1a1aa" tickMargin={8} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(15, 23, 42, 0.95)", 
                  borderRadius: "12px", 
                  color: "#f8fafc",
                  fontSize: "11px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "8px 12px"
                }} 
              />
              <Area type="monotone" dataKey="tokens" stroke="#0072F5" strokeWidth={2} fillOpacity={1} fill="url(#dashboardTokenColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* PROJECTS GRID SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-default-500 font-medium text-sm">
          <LayoutGrid className="h-4 w-4" />
          <h2>Recent Architecture Blueprints</h2>
        </div>

        {projects.length === 0 ? (
          /* EMPTY STATE */
          <Card className="border border-dashed border-divider bg-default-50/50 text-center py-10 sm:py-12 p-4 sm:p-6 flex flex-col items-center justify-center gap-3" radius="xl">
            <div className="p-3 sm:p-4 bg-default-100 rounded-full text-default-400">
              <Database className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">No blueprints found</h3>
            <p className="text-xs sm:text-sm text-default-400 max-w-sm">
              You haven't generated any software schemas yet. Let's build your first AI-powered folder structure!
            </p>
            <Button color="primary" variant="flat" className="mt-2 font-medium text-xs sm:text-sm" startContent={<FolderPlus className="h-4 w-4" />}>
              Launch Pilot
            </Button>
          </Card>
        ) : (
          /* RECENT PROJECTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {projects.map((project) => (
              <Card 
                key={project._id || project.id} 
                className="border border-divider/50 bg-background/40 hover:bg-default-50/50 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col justify-between"
                radius="xl"
                isPressable
              >
                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 w-full text-left">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.projectName || project.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-default-400 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      <span>
                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-default-400 line-clamp-3 leading-relaxed">
                    {project.blueprint?.overview || `Target Users: ${project.targetUsers}`}
                  </p>
                  <p className="text-[11px] sm:text-xs text-default-400 line-clamp-2 leading-relaxed">
                    {project.description || "No description provided for this blueprint."}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {project.selectedTech && Array.isArray(project.selectedTech) ? (
                      project.selectedTech.map((tech, i) => (
                        <Chip 
                          key={i} 
                          size="sm" 
                          variant="flat" 
                          className="bg-default-100/70 border border-divider/30 text-default-600 text-[9px] sm:text-[10px] font-medium"
                        >
                          {tech}
                        </Chip>
                      ))
                    ) : (
                      <Chip size="sm" variant="flat" className="text-[10px]">General</Chip>
                    )}
                  </div>
                </div>
                
                <div className="w-full border-t border-divider/40 px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between bg-default-50/20 rounded-b-xl">
                  <span className="text-xs font-medium text-primary flex items-center gap-1">
                    Open Workspace
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-default-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}