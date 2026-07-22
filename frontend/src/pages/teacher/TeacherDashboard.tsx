import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, TrendingDown, AlertTriangle, Search, ChevronDown } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { getTeacherStudents, type TeacherStudent } from "../../lib/api";

export default function TeacherDashboard() {
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getTeacherStudents()
      .then((s) => {
        setStudents(s);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Could not load students");
        setLoading(false);
      });
  }, []);

  const classAverage = students.length ? Math.round(students.reduce((s, st) => s + st.avgScore, 0) / students.length) : 0;
  const atRisk = students.filter((s) => s.avgScore < 60).length;

  const topicCounts: Record<string, number> = {};
  students.forEach((s) => s.weakTopics.forEach((t) => (topicCounts[t] = (topicCounts[t] || 0) + 1)));
  const weakestTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-sora text-lg font-bold text-slate-900 dark:text-white">LearnQuest · Teacher</span>
      </div>
      <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white mt-4">Class Overview</h1>

      {loading ? (
        <p className="text-sm text-slate-400 mt-6">Loading class data...</p>
      ) : loadError ? (
        <p className="text-sm text-rose-600 mt-6">{loadError}</p>
      ) : (
        <>
          {students.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              No students have signed up yet — this list fills in as students register and practice.
            </p>
          )}

          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-6">
            <div className="lq-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                <Users className="w-4 h-4" /> Class average
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{classAverage}%</p>
            </div>
            <div className="lq-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                <AlertTriangle className="w-4 h-4" /> Students at risk
              </div>
              <p className="text-3xl font-bold text-rose-600">{atRisk}</p>
            </div>
            <div className="lq-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                <TrendingDown className="w-4 h-4" /> Weakest topic
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{weakestTopic}</p>
            </div>
          </div>

          <div className="lq-card rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="font-semibold text-slate-900 dark:text-white">Students</p>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-400 w-48">
                <Search className="w-4 h-4" /> Search students...
              </div>
            </div>
            <div>
              {students.map((s) => (
                <div key={s.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-primary-50/60 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.classLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-2 w-32">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${s.avgScore < 60 ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${s.avgScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-8">{s.avgScore}%</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded === s.id ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {expanded === s.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-5 overflow-hidden">
                      {s.weakTopics.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {s.weakTopics.map((t) => (
                            <span
                              key={t}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            >
                              Struggling: {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">No flagged weak topics yet</p>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
