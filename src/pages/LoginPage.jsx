// ─────────────────────────────────────────────
//  src/pages/LoginPage.tsx
//  Changes vs original LoginPage.jsx:
//  - Converted to TSX with typed props
//  - LoginForm now calls the real API via login() from authApi.ts
//  - On success, calls useAuth().login() to store user in context
//  - Error state added — shows API error message below the button
//  - RegisterForm remains UI-only (no register endpoint provided yet)
//  - Removed mock setTimeout delays in LoginForm
// ─────────────────────────────────────────────

import { useState } from "react";
import {
  Flame, Mail, Lock, Eye, EyeOff,
  User, ArrowRight, Phone,
} from "lucide-react";
import { login as apiLogin } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

// ── InputField ────────────────────────────────
interface InputFieldProps {
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightSlot?: React.ReactNode;
}

const InputField = ({ icon: Icon, type = "text", placeholder, value, onChange, rightSlot }: InputFieldProps) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-zinc-800/60 border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500/60 focus:bg-zinc-800 transition-all"
    />
    {rightSlot && (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
    )}
  </div>
);

// ── LoginForm ─────────────────────────────────
interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading,  setLoading]  = useState<boolean>(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await apiLogin({ email, password });
      login(user);      // store in AuthContext + localStorage
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <InputField
        icon={Mail} type="email" placeholder="Email address"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        icon={Lock} type={showPass ? "text" : "password"} placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        rightSlot={
          <button onClick={() => setShowPass(!showPass)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <div className="flex justify-end">
        <button className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
          Forgot password?
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm hover:from-rose-400 hover:to-pink-400 transition-all shadow-lg shadow-rose-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><ArrowRight className="w-4 h-4" /> Sign In</>
        }
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-zinc-600">or continue with</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[{ label: "Google", logo: "G" }, { label: "M-Pesa", logo: "M" }].map(({ label, logo }) => (
          <button key={label}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800/60 border border-white/8 text-zinc-300 text-sm font-semibold hover:border-rose-500/30 hover:text-white transition-all"
          >
            <span className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-black">
              {logo}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── RegisterForm ──────────────────────────────
// UI-only for now — wire up when register endpoint is available.
interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [name,     setName]     = useState<string>("");
  const [phone,    setPhone]    = useState<string>("");
  const [email,    setEmail]    = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading,  setLoading]  = useState<boolean>(false);
  const [agreed,   setAgreed]   = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1200);
  };

  return (
    <div className="space-y-4">
      <InputField icon={User} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <InputField icon={Phone} placeholder="Phone number (e.g. 0712 345 678)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField
        icon={Lock} type={showPass ? "text" : "password"} placeholder="Create password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        rightSlot={
          <button onClick={() => setShowPass(!showPass)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAgreed(!agreed)}
          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
            agreed ? "bg-rose-500 border-rose-500" : "border-zinc-600 group-hover:border-zinc-400"
          }`}
        >
          {agreed && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="text-xs text-zinc-500 leading-relaxed">
          I am 18+ and agree to the{" "}
          <span className="text-rose-400 hover:underline cursor-pointer">Terms of Service</span>
          {" "}and{" "}
          <span className="text-rose-400 hover:underline cursor-pointer">Privacy Policy</span>
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading || !agreed}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm hover:from-rose-400 hover:to-pink-400 transition-all shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><ArrowRight className="w-4 h-4" /> Create Account</>
        }
      </button>
    </div>
  );
};

// ── Main page ─────────────────────────────────
interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-zinc-950 flex">

      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-rose-950 via-zinc-900 to-zinc-950 border-r border-white/5 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 30% 60%, #f43f5e 0%, transparent 65%)" }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/30">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">Sk<span className="text-rose-400">ort</span></span>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
            Connect with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
              Nairobi's finest
            </span><br />
            creators
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Chat, call or video with verified companions available right now — all payments via M-Pesa.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: "6+",     label: "Creators"   },
              { value: "4.8★",   label: "Avg Rating" },
              { value: "M-Pesa", label: "Payments"   },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/8 text-center">
                <div className="text-base font-black text-white">{value}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-zinc-700">© 2026 Skort · 18+ verified platform</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white">Sk<span className="text-rose-400">ort</span></span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {tab === "login" ? "Sign in to continue" : "Join Skort for free"}
            </p>
          </div>

          <div className="flex bg-zinc-800/60 rounded-xl p-1 mb-6 border border-white/5">
            {([{ id: "login", label: "Sign In" }, { id: "register", label: "Register" }] as const).map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  tab === id
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "login"
            ? <LoginForm onSuccess={onLogin} />
            : <RegisterForm onSuccess={onLogin} />
          }

          <p className="text-center text-xs text-zinc-600 mt-6">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
            >
              {tab === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;