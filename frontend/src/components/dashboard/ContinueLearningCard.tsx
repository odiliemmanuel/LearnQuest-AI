import { ChevronRight } from "lucide-react";

interface ContinueLearningCardProps {
  className: string;
  subject: string;
  topic: string;
  questionsComplete: number;
  questionsTotal: number;
  onContinue: () => void;
}

export default function ContinueLearningCard({
  className,
  subject,
  topic,
  questionsComplete,
  questionsTotal,
  onContinue,
}: ContinueLearningCardProps) {
  const percent = Math.round((questionsComplete / questionsTotal) * 100);

  return (
    <div className="rounded-3xl lq-card p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Continue learning
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {className} · {subject} · {topic}
          </h3>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            {questionsComplete} of {questionsTotal} practice questions complete
          </p>
          <div className="mt-3 w-48 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <button
          onClick={onContinue}
          className="shrink-0 flex items-center gap-1.5 bg-gradient-to-br from-primary-600 to-primary-800 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary-600/30 transition"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
