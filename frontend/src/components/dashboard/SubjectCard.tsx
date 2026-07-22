import { LucideIcon } from "lucide-react";

const tintMap: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400", bar: "bg-primary-600" },
  indigo: { bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400", bar: "bg-primary-600" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-600" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-400", bar: "bg-rose-500" },
};

interface SubjectCardProps {
  name: string;
  icon: LucideIcon;
  progress: number;
  tint?: keyof typeof tintMap;
  onClick?: () => void;
}

export default function SubjectCard({ name, icon: Icon, progress, tint = "blue", onClick }: SubjectCardProps) {
  const t = tintMap[tint];

  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 lq-grid-item p-4 flex items-center gap-3 hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left w-full cursor-pointer"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${t.bg}`}>
        <Icon className={`w-5 h-5 ${t.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{name}</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">{progress}%</span>
    </button>
  );
}
