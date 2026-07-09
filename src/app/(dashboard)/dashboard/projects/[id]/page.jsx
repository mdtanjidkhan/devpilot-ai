
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Chip } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  Edit3, 
  Check, 
  Layers, 
  Database, 
  Terminal, 
  ChevronRight,
  Info,
  Trash2,
  Send,
  Bot,
  User,
  Copy
} from "lucide-react";

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const chatEndRef = useRef(null);

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editSection, setEditSection] = useState(null); 
  const [tempOverview, setTempOverview] = useState("");
  const [tempFileStructure, setTempFileStructure] = useState("");
  const [tempSchema, setTempSchema] = useState("");

  // AI Generations (Chat) State
  const [generations, setGenerations] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!id) return;

    const fetchProjectAndGenerations = async () => {
      try {
        setIsLoading(true);
        
        const projectRes = await fetch(`http://localhost:5000/api/projects/${id}`);
        const projectData = await projectRes.json();

        if (projectData.success) {
          setProjectData(projectData.project);
          setTempOverview(projectData.project.blueprint?.overview || "");
          setTempFileStructure(projectData.project.blueprint?.fileStructure || "");
          setTempSchema(projectData.project.blueprint?.schemaDesign || "");
        } else {
          toast.error("Project not found!");
        }

        // ২. AI Generations (Chat History)
        const chatRes = await fetch(`http://localhost:5000/api/projects/${id}/generations`);
        const chatData = await chatRes.json();
        if (chatData.success) {
          setGenerations(chatData.generations);
        }

      } catch (error) {
        console.error("Error loading workspace data:", error);
        toast.error("Error connecting to server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndGenerations();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [generations]);

  const saveSection = async (sectionName) => {
    if (!projectData) return;

    let updatedValue = "";
    if (sectionName === "overview") updatedValue = tempOverview;
    if (sectionName === "fileStructure") updatedValue = tempFileStructure;
    if (sectionName === "schemaDesign") updatedValue = tempSchema;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionName, value: updatedValue }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedProject = { ...projectData };
        if (sectionName === "overview") updatedProject.blueprint.overview = tempOverview;
        if (sectionName === "fileStructure") updatedProject.blueprint.fileStructure = tempFileStructure;
        if (sectionName === "schemaDesign") updatedProject.blueprint.schemaDesign = tempSchema;

        setProjectData(updatedProject);
        setEditSection(null); 
        toast.success("Section updated successfully!");
      } else {
        toast.error("Failed to update: " + data.message);
      }
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Something went wrong while saving updates.");
    }
  };

 const handleSendPrompt = async (e) => {
    e.preventDefault();
    if (!newPrompt.trim() || isChatLoading) return;

    const userPrompt = newPrompt;
    setNewPrompt("");
    setIsChatLoading(true);

    let detectedType = "Full Blueprint"; 
    const lowerPrompt = userPrompt.toLowerCase();
    if (lowerPrompt.includes("schema") || lowerPrompt.includes("database") || lowerPrompt.includes("model") || lowerPrompt.includes("mongodb")) {
      detectedType = "Database";
    } else if (lowerPrompt.includes("api") || lowerPrompt.includes("route") || lowerPrompt.includes("backend") || lowerPrompt.includes("controller")) {
      detectedType = "API";
    } else if (lowerPrompt.includes("readme") || lowerPrompt.includes("documentation") || lowerPrompt.includes("doc")) {
      detectedType = "README";
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/generations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userPrompt,
          generationType: detectedType,
          user: session?.user ? { name: session.user.name, id: session.user.id } : null
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGenerations((prev) => [...prev, data.generation]);
        toast.success("AI Generation updated!");
      } else {
        toast.error(data.error || "Generation failed");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to generate AI response.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project permanently?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        toast.success("Project deleted successfully");
        router.push("/dashboard"); 
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-default-400 font-medium">Fetching workspace from database...</p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-danger font-medium">Project workspace could not be loaded.</p>
      </div>
    );
  }

  const { projectName, category, targetUsers, selectedTech, blueprint } = projectData;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-16 text-left px-4">
      <Toaster position="top-center" />
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 text-primary rounded-xl shrink-0">
            <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Interactive AI Studio</h2>
            <p className="text-xs text-default-400">Review infrastructure setup or ask DevPilot AI to append features dynamically.</p>
          </div>
        </div>
        <Button 
          color="primary"
          size="sm"
          radius="xl"
          className="font-medium bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/20 w-full sm:w-auto px-5 shrink-0"
          startContent={<Save className="h-4 w-4" />}
        >
          Save Blueprint
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">

        <div className="md:col-span-4 lg:col-span-3 space-y-6 md:sticky md:top-20">
          <Card className="border border-divider/50 bg-background/40 backdrop-blur-md p-5 space-y-5" radius="xl">
            <div>
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-md">Workspace Info</span>
              <h1 className="text-xl font-extrabold text-foreground mt-1.5 line-clamp-2">{projectName}</h1>
              <p className="text-[11px] text-default-400 mt-1 font-mono truncate">ID: {id}</p>
            </div>

            <div className="space-y-3 border-t border-divider/40 pt-4 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-default-400 font-medium shrink-0">Category:</span>
                <span className="text-foreground font-semibold text-right">{category}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-default-400 font-medium shrink-0">Target Scale:</span>
                <span className="text-foreground font-semibold text-right line-clamp-1">{targetUsers}</span>
              </div>
            </div>

            {selectedTech && selectedTech.length > 0 && (
              <div className="space-y-2 border-t border-divider/40 pt-4">
                <label className="text-xs font-semibold text-default-400 uppercase tracking-wider block">Tech Stack</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTech.map((tech) => (
                    <Chip key={tech} size="sm" variant="flat" className="bg-default-100 border border-divider/20 text-default-600 text-[10px] font-medium">
                      {tech}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 border-t border-divider/40 pt-4">
              <Button 
                color="danger"
                variant="light"
                className="w-full font-semibold border border-danger/20 hover:bg-danger/10 text-xs h-9"
                startContent={<Trash2 className="h-4 w-4" />}
                onClick={handleDelete}
              >
                Delete Blueprint
              </Button>
            </div>
          </Card>
        </div>

     
        <div className="md:col-span-8 lg:col-span-5 space-y-6">
          
          {/* Architecture Overview */}
          <Card className="border border-divider/50 bg-background/40 p-5 space-y-4" radius="xl">
            <div className="flex items-center justify-between border-b border-divider/40 pb-3 gap-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 shrink-0">
                <Info className="h-4 w-4 text-primary shrink-0" /> Architecture Overview
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                {editSection !== "overview" ? (
                  <Button size="sm" variant="flat" radius="xl" className="font-medium text-[11px] h-7 px-3" startContent={<Edit3 className="h-3 w-3" />} onClick={() => setEditSection("overview")}>Edit</Button>
                ) : (
                  <Button size="sm" color="success" radius="xl" className="font-medium text-[11px] h-7 px-3 text-white" startContent={<Check className="h-3 w-3" />} onClick={() => saveSection("overview")}>Save</Button>
                )}
              </div>
            </div>
            {editSection === "overview" ? (
              <textarea 
                value={tempOverview} 
                onChange={(e) => setTempOverview(e.target.value)}
                className="w-full bg-default-100/50 border border-divider rounded-xl p-3 text-sm focus:outline-none focus:border-primary text-foreground resize-none leading-relaxed" rows="5" 
              />
            ) : (
              <p className="text-xs sm:text-sm text-default-400 leading-relaxed whitespace-pre-line">{blueprint?.overview}</p>
            )}
          </Card>

          {/* Modules */}
          {blueprint?.modules && blueprint.modules.length > 0 && (
            <Card className="border border-divider/50 bg-background/40 p-5 space-y-4" radius="xl">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-divider/40 pb-3 shrink-0">
                <Layers className="h-4 w-4 text-primary shrink-0" /> Core Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {blueprint.modules.map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 bg-default-50 border border-divider/30 rounded-xl">
                    <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-default-500 leading-relaxed">{mod}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommended File Tree */}
          <Card className="border border-divider/50 bg-background/40 p-5 space-y-4" radius="xl">
            <div className="flex items-center justify-between border-b border-divider/40 pb-3 gap-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 shrink-0">
                <Terminal className="h-4 w-4 text-primary shrink-0" /> File Tree
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <Button isIconOnly size="sm" variant="light" radius="full" className="text-default-400 h-7 w-7" onClick={() => copyToClipboard(blueprint?.fileStructure)}><Copy className="h-3.5 w-3.5" /></Button>
                {editSection !== "fileStructure" ? (
                  <Button size="sm" variant="flat" radius="xl" className="font-medium text-[11px] h-7 px-3" startContent={<Edit3 className="h-3 w-3" />} onClick={() => setEditSection("fileStructure")}>Edit</Button>
                ) : (
                  <Button size="sm" color="success" radius="xl" className="font-medium text-[11px] h-7 px-3 text-white" startContent={<Check className="h-3 w-3" />} onClick={() => saveSection("fileStructure")}>Save</Button>
                )}
              </div>
            </div>
            {editSection === "fileStructure" ? (
              <textarea 
                value={tempFileStructure} 
                onChange={(e) => setTempFileStructure(e.target.value)}
                className="w-full bg-default-100/50 border border-divider rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary text-foreground resize-none whitespace-pre" rows="10" 
              />
            ) : (
              <pre className="bg-default-900 text-default-100 font-mono text-[11px] p-3 rounded-xl overflow-x-auto leading-relaxed border border-divider/50 whitespace-pre">
                {blueprint?.fileStructure}
              </pre>
            )}
          </Card>

          {/* Database Schema Layout */}
          <Card className="border border-divider/50 bg-background/40 p-5 space-y-4" radius="xl">
            <div className="flex items-center justify-between border-b border-divider/40 pb-3 gap-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 shrink-0">
                <Database className="h-4 w-4 text-primary shrink-0" /> DB Schema
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <Button isIconOnly size="sm" variant="light" radius="full" className="text-default-400 h-7 w-7" onClick={() => copyToClipboard(blueprint?.schemaDesign)}><Copy className="h-3.5 w-3.5" /></Button>
                {editSection !== "schemaDesign" ? (
                  <Button size="sm" variant="flat" radius="xl" className="font-medium text-[11px] h-7 px-3" startContent={<Edit3 className="h-3 w-3" />} onClick={() => setEditSection("schemaDesign")}>Edit</Button>
                ) : (
                  <Button size="sm" color="success" radius="xl" className="font-medium text-[11px] h-7 px-3 text-white" startContent={<Check className="h-3 w-3" />} onClick={() => saveSection("schemaDesign")}>Save</Button>
                )}
              </div>
            </div>
            {editSection === "schemaDesign" ? (
              <textarea 
                value={tempSchema} 
                onChange={(e) => setTempSchema(e.target.value)}
                className="w-full bg-default-100/50 border border-divider rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary text-foreground resize-none whitespace-pre" rows="10" 
              />
            ) : (
              <pre className="bg-default-900 text-default-100 font-mono text-[11px] p-3 rounded-xl overflow-x-auto leading-relaxed border border-divider/50 whitespace-pre">
                {blueprint?.schemaDesign}
              </pre>
            )}
          </Card>

        </div>
        {/* devpilt -ai promt chart */}
        <div className="md:col-span-12 lg:col-span-4 h-[550px] lg:h-[75vh] lg:sticky lg:top-20 flex flex-col">
          <Card className="border border-divider/50 bg-background/40 backdrop-blur-md flex-1 flex flex-col overflow-hidden" radius="xl">
            
            <div className="p-4 border-b border-divider/40 bg-default-50/50 flex items-center gap-2 shrink-0">
              <Bot className="h-4 w-4 text-primary shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">DevPilot Copilot</h3>
                <p className="text-[10px] text-default-400">Modify framework stack or expand features</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-default-50/20">
              {generations.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-default-400 space-y-2">
                  <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                  <p className="text-xs font-medium">No custom generations yet.</p>
                  <p className="text-[11px] max-w-xs text-default-400/80">Type below to request schema upgrades, module add-ons, or custom setup files.</p>
                </div>
              )}
              
              {generations.map((gen, idx) => (
                <div key={gen._id || idx} className="space-y-3">
                  <div className="flex gap-2 items-start justify-end">
                    <div className="bg-black text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm break-words">
                      {gen.prompt}
                    </div>
                    <div className="p-1.5 bg-primary/20 text-primary rounded-lg shrink-0"><User className="h-3 w-3" /></div>
                  </div>

             
                  <div className="flex gap-2 items-start">
                    <div className="p-1.5 bg-default-200 text-default-700 rounded-lg shrink-0"><Bot className="h-3 w-3" /></div>
                    <div className="bg-default-100/80 border border-divider/50 text-foreground text-xs px-3 py-2 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm relative group flex-1">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        radius="full" 
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 z-10" 
                        onClick={() => copyToClipboard(gen.generatedOutput)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <div className="whitespace-pre-line leading-relaxed font-sans overflow-x-auto max-w-full break-words pr-4">
                        {gen.generatedOutput}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex gap-2 items-start">
                  <div className="p-1.5 bg-default-200 text-default-700 rounded-lg shrink-0"><Bot className="h-3 w-3 animate-spin" /></div>
                  <div className="bg-default-100 text-default-400 text-xs px-3 py-2 rounded-2xl rounded-tl-none animate-pulse">
                    Thinking and generating logic...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendPrompt} className="p-3 border-t border-divider/40 bg-background/50 flex gap-2 shrink-0 items-center">
              <input 
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Ask AI to write code or modify modules..."
                className="flex-1 bg-default-100 border border-divider/50 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary text-foreground transition-colors"
                disabled={isChatLoading}
              />
              <Button 
                type="submit" 
                isIconOnly 
                color="primary" 
                radius="xl" 
                size="sm"
                className="bg-gradient-to-r from-primary to-indigo-600 shadow-md shadow-primary/20 shrink-0"
                isDisabled={!newPrompt.trim() || isChatLoading}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>

          </Card>
        </div>

      </div>
    </div>
  );
}