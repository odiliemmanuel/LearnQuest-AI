import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Star, Sparkles, Calculator, Atom, FlaskConical, Landmark, Dna, BookOpen, Loader2 } from "lucide-react";

import AppShell from "../../layouts/AppShell";
import ContinueLearningCard from "../../components/dashboard/ContinueLearningCard";
import SubjectCard from "../../components/dashboard/SubjectCard";
import WeeklyActivityChart from "../../components/dashboard/WeeklyActivityChart";
import CurriculumSelector from "../../components/dashboard/CurriculumSelector";
import { getDashboardSummary, type DashboardSummary } from "../../lib/api";

const aiTutorPrompts = ["Explain this topic simply", "Why is my answer wrong?", "Give me another example"];

// Styling lookup by subject name — the backend only sends subject/progress
// numbers, icons and tints stay a frontend concern.
const subjectStyle: Record<string, { icon: typeof Atom; tint: "blue" | "indigo" | "emerald" | "amber" | "rose" }> = {
  Physics: { icon: Atom, tint: "blue" },
  Mathematics: { icon: Calculator, tint: "indigo" },
  "English Language": { icon: BookOpen, tint: "emerald" },
  Chemistry: { icon: FlaskConical, tint: "amber" },
  Biology: { icon: Dna, tint: "rose" },
  Government: { icon: Landmark, tint: "blue" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load your dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-canvas-dark flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-canvas-dark flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{error || "Couldn't load your dashboard."}</p>
          <button onClick={() => navigate("/login")} className="text-primary-600 font-semibold">
            Back to login
          </button>
        </div>
      </div>
    );
  }

  const { user, subjects, weekly } = summary;

  // No attempts yet? Point new students at the one seeded topic so the demo
  // always has something to click into. Once you track "last active topic"
  // on the backend, swap this for that.
  const nextTopic = subjects[0] ?? { subject: "Physics" };

  return (
    <AppShell>
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 sm:p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="font-sora text-2xl sm:text-3xl font-bold text-white">Welcome back, {user.name.split(" ")[0]} 👋</h1>
            <p className="text-primary-100 mt-1.5">
              {user.streak > 0 ? `You're on a ${user.streak}-day streak — keep it going today.` : "Practice today to start your streak."}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-orange-300" />
              <div>
                <p className="text-white font-bold leading-none">{user.streak}</p>
                <p className="text-primary-100 text-xs mt-0.5">day streak</p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-300" />
              <div>
                <p className="text-white font-bold leading-none">{user.xp.toLocaleString()}</p>
                <p className="text-primary-100 text-xs mt-0.5">XP points</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue learning + AI tutor */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <ContinueLearningCard
            className={user.classLevel || "SS2"}
            subject={nextTopic.subject}
            topic="Waves"
            questionsComplete={subjects[0]?.correct ?? 0}
            questionsTotal={5}
            onContinue={() => navigate("/practice", { state: { subject: nextTopic.subject, topic: "Waves" } })}
          />
        </div>

        <div className="rounded-3xl lq-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">AI Tutor</p>
          </div>
          <div className="space-y-2">
            {aiTutorPrompts.map((q) => (
              <button
                key={q}
                onClick={() => navigate("/ai-tutor", { state: { prompt: q, subject: nextTopic.subject, topic: "Waves" } })}
                className="w-full text-left text-sm px-3.5 py-2.5 rounded-xl border-2 border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/30 text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:shadow-sm transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly activity + subjects */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <WeeklyActivityChart data={weekly} />
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">Your subjects</p>
          {subjects.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No practice sessions yet — try Physics · Waves below to see progress show up here.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {subjects.map((s) => {
                const style = subjectStyle[s.subject] ?? { icon: BookOpen, tint: "blue" as const };
                return (
                  <SubjectCard
                    key={s.subject}
                    name={s.subject}
                    icon={style.icon}
                    progress={s.progress}
                    tint={style.tint}
                    onClick={() => navigate("/curriculum", { state: { subject: s.subject } })}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full curriculum browser */}
      <div className="rounded-3xl lq-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">Browse full curriculum</p>
        <CurriculumSelector />
      </div>
    </AppShell>
  );
}
