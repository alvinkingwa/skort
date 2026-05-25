// ─────────────────────────────────────────────
//  src/components/AuthModal.tsx
//  Changes vs previous version:
//  - Added apiRegisterModel() targeting /skort_app/profiles/open/signup/model
//  - mapToAuthUser now has safe fallbacks for token/role (signup may not return them)
//  - Register panel now collects: firstName, lastName, email, password, gender,
//    idNumber, location, country, dob, phoneNumber, landmark
//  - Added Select helper component for gender dropdown
//  - Register panel container is now scrollable (overflow-y-auto) to handle extra fields
//  - handleRegister now calls apiRegisterModel with full payload
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  X,
  Flame,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ChevronLeft,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Calendar,
} from "lucide-react";
import { brand, brandDark, brandText } from "../theme";
import { useAuth, AuthUser } from "../context/AuthContext";

// ── Types ─────────────────────────────────────
type Panel = "login" | "register";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  reason?: string;
  normaliseUser?: (raw: Record<string, unknown>) => AuthUser;
}

interface FieldProps {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  right?: { onClick: () => void; icon: React.ReactNode };
}

// Added: SelectProps for gender dropdown
interface SelectProps {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (
            cb: (n: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void,
          ) => void;
          renderButton: (
            el: HTMLElement,
            config: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

// ── API envelope unwrapper ────────────────────
interface LoginData {
  email: string;
  role?: string; // Changed: made optional — signup response may omit it
  token?: string; // Changed: made optional — signup response may omit it
  refreshToken?: string;
  name?: string;
  fullName?: string;
}

interface ApiEnvelope {
  status: number;
  message: string;
  data: LoginData;
}

// Changed: role and token now fall back gracefully if absent in signup response
function mapToAuthUser(d: LoginData): AuthUser {
  return {
    id: d.email,
    email: d.email,
    name: d.fullName ?? d.name ?? d.email,
    role: d.role ? d.role.toUpperCase() : "MODEL",
    token: d.token ?? "",
  };
}

async function apiLoginEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/open/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );
  const envelope: ApiEnvelope = await res.json();
  if (!res.ok) throw new Error(envelope.message ?? "Login failed");
  return mapToAuthUser(envelope.data);
}

async function apiLoginGoogle(idToken: string): Promise<AuthUser> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/open/login/google`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  const envelope: ApiEnvelope = await res.json();
  if (!res.ok) throw new Error(envelope.message ?? "Google login failed");
  return mapToAuthUser(envelope.data);
}

// Added: full model signup payload type
interface ModelSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  idNumber: string;
  location: string;
  country: string;
  dob: string;
  phoneNumber: string;
  landmark: string;
}

// Added: apiRegisterModel — posts to the model signup endpoint
async function apiRegisterModel(
  payload: ModelSignupPayload,
): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("gender", payload.gender);
  formData.append("idNumber", payload.idNumber);
  formData.append("location", payload.location);
  formData.append("country", payload.country);
  formData.append("dob", payload.dob);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("landmark", payload.landmark);

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/open/signup/model`,
    {
      method: "POST",
      // ✅ No Content-Type header — browser sets it automatically with boundary
      body: formData,
    },
  );
  const envelope: ApiEnvelope = await res.json();
  if (!res.ok) throw new Error(envelope.message ?? "Registration failed");
  return mapToAuthUser(envelope.data);
}

// ── Google script loader ──────────────────────
function loadGoogleScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
    />
  </svg>
);

// ── Field ─────────────────────────────────────
const Field = ({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
  right,
}: FieldProps) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-800/60 border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
      onFocus={(e) => (e.target.style.borderColor = brand)}
      onBlur={(e) => (e.target.style.borderColor = "")}
    />
    {right && (
      <button
        type="button"
        onClick={right.onClick}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        {right.icon}
      </button>
    )}
  </div>
);

// Added: Select component for enum fields (gender)
const Select = ({
  icon: Icon,
  placeholder,
  value,
  onChange,
  options,
}: SelectProps) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none z-10" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-800/60 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors appearance-none"
      onFocus={(e) => (e.target.style.borderColor = brand)}
      onBlur={(e) => (e.target.style.borderColor = "")}
      style={{ color: value ? "white" : "#52525b" }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          style={{ background: "#18181b", color: "white" }}
        >
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const Divider = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-white/[0.07]" />
    <span className="text-[11px] text-zinc-600 font-medium">or</span>
    <div className="flex-1 h-px bg-white/[0.07]" />
  </div>
);

// ── Modal ─────────────────────────────────────
const AuthModal = ({ onClose, onSuccess, reason }: AuthModalProps) => {
  const { login } = useAuth();

  const [panel, setPanel] = useState<Panel>("login");
  const [animating, setAnimating] = useState<boolean>(false);

  // Login fields — unchanged
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showLoginPw, setShowLoginPw] = useState<boolean>(false);

  // Register fields — expanded for model signup
  const [regFirstName, setRegFirstName] = useState<string>(""); // Added
  const [regLastName, setRegLastName] = useState<string>(""); // Added
  const [regEmail, setRegEmail] = useState<string>("");

  const [regGender, setRegGender] = useState<string>(""); // Added
  const [regIdNumber, setRegIdNumber] = useState<string>(""); // Added
  const [regLocation, setRegLocation] = useState<string>(""); // Added
  const [regCountry, setRegCountry] = useState<string>(""); // Added
  const [regDob, setRegDob] = useState<string>(""); // Added
  const [regPhone, setRegPhone] = useState<string>(""); // Added
  const [regLandmark, setRegLandmark] = useState<string>(""); // Added

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoogleScript();
  }, []);

  const slideTo = (target: Panel): void => {
    if (animating || panel === target) return;
    setError(null);
    setAnimating(true);
    requestAnimationFrame(() => {
      setPanel(target);
      setTimeout(() => setAnimating(false), 350);
    });
  };

  const handleSuccess = (userData: AuthUser): void => {
    login(userData);
    onSuccess(userData);
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      await loadGoogleScript();
      if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        setError("Google Client ID not configured.");
        setLoading(false);
        return;
      }
      window.google!.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async ({ credential }: { credential: string }) => {
          try {
            const data = await apiLoginGoogle(credential);
            handleSuccess(data);
          } catch {
            setError("Google sign-in failed. Please try again.");
            setLoading(false);
          }
        },
        ux_mode: "popup",
        cancel_on_tap_outside: false,
      });
      window.google!.accounts.id.prompt((n) => {
        if (n.isNotDisplayed() || n.isSkippedMoment()) {
          const c = document.getElementById("g_id_signin_container");
          if (c) {
            window.google!.accounts.id.renderButton(c, {
              type: "standard",
              theme: "outline",
              size: "large",
            });
            (
              c.querySelector("div[role=button]") as HTMLElement | null
            )?.click();
          }
        }
      });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailLogin = async (): Promise<void> => {
    if (!loginEmail || !loginPassword) return;
    setError(null);
    setLoading(true);
    try {
      const data = await apiLoginEmail(loginEmail, loginPassword);
      handleSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Changed: now validates all required model fields and calls apiRegisterModel
  const handleRegister = async (): Promise<void> => {
    if (
      !regFirstName ||
      !regLastName ||
      !regEmail ||
      !regGender ||
      !regIdNumber ||
      !regLocation ||
      !regCountry ||
      !regDob ||
      !regPhone ||
      !regLandmark
    )
      return;

    setError(null);
    setLoading(true);
    try {
      const data = await apiRegisterModel({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        gender: regGender,
        idNumber: regIdNumber,
        location: regLocation,
        country: regCountry,
        dob: regDob,
        phoneNumber: regPhone,
        landmark: regLandmark,
      });
      handleSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Changed: all required model fields must be filled for the button to enable
  const registerReady =
    !!regFirstName &&
    !!regLastName &&
    !!regEmail &&
    !!regGender &&
    !!regIdNumber &&
    !!regLocation &&
    !!regCountry &&
    !!regDob &&
    !!regPhone &&
    !!regLandmark;

  const gradBg = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-sm relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        // Changed: increased max-height to accommodate scrollable register panel
        style={{ maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="flex"
          style={{
            width: "200%",
            transform: panel === "login" ? "translateX(0)" : "translateX(-50%)",
            transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {/* LOGIN PANEL — unchanged */}
          <div className="w-1/2 p-7 flex flex-col">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-xl"
              style={{ background: gradBg }}
            >
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white mb-1">
              {reason ?? "Welcome back"}
            </h2>
            <p className="text-xs text-zinc-500 mb-5">
              Sign in to your Skort account
            </p>

            {error && panel === "login" && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mb-3"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
              ) : (
                <GoogleIcon />
              )}
              {loading ? "Signing in…" : "Continue with Google"}
            </button>
            <div id="g_id_signin_container" className="hidden" />

            <Divider />

            <div className="space-y-2.5 mt-1">
              <Field
                icon={Mail}
                placeholder="Email address"
                value={loginEmail}
                onChange={setLoginEmail}
                type="email"
              />
              <Field
                icon={Lock}
                placeholder="Password"
                value={loginPassword}
                onChange={setLoginPassword}
                type={showLoginPw ? "text" : "password"}
                right={{
                  onClick: () => setShowLoginPw((v) => !v),
                  icon: showLoginPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  ),
                }}
              />
            </div>

            <button
              onClick={handleEmailLogin}
              disabled={loading || !loginEmail || !loginPassword}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm mt-3 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: gradBg }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" /> Sign In
                </>
              )}
            </button>

            <p className="text-center text-xs text-zinc-600 mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => slideTo("register")}
                className="font-bold transition-colors"
                style={{ color: brandText }}
              >
                Create one
              </button>
            </p>
          </div>

          {/* REGISTER PANEL — expanded with model signup fields, now scrollable */}
          <div className="w-1/2 flex flex-col" style={{ maxHeight: "90vh" }}>
            {/* Changed: sticky header so back button and title stay visible while scrolling */}
            <div className="p-7 pb-3">
              <button
                onClick={() => slideTo("login")}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors mb-5 w-fit"
              >
                <ChevronLeft className="w-4 h-4" /> Back to sign in
              </button>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                style={{ background: gradBg }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white mb-1">
                Become a model
              </h2>
              <p className="text-xs text-zinc-500">
                Fill in your details to create a model account
              </p>
            </div>

            {/* Changed: scrollable body for the form fields */}
            <div className="overflow-y-auto px-7 pb-7 flex-1">
              {error && panel === "register" && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                ) : (
                  <GoogleIcon />
                )}
                {loading ? "Signing up…" : "Sign up with Google"}
              </button>

              <Divider />

              {/* Changed: full model signup field set */}
              <div className="space-y-2.5 mt-1">
                <Field
                  icon={User}
                  placeholder="First name"
                  value={regFirstName}
                  onChange={setRegFirstName}
                />
                <Field
                  icon={User}
                  placeholder="Last name"
                  value={regLastName}
                  onChange={setRegLastName}
                />
                <Field
                  icon={Mail}
                  placeholder="Email address"
                  value={regEmail}
                  onChange={setRegEmail}
                  type="email"
                />

                {/* Added: gender select */}
                <Select
                  icon={User}
                  placeholder="Gender"
                  value={regGender}
                  onChange={setRegGender}
                  options={[
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                    { label: "Other", value: "OTHER" },
                  ]}
                />
                {/* Added: ID number */}
                <Field
                  icon={CreditCard}
                  placeholder="ID number"
                  value={regIdNumber}
                  onChange={setRegIdNumber}
                />
                {/* Added: date of birth */}
                <Field
                  icon={Calendar}
                  placeholder="Date of birth (YYYY-MM-DD)"
                  value={regDob}
                  onChange={setRegDob}
                />
                {/* Added: phone number */}
                <Field
                  icon={Phone}
                  placeholder="Phone number"
                  value={regPhone}
                  onChange={setRegPhone}
                  type="tel"
                />
                {/* Added: location */}
                <Field
                  icon={MapPin}
                  placeholder="Location"
                  value={regLocation}
                  onChange={setRegLocation}
                />
                {/* Added: landmark */}
                <Field
                  icon={MapPin}
                  placeholder="Landmark"
                  value={regLandmark}
                  onChange={setRegLandmark}
                />
                {/* Added: country */}
                <Field
                  icon={Globe}
                  placeholder="Country"
                  value={regCountry}
                  onChange={setRegCountry}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading || !registerReady}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm mt-3 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: gradBg }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" /> Create Account
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-zinc-700 mt-4 leading-relaxed">
                By registering you agree to our{" "}
                <span style={{ color: brandText }}>Terms of Service</span> and{" "}
                <span style={{ color: brandText }}>Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
