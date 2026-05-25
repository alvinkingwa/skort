// ─────────────────────────────────────────────
//  components/CreatorSignupModal.jsx
// ─────────────────────────────────────────────
import { useState, useRef } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Globe,
  Landmark,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Camera,
  ImagePlus,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { useModelSignup } from "../hooks/useModelSignup.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.js";

const TOTAL_PAGES = 4;

const SPECIALTY_OPTIONS = [
  { label: "Deep Conversations", id: 1 },
  { label: "Life Coaching", id: 2 },
  { label: "Companionship", id: 3 },
  { label: "Entertainment", id: 4 },
  { label: "Storytelling", id: 5 },
  { label: "Advice", id: 6 },
  { label: "Mental Wellness", id: 7 },
  { label: "Motivation", id: 8 },
  { label: "Music Talk", id: 9 },
  { label: "Fun Chats", id: 10 },
  { label: "Stress Relief", id: 11 },
  { label: "Goal Setting", id: 12 },
  { label: "Humor", id: 13 },
  { label: "Positivity", id: 14 },
  { label: "Casual Chat", id: 15 },
];

// ─── primitives ──────────────────────────────
const Field = ({ icon: Icon, placeholder, value, onChange, type = "text" }) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-800/60 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
      onFocus={(e) => (e.target.style.borderColor = brand)}
      onBlur={(e) => (e.target.style.borderColor = "")}
    />
  </div>
);

const ProgressBar = ({ page }) => (
  <div className="flex items-center gap-1.5 mb-6">
    {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
      <div
        key={i}
        className="h-1 flex-1 rounded-full transition-all duration-300"
        style={{ background: i < page ? brand : "#27272a" }}
      />
    ))}
  </div>
);

const NavButtons = ({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  loading = false,
}) => (
  <div className="flex gap-3 pt-2">
    {onBack && (
      <button
        onClick={onBack}
        className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    )}
    <button
      onClick={onNext}
      disabled={nextDisabled || loading}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
      }}
      onMouseEnter={(e) => {
        if (!nextDisabled && !loading)
          e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`;
      }}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`)
      }
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  </div>
);

const PasswordField = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800/60 border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
        onFocus={(e) => (e.target.style.borderColor = brand)}
        onBlur={(e) => (e.target.style.borderColor = "")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

const OtpInput = ({ value, onChange }) => {
  const digits = 6;
  const arr = value.split("").concat(Array(digits).fill("")).slice(0, digits);
  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = arr
        .map((d, idx) => (idx === i ? "" : d))
        .join("")
        .trimEnd();
      onChange(next);
      if (i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
      return;
    }
    if (!/^[a-zA-Z0-9]$/.test(e.key)) return;
    const next = arr.map((d, idx) => (idx === i ? e.key : d)).join("");
    onChange(next);
    if (i < digits - 1) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  return (
    <div className="flex gap-2 justify-center">
      {arr.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(e, i)}
          className="w-11 h-12 text-center text-lg font-bold bg-zinc-800/60 border border-white/8 rounded-xl text-white focus:outline-none transition-colors"
          onFocus={(e) => (e.target.style.borderColor = brand)}
          onBlur={(e) => (e.target.style.borderColor = "")}
        />
      ))}
    </div>
  );
};

const ImagePicker = ({
  label,
  icon: Icon,
  preview,
  onPick,
  hint,
  wide = false,
}) => {
  const ref = useRef();
  return (
    <div>
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
        {label}
      </p>
      <div
        onClick={() => ref.current.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 transition-all overflow-hidden flex items-center justify-center ${wide ? "h-28 w-full" : "h-24 w-24"}`}
        style={
          preview
            ? {
                backgroundImage: `url(${preview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {!preview && (
          <div className="flex flex-col items-center gap-2 text-zinc-600">
            <Icon className="w-6 h-6" />
            <span className="text-xs">{hint}</span>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) onPick(URL.createObjectURL(f), f);
          }}
        />
      </div>
    </div>
  );
};

// ─── pages ───────────────────────────────────

// Page 1 — Personal info
const PagePersonal = ({ fields, set, onNext }) => {
  const required = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "gender",
    "idNumber",
    "dob",
  ];
  const canNext = required.every((k) => String(fields[k] || "").trim() !== "");
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-white">Personal info</h2>
        <p className="text-zinc-500 text-xs mt-1">Fill in your basic details</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field
          icon={User}
          placeholder="First name"
          value={fields.firstName}
          onChange={(v) => set("firstName", v)}
        />
        <Field
          icon={User}
          placeholder="Last name"
          value={fields.lastName}
          onChange={(v) => set("lastName", v)}
        />
      </div>
      <Field
        icon={Mail}
        placeholder="Email"
        value={fields.email}
        onChange={(v) => set("email", v)}
        type="email"
      />
      <Field
        icon={Phone}
        placeholder="Phone number"
        value={fields.phoneNumber}
        onChange={(v) => set("phoneNumber", v)}
        type="tel"
      />
      <Field
        icon={Calendar}
        placeholder="Date of birth"
        value={fields.dob}
        onChange={(v) => set("dob", v)}
        type="date"
      />
      <div className="relative">
        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <select
          value={fields.gender}
          onChange={(e) => set("gender", e.target.value)}
          className="w-full bg-zinc-800/60 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
          onFocus={(e) => (e.target.style.borderColor = brand)}
          onBlur={(e) => (e.target.style.borderColor = "")}
        >
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <Field
        icon={CreditCard}
        placeholder="ID / Passport number"
        value={fields.idNumber}
        onChange={(v) => set("idNumber", v)}
      />
      <Field
        icon={MapPin}
        placeholder="Location (city/area)"
        value={fields.location}
        onChange={(v) => set("location", v)}
      />
      <Field
        icon={Globe}
        placeholder="Country"
        value={fields.country}
        onChange={(v) => set("country", v)}
      />
      <Field
        icon={Landmark}
        placeholder="Landmark / estate"
        value={fields.landmark}
        onChange={(v) => set("landmark", v)}
      />
      <NavButtons onNext={onNext} nextDisabled={!canNext} />
    </div>
  );
};

// Page 2 — Creator identity + specialties as serviceIds
const PageCreatorIdentity = ({ fields, set, onBack, onNext }) => {
  const canNext =
    String(fields.modelName || "").trim() !== "" &&
    fields.serviceIds.length > 0 &&
    fields._agreed;

  const toggleSpecialty = (id) => {
    const has = fields.serviceIds.includes(id);
    set(
      "serviceIds",
      has
        ? fields.serviceIds.filter((s) => s !== id)
        : [...fields.serviceIds, id],
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-white">Creator identity</h2>
        <p className="text-zinc-500 text-xs mt-1">
          How you'll appear to clients
        </p>
      </div>
      <Field
        icon={Sparkles}
        placeholder="Creator name (shown on your profile)"
        value={fields.modelName}
        onChange={(v) => set("modelName", v)}
      />
      <Field
        icon={Sparkles}
        placeholder="Tagline  e.g. 'Your vibe, your rules'"
        value={fields.tagline}
        onChange={(v) => set("tagline", v)}
      />
      <div className="relative">
        <textarea
          value={fields.aboutMe}
          onChange={(e) => set("aboutMe", e.target.value)}
          placeholder="About me — tell fans a little about yourself"
          rows={3}
          className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none"
          onFocus={(e) => (e.target.style.borderColor = brand)}
          onBlur={(e) => (e.target.style.borderColor = "")}
        />
      </div>
      <Field
        icon={CreditCard}
        placeholder="Rates from (KES)"
        value={fields.ratesFrom}
        onChange={(v) => set("ratesFrom", v)}
        type="number"
      />
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Specialties{" "}
          <span className="text-zinc-700 normal-case font-normal">
            (select all that apply)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map(({ label, id }) => {
            const active = fields.serviceIds.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleSpecialty(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-[#A1045A]/35 border-[#A1045A]/50 text-[#e07ab0]"
                    : "bg-zinc-800 border-white/8 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {active && <X className="w-3 h-3 inline mr-1" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <label className="flex items-start gap-3 cursor-pointer pt-1">
        <div
          onClick={() => set("_agreed", !fields._agreed)}
          className="mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all"
          style={{
            borderColor: fields._agreed ? brand : "#52525b",
            background: fields._agreed
              ? `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`
              : "transparent",
          }}
        >
          {fields._agreed && (
            <svg
              className="w-2.5 h-2.5 text-white"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M1.5 5l2.5 2.5 4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-xs text-zinc-500 leading-relaxed">
          I am 18+ and agree to the{" "}
          <span style={{ color: brandText }}>Creator Terms</span> and{" "}
          <span style={{ color: brandText }}>Privacy Policy</span>
        </span>
      </label>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!canNext} />
    </div>
  );
};

// Page 3 — Photos (collected here, sent with signup on page 4)
const PagePhotos = ({
  avatarPreview,
  coverPreview,
  onAvatarPick,
  onCoverPick,
  onBack,
  onNext,
}) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-black text-white">Add your photos</h2>
      <p className="text-zinc-500 text-sm">
        A great photo gets 3× more views. These will be uploaded with your
        account.
      </p>
    </div>
    <div className="flex gap-4 items-start">
      <ImagePicker
        label="Profile Photo"
        icon={Camera}
        preview={avatarPreview}
        onPick={onAvatarPick}
        hint="Upload"
      />
      <div className="flex-1">
        <ImagePicker
          label="Cover Photo"
          icon={ImagePlus}
          preview={coverPreview}
          onPick={onCoverPick}
          hint="Upload a cover"
          wide
        />
      </div>
    </div>
    <div className="flex gap-3 pt-2">
      <button
        onClick={onNext}
        className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-500 text-sm font-semibold hover:text-zinc-300 hover:border-white/20 transition-all"
      >
        Skip for now
      </button>
      <button
        onClick={onNext}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm"
        style={{
          background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
        }}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Page 4 — OTP + password (signup fires here)
const PageOtp = ({
  email,
  otp,
  setOtp,
  password,
  setPassword,
  confirm,
  setConfirm,
  onBack,
  onNext,
  loading,
}) => {
  const canNext =
    otp.trim().length === 6 && password.length >= 6 && password === confirm;
  return (
    <div className="space-y-5">
      <div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
          }}
        >
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-black text-white">Verify your account</h2>
        <p className="text-zinc-500 text-xs mt-1">
          An OTP has been sent to{" "}
          <span
            style={{ color: brandText }}
            className="font-semibold break-all"
          >
            {email}
          </span>
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Enter OTP
        </p>
        <OtpInput value={otp} onChange={setOtp} />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Set your password
        </p>
        <PasswordField
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          placeholder="Confirm password"
          value={confirm}
          onChange={setConfirm}
        />
        {confirm.length > 0 && password !== confirm && (
          <p className="text-xs text-red-400">Passwords do not match</p>
        )}
      </div>
      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!canNext}
        loading={loading}
        nextLabel="Verify & Continue"
      />
    </div>
  );
};

// ─── main modal ──────────────────────────────
const CreatorSignupModal = ({ onClose, onSuccess }) => {
  const {
    fields,
    set,
    canSubmit,
    loading,
    submit,
    setAvatarFile,
    setCoverFile,
    avatarFile,
    coverFile,
  } = useModelSignup();

  const [page, setPage] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const { login } = useAuth();

  // OTP state
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const OTP_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/open/password/otp-reset`;

  // Page 3 → submit signup (with photos) → go to OTP
  const handleSignupSubmit = async () => {
    const data = await submit();
    if (data) setPage(4);
  };

  // Page 4 → verify OTP → call onSuccess → App navigates to onboarding
const handleOtpSubmit = async () => {
  setOtpLoading(true);
  const toastId = toast.loading("Verifying OTP…");
  try {
    const res = await fetch(OTP_ENDPOINT, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: fields.email, otp, password }),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

    // ── DO NOT call login() here — user must sign in via AuthModal ──

    toast.success("Account created! Please sign in.", { id: toastId });
    onSuccess({ ...data, email: fields.email }); // closes signup, opens AuthModal
  } catch (err) {
    toast.error(err.message, { id: toastId });
  } finally {
    setOtpLoading(false);
  }
};
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <ProgressBar page={page} />
          <p className="text-xs text-zinc-600 mb-5">
            Step {page} of {TOTAL_PAGES}
          </p>

          {page === 1 && (
            <PagePersonal fields={fields} set={set} onNext={() => setPage(2)} />
          )}
          {page === 2 && (
            <PageCreatorIdentity
              fields={fields}
              set={set}
              onBack={() => setPage(1)}
              onNext={() => setPage(3)}
            />
          )}
          {page === 3 && (
            <PagePhotos
              avatarPreview={avatarPreview}
              coverPreview={coverPreview}
              onAvatarPick={(url, file) => {
                setAvatarPreview(url);
                setAvatarFile(file);
              }}
              onCoverPick={(url, file) => {
                setCoverPreview(url);
                setCoverFile(file);
              }}
              onBack={() => setPage(2)}
              onNext={handleSignupSubmit}
              loading={loading}
            />
          )}
          {page === 4 && (
            <PageOtp
              email={fields.email}
              otp={otp}
              setOtp={setOtp}
              password={password}
              setPassword={setPassword}
              confirm={confirm}
              setConfirm={setConfirm}
              onBack={() => setPage(3)}
              onNext={handleOtpSubmit}
              loading={otpLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorSignupModal;
