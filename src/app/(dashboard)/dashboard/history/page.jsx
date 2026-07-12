"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { 
  Search, 
  Eye, 
  Edit3, 
  RotateCcw, 
  Copy, 
  Download, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Sparkles,
  ExternalLink,
  X,
  Check
} from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

export default function AIHistoryPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  // States
  const [historyList, setHistoryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [uniqueProjects, setUniqueProjects] = useState([]);

  // Modal Control States
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);


  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/generations`);
      const data = await res.json();
      
      if (data.success) {
        const myHistory = session?.user 
          ? data.generations.filter(item => item.userId === session.user.id)
          : data.generations;

        setHistoryList(myHistory);
        setFilteredList(myHistory);

        const projects = [...new Set(myHistory.map(item => item.projectName))].filter(Boolean);
        setUniqueProjects(projects);
      } else {
        toast.error("Failed to load history data.");
      }
    } catch (error) {
      console.error("History fetch error:", error);
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [session]);

  
  useEffect(() => {
    let result = historyList;

    if (searchQuery.trim() !== "") {
      result = result.filter(item => 
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.generatedOutput.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedProject !== "all") {
      result = result.filter(item => item.projectName === selectedProject);
    }

    setFilteredList(result);
  }, [searchQuery, selectedProject, historyList]);

  // Action ৩: COPY logic
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Action ৪: EXPORT (.md) file download logoc
  const exportToMarkdown = (item) => {
    const fileContent = `# Project: ${item.projectName}\n## Prompt: ${item.prompt}\n\n${item.generatedOutput}`;
    const blob = new Blob([fileContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${item.projectName || "generation"}_${item.generationType}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Markdown file exported successfully!");
  };

  // action ৫: DELETE logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log from history permanently?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/generations/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        setHistoryList(prev => prev.filter(item => item._id !== id));
        toast.success("History log removed!");
      } else {
        toast.error("Delete failed!");
      }
    } catch (error) {
      toast.error("Error communicating with server.");
    }
  };

  //  ৬: EDIT (Save Changes)
  const saveEdit = async () => {
    if (!editText.trim()) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/generations/${activeItem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedOutput: editText })
      });
      const data = await res.json();

      if (data.success) {
        setHistoryList(prev => prev.map(item => 
          item._id === activeItem._id ? { ...item, generatedOutput: editText, updatedAt: new Date() } : item
        ));
        toast.success("AI response updated successfully!");
        setIsOpen(false);
      } else {
        toast.error("Failed to update.");
      }
    } catch (error) {
      toast.error("Error saving updates.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRegenerate = async (id) => {
    setIsActionLoading(true);
    toast.loading("Regenerating response from Gemini...", { id: "regen" });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/generations/${id}/regenerate`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setHistoryList(prev => prev.map(item => 
          item._id === id ? { ...item, generatedOutput: data.generatedOutput, status: "Completed", updatedAt: new Date() } : item
        ));
        if (activeItem && activeItem._id === id) {
          setEditText(data.generatedOutput);
        }
        toast.success("Regeneration complete!", { id: "regen" });
      } else {
        toast.error("Regeneration failed.", { id: "regen" });
      }
    } catch (error) {
      toast.error("Server error during regeneration.", { id: "regen" });
    } finally {
      setIsActionLoading(false);
    }
  };


  const getTypeBadgeStyle = (type) => {
    if (type === "Database") return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    if (type === "API") return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
    if (type === "README") return "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20";
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400 font-medium">Loading your AI activity log...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 p-4 text-left">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" /> AI Generation History
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage, reuse, regenerate or export your historical AI software layouts.</p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
            placeholder="Search keywords or code chunks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          className="w-full sm:w-[240px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          {uniqueProjects.map((proj) => (
            <option key={proj} value={proj}>{proj}</option>
          ))}
        </select>
      </div>

      {/* History Feed List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl">
            <p className="text-sm text-gray-400 font-medium">No generation matching the filters found.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div key={item._id} className="border border-gray-200 dark:border-gray-800/60 p-5 bg-white dark:bg-gray-950/40 rounded-2xl shadow-sm hover:border-blue-500/40 transition-colors">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                
                {/* Meta Details Left */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                      📄 {item.projectName || "Unassigned Project"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(item.generationType)}`}>
                      {item.generationType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.status === "Failed" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                      {item.status || "Completed"}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                    &ldquo;{item.prompt}&rdquo;
                  </h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-blue-500" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-400" /> Updated: {new Date(item.updatedAt || item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-green-500" /> {item.user}</span>
                  </div>
                </div>

                {/* Actions Button Row Right */}
                <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-end border-t border-gray-100 dark:border-gray-800/40 lg:border-none pt-3 lg:pt-0">
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl transition-colors" title="View details" onClick={() => { setActiveItem(item); setEditText(item.generatedOutput); setIsEditMode(false); setIsOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-amber-500 rounded-xl transition-colors" title="Edit Output" onClick={() => { setActiveItem(item); setEditText(item.generatedOutput); setIsEditMode(true); setIsOpen(true); }}>
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-purple-500 rounded-xl transition-colors disabled:opacity-50" title="Regenerate logic" disabled={isActionLoading} onClick={() => handleRegenerate(item._id)}>
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 rounded-xl transition-colors" title="Copy code" onClick={() => copyToClipboard(item.generatedOutput)}>
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-green-500 rounded-xl transition-colors" title="Export markdown" onClick={() => exportToMarkdown(item)}>
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-500 rounded-xl transition-colors" title="Delete record" onClick={() => handleDelete(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-500 rounded-xl transition-colors" title="Go to Project Workspace" onClick={() => router.push(`/dashboard/projects/${item.projectId}`)}>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* TAILWIND MODAL SYSTEM */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{activeItem?.generationType} Log</span>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white line-clamp-1 mt-0.5">&ldquo;{activeItem?.prompt}&rdquo;</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/20 flex-1">
              {isEditMode ? (
                <textarea
                  className="w-full h-80 font-mono text-xs p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none leading-relaxed"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <pre className="bg-gray-900 text-gray-100 font-mono text-[11px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-gray-800 whitespace-pre">
                  {activeItem?.generatedOutput}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Close
              </button>
              
              {isEditMode ? (
                <button 
                  disabled={isActionLoading} 
                  onClick={saveEdit} 
                  className="px-4 py-2 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </button>
              ) : (
                <button 
                  onClick={() => copyToClipboard(activeItem?.generatedOutput)} 
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Logic
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}