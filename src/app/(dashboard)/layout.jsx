
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  History, 
  Settings, 
  PlusCircle,
  ChevronRight,
  User,
  X
} from "lucide-react";
import { Button } from "@heroui/react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileSidebarOpen(prev => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Create Project", href: "/dashboard/create-project", icon: PlusCircle }, // 
    { name: "AI History", href: "/dashboard/history", icon: History },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-40 border-r border-divider/60 bg-background/50 backdrop-blur-md pt-16">
        <div className="flex flex-col flex-1 gap-y-6 px-4 py-6">
          
          <Link href="/dashboard/create-project" className="w-full">
            <Button 
              color="primary" 
              endContent={<PlusCircle className="h-4 w-4" />}
              className="w-full font-medium shadow-md shadow-primary/10 bg-gradient-to-r from-primary to-indigo-600"
            >
              New Project
            </Button>
          </Link>

          <nav className="flex flex-col gap-1.5 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-default-500 hover:bg-default-100 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive(item.href) ? "text-primary" : "text-default-400 group-hover:text-foreground"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive(item.href) && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-divider flex flex-col pt-6 transition-transform duration-300 transform lg:hidden ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between px-6 pb-4 border-b border-divider">
          <span className="font-bold text-lg text-primary">Navigation</span>
          <Button isIconOnly variant="light" radius="full" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col flex-1 gap-y-6 px-4 py-6">
          <Link href="/dashboard/create-project" onClick={() => setIsMobileSidebarOpen(false)} className="w-full">
            <Button color="primary" className="w-full font-medium" endContent={<PlusCircle className="h-4 w-4" />}>
              Create Project
            </Button>
          </Link>
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive(item.href) ? "bg-primary/10 text-primary" : "text-default-500 hover:bg-default-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="flex-1 flex flex-col lg:pl-64">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
