"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, Button } from "@heroui/react";
import { Terminal, Sun, Moon, LayoutDashboard, LogOut, Menu, X, Bell, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isPending = false; 
  const { data: session } = authClient.useSession();
  const user = session?.user;


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = async() => {
   await authClient.signOut();
    console.log("Logged out");
    setIsMenuOpen(false);
  };

  const isActive = (path) => pathname === path;

  const landingLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "#docs" },
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

            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
              <Terminal className="h-5 w-5" />
              <span>DevPilot <span className="text-foreground/80 font-medium text-lg">AI</span></span>
            </Link>
            
            <div className="hidden sm:flex items-center text-sm text-default-400 gap-2 border-l border-divider pl-4">
              <span>Workspace</span>
              <span className="text-default-300">/</span>
              <span className="text-foreground font-medium capitalize">
                {pathname.split("/").pop() || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 max-w-sm w-full bg-default-100 hover:bg-default-200/80 px-3 py-1.5 rounded-lg border border-divider/50 text-default-400 text-sm cursor-pointer transition-colors">
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search projects...</span>
            <kbd className="hidden lg:inline-block bg-default-300/50 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl K</kbd>
          </div>

          <div className="flex items-center gap-4">
            <Button isIconOnly variant="light" radius="full" className="text-default-500">
              <Bell className="h-5 w-5" />
            </Button>

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
        <Avatar.Image alt="John Doe" name={user?.name}
                  src={user?.image} />
        <Avatar.Fallback>JD</Avatar.Fallback>
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
                    ? "text-primary font-semibold"
                    : "text-default-600 hover:text-primary"
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
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-default-600 hover:text-primary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 border-l border-divider pl-3">
               
                <Avatar className="h-8 w-8 text-sm bg-primary/20 text-primary border border-primary/30">
        <Avatar.Image alt="John Doe" name={user?.name}
                  src={user?.image} />
        <Avatar.Fallback>JD</Avatar.Fallback>
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

      {/* মোবাইল রেসপনসিভ মেনু ড্রপডাউন */}
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
                      ? "bg-primary/10 text-primary"
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