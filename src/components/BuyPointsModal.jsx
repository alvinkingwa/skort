// ─────────────────────────────────────────────
//  components/BuyPointsModal.jsx
//  Client buys points via M-Pesa — shown when
//  they try to chat/call with insufficient points
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { X, Coins, Phone, CheckCircle, Zap, Star, Crown, ArrowRight } from "lucide-react";

const PACKAGES = [
  { id: "starter", pts: 500,  kes: 50,  label: "Starter", icon: Zap,    color: "zinc"   },
  { id: "basic",   pts: 1000, kes: 100, label: "Basic",   icon: Coins,  color: "rose",  },
  { id: "popular", pts: 2500, kes: 200, label: "Popular", icon: Star,   color: "amber", popular: true },
  { id: "premium", pts: 6000, kes: 500, label: "Premium", icon: Crown,  color: "violet" },
];

const border = { zinc: "border-white/8",       rose: "border-[#A1045A]/30",   amber: "border-amber-500/50",  violet: "border-violet-500/30"  };
const bg     = { zinc: "bg-zinc-800/40",        rose: "bg-[#A1045A]/18",       amber: "bg-amber-500/10",      violet: "bg-violet-500/10"      };
const icon   = { zinc: "text-zinc-400",         rose: "text-[#e07ab0]",        amber: "text-amber-400",       violet: "text-violet-400"       };
const badge  = { amber: "bg-amber-500/20 border-amber-500/30 text-amber-300" };

const BuyPointsModal = ({ onClose, onSuccess, sessionType, required }) => {
  const [selected, setSelected] = useState("popular");
  const [phone,    setPhone]    = useState("");
  const [step,     setStep]     = useState("pick");   // pick | mpesa | waiting | done
  const [error,    setError]    = useState("");

  const pkg = PACKAGES.find((p) => p.id === selected);

  const sessionLabels = { chat: "Text Chat", call: "Voice Call", video: "Video Call", order: "Place Order" };
  const sessionCost   = { chat: 200, call: 500, video: 800, order: 1500 };
  const cost = required || sessionCost[sessionType] || 200;

  const handleContinue = () => {
    if (!phone.trim() || phone.length < 10) { setError("Enter a valid M-Pesa number"); return; }
    setError("");
    setStep("waiting");
    // Simulate STK push → success
    setTimeout(() => setStep("done"), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Step: Pick package ── */}
        {step === "pick" && (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
              <div>
                <h2 className="text-base font-black text-white">Buy Points</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  <span className={`text-[#e07ab0] font-bold`}>{sessionLabels[sessionType]}</span> costs <span className="text-white font-bold">{cost} pts</span>
                </p>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 space-y-2">
              {PACKAGES.map((p) => {
                const Icon = p.icon;
                const isSelected = selected === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left relative ${
                      isSelected ? `${border[p.color]} ${bg[p.color]}` : "border-white/5 bg-zinc-800/30 hover:border-white/10"
                    }`}
                  >
                    {/* radio */}
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "border-[#A1045A] " : "border-zinc-600"}`}
                    style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
                    onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
                    onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <Icon className={`w-4 h-4 shrink-0 ${icon[p.color]}`} />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{p.pts.toLocaleString()} pts</span>
                        {p.popular && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full border bg-amber-500/20 border-amber-500/30 text-amber-300">POPULAR</span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">KES {p.kes}</span>
                    </div>

                    <span className="text-xs font-bold text-zinc-500">
                      {(p.pts / p.kes).toFixed(0)} pts/KES
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-4 pb-5">
              <button
                onClick={() => setStep("mpesa")}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
              
              style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
              onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
              onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
              >
                <Coins className="w-4 h-4" /> Pay KES {pkg?.kes} via M-Pesa
              </button>
              <p className="text-center text-xs text-zinc-700 mt-2">1 point = KES 0.10 · Points never expire</p>
            </div>
          </>
        )}

        {/* ── Step: M-Pesa number ── */}
        {step === "mpesa" && (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
              <div>
                <h2 className="text-base font-black text-white">Enter M-Pesa Number</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Buying <span className="text-white font-bold">{pkg?.pts.toLocaleString()} pts</span> for KES {pkg?.kes}</p>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-zinc-800 border border-white/8 rounded-xl flex items-center gap-3 px-4 py-3">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  placeholder="07XX XXX XXX"
                  maxLength={12}
                  className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>
              {error && <p className={`text-xs text-[#e07ab0]`}>{error}</p>}

              <div className="bg-zinc-800/60 rounded-xl p-3 text-xs text-zinc-500 leading-relaxed">
                An M-Pesa STK push will be sent to your phone. Enter your PIN to complete the payment.
              </div>

              <button
                onClick={handleContinue}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
              
              style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
              onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
              onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
              >
                <ArrowRight className="w-4 h-4" /> Send STK Push
              </button>
              <button onClick={() => setStep("pick")} className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1">← Change package</button>
            </div>
          </>
        )}

        {/* ── Step: Waiting for payment ── */}
        {step === "waiting" && (
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className={`w-16 h-16 rounded-full bg-[#A1045A]/18 border border-[#A1045A]/30 flex items-center justify-center`}>
              <Phone className={`w-7 h-7 text-[#e07ab0] animate-pulse`} />
            </div>
            <div>
              <p className="font-black text-white text-lg">Check your phone</p>
              <p className="text-zinc-500 text-sm mt-1">M-Pesa prompt sent to<br /><span className="text-white font-bold">{phone}</span></p>
              <p className="text-zinc-600 text-xs mt-3">Enter your M-Pesa PIN to confirm</p>
            </div>
            <div className="flex gap-1">
              {[0,1,2].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Step: Done ── */}
        {step === "done" && (
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="font-black text-white text-lg">Points Added!</p>
              <p className="text-zinc-400 text-sm mt-1">
                <span className="text-amber-400 font-black text-xl">{pkg?.pts.toLocaleString()}</span> pts added to your balance
              </p>
            </div>
            <button
              onClick={() => onSuccess(pkg?.pts)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
            
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
            >
              Continue to {sessionLabels[sessionType]} →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BuyPointsModal;