import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyOtp, resendOtp, setSession } from "../../lib/api";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email: string | undefined = state?.email;
  const devOtp: string | undefined = state?.devOtp;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!email) {
    return (
      <AuthLayout title="No email to verify" subtitle="Start from sign up again.">
        <Link to="/signup" className="text-primary-600 font-semibold text-sm">
          Back to sign up
        </Link>
      </AuthLayout>
    );
  }

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp(email, code);
      setSession(res.token, res.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await resendOtp(email);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit code we sent to ${email}`}>
      {devOtp && (
        <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-700 dark:text-amber-400">
          <strong>Dev mode:</strong> no email service is wired up yet, so your code is <strong>{devOtp}</strong> — this
          banner disappears once you connect a real email provider on the backend.
        </div>
      )}

      <div className="flex justify-between gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        ))}
      </div>

      {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="mt-6 w-full bg-gradient-to-br from-primary-600 to-primary-800 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify account"}
      </button>

      <div className="mt-5 text-center text-sm">
        {countdown > 0 ? (
          <span className="text-slate-400">Resend code in {countdown}s</span>
        ) : (
          <button onClick={handleResend} disabled={resending} className="text-primary-600 font-semibold">
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>

      <Link
        to="/signup"
        className="mt-4 flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign up
      </Link>
    </AuthLayout>
  );
}
