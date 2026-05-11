import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { normalizeIdentifier } from "@/lib/auth-utils";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,24}$/;

const validateIdentifier = (value: string) => {
  const identifier = value.trim();
  if (!identifier) return "Enter your email or username";
  if (identifier.includes("@") && !emailPattern.test(identifier)) return "Enter a valid email address";
  if (!identifier.includes("@") && !usernamePattern.test(identifier)) return "Use 3-24 letters, numbers, or underscores";
  return null;
};

const validatePassword = (value: string) => {
  if (!value) return "Enter your password";
  if (value.length < 8) return "Password must be at least 8 characters";
  return null;
};

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const helperCopy = useMemo(() => {
    const normalized = identifier ? normalizeIdentifier(identifier) : null;
    if (!normalized) return "Use email or a unique username.";
    return normalized.username ? `Username login will use @${normalized.username}` : "Email login is protected by Supabase Auth.";
  }, [identifier]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const identifierError = validateIdentifier(identifier);
    const passwordError = validatePassword(password);
    if (identifierError || passwordError) {
      setError(identifierError || passwordError);
      return;
    }

    setLoading(true);
    try {
      if (!remember && !isRegister) {
        window.sessionStorage.setItem("vs_prefer_session_only", "true");
      } else {
        window.sessionStorage.removeItem("vs_prefer_session_only");
      }
      if (isRegister) {
        await signUp(identifier, password);
        setSuccess("Account created. Opening your dashboard...");
      } else {
        await signIn(identifier, password);
        setSuccess("Welcome back. Opening your dashboard...");
      }
      window.setTimeout(() => navigate(destination, { replace: true }), 350);
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Something went wrong";
      if (!isRegister && message.toLowerCase().includes("not found")) setError("Account not found");
      else if (!isRegister) setError("Invalid password");
      else setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-md"
    >
      <div className="mb-6 text-center lg:hidden">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#4A3528] text-[#FFFDF7] shadow-xl shadow-[#4A3528]/20">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="text-xl font-black text-[#4A3528]">VyapaarSaathi AI</div>
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#7D9275]">Business strategy platform</div>
      </div>

      <div className="rounded-[2rem] border border-[#D8CDBB] bg-[#FFFDF7]/86 p-5 shadow-2xl shadow-[#4A3528]/12 backdrop-blur-xl sm:p-7">
        <div className="mb-7">
          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#7D9275]">
            {isRegister ? "Create founder workspace" : "Welcome back"}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#4A3528]">
            {isRegister ? "Register your strategy account" : "Login to your dashboard"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6F5A49]">
            {isRegister
              ? "Start with a secure account for business plans, compliance progress, and AI advisory."
              : "Access your AI-powered launch plan, funding intelligence, and compliance workspace."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="group mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#D8CDBB] bg-[#F7F4EC] px-4 py-3 text-sm font-black text-[#4A3528] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7D9275] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 text-[#7D9275]" />}
          Continue with Google / Gmail
        </button>

        <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#8B6A4E]/70">
          <div className="h-px flex-1 bg-[#D8CDBB]" />
          or use password
          <div className="h-px flex-1 bg-[#D8CDBB]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#5C4635]">Email or username</span>
            <input
              value={identifier}
              onChange={event => setIdentifier(event.target.value)}
              autoComplete={isRegister ? "username" : "username"}
              placeholder="founder@company.com or startupfounder"
              className="w-full rounded-2xl border border-[#D8CDBB] bg-[#F7F4EC] px-4 py-3 text-sm font-bold text-[#4A3528] outline-none transition placeholder:text-[#8B6A4E]/55 focus:border-[#7D9275] focus:bg-[#FFFDF7] focus:ring-4 focus:ring-[#7D9275]/15"
            />
            <span className="mt-2 block text-xs text-[#7B6A5A]">{helperCopy}</span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#5C4635]">Password</span>
            <div className="relative">
              <input
                value={password}
                onChange={event => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-[#D8CDBB] bg-[#F7F4EC] px-4 py-3 pr-12 text-sm font-bold text-[#4A3528] outline-none transition placeholder:text-[#8B6A4E]/55 focus:border-[#7D9275] focus:bg-[#FFFDF7] focus:ring-4 focus:ring-[#7D9275]/15"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl text-[#6F5A49] transition hover:bg-[#E9E1D2]" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {!isRegister && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 font-bold text-[#6F5A49]">
                <input checked={remember} onChange={event => setRemember(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-[#D8CDBB] accent-[#7D9275]" />
                Remember me
              </label>
              <button type="button" className="font-black text-[#7D9275] transition hover:text-[#4A3528]">Forgot password?</button>
            </div>
          )}

          {(error || success) && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-bold ${error ? "border-[#B66A55]/35 bg-[#B66A55]/10 text-[#7A3326]" : "border-[#7D9275]/35 bg-[#7D9275]/12 text-[#4F6548]"}`}>
              {error ? <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> : <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />}
              <span>{error || success}</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4A3528] px-5 py-3.5 text-sm font-black text-[#FFFDF7] shadow-xl shadow-[#4A3528]/20 transition hover:bg-[#5C4635] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isRegister ? "Create secure account" : "Login to dashboard"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </motion.button>
        </form>

        <div className="mt-6 rounded-2xl bg-[#F4EFE3] p-4 text-center text-sm font-bold text-[#6F5A49]">
          {isRegister ? "Already have an account?" : "New to VyapaarSaathi AI?"}{" "}
          <Link to={isRegister ? "/login" : "/register"} className="font-black text-[#7D9275] hover:text-[#4A3528]">
            {isRegister ? "Login" : "Create account"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
