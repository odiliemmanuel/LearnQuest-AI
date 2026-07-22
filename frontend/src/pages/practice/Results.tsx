import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Star, RotateCcw, LayoutDashboard, PenLine } from "lucide-react";
import AppShell from "../../layouts/AppShell";

interface ReviewItem {
  text: string;
  correct: boolean;
  feedback: string;
}

interface ResultsState {
  subject: string;
  topic: string;
  className: string;
  score: number;
  total: number;
  review: ReviewItem[];
}

export default function Results() {
  const { state } = useLocation() as { state: ResultsState | null };
  const navigate = useNavigate();

  if (!state) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <button onClick={() => navigate("/dashboard")} className="text-primary-600 font-semibold">
            No results to show — back to dashboard
          </button>
        </div>
      </AppShell>
    );
  }

  const { subject, topic, className, score, total, review } = state;
  const percentage = Math.round((score / total) * 100);
  const xpEarned = score * 10;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-center relative overflow-hidden mb-6"
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-primary-100 font-semibold">
            {className} · {subject} · {topic}
          </p>
          <h1 className="relative font-sora text-5xl font-bold text-white mt-2">
            {score}/{total}
          </h1>
          <p className="relative text-primary-100 mt-1">{percentage}% correct</p>
          <div className="relative inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2 mt-4">
            <Star className="w-4 h-4 text-amber-300" />
            <span className="text-white font-semibold text-sm">+{xpEarned} XP earned</span>
          </div>
        </motion.div>

        {review && review.length > 0 && (
          <div className="lq-card rounded-3xl p-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Question review
            </p>
            <div className="space-y-3">
              {review.map((r, i) => (
                <div key={i} className="bg-white dark:bg-panel-dark rounded-xl p-4 border border-sky-100 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    {r.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {i + 1}. {r.text}
                      </p>
                      {!r.correct && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{r.feedback}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/theory-practice", { state: { subject, topic, className } })}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition"
          >
            <PenLine className="w-4 h-4" /> Try theory questions
          </button>
          <button
            onClick={() => navigate("/practice", { state: { subject, topic, className } })}
            className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-3.5 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-slate-900 dark:hover:border-slate-600 transition"
          >
            <RotateCcw className="w-4 h-4" /> Practice again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-3.5 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-slate-900 dark:hover:border-slate-600 transition"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </div>
    </AppShell>
  );
}
