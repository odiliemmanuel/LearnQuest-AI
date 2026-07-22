import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, ChevronRight } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { getPracticeQuestions, submitPracticeAnswer, type PracticeQuestion } from "../../lib/api";

type OptionKey = "A" | "B" | "C" | "D";

export default function Practice() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const topic = state?.topic ?? "Waves";
  const subject = state?.subject ?? "Physics";
  const className = state?.className ?? "SS2";

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [review, setReview] = useState<{ text: string; correct: boolean; feedback: string }[]>([]);

  useEffect(() => {
    getPracticeQuestions(subject, topic)
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
            {loadError || `No questions found yet for ${subject} · ${topic}.`}
          </p>
          <p className="text-xs text-slate-400">
            Make sure the backend is running on http://localhost:8080 — see the README.
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

  const chooseAnswer = async (key: OptionKey) => {
    if (feedback || submitting) return; // lock in after the first pick
    setSelected(key);
    setSubmitting(true);
    try {
      const res = await submitPracticeAnswer(question.id, key);
      setFeedback({ correct: res.correct, text: res.feedback });
      setAnswers((prev) => ({ ...prev, [question.id]: res.correct }));
      setReview((prev) => [...prev, { text: question.text, correct: res.correct, feedback: res.feedback }]);
    } catch (err) {
      setFeedback({ correct: false, text: err instanceof Error ? err.message : "Could not grade that answer." });
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (isLast) {
      const score = Object.values(answers).filter(Boolean).length;
      navigate("/results", { state: { subject, topic, className, score, total: questions.length, review } });
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setFeedback(null);
  };

  const optionState = (key: OptionKey) => {
    if (!feedback) return "idle";
    if (key === selected) return feedback.correct ? "correct" : "incorrect";
    return "dimmed";
  };

  const options: { key: OptionKey; text: string }[] = [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
  ];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-primary-600">
              {className} · {subject}
            </p>
            <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white">{topic}</h1>
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Question {current + 1} of {questions.length}
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
            animate={{ width: `${((current + (feedback ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lq-card rounded-3xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{question.text}</h2>

          <div className="space-y-3">
            {options.map((opt) => {
              const optState = optionState(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => chooseAnswer(opt.key)}
                  disabled={!!feedback || submitting}
                  className={`w-full flex items-center justify-between text-left p-4 rounded-xl border-2 transition ${
                    optState === "correct"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                      : optState === "incorrect"
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40"
                      : optState === "dimmed"
                      ? "border-slate-100 dark:border-slate-800 opacity-50"
                      : "border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      optState === "correct"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : optState === "incorrect"
                        ? "text-rose-700 dark:text-rose-400"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className="font-bold mr-2">{opt.key}.</span>
                    {opt.text}
                  </span>
                  {optState === "correct" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {optState === "incorrect" && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {submitting && <p className="text-sm text-slate-400 mt-4">Checking your answer...</p>}

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={`mt-6 p-4 rounded-xl flex gap-3 ${
                    feedback.correct ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-primary-50 dark:bg-slate-800"
                  }`}
                >
                  <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${feedback.correct ? "text-emerald-600" : "text-primary-600"}`} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{feedback.text}</p>
                </div>

                <button
                  onClick={goNext}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition"
                >
                  {isLast ? "See results" : "Next question"} <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppShell>
  );
}
