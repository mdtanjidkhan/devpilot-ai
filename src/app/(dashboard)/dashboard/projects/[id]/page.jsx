
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Chip } from "@heroui/react";
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
  Trash2 
} from "lucide-react";

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editSection, setEditSection] = useState(null); // 'overview', 'fileStructure', 'schemaDesign'
  const [tempOverview, setTempOverview] = useState("");
  const [tempFileStructure, setTempFileStructure] = useState("");
  const [tempSchema, setTempSchema] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await response.json();

        if (data.success) {
          setProjectData(data.project);
          
          setTempOverview(data.project.blueprint?.overview || "");
          setTempFileStructure(data.project.blueprint?.fileStructure || "");
          setTempSchema(data.project.blueprint?.schemaDesign || "");
        } else {
          alert("Project not found in database!");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const saveSection = async (sectionName) => {
    if (!projectData) return;

    let updatedValue = "";
    if (sectionName === "overview") updatedValue = tempOverview;
    if (sectionName === "fileStructure") updatedValue = tempFileStructure;
    if (sectionName === "schemaDesign") updatedValue = tempSchema;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: sectionName, // 'overview', 'fileStructure',  'schemaDesign'
          value: updatedValue
        }),
      });

      const data = await response.json();
      console.log("Backend Response Data:", data);

      if (data.success) {
        const updatedProject = { ...projectData };
        if (sectionName === "overview") updatedProject.blueprint.overview = tempOverview;
        if (sectionName === "fileStructure") updatedProject.blueprint.fileStructure = tempFileStructure;
        if (sectionName === "schemaDesign") updatedProject.blueprint.schemaDesign = tempSchema;

        setProjectData(updatedProject);
        setEditSection(null); 
        alert("Section updated successfully in database!");
      } else {
        alert("Failed to update section: " + data.message);
      }
    } catch (error) {
      console.error("Error updating section:", error);
      alert("Something went wrong while saving updates.");
    }
  };

  
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project blueprint permanently?");
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        alert("Project deleted successfully!");
        router.push("/dashboard"); 
      } else {
        alert("Failed to delete project: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Something went wrong while deleting the project.");
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-default-400 font-medium">Fetching blueprint from database...</p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-danger font-medium">Project blueprint could not be loaded.</p>
      </div>
    );
  }

  const { projectName, category, targetUsers, selectedTech, blueprint } = projectData;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16 text-left">
      
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 text-primary rounded-xl shrink-0">
            <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">AI Generation Complete</h2>
            <p className="text-xs text-default-400">Review, edit, or regenerate components below before saving to your permanent workspace.</p>
          </div>
        </div>
        <Button 
          color="primary"
          size="sm"
          radius="xl"
          className="font-medium bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/20 w-full sm:w-auto"
          startContent={<Save className="h-4 w-4" />}
        >
          Save Blueprint
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <Card className="border border-divider/50 bg-background/40 backdrop-blur-md p-5 space-y-5" radius="xl">
            <div>
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-md">Project Info</span>
              <h1 className="text-xl font-extrabold text-foreground mt-1.5">{projectName}</h1>
              <p className="text-xs text-default-400 mt-1">ID: {id}</p>
            </div>

            <div className="space-y-3 border-t border-divider/40 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-default-400 font-medium">Category:</span>
                <span className="text-foreground font-semibold">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-400 font-medium">Target Users:</span>
                <span className="text-foreground font-semibold line-clamp-1">{targetUsers}</span>
              </div>
            </div>

            {selectedTech && selectedTech.length > 0 && (
              <div className="space-y-2 border-t border-divider/40 pt-4">
                <label className="text-xs font-semibold text-default-400 uppercase tracking-wider block">Configured Stack</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTech.map((tech) => (
                    <Chip key={tech} size="sm" variant="flat" className="bg-default-100 border border-divider/20 text-default-600 text-[11px] font-medium">
                      {tech}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 border-t border-divider/40 pt-4">
              <Button 
                color="primary"
                variant="flat"
                className="w-full font-semibold border border-primary/20"
                startContent={<Save className="h-4 w-4" />}
              >
                Commit to Workspace
              </Button>

              <Button 
                color="danger"
                variant="light"
                className="w-full font-semibold border border-danger/20 hover:bg-danger/10"
                startContent={<Trash2 className="h-4 w-4" />}
                onClick={handleDelete}
              >
                Delete Project
              </Button>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-8 space-y-6">
          
          <Card className="border border-divider/50 bg-background/40 p-5 sm:p-6 space-y-4" radius="xl">
            <div className="flex items-center justify-between border-b border-divider/40 pb-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Architecture Overview
              </h3>
              <div className="flex items-center gap-2">
                <Button isIconOnly size="sm" variant="light" radius="full" className="text-default-400"><RotateCcw className="h-4 w-4" /></Button>
                {editSection !== "overview" ? (
                  <Button size="sm" variant="flat" radius="xl" className="font-medium text-xs" startContent={<Edit3 className="h-3 w-3" />} onClick={() => setEditSection("overview")}>Edit</Button>
                ) : (
                  <Button size="sm" color="success" radius="xl" className="font-medium text-xs text-white" startContent={<Check className="h-3 w-3" />} onClick={() => saveSection("overview")}>Save</Button>
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
              <p className="text-sm text-default-400 leading-relaxed">{blueprint?.overview}</p>
            )}
          </Card>

          {blueprint?.modules && blueprint.modules.length > 0 && (
            <Card className="border border-divider/50 bg-background/40 p-5 sm:p-6 space-y-4" radius="xl">
              <div className="flex items-center justify-between border-b border-divider/40 pb-3">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Core Functional Modules
                </h3>
                <Button isIconOnly size="sm" variant="light" radius="full" className="text-default-400"><RotateCcw className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blueprint.modules.map((mod, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 bg-default-50 border border-divider/30 rounded-xl">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-default-500 line-clamp-2">{mod}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card className="border border-divider/50 bg-background/40 p-5 sm:p-6 space-y-4" radius="xl">
            <div className="flex items-center justify-between border-b border-divider/40 pb-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" /> Recommended File Tree
              </h3>
              <div className="flex items-center gap-2">
                <Button isIconOnly size="sm" variant="light" radius="full" className="text-default-400"><RotateCcw className="h-4 w-4" /></Button>
                {editSection !== "fileStructure" ? (
                  <Button size="sm" variant="flat" radius="xl" className="font-medium text-xs" startContent={<Edit3 className="h-3 w-3" />} onClick={() => setEditSection("fileStructure")}>Edit</Button>
                ) : (
                  <Button size="sm" color="success" radius="xl" className="font-medium text-xs text-white" startContent={<Check className="h-3 w-3" />} onClick={() => saveSection("fileStructure")}>Save</Button>
                )}
              </div>
            </div>
            
            {editSection === "fileStructure" ? (
              <textarea 
                value={tempFileStructure} 
                onChange={(e) => setTempFileStructure(e.target.value)}
                className="w-full bg-default-100/50 border border-divider rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary text-foreground resize-none whitespace-pre" rows="12" 
              />
            ) : (
              <pre className="bg-default-900 text-default-100 font-mono text-xs p-4 rounded-xl overflow-x-auto leading-relaxed border border-divider/50 whitespace-pre-wrap">
                {blueprint?.fileStructure}
              </pre>
            )}
          </Card>

          <Card className="border border-divider/50 bg-background/40 p-5 sm:p-6 space-y-4" radius="xl">
            <div className="flex items-center justify-between border-b border-divider/40 pb-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" /> Database Schema Layout
              </h3>
              <div className="flex items-center gap-2">
                <Button isIconOnly size="sm" variant="light" radius="full" className="text-default-400"><RotateCcw className="h-4 w-4" /></Button>
                {editSection !== "schemaDesign" ? (
                  <Button size="sm" variant="flat" radius="xl" className="font-medium text-xs" startContent={<Edit3 className="h-3 w-3" />} onClick={() => setEditSection("schemaDesign")}>Edit</Button>
                ) : (
                  <Button size="sm" color="success" radius="xl" className="font-medium text-xs text-white" startContent={<Check className="h-3 w-3" />} onClick={() => saveSection("schemaDesign")}>Save</Button>
                )}
              </div>
            </div>
            
            {editSection === "schemaDesign" ? (
              <textarea 
                value={tempSchema} 
                onChange={(e) => setTempSchema(e.target.value)}
                className="w-full bg-default-100/50 border border-divider rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary text-foreground resize-none whitespace-pre" rows="12" 
              />
            ) : (
              <pre className="bg-default-900 text-default-100 font-mono text-xs p-4 rounded-xl overflow-x-auto leading-relaxed border border-divider/50 whitespace-pre-wrap">
                {blueprint?.schemaDesign}
              </pre>
            )}
          </Card>

        </div>
      </div>

    </div>
  );
}