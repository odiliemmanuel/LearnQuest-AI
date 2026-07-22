import { useState, useEffect } from "react";
import { Trophy, Flame, Medal } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { getLeaderboard, type LeaderboardEntry } from "../../lib/api";

const medalColor: Record<number, string> = {
  1: "text-amber-500",
  2: "text-slate-400",
  3: "text-orange-400",
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getLeaderboard()
      .then((e) => {
        setEntries(e);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Could not load the leaderboard");
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white">Leaderboard</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Top XP earners across LearnQuest.</p>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : loadError ? (
          <p className="text-sm text-rose-600">{loadError}</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No students on the board yet — be the first to earn XP.</p>
        ) : (
          <div className="lq-card rounded-3xl overflow-hidden">
            {entries.map((s, i) => {
              const rank = i + 1;
              return (
                <div
                  key={s.name + i}
                  className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex items-center justify-center shrink-0">
                      {rank <= 3 ? (
                        <Medal className={`w-5 h-5 ${medalColor[rank]}`} />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">{rank}</span>
                      )}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{s.streak}</span>
                    </div>
                    <span className="text-sm font-bold text-primary-600 w-16 text-right">{s.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
