import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { User, Mail, Bell, Moon, Sun, LogOut } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { clearSession, getStoredUser } from "../../lib/api";

const classes = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const storedUser = getStoredUser<{ name: string; email: string; classLevel: string }>();

  // TODO: wire the onChange handlers below to a real "update profile" API call —
  // right now editing these fields only updates local component state.
  const [name, setName] = useState(storedUser?.name ?? "");
  const [studentClass, setStudentClass] = useState(storedUser?.classLevel ?? "SS2");
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h1>

        <div className="lq-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
            <div className="mt-1.5 relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={storedUser?.email ?? ""}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Class</label>
            <div className="mt-1.5 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {classes.map((c) => (
                <button
                  key={c}
                  onClick={() => setStudentClass(c)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition cursor-pointer ${
                    studentClass === c
                      ? "border-primary-600 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                      : "border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/30 text-slate-600 dark:text-slate-300 hover:border-primary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/50 dark:hover:text-primary-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily practice reminders</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition relative shrink-0 cursor-pointer ${notifications ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-slate-400" />}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark mode</span>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`w-11 h-6 rounded-full transition relative shrink-0 cursor-pointer ${isDark ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900 text-rose-600 py-3 rounded-xl font-semibold hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/30 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>
    </AppShell>
  );
}
