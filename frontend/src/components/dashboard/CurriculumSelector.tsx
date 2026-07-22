import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { getCurriculum, type CurriculumData } from "../../lib/api";

const tintMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400" },
  indigo: { bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-400" },
};
const tintCycle = ["blue", "indigo", "emerald", "amber", "rose"] as const;

// Shared "unselected" button treatment — was just a hover:border change
// before, which barely registers. Now hover swaps in a real background too.
const unselected =
  "border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/30 text-slate-600 dark:text-slate-300 hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 dark:hover:border-primary-400 cursor-pointer";
const selected = "border-primary-600 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400";

export default function CurriculumSelector() {
  const navigate = useNavigate();
  const [data, setData] = useState<CurriculumData | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<"class" | "term" | "subject" | "topic">("class");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    getCurriculum()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-400">Loading curriculum...</p>;
  if (!data) return <p className="text-sm text-rose-600">Could not load the curriculum. Is the backend running?</p>;

  const steps: { key: typeof step; label: string }[] = [
    { key: "class", label: "Class" },
    { key: "term", label: "Term" },
    { key: "subject", label: "Subject" },
    { key: "topic", label: "Topic" },
  ];

  const topicsForSubject = data.subjects.find((s) => s.name === selectedSubject)?.topics ?? [];
  const subjectsForClass = selectedClass
    ? data.subjects.filter((s) => s.classes.includes(selectedClass))
    : data.subjects;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer ${
                step === s.key
                  ? "bg-gradient-to-br from-primary-600 to-primary-800 text-white"
                  : "bg-sky-100 dark:bg-panel-dark text-slate-500 dark:text-slate-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-slate-800"
              }`}
            >
              {s.label}
              {s.key === "class" && selectedClass ? `: ${selectedClass}` : ""}
              {s.key === "term" && selectedTerm ? `: ${selectedTerm}` : ""}
              {s.key === "subject" && selectedSubject ? `: ${selectedSubject}` : ""}
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
          </div>
        ))}
      </div>

      {step === "class" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {data.classes.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedClass(c);
                setStep("term");
              }}
              className={`p-4 rounded-xl border-2 font-semibold text-sm transition ${selectedClass === c ? selected : unselected}`}
            >
              {c}
            </button>
          ))}
        </motion.div>
      )}

      {step === "term" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-3">
          {data.terms.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTerm(t);
                setStep("subject");
              }}
              className={`p-4 rounded-xl border-2 font-semibold text-sm transition ${selectedTerm === t ? selected : unselected}`}
            >
              {t}
            </button>
          ))}
        </motion.div>
      )}

      {step === "subject" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjectsForClass.map((s, i) => {
            const t = tintMap[tintCycle[i % tintCycle.length]];
            return (
              <button
                key={s.name}
                onClick={() => {
                  setSelectedSubject(s.name);
                  setStep("topic");
                }}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition ${
                  selectedSubject === s.name ? selected : unselected
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.bg}`}>
                  <span className={`text-xs font-bold ${t.text}`}>{s.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.name}</span>
              </button>
            );
          })}
          {subjectsForClass.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full">No subjects found for {selectedClass}.</p>
          )}
        </motion.div>
      )}

      {step === "topic" && selectedSubject && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {topicsForSubject.map((topic) => (
            <button
              key={topic}
              onClick={() =>
                navigate("/practice", {
                  state: { className: selectedClass, term: selectedTerm, subject: selectedSubject, topic },
                })
              }
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/30 hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 dark:hover:border-primary-400 transition text-left cursor-pointer"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{topic}</span>
              <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold">
                Start practice <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
          {topicsForSubject.length === 0 && (
            <p className="text-sm text-slate-400">No topics seeded for this subject yet — try Physics · Waves.</p>
          )}
        </motion.div>
      )}

      {selectedClass && selectedTerm && selectedSubject && step !== "topic" && (
        <button
          onClick={() => setStep("topic")}
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition cursor-pointer"
        >
          <Check className="w-4 h-4" /> Continue to topics
        </button>
      )}
    </div>
  );
}
