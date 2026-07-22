import AppShell from "../../layouts/AppShell";
import CurriculumSelector from "../../components/dashboard/CurriculumSelector";

export default function Curriculum() {
  return (
    <AppShell>
      <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white mb-1">Browse the curriculum</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Pick your class, term, subject, and topic to start a practice session.
      </p>

      <div className="lq-card rounded-3xl p-6 sm:p-8">
        <CurriculumSelector />
      </div>
    </AppShell>
  );
}
