// ─────────────────────────────────────────────
//  pages/CreatorOnboarding.jsx
// ─────────────────────────────────────────────
import { useState, useRef } from "react";
import { brand, brandDark, brandHover } from "../theme.js";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Flame,
  X,
  Images,
  MessageCircle,
  Phone,
  Video,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";

const TOTAL_STEPS = 3;

const SERVICE_ID_MAP = { chat: 1, call: 2, video: 3, order: 4 };

const SERVICES = [
  { id: "chat", label: "Text Chat", icon: MessageCircle, color: "rose" },
  { id: "call", label: "Voice Call", icon: Phone, color: "emerald" },
  { id: "video", label: "Video Call", icon: Video, color: "violet" },
  { id: "order", label: "Orders", icon: ShoppingBag, color: "amber" },
];

const iconColors = {
  rose: "bg-[#A1045A]/35 text-[#e07ab0]",
  emerald: "bg-emerald-500/20 text-emerald-400",
  violet: "bg-violet-500/20 text-violet-400",
  amber: "bg-amber-500/20 text-amber-400",
};

const ProgressBar = ({ step }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <div
        key={i}
        className="h-1 flex-1 rounded-full transition-all duration-300"
        style={{ background: i < step ? brand : "#27272a" }}
      />
    ))}
  </div>
);

const Btn = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25 disabled:opacity-40 disabled:cursor-not-allowed"
    style={{
      background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
    }}
    onMouseEnter={(e) => {
      if (!disabled)
        e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`;
    }}
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`)
    }
  >
    {children}
  </button>
);

const BackBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-colors"
  >
    <ArrowLeft className="w-4 h-4" />
  </button>
);

// ── Step 1: Bio ───────────────────────────────
const StepBio = ({ data, setData, onNext }) => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-black text-white mb-1">
        Tell clients about you
      </h2>
      <p className="text-zinc-500 text-sm">This shows on your profile card.</p>
    </div>
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
        Tagline
      </label>
      <input
        type="text"
        maxLength={60}
        value={data.tagline}
        onChange={(e) => setData({ ...data, tagline: e.target.value })}
        placeholder="e.g. Your vibe, your escape"
        className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors"
      />
      <p className="text-xs text-zinc-600 mt-1 text-right">
        {data.tagline.length}/60
      </p>
    </div>
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
        About me
      </label>
      <textarea
        rows={3}
        maxLength={300}
        value={data.about}
        onChange={(e) => setData({ ...data, about: e.target.value })}
        placeholder="Tell clients who you are, what you offer and your vibe…"
        className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors resize-none"
      />
      <p className="text-xs text-zinc-600 mt-1 text-right">
        {data.about.length}/300
      </p>
    </div>
    <div className="flex gap-3 pt-1">
      <Btn
        onClick={onNext}
        disabled={!data.tagline.trim() || !data.about.trim()}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </Btn>
    </div>
  </div>
);

// ── Step 2: Gallery ───────────────────────────
const StepGallery = ({ data, setData, onNext, onBack }) => {
  const ref = useRef();
  const gallery = data.gallery || [];
  const handleFiles = (e) => {
    const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setData({ ...data, gallery: [...gallery, ...urls].slice(0, 12) });
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">
          Add gallery photos
        </h2>
        <p className="text-zinc-500 text-sm">
          Show clients your vibe. Up to 12 photos.
        </p>
      </div>
      <div
        onClick={() => ref.current.click()}
        className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 rounded-2xl p-6 flex flex-col items-center gap-3 text-zinc-600 hover:text-zinc-400 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Images className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-400">
            Tap to upload photos
          </p>
          <p className="text-xs text-zinc-600 mt-0.5">
            JPG, PNG · Max 12 photos
          </p>
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>
      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {gallery.map((url, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() =>
                  setData({
                    ...data,
                    gallery: gallery.filter((_, idx) => idx !== i),
                  })
                }
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {gallery.length < 12 && (
            <button
              onClick={() => ref.current.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-all"
            >
              <Images className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      <div className="flex gap-3 pt-1">
        <BackBtn onClick={onBack} />
        <Btn onClick={onNext}>
          {gallery.length === 0
            ? "Skip Gallery"
            : `Continue with ${gallery.length} photo${gallery.length > 1 ? "s" : ""}`}
          <ArrowRight className="w-4 h-4" />
        </Btn>
      </div>
    </div>
  );
};

// ── Step 3: Services ──────────────────────────
const StepServices = ({ data, setData, onNext, onBack }) => {
  const toggleService = (id) =>
    setData({
      ...data,
      servicesEnabled: {
        ...data.servicesEnabled,
        [id]: !data.servicesEnabled[id],
      },
    });
  const updatePrice = (id, val) =>
    setData({ ...data, prices: { ...data.prices, [id]: val } });
  const hasAny = Object.values(data.servicesEnabled).some(Boolean);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">
          What do you offer?
        </h2>
        <p className="text-zinc-500 text-sm">
          Enable services and set your KES rates per 30 minutes.
        </p>
      </div>
      <div className="space-y-3">
        {SERVICES.map(({ id, label, icon: Icon, color }) => {
          const enabled = data.servicesEnabled[id];
          return (
            <div
              key={id}
              className={`rounded-xl border transition-all ${enabled ? "bg-zinc-900 border-[#A1045A]/30" : "bg-zinc-900/50 border-white/5"}`}
            >
              <div className="flex items-center gap-3 p-4">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconColors[color]}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-bold ${enabled ? "text-white" : "text-zinc-500"}`}
                  >
                    {label}
                  </p>
                  {enabled && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      KES per 30 min
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleService(id)}
                  className={`w-11 h-6 rounded-full transition-all relative ${enabled ? "bg-[#A1045A]" : "bg-zinc-700"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? "left-[22px]" : "left-0.5"}`}
                  />
                </button>
              </div>
              {enabled && (
                <div className="flex items-center gap-3 px-4 pb-4">
                  <button
                    onClick={() =>
                      updatePrice(
                        id,
                        Math.max(50, (data.prices[id] || 200) - 50),
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      KES
                    </span>
                    <input
                      type="number"
                      value={data.prices[id] || 200}
                      onChange={(e) =>
                        updatePrice(id, parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-sm text-white text-center focus:outline-none focus:border-[#A1045A]/50"
                    />
                  </div>
                  <button
                    onClick={() =>
                      updatePrice(id, (data.prices[id] || 200) + 50)
                    }
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 pt-1">
        <BackBtn onClick={onBack} />
        <Btn onClick={onNext} disabled={!hasAny}>
          Continue <ArrowRight className="w-4 h-4" />
        </Btn>
      </div>
    </div>
  );
};

// ── Step 5: Done ──────────────────────────────
const StepDone = ({ onNext }) => (
  <div className="flex flex-col items-center text-center gap-5 py-6">
    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
      <CheckCircle className="w-10 h-10 text-emerald-400" />
    </div>
    <div>
      <h2 className="text-2xl font-black text-white mb-2">Profile saved!</h2>
      <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
        One last step — choose a plan to make your profile visible to clients.
      </p>
    </div>
    <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left">
      <p className="text-xs font-bold text-amber-300 mb-1">💡 How it works</p>
      <p className="text-xs text-zinc-500 leading-relaxed">
        Clients browse for free.{" "}
        <strong className="text-zinc-300">
          Creators pay a small monthly fee
        </strong>{" "}
        to be listed — higher plans appear first in search.
      </p>
    </div>
    <Btn onClick={onNext}>
      <Flame className="w-4 h-4" /> See Plans & Pricing
    </Btn>
  </div>
);

// ── Main export ───────────────────────────────
const CreatorOnboarding = ({ onGoToPricing }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    avatar: "",
    cover: "",
    tagline: "",
    about: "",
    gallery: [],
    servicesEnabled: {},
    prices: {},
  });

  const handleConfirm = async () => {
    const enabledEntries = Object.entries(data.servicesEnabled).filter(
      ([, on]) => on,
    );
    const serviceIds = enabledEntries
      .map(([id]) => SERVICE_ID_MAP[id])
      .filter(Boolean);
    const ratesFrom =
      enabledEntries.length > 0
        ? Math.min(...enabledEntries.map(([id]) => data.prices[id] || 200))
        : 0;

    // TODO: wire up API call here
    setStep(4); // goes straight to Done
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-[#A1045A]/25"
            style={{
              background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
            }}
          >
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black text-white">
            Sk<span className="text-[#e07ab0]">ort</span>
          </span>
        </div>

        {step <= TOTAL_STEPS && (
          <>
            <ProgressBar step={step} />
            <p className="text-xs text-zinc-600 mb-6">
              Step {step} of {TOTAL_STEPS}
            </p>
          </>
        )}

        {step === 1 && (
          <StepBio data={data} setData={setData} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <StepGallery
            data={data}
            setData={setData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepServices
            data={data}
            setData={setData}
            onNext={handleConfirm} // was () => setStep(4)
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && <StepDone onNext={() => onGoToPricing(data)} />}
      </div>
    </div>
  );
};

export default CreatorOnboarding;
