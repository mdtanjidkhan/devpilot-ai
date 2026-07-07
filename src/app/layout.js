import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { HeroUIProvider } from "@/components/theme/HeroUIProvider";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevPilot AI - AI-Powered Software Architecture & Planning",
  description: "Transform your software ideas into production-ready blueprints, database schemas, and folder structures with DevPilot AI.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
       suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <HeroUIProvider>
          <Navbar></Navbar>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </HeroUIProvider>
      </body>
    </html>
  );
}