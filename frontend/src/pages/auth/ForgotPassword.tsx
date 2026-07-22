import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to your real password-reset endpoint / Firebase sendPasswordResetEmail
    // await sendResetEmail(email);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={sent ? `We sent a reset link to ${email}` : "Enter your email and we'll send you a reset link."}
    >
      {sent ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-slate-800">
          <MailCheck className="w-5 h-5 text-primary-600 shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Follow the link in that email to set a new password. It expires in 30 minutes.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary-600">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
