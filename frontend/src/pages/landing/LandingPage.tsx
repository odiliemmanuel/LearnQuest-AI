import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Zap, Users, TrendingUp, Library,
  CheckCircle2, ArrowRight, Flame, Star, GraduationCap, BookOpen
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant AI Feedback",
    description: "Get an explanation the moment you answer — right or wrong — scaled to your class level.",
  },
  {
    icon: CheckCircle2,
    title: "WAEC & NECO Aligned",
    description: "Every question follows the official Nigerian curriculum and past exam standards.",
  },
  {
    icon: Users,
    title: "Teacher Insights",
    description: "Teachers see exactly where each student is struggling and can step in early.",
  },
  {
    icon: Flame,
    title: "Streaks, XP & Challenges",
    description: "Daily streaks and XP keep practice consistent, not a one-time cram session.",
  },
  {
    icon: Library,
    title: "Textbook Library",
    description: "Browse approved textbooks by subject and topic, right inside the app.",
  },
  {
    icon: GraduationCap,
    title: "Built For Every Level",
    description: "From JSS1 to SS3 — explanations scale with how much the student already understands.",
  },
];

const steps = [
  { number: "01", title: "Pick your class & topic", description: "Class, term, subject, then the exact topic you're struggling with." },
  { number: "02", title: "Practice with instant feedback", description: "Answer AI-generated questions and know immediately if you're right, with an explanation either way." },
  { number: "03", title: "Go deeper with the AI Tutor", description: "Ask for another example, a simpler explanation, or exactly where your working went wrong." },
  { number: "04", title: "Track your progress", description: "Earn XP, keep your streak alive, and watch weak topics turn into strengths." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-sora text-xl font-bold">LearnQuest</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition">How it works</a>
            <a href="#teachers" className="hover:text-primary-600 dark:hover:text-primary-400 transition">For Teachers</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition">
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold bg-gradient-to-br from-primary-600 to-primary-800 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-slate-900 text-primary-700 dark:text-primary-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" /> Built for Nigerian secondary schools
          </div>
          <h1 className="font-sora text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Practice smarter.
            <br />
            <span className="bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Master WAEC & NECO.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-lg">
            LearnQuest gives every student instant, personalized feedback the moment they answer a question —
            no more waiting days to find out what went wrong.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-primary-600 to-primary-800 text-white px-7 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-primary-600/30 transition"
            >
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-slate-900 dark:hover:border-slate-600 transition"
            >
              See how it works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span>✅ Free to start</span>
            <span>✅ JSS1 – SS3</span>
            <span>✅ No card required</span>
          </div>
        </motion.div>

        {/* Signature moment: the instant-feedback mockup — this is the product's actual differentiator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-primary-600/20 to-primary-800/20 rounded-[2.5rem] blur-2xl" />
          <div className="relative lq-card rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-400">SS2 · Physics · Waves</span>
              <span className="text-sm font-semibold text-primary-600">Q3 of 20</span>
            </div>
            <p className="font-semibold text-lg mb-4">
              What happens to wave speed when frequency increases and wavelength stays constant?
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 flex items-center justify-between">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Wave speed increases</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400">
                Wave speed decreases
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400">
                Wave speed stays the same
              </div>
            </div>
            <div className="mt-5 p-4 rounded-xl bg-primary-50 dark:bg-slate-800 flex gap-3">
              <Sparkles className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Correct! </span>
                Since v = fλ, if wavelength stays the same and frequency rises, speed must rise too.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 dark:bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sora text-3xl lg:text-4xl font-bold">How LearnQuest works</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Four steps between "I don't get this topic" and "I've got this."
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="font-sora text-5xl font-bold text-primary-100 dark:text-slate-800">{step.number}</span>
                <h3 className="mt-3 font-bold text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-sora text-3xl lg:text-4xl font-bold">Everything a student needs to actually improve</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Not just another quiz app.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl lq-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Teachers */}
      <section id="teachers" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-10 lg:p-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" /> For Teachers
            </div>
            <h2 className="font-sora text-3xl lg:text-4xl font-bold">See exactly where each student is stuck</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              No more guessing who needs help. The teacher dashboard shows performance by topic, by student,
              and flags who's falling behind before an exam does.
            </p>
            <ul className="mt-6 space-y-3">
              {["Class-wide performance at a glance", "Per-student weak topics", "Exportable progress reports"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lq-card rounded-3xl shadow-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">SS2 Physics · Class Overview</p>
            {[
              { name: "Ada Nwosu", score: 88 },
              { name: "Tunde Bello", score: 54 },
              { name: "Zainab Musa", score: 71 },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm font-medium">{s.name}</span>
                <div className="flex items-center gap-2 w-32">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.score < 60 ? "bg-rose-500" : "bg-emerald-500"}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 w-8">{s.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-sora text-3xl lg:text-4xl font-bold text-white">
              Ready to stop guessing and start improving?
            </h2>
            <p className="mt-4 text-primary-100 max-w-xl mx-auto">
              Join LearnQuest today and get instant feedback on every question you practice.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition"
            >
              Create your free account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>© 2026 LearnQuest. Built for Nigerian students.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-600">Privacy</a>
            <a href="#" className="hover:text-primary-600">Terms</a>
            <a href="#" className="hover:text-primary-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
