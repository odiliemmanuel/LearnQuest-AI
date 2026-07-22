import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BookOpen, ChevronRight, ArrowLeft, X } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { getLibrary, type LibrarySubject, type LibraryNote } from "../../lib/api";

const tintMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400" },
  indigo: { bg: "bg-primary-50 dark:bg-primary-950", text: "text-primary-600 dark:text-primary-400" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-400" },
};
const tintCycle = ["blue", "indigo", "emerald", "amber", "rose"] as const;

export default function Library() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<LibrarySubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<LibrarySubject | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getLibrary()
      .then((s) => {
        setSubjects(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Flat, cross-subject search results — searches title, topic, and
  // subject name at once. Only active when there's actually a query, so
  // the normal subject-grid / drill-down view is untouched otherwise.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const results: (LibraryNote & { subject: string })[] = [];
    for (const subj of subjects) {
      for (const note of subj.notes) {
        if (
          note.title.toLowerCase().includes(q) ||
          note.topic.toLowerCase().includes(q) ||
          subj.name.toLowerCase().includes(q)
        ) {
          results.push({ ...note, subject: subj.name });
        }
      }
    }
    return results;
  }, [query, subjects]);

  const openNote = (subject: string, note: LibraryNote) =>
    navigate("/textbooks/read", { state: { subject, ...note } });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white">Textbook Library</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Condensed study notes, written for LearnQuest — pick a subject, then read right here.
            </p>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl lq-card text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : subjects.length === 0 ? (
          <div className="lq-card rounded-3xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300 font-medium">No study notes yet.</p>
            <p className="text-sm text-slate-400 mt-1">
              Run <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">scripts/textbook_fetcher</code> to
              generate notes for the rest of the curriculum.
            </p>
          </div>
        ) : searchResults !== null ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for "{query}"
            </p>
            {searchResults.length === 0 ? (
              <div className="lq-card rounded-3xl p-8 text-center text-slate-500 dark:text-slate-400">
                No topics match that search.
              </div>
            ) : (
              <div className="lq-card rounded-3xl divide-y divide-sky-200 dark:divide-slate-800 overflow-hidden">
                {searchResults.map((note) => (
                  <button
                    key={`${note.subject}-${note.topic}`}
                    onClick={() => openNote(note.subject, note)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="w-5 h-5 text-primary-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">{note.title}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                          {note.subject} · {note.topic}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : !activeSubject ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subj, i) => {
              const t = tintMap[tintCycle[i % tintCycle.length]];
              return (
                <button
                  key={subj.name}
                  onClick={() => setActiveSubject(subj)}
                  className="text-left lq-card rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${t.bg}`}>
                    <BookOpen className={`w-5 h-5 ${t.text}`} />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">{subj.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {subj.notes.length} {subj.notes.length === 1 ? "topic" : "topics"}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setActiveSubject(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 mb-4">
              <ArrowLeft className="w-4 h-4" /> All subjects
            </button>
            <div className="lq-card rounded-3xl divide-y divide-sky-200 dark:divide-slate-800 overflow-hidden">
              {activeSubject.notes.map((note) => (
                <button
                  key={note.topic}
                  onClick={() => openNote(activeSubject.name, note)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BookOpen className="w-5 h-5 text-primary-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{note.title}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{note.topic}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
