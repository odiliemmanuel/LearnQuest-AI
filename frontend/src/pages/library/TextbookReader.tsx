import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import AppShell from "../../layouts/AppShell";

interface ReaderState {
  subject: string;
  topic: string;
  title: string;
  content: string;
}

export default function TextbookReader() {
  const { state } = useLocation() as { state: ReaderState | null };
  const navigate = useNavigate();

  if (!state) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <button onClick={() => navigate("/textbooks")} className="text-primary-600 font-semibold">
            No note selected — back to the library
          </button>
        </div>
      </AppShell>
    );
  }

  const { subject, topic, title, content } = state;
  const paragraphs = content.split("\n").filter((p) => p.trim().length > 0);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/textbooks")}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to library
        </button>

        <div className="lq-card rounded-3xl p-6 sm:p-10 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-600">
              {subject} · {topic}
            </span>
          </div>
          <h1 className="font-sora text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">{title}</h1>

          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Original condensed notes written for LearnQuest, not excerpted from any specific textbook.
          </div>

          <button
            onClick={() => navigate("/practice", { state: { subject, topic } })}
            className="mt-6 w-full bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition"
          >
            Practice this topic
          </button>
        </div>
      </div>
    </AppShell>
  );
}
