import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { getTheoryQuestions, gradeTheoryAnswer, type TheoryQuestion } from "../../lib/api";

type Verdict = "correct" | "partial" | "incorrect";

export default function TheoryPractice() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const topic = state?.topic ?? "Waves";
  const subject = state?.subject ?? "Physics";

  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ verdict: Verdict; feedback: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTheoryQuestions(subject, topic)
      .then((qs) => {
        setQuestions(qs);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Could not load questions");
        setLoading(false);
      });
  }, [subject, topic]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400">
          Loading questions...
        </div>
      </AppShell>
    );
  }

  if (loadError || questions.length === 0) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center px-6">
          <p className="text-slate-600 dark:text-slate-300">
            {loadError || `No theory questions found yet for ${subject} · ${topic}.`}
          </p>
          <button onClick={() => navigate("/dashboard")} className="text-primary-600 font-semibold text-sm mt-2">
            Back to dashboard
          </button>
        </div>
      </AppShell>
    );
  }

  const question = questions[current];
  const isLast = current === questions.length - 1;

  const submitAnswer = async () => {
    setSubmitting(true);
    try {
      const res = await gradeTheoryAnswer(question.id, answer);
      setResult({ verdict: res.verdict, feedback: res.feedback });
    } catch (err) {
      setResult({ verdict: "incorrect", feedback: err instanceof Error ? err.message : "Could not grade that answer." });
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (isLast) {
      navigate("/dashboard");
      return;
    }
    setCurrent((c) => c + 1);
    setAnswer("");
    setResult(null);
  };

  const verdictStyles: Record<Verdict, string> = {
    correct: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-400",
    partial: "bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-700 dark:text-amber-400",
    incorrect: "bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-400",
  };

  const verdictLabel: Record<Verdict, string> = {
    correct: "Correct",
    partial: "Partially correct",
    incorrect: "Not quite",
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-primary-600">
              {subject} · {topic} · Theory
            </p>
            <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white">Written answer practice</h1>
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {current + 1} of {questions.length}
          </span>
        </div>

        <div className="lq-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{question.prompt}</h2>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!!result}
            rows={6}
            placeholder="Type your full working and answer here..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-70"
          />

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.button
                key="submit"
                onClick={submitAnswer}
                disabled={!answer.trim() || submitting}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition disabled:opacity-50"
              >
                {submitting ? "Checking your answer..." : "Submit answer"}
              </motion.button>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <div className={`mt-6 p-4 rounded-xl border-2 flex gap-3 ${verdictStyles[result.verdict]}`}>
                  {result.verdict === "correct" ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{verdictLabel[result.verdict]}</p>
                    <p className="text-sm mt-1 opacity-90">{result.feedback}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  This grader checks for key terms only — a real AI grader should understand full working, not just keywords.
                </div>

                <button
                  onClick={goNext}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  {isLast ? "Finish" : "Next question"} <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
