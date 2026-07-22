import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, CheckCircle2, Users, Flame, Star } from "lucide-react";

const perks = [
  { icon: Zap, text: "Instant AI feedback" },
  { icon: CheckCircle2, text: "WAEC & NECO aligned" },
  { icon: Users, text: "Built for JSS1 – SS3" },
];

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-canvas dark:bg-canvas-dark transition-colors duration-300">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900 p-12 flex-col justify-between">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-sora text-xl font-bold text-white">LearnQuest</span>
        </div>

        <div className="relative">
          <h2 className="font-sora text-3xl font-bold text-white leading-tight mb-8">
            Feedback the moment you need it — not days later.
          </h2>

          {/* Live product mockup — the same "instant feedback" moment from the
              landing page, so sign-up reinforces what the product actually does
              instead of a generic decorative image. */}
          <div className="relative mb-8">
            {/* Floating stat chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-4 z-10 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">6</p>
                <p className="text-slate-400 text-[10px] mt-0.5">day streak</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-4 -right-6 z-10 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">+50</p>
                <p className="text-slate-400 text-[10px] mt-0.5">XP earned</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">SS2 · Physics · Waves</span>
                <span className="text-xs font-semibold text-primary-600">Q3 of 20</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                What happens to wave speed when frequency increases and wavelength stays constant?
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-between mb-2">
                <span className="text-emerald-700 text-sm font-medium">Wave speed increases</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <div className="p-3 rounded-xl border border-slate-100 text-slate-300 text-sm">Wave speed decreases</div>
              <div className="mt-3 p-3 rounded-xl bg-primary-50 flex gap-2">
                <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Correct! </span>
                  v = fλ — wavelength stayed the same, so speed rises with frequency.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full pl-2 pr-3.5 py-1.5">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <p.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-primary-50">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-primary-100 text-sm">© 2026 LearnQuest</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/80 dark:bg-panel-dark/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/5 p-8 sm:p-10"
        >
          <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
