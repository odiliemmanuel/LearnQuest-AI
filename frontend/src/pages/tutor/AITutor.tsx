import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Send, User } from "lucide-react";
import AppShell from "../../layouts/AppShell";
import { chatWithTutor } from "../../lib/api";

type Message = { role: "user" | "ai"; text: string };

const quickPrompts = [
  "Explain this topic simply",
  "Why is my answer wrong?",
  "Give me another example",
  "Teach me like I'm preparing for WAEC",
];

export default function AITutor() {
  const { state } = useLocation();
  const subject = state?.subject ?? "Physics";
  const topic = state?.topic ?? "Waves";

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: `Hi! I'm your AI tutor for ${subject} · ${topic}. Ask me anything, or pick a quick prompt below.` },
  ]);
  const [input, setInput] = useState(state?.prompt ?? "");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);

    try {
      const res = await chatWithTutor(text, subject, topic);
      setMessages((m) => [...m, { role: "ai", text: res.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: err instanceof Error ? err.message : "Sorry, I couldn't reach the tutor service." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-sora text-xl font-bold text-slate-900 dark:text-white">AI Tutor</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subject} · {topic}
            </p>
          </div>
        </div>

        <div className="lq-card rounded-3xl p-5 sm:p-6 flex flex-col overflow-hidden min-h-[520px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[420px]">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    m.role === "user" ? "bg-panel dark:bg-panel-dark" : "bg-gradient-to-br from-primary-600 to-primary-800"
                  }`}
                >
                  {m.role === "user" ? <User className="w-4 h-4 text-slate-500" /> : <Sparkles className="w-4 h-4 text-white" />}
                </div>
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-primary-600 text-white rounded-tr-sm"
                      : "bg-panel dark:bg-panel-dark text-slate-700 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-sm bg-panel dark:bg-panel-dark text-slate-400 text-sm">Thinking...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            {quickPrompts.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs font-medium px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-400 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            <button
              type="submit"
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shrink-0 hover:shadow-lg hover:brightness-110 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
