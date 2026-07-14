
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, Button } from "@heroui/react";
import { Terminal, Sun, Moon, LayoutDashboard, LogOut, Menu, X, Bell, Search, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isPending = false; 
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.id && pathname.startsWith("/dashboard")) {
      fetchNotifications();
    }
  }, [mounted, user?.id, pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notifications/${user.id}`);
      const data = await res.json();
      
      if (data.success) {
        setNotifications(data.data);
        const unread = data.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notifications/read/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  if (!mounted) return null;

  const handleLogout = async() => {
    await authClient.signOut();
    console.log("Logged out");
    setIsMenuOpen(false);
  };

  const isActive = (path) => pathname === path;

  const landingLinks = [
    { name: "Features", href: "features" },
    { name: "Pricing", href: "pricing" },
    { name: "How It Works", href: "how-it-works" },
    { name: "FAQ", href: "faq" }
  ];

  if (pathname.startsWith("/dashboard")) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-divider/50 bg-background/70 backdrop-blur-lg transition-colors duration-300">
        <header className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              isIconOnly 
              variant="light" 
              radius="md" 
              onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
              className="lg:hidden text-default-600"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-500">
              <Terminal className="h-5 w-5 hidden md:block" />
              <span className="flex items-center gap-2">DevPilot <span className="text-foreground/80 font-medium text-lg hidden md:block">AI</span></span>
            </Link>
            
            <div className="hidden sm:flex items-center text-sm text-default-400 gap-2 border-l border-divider pl-4">
              <span>Workspace</span>
              <span className="text-default-300">/</span>
              <span className="text-foreground font-medium capitalize">
                {pathname.split("/").pop() || "Dashboard"}
              </span>
            </div>
          </div>
          {/* <div className="hidden md:flex items-center gap-2 max-w-sm w-full bg-default-100 hover:bg-default-200/80 px-3 py-1 rounded-lg border border-divider/50 text-default-400 text-sm transition-colors">
            <Search className="h-4 w-4 text-default-400" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-default-400 py-0.5 text-sm"
            />
            <kbd className="hidden lg:inline-block bg-default-300/50 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl K</kbd>
          </div> */}

          <div className="flex items-center gap-4">
            <div className="relative">
              <Button 
                isIconOnly 
                variant="light" 
                radius="full" 
                className="text-default-500 relative"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-divider bg-background shadow-xl z-20 py-2">
                    <div className="px-4 py-2 border-b border-divider font-bold text-sm text-foreground">
                      🔔 Notifications
                    </div>
                    
                    <div className="divide-y divide-divider/40">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-default-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            className={`p-3 text-sm flex items-start gap-2 hover:bg-default-50 transition-colors ${!notif.isRead ? 'bg-blue-500/5 dark:bg-blue-500/10' : 'opacity-75'}`}
                          >
                            <div className="flex-1">
                              <p className={`font-semibold text-foreground ${!notif.isRead ? 'text-blue-500' : ''}`}>{notif.title}</p>
                              <p className="text-xs text-default-500 mt-0.5">{notif.message}</p>
                            </div>
                            
                            {!notif.isRead && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notif._id);
                                }}
                                className="p-1 text-default-400 hover:text-success rounded-md transition-colors mt-0.5"
                                title="Mark as read"
                              >
                                <CheckCircle className="h-4 w-4 text-success" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              isIconOnly
              variant="light"
              radius="full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-default-500"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </Button>

            <div className="flex items-center gap-3 border-l border-divider pl-3">
              <Avatar className="h-8 w-8 text-sm bg-primary/20 text-primary border border-primary/30">
                <Avatar.Image alt={user?.name || "User Avatar"} name={user?.name} src={user?.image} />
                <Avatar.Fallback>{user?.name?.substring(0, 2).toUpperCase() || "US"}</Avatar.Fallback>
              </Avatar>
              
              <button
                onClick={handleLogout}
                className="p-1.5 text-default-400 hover:text-danger transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-divider/50 bg-background/70 backdrop-blur-lg transition-colors duration-300">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-default-600 rounded-lg hover:bg-default-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <Terminal className="h-6 w-6" />
            <span>DevPilot <span className="text-foreground">AI</span></span>
          </Link>
        </div>

        <ul className="hidden items-center gap-1 md:flex">
          {landingLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-blue-600 font-semibold"
                    : "text-default-600 hover:text-blue-500"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-default-500"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isPending ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-default-600 hover:text-blue-500 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 border-l border-divider pl-3">
                <Avatar className="h-8 w-8 text-sm bg-primary/20 text-primary border border-primary/30">
                  <Avatar.Image alt={user?.name || "User"} name={user?.name} src={user?.image} />
                  <Avatar.Fallback>{user?.name?.substring(0, 2).toUpperCase() || "JD"}</Avatar.Fallback>
                </Avatar>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className="text-sm font-medium text-default-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button color="primary" className="font-medium shadow-md">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-divider bg-background md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            {landingLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-base font-medium ${
                    isActive(link.href)
                      ? " text-blue-500"
                      : "text-default-600 hover:bg-default-50"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li className="mt-2 flex flex-col gap-2 border-t border-divider pt-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 text-base font-medium text-default-600 hover:bg-default-50 rounded-lg"
                  >
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 px-3 text-base font-medium text-danger hover:bg-danger/10 rounded-lg w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout ({user.name.split(" ")[0]})
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 text-center text-base font-medium border border-divider text-default-700 rounded-lg hover:bg-default-50"
                  >
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button color="primary" className="w-full font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}