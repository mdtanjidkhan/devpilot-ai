
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button, Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; 
import toast, { Toaster } from "react-hot-toast";
import { 
  Plus, 
  Sparkles, 
  X, 
  Layers, 
  Target, 
  FileText, 
  Laptop, 
  Check 
} from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter(); 
  const { data: session } = authClient.useSession(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [selectedTech, setSelectedTech] = useState([]); 

  const [formErrors, setFormErrors] = useState({});

  const categories = ["E-commerce", "SaaS Platform", "FinTech App", "Social Media", "AI/ML Tool", "Portfolio/Website"];
  const techOptions = ["Next.js", "React.js", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS"];
  const userTargets = ["Students", "Junior Developers", "Freelancers", "Startup Founders", "Software Engineers"];

  const handleTechToggle = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    let localErrors = {};

    if (!projectName.trim()) localErrors.projectName = "Project name is required";
    if (!category) localErrors.category = "Please select a category";
    if (!description.trim()) localErrors.description = "Project description is required";
    if (!targetUsers) localErrors.targetUsers = "Please select target audience";

    if (Object.keys(localErrors).length > 0) {
      setFormErrors(localErrors);
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in to create a project.");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Analyzing requirements and generating blueprint...");

    try {
      const response = await fetch("http://localhost:5000/api/generate-blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          category,
          description,
          targetUsers, 
          selectedTech,
          userId: session.user.id,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Blueprint generated successfully!", { id: toastId });
        setIsGenerating(false);
        setIsModalOpen(false);
        
        router.push(`/dashboard/projects/${data.projectId}`);
      } else {
        throw new Error(data.error || "AI Generation Failed");
      }
    } catch (error) {
      setIsGenerating(false);
      console.error("Frontend Fetch Error:", error);
      toast.error(error.message || "Something went wrong! Please check backend.", { id: toastId });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center max-w-5xl mx-auto animate-in fade-in duration-500 px-4">
      <Toaster position="top-center" />
      
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-8 py-8">
        
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 text-primary font-medium text-xs bg-primary/10 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>DevPilot AI Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Ready to Architect Your Next Big Idea?
          </h1>
          <p className="text-sm sm:text-base text-default-400 leading-relaxed">
            Welcome to the AI Architecture Wizard. Provide your software requirements, target scale, and goals. Our system will analyze and scaffold a production-ready software blueprint instantly.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Button 
            onClick={() => setIsModalOpen(true)}
            color="primary" 
            size="lg"
            className="font-semibold shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-indigo-600 px-8 py-6 text-base w-full md:w-auto rounded-xl"
            startContent={<Plus className="h-5 w-5 text-white" />}
          >
            Create Project
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isGenerating && setIsModalOpen(false)} />
          
          <Card className="relative w-full max-w-2xl border border-divider bg-background shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200" radius="2xl">
            
            <div className="flex items-center justify-between p-5 border-b border-divider shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">New AI Project Blueprint</h3>
                  <p className="text-xs text-default-400">Configure your system parameters below</p>
                </div>
              </div>
              <Button isIconOnly variant="light" radius="full" size="sm" onClick={() => setIsModalOpen(false)} isDisabled={isGenerating}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleGenerateAI} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left">
              
              {/* Project Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-default-400 uppercase tracking-wider">Project Name *</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (formErrors.projectName) setFormErrors({...formErrors, projectName: null});
                  }}
                  placeholder="e.g., KinKeeper Core" 
                  className={`w-full bg-default-100/50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors text-foreground ${
                    formErrors.projectName ? "border-red-500 focus:border-red-500" : "border-divider/50 focus:border-primary"
                  }`}
                />
                {formErrors.projectName && <p className="text-xs text-red-500 pl-1">{formErrors.projectName}</p>}
              </div>

              {/* Category Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-default-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Category *
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (formErrors.category) setFormErrors({...formErrors, category: null});
                    }}
                    className={`w-full bg-default-100/50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors text-foreground appearance-none cursor-pointer ${
                      formErrors.category ? "border-red-500 focus:border-red-500" : "border-divider/50 focus:border-primary"
                    }`}
                  >
                    <option value="" disabled className="bg-background">Select project category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-background">{cat}</option>
                    ))}
                  </select>
                </div>
                {formErrors.category && <p className="text-xs text-red-500 pl-1">{formErrors.category}</p>}
              </div>

              {/* Project Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-default-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Project Description *
                </label>
                <textarea 
                  rows="3" 
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors({...formErrors, description: null});
                  }}
                  placeholder="Explain the features, core logic, and overall goals of the software..." 
                  className={`w-full bg-default-100/50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors text-foreground resize-none leading-relaxed ${
                    formErrors.description ? "border-red-500 focus:border-red-500" : "border-divider/50 focus:border-primary"
                  }`}
                />
                {formErrors.description && <p className="text-xs text-red-500 pl-1">{formErrors.description}</p>}
              </div>

              {/* Target Users Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-default-400 uppercase tracking-wider flex items-center gap-1">
                  <Target className="h-3 w-3" /> Target Users *
                </label>
                <div className="relative">
                  <select
                    value={targetUsers}
                    onChange={(e) => {
                      setTargetUsers(e.target.value);
                      if (formErrors.targetUsers) setFormErrors({...formErrors, targetUsers: null});
                    }}
                    className={`w-full bg-default-100/50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors text-foreground appearance-none cursor-pointer ${
                      formErrors.targetUsers ? "border-red-500 focus:border-red-500" : "border-divider/50 focus:border-primary"
                    }`}
                  >
                    <option value="" disabled className="bg-background">Select target audience</option>
                    {userTargets.map((target) => (
                      <option key={target} value={target} className="bg-background">{target}</option>
                    ))}
                  </select>
                </div>
                {formErrors.targetUsers && <p className="text-xs text-red-500 pl-1">{formErrors.targetUsers}</p>}
              </div>

              {/* Tech Stack Options Field */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> Preferred Tech Stack
                  </label>
                  <span className="text-[10px] font-bold text-primary tracking-wide bg-primary/10 px-2 py-0.5 rounded-full uppercase">Optional</span>
                </div>
                <p className="text-xs text-default-400">If left empty, DevPilot AI will recommend the ideal stack for you.</p>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {techOptions.map((tech) => {
                    const isSelected = selectedTech.includes(tech);
                    return (
                      <Button
                        key={tech}
                        type="button"
                        size="sm"
                        radius="full"
                        variant={isSelected ? "solid" : "flat"}
                        color={isSelected ? "primary" : "default"}
                        onClick={() => handleTechToggle(tech)}
                        className={`font-medium transition-all px-3 py-1.5 border border-divider/20 h-auto ${
                          isSelected ? "" : "bg-default-100 hover:bg-default-200 text-default-600"
                        }`}
                        startContent={isSelected && <Check className="h-3 w-3" />}
                      >
                        {tech}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-divider shrink-0">
                <Button 
                  variant="light" 
                  radius="xl" 
                  className="font-medium" 
                  onClick={() => setIsModalOpen(false)}
                  isDisabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  isLoading={isGenerating}
                  color="primary" 
                  radius="xl" 
                  className="font-medium bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/20 px-6"
                >
                  {isGenerating ? "Analyzing Requirements..." : "Generate with AI"}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

    </div>
  );
}