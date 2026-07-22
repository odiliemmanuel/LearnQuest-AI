import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Wraps any authenticated page in the same persistent shell Dashboard uses —
// Sidebar always visible on the left (desktop) or behind a hamburger menu
// (mobile), Navbar (search/theme/notifications) on top. Sidebar and content
// are separate panels (not one shared background) to match the reference
// dashboard kit — a persistent dark rail next to a light/dark content panel.
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark p-4 sm:p-6 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row gap-4 min-h-[92vh]">
        <div className="bg-ink rounded-[32px] lg:w-64 shrink-0 transition-colors duration-300">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto bg-panel dark:bg-panel-dark rounded-[32px] p-4 sm:p-6 transition-colors duration-300">
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  );
}
