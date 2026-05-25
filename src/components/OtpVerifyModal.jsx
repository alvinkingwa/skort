// ─────────────────────────────────────────────
//  components/OtpVerifyModal.jsx
// ─────────────────────────────────────────────
import { useState } from "react";
import { X, ShieldCheck, KeyRound, Eye, EyeOff, ArrowRight } from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { useOtpVerify } from "../hooks/useOtpVerify.js";

// ── OTP digit input ──────────────────────────
const OtpInput = ({ value, onChange }) => {
  const digits = 6;
  const arr    = value.split("").concat(Array(digits).fill("")).slice(0, digits);

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = arr.map((d, idx) => idx === i ? "" : d).join("").trimEnd();
      onChange(next);
      if (i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
      return;
    }
    if (!/^[a-zA-Z0-9]$/.test(e.key)) return;
    const next = arr.map((d, idx) => idx === i ? e.key : d).join("");
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
          onKeyDown={e => handleKey(e, i)}
          className="w-11 h-12 text-center text-lg font-bold bg-zinc-800/60 border border-white/8 rounded-xl text-white focus:outline-none transition-colors"
          onFocus={e => e.target.style.borderColor = brand}
          onBlur={e  => e.target.style.borderColor = ""}
        />
      ))}
    </div>
  );
};

// ── Password field with show/hide ────────────
const PasswordField = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800/60 border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
        onFocus={e => e.target.style.borderColor = brand}
        onBlur={e  => e.target.style.borderColor = ""}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

// ── Main modal ───────────────────────────────
const OtpVerifyModal = ({ email, onClose, onSuccess }) => {
  const {
    otp, setOtp,
    password, setPassword,
    confirm,  setConfirm,
    canSubmit, loading, submit,
  } = useOtpVerify(email);

  const handleContinue = async () => {
    const data = await submit();
    if (data) onSuccess(data);
  };
  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-5">

          {/* Header */}
          <div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-black text-white">Verify your account</h2>
            <p className="text-zinc-500 text-xs mt-1">
              An OTP has been sent to{" "}
              <span style={{ color: brandText }} className="font-semibold break-all">
                {email}
              </span>
            </p>
          </div>

          {/* OTP boxes */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Enter OTP
            </p>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          {/* Password */}
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

          {/* Submit */}
          <button
            onClick={handleContinue}
            disabled={loading || !canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`; }}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><ArrowRight className="w-4 h-4" /> Verify & Continue</>
            }
          </button>

        </div>
      </div>
    </div>
  );
};

export default OtpVerifyModal;