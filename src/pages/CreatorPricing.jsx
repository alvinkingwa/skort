// ─────────────────────────────────────────────
//  pages/CreatorPricing.jsx
//  Subscription plans shown after onboarding
//  Creator pays — not the client
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import {
  Flame, CheckCircle, Star, Zap, Crown,
  TrendingUp, Search, Shield, Clock, Gift,
} from "lucide-react";

const PLANS = [
  {
    id: "trial",
    name: "Free Trial",
    price: 0,
    period: "5 days",
    badge: null,
    color: "zinc",
    description: "Get started and see how Skort works — no payment needed.",
    features: [
      { icon: CheckCircle, text: "Profile listed publicly",       included: true  },
      { icon: Search,      text: "Standard search placement",     included: true  },
      { icon: CheckCircle, text: "All services enabled",          included: true  },
      { icon: TrendingUp,  text: "Boosted in search results",     included: false },
      { icon: Star,        text: "Featured creator badge",        included: false },
      { icon: Crown,       text: "Priority client notifications", included: false },
      { icon: Shield,      text: "Verified creator checkmark",    included: false },
    ],
    cta: "Start Free Trial",
    ctaStyle: "bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700",
  },
  {
    id: "basic",
    name: "Basic",
    price: 999,
    period: "per month",
    badge: null,
    color: "rose",
    description: "Stay listed and keep earning after your trial ends.",
    features: [
      { icon: CheckCircle, text: "Profile listed publicly",       included: true  },
      { icon: Search,      text: "Standard search placement",     included: true  },
      { icon: CheckCircle, text: "All services enabled",          included: true  },
      { icon: TrendingUp,  text: "Boosted in search results",     included: false },
      { icon: Star,        text: "Featured creator badge",        included: false },
      { icon: Crown,       text: "Priority client notifications", included: false },
      { icon: Shield,      text: "Verified creator checkmark",    included: false },
    ],
    cta: "Choose Basic",
    ctaStyle: "bg-[#A1045A] text-white  shadow-lg shadow-[#A1045A]/25",
  },
  {
    id: "pro",
    name: "Pro",
    price: 2499,
    period: "per month",
    badge: "Most Popular",
    color: "amber",
    description: "Get seen first. The algorithm favours Pro creators in every search.",
    features: [
      { icon: CheckCircle, text: "Profile listed publicly",       included: true  },
      { icon: TrendingUp,  text: "Boosted in search results",     included: true  },
      { icon: Star,        text: "Featured creator badge",        included: true  },
      { icon: Crown,       text: "Priority client notifications", included: true  },
      { icon: Shield,      text: "Verified creator checkmark",    included: false },
      { icon: Zap,         text: "Analytics dashboard",           included: false },
      { icon: Gift,        text: "Exclusive promotional slots",   included: false },
    ],
    cta: "Go Pro",
    ctaStyle: "from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25",
  },
  {
    id: "elite",
    name: "Elite",
    price: 4999,
    period: "per month",
    badge: "Best Value",
    color: "violet",
    description: "Top of every search. Maximum visibility with full platform features.",
    features: [
      { icon: CheckCircle, text: "Profile listed publicly",       included: true  },
      { icon: TrendingUp,  text: "Boosted in search results",     included: true  },
      { icon: Star,        text: "Featured creator badge",        included: true  },
      { icon: Crown,       text: "Priority client notifications", included: true  },
      { icon: Shield,      text: "Verified creator checkmark",    included: true  },
      { icon: Zap,         text: "Analytics dashboard",           included: true  },
      { icon: Gift,        text: "Exclusive promotional slots",   included: true  },
    ],
    cta: "Go Elite",
    ctaStyle: "from-violet-500 to-purple-500 text-white hover:from-violet-400 hover:to-purple-400 shadow-lg shadow-violet-500/25",
  },
];

const badgeColors = {
  amber:  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  violet: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const borderColors = {
  zinc:   "border-white/8",
  rose:   "border-[#A1045A]/30",
  amber:  "border-amber-500/40",
  violet: "border-violet-500/40",
};

const CreatorPricing = ({ onFinish }) => {
  const [selected, setSelected] = useState("trial");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1200);
  };

  if (done) {
    const plan = PLANS.find((p) => p.id === selected);
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">
            {selected === "trial" ? "Trial Started! 🎉" : `You're on ${plan.name}!`}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            {selected === "trial"
              ? "Your profile is now live for 5 days. We'll remind you before your trial ends."
              : `Your profile is live and ${selected === "pro" || selected === "elite" ? "boosted in search results" : "listed publicly"}. Payments via M-Pesa.`
            }
          </p>
        </div>
        <button
          onClick={onFinish}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
        
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
        >
          <Flame className="w-4 h-4" /> View My Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-[#A1045A]/25`}
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
          onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
          onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
          >
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black text-white">Sk<span className={`text-[#e07ab0]`}>ort</span></span>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <Gift className="w-3.5 h-3.5" /> 5-day free trial included
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          Choose your plan
        </h1>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          Your profile goes live after selecting a plan. Higher plans get seen first by clients — the algorithm favours Pro and Elite creators.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-4 space-y-3">
        {PLANS.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `${borderColors[plan.color]} bg-zinc-900`
                  : "border-white/5 bg-zinc-900/50 hover:border-white/15"
              }`}
            >
              {/* Popular / Best badge */}
              {plan.badge && (
                <span className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full border ${badgeColors[plan.color]}`}>
                  {plan.badge}
                </span>
              )}

              <div className="flex items-start gap-3 mb-3">
                {/* Radio */}
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? "border-[#A1045A] bg-[#A1045A]" : "border-zinc-600"
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-base font-black text-white">{plan.name}</span>
                    <div className="flex items-baseline gap-1">
                      {plan.price === 0
                        ? <span className="text-xl font-black text-emerald-400">Free</span>
                        : <>
                            <span className="text-xs text-zinc-500">KES</span>
                            <span className="text-xl font-black text-white">{plan.price.toLocaleString()}</span>
                          </>
                      }
                      <span className="text-xs text-zinc-500">/ {plan.period}</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{plan.description}</p>
                </div>
              </div>

              {/* Features — only show when selected */}
              {isSelected && (
                <div className="ml-7 mt-3 space-y-2 border-t border-white/5 pt-3">
                  {plan.features.map(({ icon: Icon, text, included }) => (
                    <div key={text} className={`flex items-center gap-2 text-xs ${included ? "text-zinc-300" : "text-zinc-700"}`}>
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${included ? "text-emerald-400" : "text-zinc-700"}`} />
                      <span className={included ? "" : "line-through"}>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trial note */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 leading-relaxed">
            All plans include a <strong className="text-zinc-300">5-day free trial</strong>. Your profile goes live immediately. We'll notify you 2 days before your trial ends — no surprises.
            {selected !== "trial" && <span className="text-zinc-400"> Payment will be collected via <strong>M-Pesa</strong> after the trial.</span>}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${PLANS.find((p) => p.id === selected)?.ctaStyle}`}
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <>
                {selected === "trial" ? <Gift className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                {PLANS.find((p) => p.id === selected)?.cta}
              </>
          }
        </button>

        <p className="text-center text-xs text-zinc-700 mt-3">
          Cancel anytime · Payments via M-Pesa · No hidden fees
        </p>
      </div>

    </div>
  );
};

export default CreatorPricing;