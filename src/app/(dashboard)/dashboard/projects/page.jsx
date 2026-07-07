"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Chip } from "@heroui/react";
import { 
  FolderPlus, 
  Layers, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Search,
  LayoutGrid
} from "lucide-react";

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // ২. ডাটাবেজ থেকে Regex সার্চ কুয়েরি অনুযায়ী প্রজেক্ট ফেচ করা
  // =========================================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // সার্চকুয়েরি যদি থাকে তবে URL-এ query parameter হিসেবে পাঠানো হচ্ছে
        const url = searchQuery 
          ? `http://localhost:5000/api/projects?search=${encodeURIComponent(searchQuery)}`
          : "http://localhost:5000/api/projects";

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setProjects(data.projects);
        } else {
          console.error("Failed to load projects from DB");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // একটি Debounce লজিক দিলে ভালো হতো, তবে আপাতত ইউজার টাইপ করার সাথে সাথে রিয়েল-টাইমে রিকোয়েস্ট যাবে
    fetchProjects();
  }, [searchQuery]); // এখানে searchQuery ডিফেন্ডেন্সি দেওয়াতে প্রতিবার টাইপ করলেই useEffect রান হবে

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 text-left px-4">
      
      {/* ========================================================= */}
      {/* ১. হেডার ও সার্চ বার সেকশন */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider/50 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" /> My Workspace
          </h1>
          <p className="text-xs sm:text-sm text-default-400 mt-1">
            Access, modify, and revisit all your AI-generated software blueprints.
          </p>
        </div>

        <Link href="/create-project">
          <Button 
            color="primary" 
            radius="xl"
            className="font-semibold shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-indigo-600 px-6 w-full sm:w-auto"
            endContent={<FolderPlus className="h-4 w-4" />}
          >
            New Project
          </Button>
        </Link>
      </div>

      {/* সার্চ ইনপুট ফিল্ড (প্রজেক্ট থাকুক বা না থাকুক, সার্চবার সব সময় উপরে থাকবে) */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-default-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project name or category..."
          className="w-full bg-default-100/50 border border-divider/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
        />
      </div>

      {/* লোডিং স্টেট হ্যান্ডলিং */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-default-400 font-medium">Searching database...</p>
        </div>
      ) : projects.length === 0 ? (
        // যদি ডাটাবেজ একদম ফাঁকা থাকে অথবা সার্চে কোনো কিছু না মেলে
        <div className="min-h-[35vh] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-divider/60 rounded-3xl max-w-2xl mx-auto space-y-4 bg-background/20 backdrop-blur-sm">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-lg font-bold text-foreground">
              {searchQuery ? "No Match Found" : "No Blueprints Found"}
            </h3>
            <p className="text-xs text-default-400 leading-relaxed">
              {searchQuery 
                ? "We couldn't find any projects matching your search criteria. Try checking your spelling or search for something else."
                : "You haven't generated any software projects yet. Click below to launch the AI wizard."}
            </p>
          </div>
          {!searchQuery && (
            <Link href="/create-project" className="pt-2">
              <Button color="primary" radius="xl" size="sm" className="font-semibold px-5">
                Create Your First Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project._id} 
              className="border border-divider/50 bg-background/40 hover:bg-background/60 backdrop-blur-md p-5 flex flex-col justify-between h-[230px] group transition-all duration-300 hover:border-primary/40 hover:-translate-y-1" 
              radius="2xl"
            >
              {/* কার্ডের উপরের অংশ */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary tracking-wide bg-primary/10 px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                    <Layers className="h-2.5 w-2.5" /> {project.category}
                  </span>
                  <span className="text-[11px] text-default-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Recent
                  </span>
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {project.projectName}
                  </h3>
                  <p className="text-xs text-default-400 line-clamp-3 mt-1 leading-relaxed">
                    {project.blueprint?.overview || `Target Users: ${project.targetUsers}`}
                  </p>
                </div>
              </div>

              {/* কার্ডের নিচের অংশ: টেক স্ট্যাক এবং অ্যাকশন বাটন */}
              <div className="flex items-center justify-between border-t border-divider/40 pt-3 mt-auto">
                <div className="flex gap-1 overflow-hidden max-w-[65%]">
                  {project.selectedTech && project.selectedTech.slice(0, 3).map((tech) => (
                    <Chip key={tech} size="sm" variant="flat" className="bg-default-100/80 text-default-500 text-[10px] h-6 px-1.5 font-medium shrink-0">
                      {tech}
                    </Chip>
                  ))}
                </div>

                <Link href={`/dashboard/projects/${project._id}`}>
                  <Button 
                    isIconOnly 
                    size="sm" 
                    radius="full" 
                    variant="flat"
                    className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}