
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Globe, Briefcase, User, Mail, Shield, Award, Terminal } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
    bio: "",
    country: "",
    jobTitle: "",
    skills: [],
    experience: 0,
    preferredTechStack: [],
    currentRole: "",
    github: "",
    linkedin: "",
    portfolio: "",
    twitter: "",
    memberSince: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [stats, setStats] = useState({ projectsCount: 0, aiGenerationsCount: 0, readmeExportsCount: 0, achievementsCount: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);


  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/profile/${session.user.id}`);
      const data = await res.json();

      if (data.success) {
        setProfile({
          name: data.profile?.name || session.user.name || "",
          email: data.profile?.email || session.user.email || "",
          image: data.profile?.image || session.user.image || "",
          bio: data.profile?.bio || "",
          country: data.profile?.country || "",
          jobTitle: data.profile?.jobTitle || "",
          skills: data.profile?.skills || [],
          experience: data.profile?.experience || 0,
          preferredTechStack: data.profile?.preferredTechStack || [],
          currentRole: data.profile?.currentRole || "",
          github: data.profile?.github || "",
          linkedin: data.profile?.linkedin || "",
          portfolio: data.profile?.portfolio || "",
          twitter: data.profile?.twitter || "",
          memberSince: data.profile?.memberSince || session.user.createdAt || "",
        });
        
        setStats(data.stats || { projectsCount: 0, aiGenerationsCount: 0, readmeExportsCount: 0, achievementsCount: 0 });
        setRecentProjects(data.recentProjects || []);
        setAchievements(data.achievements || []);
      } else {
        toast.error("Failed to load profile parameters.");
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      toast.error("Network synchronization failure.");
    } finally {
      setIsDataLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchProfileData();
    } else if (!isSessionPending) {
      setIsDataLoading(false);
    }
  }, [session, isSessionPending, fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Skills Array Input
  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(skillInput.trim())) {
        setProfile((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skillToRemove) }));
  };

  //  Preferred Tech Array Input
  const handleAddTech = (e) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!profile.preferredTechStack.includes(techInput.trim())) {
        setProfile((prev) => ({ ...prev, preferredTechStack: [...prev.preferredTechStack, techInput.trim()] }));
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setProfile((prev) => ({ ...prev, preferredTechStack: prev.preferredTechStack.filter((t) => t !== techToRemove) }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!session?.user?.id) {
    toast.error("Authentication node mismatch. Please re-login.");
    return;
  }

  setIsSaving(true);

  let finalSkills = [...profile.skills];
  if (skillInput.trim() && !finalSkills.includes(skillInput.trim())) {
    finalSkills.push(skillInput.trim());
    setProfile(prev => ({ ...prev, skills: finalSkills }));
    setSkillInput(""); 
  }

  let finalTech = [...profile.preferredTechStack];
  if (techInput.trim() && !finalTech.includes(techInput.trim())) {
    finalTech.push(techInput.trim());
    setProfile(prev => ({ ...prev, preferredTechStack: finalTech }));
    setTechInput(""); 
  }

  try {
     const { data: tokenData } = await authClient.token();
      console.log(tokenData,"tokendata")
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/profile/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
         authorization: `Bearer ${tokenData?.token}`
       },
      body: JSON.stringify({
        userId: session.user.id,
        bio: profile.bio,
        country: profile.country,
        jobTitle: profile.jobTitle,
        skills: finalSkills, 
        experience: Number(profile.experience),
        preferredTechStack: finalTech, 
        currentRole: profile.currentRole,
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
        twitter: profile.twitter,
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Profile matrix successfully updated!");
      await fetchProfileData(); 
    } else {
      toast.error(data.error || "Failed to compile profile adjustments.");
    }
  } catch (err) {
    console.error("Update Error:", err);
    toast.error("Server cluster connection timed out.");
  } finally {
    setIsSaving(false);
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return "Processing...";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (isSessionPending || isDataLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-100 bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs font-mono tracking-wider text-slate-400">Compiling user framework profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 lg:p-8 text-left">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Account Core Node
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Identity verification, technical indexing, and framework metric evaluations.
          </p>
        </div>

        {/* Top Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Live Preview Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md space-y-4">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-indigo-500/40 p-1 bg-slate-900">
                <img
                  src={profile.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                  alt="User Cluster Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-200">👤 {profile.name || "John Doe"}</h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{profile.jobTitle || "Full-Stack Developer"}</p>
              </div>

             <div className="text-xs space-y-2 pt-2 border-t border-slate-700/40 text-left font-mono text-slate-300">
  <p className="truncate">📧 {profile.email}</p>
  <p className="text-slate-400">
    💻 {profile.preferredTechStack.length > 0 ? (
      profile.preferredTechStack.join(" • ")
    ) : (
      <span className="text-slate-500 italic text-[11px]">No tech stack added</span>
    )}
  </p>
</div>

              <div className="grid grid-cols-2 gap-2 text-left pt-2 font-mono text-[11px]">
                <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block">📂 Projects:</span>
                  <span className="font-bold text-emerald-400 text-sm">{stats.projectsCount}</span>
                </div>
                <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block">🤖 AI Gen:</span>
                  <span className="font-bold text-blue-400 text-sm">{stats.aiGenerationsCount}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-indigo-400 bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                📅 Joined: {formatDate(profile.memberSince)}
              </div>
            </div>

            {/* Infrastructure Count Matrix */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-400" /> Infrastructure Usage
              </h3>
              <div className="grid grid-cols-2 gap-3.5 font-mono">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-xl font-black text-emerald-400">{stats.projectsCount}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Blueprints</span>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-xl font-black text-blue-400">{stats.aiGenerationsCount}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Generations</span>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-xl font-black text-indigo-400">{stats.readmeExportsCount}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Exports</span>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
                  <span className="block text-xl font-black text-amber-400">{stats.achievementsCount}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Badges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Block now*/}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-8">
              
              {/* Identity Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="h-4 w-4 text-blue-400" /> 1. Identity Profiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Email Node (Read-only)</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 font-mono cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Job Designation</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={profile.jobTitle}
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-semibold"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Location Core (Country)</label>
                    <input
                      type="text"
                      name="country"
                      value={profile.country}
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Bangladesh"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Identity Bio Matrix</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Describe your compute interests..."
                  />
                </div>
              </div>

              {/* Developer Config Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <Briefcase className="h-4 w-4 text-indigo-400" /> 2. Pipeline Configurations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Current Stack Position</label>
                    <select
                      name="currentRole"
                      value={profile.currentRole}
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-semibold"
                    >
                      <option value="">Select Operational Status</option>
                      <option value="Student">Student Node</option>
                      <option value="Freelancer">Freelancer Cluster</option>
                      <option value="Full-time">Full-time Core Engine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Runtime Experience (Years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={profile.experience}
                      onChange={handleChange}
                      min="0"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Skills Indexing (Press Enter to lock)
                  </label>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. React, Node.js, TailwindCSS"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl text-[11px] font-mono">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-200 font-bold ml-1 text-xs">&times;</button>
                      </span>
                    ))}
                    {profile.skills.length === 0 && <span className="text-xs text-slate-500 font-mono italic">No indexed nodes.</span>}
                  </div>
                </div>

                {/* Tech Stack Section */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Target Framework Environments (Press Enter to lock)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="e.g. Next.js, MERN, Cloudflare"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredTechStack.map((tech, index) => (
                      <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-[11px] font-mono">
                        {tech}
                        <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-indigo-200 font-bold ml-1 text-xs">&times;</button>
                      </span>
                    ))}
                    {profile.preferredTechStack.length === 0 && <span className="text-xs text-slate-500 font-mono italic">No architecture groups listed.</span>}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <Globe className="h-4 w-4 text-purple-400" /> 3. External Ledger Web Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">GitHub Cluster URL</label>
                    <input
                      type="url"
                      name="github"
                      value={profile.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">LinkedIn Core URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={profile.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Primary Portfolio Node</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={profile.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">X (Twitter Cluster)</label>
                    <input
                      type="url"
                      name="twitter"
                      value={profile.twitter}
                      onChange={handleChange}
                      placeholder="https://x.com/..."
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4 border-t border-slate-700/40">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-500/10 active:scale-95 transition-all disabled:opacity-40"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Synchronizing...
                    </>
                  ) : (
                    "Save Dimensions"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Dynamic Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" /> 5. Active Blueprint Pipelines
            </h3>
            <div className="space-y-3">
              {recentProjects.map((proj, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700/70 transition-colors">
                  <h4 className="text-xs font-bold text-slate-300">{proj.name || proj.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{proj.description || proj.desc || "No description provided."}</p>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-xs text-slate-500 italic p-4 font-mono">No active projects deployed yet.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" /> 6. Core Operational Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3.5 p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <div className="text-xl p-2 bg-slate-800 rounded-lg h-fit flex items-center justify-center border border-slate-700/50">{ach.badge}</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ach.desc}</p>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-xs text-slate-500 italic p-4 font-mono">Unlock metrics by interacting with the ecosystem.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}