
"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  User, 
  Sparkles, 
  Paintbrush, 
  Bell, 
  Download, 
  CreditCard, 
  Shield, 
  Lock, 
  Trash2, 
  LogOut,
  Check,
  Smartphone,
  Monitor,
  ChevronDown,
  Loader2
} from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); //  New state for delete loading
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Dynamic Device State ---
  const [deviceInfo, setDeviceInfo] = useState({
    name: "Detecting Device...",
    icon: <Monitor className="h-4 w-4" />
  });

  // --- States for fields ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [aiModel, setAiModel] = useState("gemini-2.5-flash");
  const [aiLanguage, setAiLanguage] = useState("English");
  const [aiFormat, setAiFormat] = useState("Markdown");
  const [creativity, setCreativity] = useState("Medium");
  const [theme, setTheme] = useState("system");
  const [emailNotif, setEmailNotif] = useState(true);
  const [aiCompletedNotif, setAiCompletedNotif] = useState(true);
  const [productUpdateNotif, setProductUpdateNotif] = useState(false);
  const [defaultExport, setDefaultExport] = useState("Markdown");

  // Run device detection on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        setDeviceInfo({
          name: /iphone|ipad/i.test(ua) ? "Safari Browser on iOS" : "Mobile Browser on Android",
          icon: <Smartphone className="h-4 w-4" />
        });
      } else if (/windows/i.test(ua)) {
        setDeviceInfo({
          name: "Chrome Browser running on Windows",
          icon: <Monitor className="h-4 w-4" />
        });
      } else if (/macintosh|mac os x/i.test(ua)) {
        setDeviceInfo({
          name: "Safari/Chrome running on macOS",
          icon: <Monitor className="h-4 w-4" />
        });
      } else {
        setDeviceInfo({
          name: "Web Browser on Linux/Desktop",
          icon: <Monitor className="h-4 w-4" />
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (session?.user) {
        setName(session.user.name || "");
        setEmail(session.user.email || "");
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/user/preferences/${session.user.id}`);
          const data = await res.json();
          
          if (data.success && data.data) {
            const prefs = data.data;
            if (prefs.aiPreferences) {
              setAiModel(prefs.aiPreferences.defaultModel || "gemini-2.5-flash");
              setAiLanguage(prefs.aiPreferences.language || "English");
              setAiFormat(prefs.aiPreferences.defaultFormat || "Markdown");
              setCreativity(prefs.aiPreferences.creativityLevel || "Medium");
            }
            if (prefs.notifications) {
              setEmailNotif(prefs.notifications.emailNotifications ?? true);
              setAiCompletedNotif(prefs.notifications.generationCompleted ?? true);
              setProductUpdateNotif(prefs.notifications.productUpdate ?? false);
            }
            setTheme(prefs.appearance || "system");
            setDefaultExport(prefs.defaultExportFormat || "Markdown");
          }
        } catch (err) {
          console.error("Error fetching user preferences:", err);
        }
      }
    };

    fetchUserSettings();
  }, [session]);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: name });
      if (error) {
        toast.error(error.message || "Failed to update profile name.");
      } else {
        toast.success("Account name updated successfully!");
      }
    } catch (err) {
      toast.error("An error occurred during profile update.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/user/preferences`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          aiPreferences: {
            defaultModel: aiModel,
            language: aiLanguage,
            creativityLevel: creativity,
            defaultFormat: aiFormat
          },
          notifications: {
            emailNotifications: emailNotif,
            generationCompleted: aiCompletedNotif,
            productUpdate: productUpdateNotif
          },
          appearance: theme,
          defaultExportFormat: defaultExport
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Preferences saved successfully!");
      } else {
        toast.error("Failed to save preferences.");
      }
    } catch (error) {
      toast.error("Server connection error.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Better Auth: Revoke All Sessions Function ---
  const handleAllDeviceLogout = async () => {
    // const confirmLogout = window.confirm("Are you sure you want to sign out from all active sessions and devices?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        revokeToken: true,
        fetchOptions: {
          onSuccess: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/login"; 
            }
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to terminate sessions securely.");
          }
        }
      });
      toast.success("Successfully invalidated all system sessions.");
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Failed to terminate sessions securely.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // --- Account Deletion Function  ---
  const handleDeleteAccount = async () => {
    if (!session?.user?.id) {
      toast.error("User session not found.");
      return;
    }

    // const confirmDelete = window.confirm(
    //   "WARNING: Are you absolutely sure you want to delete your account? This action is irreversible and all your data will be wiped permanently."
    // );
    // if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      // 1. Call Backend API to delete user record from database
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/user/delete-account/${session.user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Account successfully deleted from database.");

        // 2. Clear Better-Auth client side session and redirect
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
            }
          }
        });
      } else {
        toast.error(data.message || "Failed to delete account from server.");
      }
    } catch (err) {
      console.error("Deletion Error:", err);
      toast.error("Server error occurred while attempting deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: "account", name: "Account Settings", icon: <User className="h-4 w-4" /> },
    { id: "ai", name: "AI Preferences", icon: <Sparkles className="h-4 w-4" /> },
    { id: "appearance", name: "Appearance", icon: <Paintbrush className="h-4 w-4" /> },
    { id: "notifications", name: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "export", name: "Export Options", icon: <Download className="h-4 w-4" /> },
    { id: "subscription", name: "Subscription", icon: <CreditCard className="h-4 w-4" /> },
    { id: "security", name: "Security & Sessions", icon: <Shield className="h-4 w-4" /> },
  ];

  const activeTabName = tabs.find(t => t.id === activeTab)?.name;

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 text-left">
      <Toaster position="top-center" />
      
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Control Panel</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure your personal profile, AI modeling weights, and system triggers.</p>
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 md:p-6">
        
        {/* MOBILE NAVIGATION DROPDOWN */}
        <div className="block md:hidden relative w-full">
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200"
          >
            <span className="flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.icon}
              {activeTabName}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isMobileMenuOpen && (
            <div className="absolute left-0 right-0 mt-1 z-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP SIDEBAR TABS */}
        <div className="hidden md:flex w-1/4 flex-col gap-1 border-r border-gray-100 dark:border-gray-800 pr-4 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Right Column Content Window */}
        <div className="flex-1 md:pl-2 py-2 w-full">
          
          {/* TAB 1: ACCOUNT SETTINGS */}
          {activeTab === "account" && (
            <form onSubmit={handleSaveAccount} className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">Profile Identity</h2>
              
              <div className="flex flex-col gap-5 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Email Address</label>
                  <input
                    type="email"
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-900/60 text-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed shadow-sm"
                    value={email}
                  />
                  <p className="text-[10px] text-gray-400 font-medium">To change your primary email, please contact server support nodes.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-900 flex flex-col sm:flex-row gap-2">
                <button type="submit" disabled={isSaving} className="w-full sm:w-auto justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition-colors">
                  <Check className="h-3.5 w-3.5" /> Save Profile Name
                </button>
                <button type="button" className="w-full sm:w-auto justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                  <Lock className="h-3.5 w-3.5" /> Request Password Reset
                </button>
              </div>

              {/* Danger Zone */}
              <div className="mt-8 pt-6 border-t border-red-100 dark:border-red-950/20">
                <h3 className="text-xs font-black text-red-500 uppercase tracking-wider">Danger Zone</h3>
                <p className="text-xs text-gray-400 mt-1">Permanently remove this account node and all synced AI workspaces from records.</p>
                <button 
                  type="button" 
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto justify-center mt-3 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting Node...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" /> Delete Account Node
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: AI PREFERENCES */}
          {activeTab === "ai" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">AI Copilot Weights</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Default Core Model</label>
                  <select 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" 
                    value={aiModel} 
                    onChange={(e) => setAiModel(e.target.value)}
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultralight & Fast)</option>
                    <option value="gemini-2.5-pro" disabled>Gemini 2.5 Pro 🔒 [Premium]</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Output Creativity Level</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" value={creativity} onChange={(e) => setCreativity(e.target.value)}>
                    <option value="Low">Low (Strict Technical / No Hallucinations)</option>
                    <option value="Medium">Medium (Balanced Architectural Synthesis)</option>
                    <option value="High">High (Experimental Framework Extensions)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Response Primary Language</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" value={aiLanguage} onChange={(e) => setAiLanguage(e.target.value)}>
                    <option value="English">English</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Default Output Strategy</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" value={aiFormat} onChange={(e) => setAiFormat(e.target.value)}>
                    <option value="Markdown">Standard Markdown (.md)</option>
                    <option value="JSON">Structured JSON Payload</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-900">
                <button onClick={handleSavePreferences} disabled={isSaving} className="w-full sm:w-auto justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition-colors">
                  <Check className="h-3.5 w-3.5" /> Save AI Configuration
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">Visual Viewport Theme</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-4 rounded-xl border text-center capitalize text-xs font-bold flex flex-row sm:flex-col items-center justify-center gap-2.5 transition-all ${
                      theme === t
                        ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 text-blue-600"
                        : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    <Paintbrush className="h-4 w-4 shrink-0" />
                    {t} Mode
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-900">
                <button onClick={handleSavePreferences} className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">
                  Apply Theme Node
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">Trigger Traces & Alerts</h2>
              
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 gap-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">Master Email Dispatches</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Route critical workspace security alerts directly to inbox.</p>
                  </div>
                  <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 gap-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">Generation Completed Telemetry</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Notify instantly when long-running heavy blueprints finish compilation.</p>
                  </div>
                  <input type="checkbox" checked={aiCompletedNotif} onChange={(e) => setAiCompletedNotif(e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 gap-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">Product Patch Disclosures</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Receive digests detailing new features, LLM expansions, and systems updates.</p>
                  </div>
                  <input type="checkbox" checked={productUpdateNotif} onChange={(e) => setProductUpdateNotif(e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-900">
                <button onClick={handleSavePreferences} className="w-full sm:w-auto justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                  <Check className="h-3.5 w-3.5" /> Sync Triggers
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT OPTIONS */}
          {activeTab === "export" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">Export Formats Configuration</h2>
              
              <div className="max-w-md space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Default One-Click Blueprint Download Extension</label>
                <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" value={defaultExport} onChange={(e) => setDefaultExport(e.target.value)}>
                  <option value="Markdown">Standard Markdown (.md)</option>
                  <option value="PDF" disabled>Adobe Portable Document (.pdf) 🔒 [Premium]</option>
                  <option value="DOCX" disabled>Microsoft Word Document (.docx) 🔒 [Premium]</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-900">
                <button onClick={handleSavePreferences} className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">
                  Save Export Rules
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SUBSCRIPTION */}
          {activeTab === "subscription" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">Subscription & Billing Engine</h2>
              
              <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white max-w-md shadow-sm">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Current Tier</span>
                <h3 className="text-xl font-black mt-1">DevPilot Free Architecture</h3>
                <p className="text-xs text-blue-100/80 mt-1.5 leading-relaxed">Accessing standard Gemini 2.5-Flash limits. Upgrades open up Pro modeling cores and premium compilation exporters.</p>
                <button type="button" className="w-full sm:w-auto mt-4 px-4 py-2.5 bg-white text-blue-600 hover:bg-gray-50 font-bold text-xs rounded-xl transition-all shadow-sm">
                  Premium feature <span className="text-purple-600">(Coming Soon)</span>
                </button>
                {/* Upgrade Node to Pro */}
              </div>

              <div className="max-w-md border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <h4 className="text-xs font-black text-gray-700 dark:text-gray-300">Transaction History Log</h4>
                <p className="text-[11px] text-gray-400 mt-1">No invoices found. Account node operating under non-commercial terms.</p>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & SESSIONS */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-900 pb-2">Active Cryptographic Sessions</h2>
              
              <div className="space-y-3 max-w-xl">
                <p className="text-xs text-gray-400">Review all system tokens currently possessing authority to modify your projects.</p>
                
                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-lg text-blue-600 shrink-0">
                      {deviceInfo.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white">{deviceInfo.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">IP: 103.145.x.x &bull; <span className="text-green-500 font-bold">Current Node</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-900">
                <button 
                  type="button" 
                  disabled={isLoggingOut}
                  onClick={handleAllDeviceLogout}
                  className="w-full sm:w-auto justify-center px-4 py-2.5 border border-red-200 dark:border-red-950/30 hover:bg-red-500/10 text-red-500 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Invalidating Nodes...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-3.5 w-3.5" /> Invalidate All Alternative Sessions
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}



