import { useState, useEffect } from "react";
import { Flame, Star, Award, Trophy, Loader2, Atom, Calculator, BookOpen, FlaskConical, Dna, Landmark } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import AppShell from "../../layouts/AppShell";
import { getDashboardSummary, type DashboardSummary } from "../../lib/api";

const subjectStyle: Record<string, { icon: typeof Atom; bg: string; text: string; bar: string }> = {
  Physics: { icon: Atom, bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400", bar: "bg-primary-600" },
  Mathematics: { icon: Calculator, bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400", bar: "bg-primary-600" },
  "English Language": { icon: BookOpen, bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-600" },
  Chemistry: { icon: FlaskConical, bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  Biology: { icon: Dna, bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-400", bar: "bg-rose-500" },
  Government: { icon: Landmark, bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400", bar: "bg-primary-600" },
};
const fallback = { icon: BookOpen, bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", bar: "bg-slate-500" };

// Nested cards need a visible tint since they now sit inside AppShell's
// own white/slate-900 card — plain white-on-white would disappear.
const cardBg = "lq-card";

export default function Progress() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  // TODO: badges are illustrative — there's no badge/achievement model on
  // the backend yet. Once you add one, replace `earned` with a real check.
  const badges = [
    { name: "7-Day Streak", icon: Flame, earned: (summary?.user.streak ?? 0) >= 7 },
    { name: "First Practice Session", icon: Star, earned: (summary?.subjects.length ?? 0) > 0 },
    { name: "Physics Novice", icon: Award, earned: !!summary?.subjects.find((s) => s.subject === "Physics" && s.progress > 0) },
    { name: "Top of Class", icon: Trophy, earned: false },
  ];

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!summary) return null;

  const { user, subjects, weekly } = summary;

  return (
    <AppShell>
      <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white mb-1">Your Progress</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Track your streak, XP, and mastery over time.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className={`${cardBg} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
            <Flame className="w-4 h-4 text-orange-500" /> Current streak
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{user.streak} days</p>
        </div>
        <div className={`${cardBg} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
            <Star className="w-4 h-4 text-amber-500" /> Total XP
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{user.xp.toLocaleString()}</p>
        </div>
        <div className={`${cardBg} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
            <Trophy className="w-4 h-4 text-primary-600" /> Badges earned
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{badges.filter((b) => b.earned).length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${cardBg} rounded-3xl p-6`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">Questions answered this week</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="questions" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardBg} rounded-3xl p-6`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">Badges</p>
          <div className="space-y-3">
            {badges.map((b) => (
              <div key={b.name} className={`flex items-center gap-3 p-3 rounded-xl ${b.earned ? "lq-card" : "opacity-40"}`}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shrink-0">
                  <b.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-3xl p-6 mt-6`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">Mastery by subject</p>
        {subjects.length === 0 ? (
          <p className="text-sm text-slate-400">Practice a topic to start building your mastery breakdown.</p>
        ) : (
          <div className="space-y-4">
            {subjects.map((s) => {
              const style = subjectStyle[s.subject] ?? fallback;
              return (
                <div key={s.subject} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}>
                    <style.icon className={`w-4 h-4 ${style.text}`} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 w-40 shrink-0">{s.subject}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${s.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-10 text-right">{s.progress}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
