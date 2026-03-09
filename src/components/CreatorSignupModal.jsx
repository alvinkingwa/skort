// ─────────────────────────────────────────────
//  components/CreatorSignupModal.jsx
//  Creator registration — on success goes to onboarding
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { X, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

const Field = ({ icon: Icon, type = "text", placeholder, value, onChange, rightSlot }) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full bg-zinc-800/60 border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors`}
    />
    {rightSlot && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>}
  </div>
);

const CreatorSignupModal = ({ onClose, onSuccess }) => {
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const canSubmit = name && phone && email && password && agreed;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Go straight to onboarding
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-zinc-900">
          <h2 className="text-lg font-black text-white">Join as a Creator</h2>
          <p className="text-zinc-400 text-xs mt-1">Create your account — then set up your profile</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-3">
          <Field icon={User}  placeholder="Full name"           value={name}     onChange={(e) => setName(e.target.value)} />
          <Field icon={Phone} placeholder="Phone / WhatsApp"    value={phone}    onChange={(e) => setPhone(e.target.value)} />
          <Field icon={Mail}  type="email" placeholder="Email"  value={email}    onChange={(e) => setEmail(e.target.value)} />
          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightSlot={
              <button onClick={() => setShowPass(!showPass)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <div
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${agreed ? "border-[#A1045A]" : "border-zinc-600"}`}
            
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
            >
              {agreed && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-zinc-500 leading-relaxed">
              I am 18+ and agree to the <span className={`text-[#e07ab0]`}>Creator Terms</span> and <span className={`text-[#e07ab0]`}>Privacy Policy</span>
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25 disabled:opacity-40 disabled:cursor-not-allowed`}
          
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
          onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
          onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><ArrowRight className="w-4 h-4" /> Create Account & Set Up Profile</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSignupModal;