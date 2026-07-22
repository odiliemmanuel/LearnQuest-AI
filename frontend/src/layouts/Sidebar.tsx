import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles, Home, BookOpen, TrendingUp, Library, Trophy, Settings,
  Flame, LogOut, Menu, X,
} from "lucide-react";
import { getStoredUser, clearSession, type AuthUser } from "../lib/api";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/curriculum", icon: BookOpen, label: "Learn" },
  { to: "/ai-tutor", icon: Sparkles, label: "AI Tutor" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/textbooks", icon: Library, label: "Textbooks" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

// The sidebar is permanently dark (bg-ink from its AppShell wrapper) in
// both light and dark mode, matching the reference kit's persistent dark
// rail — so its own text/hover colors don't need light/dark variants.
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition bg-primary-600 text-white shadow-lg shadow-primary-600/30"
    : "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition text-slate-400 hover:bg-white/5 hover:text-white";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getStoredUser<AuthUser>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    setMobileOpen(false);
    navigate("/login");
  };

  const UserBlock = () => (
    <div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {user?.name?.charAt(0) ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate text-white">{user?.name ?? "Guest"}</p>
          <p className="text-xs text-slate-400">{user?.classLevel ?? ""}</p>
        </div>
        <div className="flex items-center gap-1 text-orange-400 shrink-0">
          <Flame className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">{user?.streak ?? 0}</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
      >
        <LogOut className="w-4 h-4" /> Log out
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar: logo + hamburger, sitting on the same bg-ink panel */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-sora font-bold text-white">LearnQuest</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-300"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile slide-out drawer with the full nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-ink z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-sora font-bold text-lg text-white">LearnQuest</span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/5"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={navLinkClass}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <UserBlock />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col justify-between p-6 h-full">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-sora font-bold text-lg text-white">LearnQuest</span>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <UserBlock />
      </aside>
    </>
  );
}
