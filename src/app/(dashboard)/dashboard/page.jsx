"use client";

import { useState } from "react";
import { Card, Button, Chip } from "@heroui/react";
import { 
  FolderPlus, 
  Layers, 
  Cpu, 
  Clock, 
  ArrowUpRight, 
  Code2, 
  Database, 
  LayoutGrid 
} from "lucide-react";

export default function DashboardPage() {
  const user = {
    name: "Md Tanzid Hasan",
  };

  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "KinKeeper AI",
      description: "Next.js core structure and family tree database schema generated from Figma designs.",
      tech: ["Next.js", "PostgreSQL", "Tailwind CSS"],
      updatedAt: "2 hours ago"
    },
    {
      id: "2",
      name: "Resume Builder Pro",
      description: "Interactive portfolio and professional resume generation module architecture.",
      tech: ["React", "Node.js", "MongoDB"],
      updatedAt: "2 days ago"
    },
    {
      id: "3",
      name: "Job Application Tracker",
      description: "Full-stack dashboard for tracking tech career opportunities, interviews, and stages.",
      tech: ["React", "Express", "Tailwind"],
      updatedAt: "1 week ago"
    }
  ]);

  const stats = [
    { name: "Total Projects", value: projects.length, icon: Layers, color: "text-primary bg-primary/10" },
    { name: "AI Generations", value: "24", icon: Cpu, color: "text-success bg-success/10" },
    { name: "Saved Blueprints", value: "12", icon: Code2, color: "text-warning bg-warning/10" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider/50 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, <span className="from-primary to-indigo-500 bg-gradient-to-r bg-clip-text text-transparent">{user.name.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-sm text-default-400 mt-1">
            Here is the latest blueprint summary of your AI architecture workspace.
          </p>
        </div>
        <Button 
          color="primary" 
          endContent={<FolderPlus className="h-4 w-4" />}
          className="font-medium shadow-md shadow-primary/10 bg-gradient-to-r from-primary to-indigo-600"
        >
          Create Blueprint
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-divider/50 bg-background/50 backdrop-blur-md shadow-sm p-5 flex flex-row items-center gap-4" radius="xl">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-default-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-default-500 font-medium text-sm">
          <LayoutGrid className="h-4 w-4" />
          <h2>Recent Architecture Blueprints</h2>
        </div>

        {projects.length === 0 ? (
          /* EMPTY STATE */
          <Card className="border border-dashed border-divider bg-default-50/50 text-center py-12 p-6 flex flex-col items-center justify-center gap-3" radius="xl">
            <div className="p-4 bg-default-100 rounded-full text-default-400">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No blueprints found</h3>
            <p className="text-sm text-default-400 max-w-sm">
              You haven't generated any software schemas yet. Let's build your first AI-powered folder structure!
            </p>
            <Button color="primary" variant="flat" className="mt-2 font-medium" startContent={<FolderPlus className="h-4 w-4" />}>
              Launch Pilot
            </Button>
          </Card>
        ) : (
          /* RECENT PROJECTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="border border-divider/50 bg-background/40 hover:bg-default-50/50 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col justify-between"
                radius="xl"
                isPressable
              >
                
                <div className="p-5 space-y-4 w-full text-left">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-default-400 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      <span>{project.updatedAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-default-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech.map((tech, i) => (
                      <Chip 
                        key={i} 
                        size="sm" 
                        variant="flat" 
                        className="bg-default-100/70 border border-divider/30 text-default-600 text-[10px] font-medium"
                      >
                        {tech}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                <div className="w-full border-t border-divider/40 px-5 py-3 flex items-center justify-between bg-default-50/20 rounded-b-xl">
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