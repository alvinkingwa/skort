
import { useState, useRef } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import {
  Camera, ImagePlus, ArrowRight, ArrowLeft,
  CheckCircle, Flame, X, Images, Star,
  MapPin, BadgeCheck, MessageCircle, Phone, Video, ShoppingBag,
} from "lucide-react";

const TOTAL_STEPS = 4;

const SPECIALTY_OPTIONS = [
  "Deep Conversations", "Life Coaching", "Companionship",
  "Entertainment", "Storytelling", "Advice", "Mental Wellness",
  "Motivation", "Music Talk", "Fun Chats", "Stress Relief",
  "Goal Setting", "Humor", "Positivity", "Casual Chat",
];

const SERVICES = [
  { id: "chat",  label: "Text Chat",  icon: MessageCircle, color: "rose"   },
  { id: "call",  label: "Voice Call", icon: Phone,         color: "emerald"},
  { id: "video", label: "Video Call", icon: Video,         color: "violet" },
  { id: "order", label: "Orders",     icon: ShoppingBag,   color: "amber"  },
];

const iconColors = {
  rose:    "bg-[#A1045A]/35 text-[#e07ab0]",
  emerald: "bg-emerald-500/20 text-emerald-400",
  violet:  "bg-violet-500/20 text-violet-400",
  amber:   "bg-amber-500/20 text-amber-400",
};

// ── Progress bar ──────────────────────────────
const ProgressBar = ({ step }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <div
        key={i}
        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
          i < step ? "bg-[#A1045A]" : i === step - 1 ? "bg-[#b8055f]" : "bg-zinc-800"
        }`}
      />
    ))}
  </div>
);

// ── Image picker (simulated) ──────────────────
const ImagePicker = ({ label, icon: Icon, preview, onPick, hint }) => {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPick(url);
  };
  return (
    <div>
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
      <div
        onClick={() => ref.current.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 transition-all overflow-hidden flex items-center justify-center ${
          label === "Cover Photo" ? "h-28 w-full" : "h-24 w-24"
        }`}
        style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
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
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
};

// ── Step 1: Photos ────────────────────────────
const StepPhotos = ({ data, setData, onNext, onSkip }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-black text-white mb-1">Add your photos</h2>
      <p className="text-zinc-500 text-sm">A great photo gets 3× more views. You can always change these later.</p>
    </div>

    <div className="flex gap-4 items-start">
      <ImagePicker
        label="Profile Photo"
        icon={Camera}
        preview={data.avatar}
        onPick={(url) => setData({ ...data, avatar: url })}
        hint="Upload"
      />
      <div className="flex-1">
        <ImagePicker
          label="Cover Photo"
          icon={ImagePlus}
          preview={data.cover}
          onPick={(url) => setData({ ...data, cover: url })}
          hint="Upload a cover"
        />
      </div>
    </div>

    <div className="flex gap-3 pt-2">
      <button
        onClick={onSkip}
        className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-500 text-sm font-semibold hover:text-zinc-300 hover:border-white/20 transition-all"
      >
        Skip for now
      </button>
      <button
        onClick={onNext}
        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
      
      style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
      onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
      onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ── Step 2: Bio & Tags ────────────────────────
const StepBio = ({ data, setData, onNext, onBack }) => {
  const toggleTag = (tag) => {
    const has = data.specialties.includes(tag);
    setData({
      ...data,
      specialties: has
        ? data.specialties.filter((t) => t !== tag)
        : data.specialties.length < 5
          ? [...data.specialties, tag]
          : data.specialties,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Tell clients about you</h2>
        <p className="text-zinc-500 text-sm">This shows on your profile card.</p>
      </div>

      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Tagline</label>
        <input
          type="text"
          maxLength={60}
          value={data.tagline}
          onChange={(e) => setData({ ...data, tagline: e.target.value })}
          placeholder="e.g. Your vibe, your escape"
          className={`w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors`}
        />
        <p className="text-xs text-zinc-600 mt-1 text-right">{data.tagline.length}/60</p>
      </div>

      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">About me</label>
        <textarea
          rows={3}
          maxLength={300}
          value={data.about}
          onChange={(e) => setData({ ...data, about: e.target.value })}
          placeholder="Tell clients who you are, what you offer and your vibe…"
          className={`w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors resize-none`}
        />
        <p className="text-xs text-zinc-600 mt-1 text-right">{data.about.length}/300</p>
      </div>

      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Specialties <span className="text-zinc-700 normal-case font-normal">(pick up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map((tag) => {
            const active = data.specialties.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-[#A1045A]/35 border-[#A1045A]/50 text-[#e07ab0]"
                    : "bg-zinc-800 border-white/8 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {active && <X className="w-3 h-3 inline mr-1" />}{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!data.tagline.trim() || !data.about.trim()}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25 disabled:opacity-40 disabled:cursor-not-allowed`}
        
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Step 3: Services ──────────────────────────
const StepServices = ({ data, setData, onNext, onBack }) => {
  const toggleService = (id) => {
    const enabled = { ...data.servicesEnabled, [id]: !data.servicesEnabled[id] };
    setData({ ...data, servicesEnabled: enabled });
  };

  const updatePrice = (id, val) => {
    const prices = { ...data.prices, [id]: val };
    setData({ ...data, prices });
  };

  const hasAny = Object.values(data.servicesEnabled).some(Boolean);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">What do you offer?</h2>
        <p className="text-zinc-500 text-sm">Enable services and set your KES rates per 30 minutes.</p>
      </div>

      <div className="space-y-3">
        {SERVICES.map(({ id, label, icon: Icon, color }) => {
          const enabled = data.servicesEnabled[id];
          return (
            <div
              key={id}
              className={`rounded-xl border transition-all ${
                enabled ? "bg-zinc-900 border-[#A1045A]/30" : "bg-zinc-900/50 border-white/5"
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconColors[color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${enabled ? "text-white" : "text-zinc-500"}`}>{label}</p>
                  {enabled && (
                    <p className="text-xs text-zinc-600 mt-0.5">KES per 30 min</p>
                  )}
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleService(id)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    enabled ? "bg-[#A1045A]" : "bg-zinc-700"
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    enabled ? "left-[22px]" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* Price input when enabled */}
              {enabled && (
                <div className="flex items-center gap-3 px-4 pb-4">
                  <button
                    onClick={() => updatePrice(id, Math.max(50, (data.prices[id] || 200) - 50))}
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">KES</span>
                    <input
                      type="number"
                      value={data.prices[id] || 200}
                      onChange={(e) => updatePrice(id, parseInt(e.target.value) || 0)}
                      className={`w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-sm text-white text-center focus:outline-none focus:border-[#A1045A]/50`}
                    />
                  </div>
                  <button
                    onClick={() => updatePrice(id, (data.prices[id] || 200) + 50)}
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
        <button onClick={onBack} className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!hasAny}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25 disabled:opacity-40 disabled:cursor-not-allowed`}
        
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
        >
          Finish Setup <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Step 3: Gallery upload ────────────────────
const StepGallery = ({ data, setData, onNext, onBack }) => {
  const ref = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setData({ ...data, gallery: [...(data.gallery || []), ...urls].slice(0, 12) });
  };

  const removePhoto = (i) => {
    const updated = (data.gallery || []).filter((_, idx) => idx !== i);
    setData({ ...data, gallery: updated });
  };

  const gallery = data.gallery || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Add gallery photos</h2>
        <p className="text-zinc-500 text-sm">Show clients your vibe. Up to 12 photos. You can skip this and add later.</p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => ref.current.click()}
        className={`cursor-pointer border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 rounded-2xl p-6 flex flex-col items-center gap-3 text-zinc-600 hover:text-zinc-400 transition-all`}
      >
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Images className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-400">Tap to upload photos</p>
          <p className="text-xs text-zinc-600 mt-0.5">JPG, PNG · Max 12 photos</p>
        </div>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </div>

      {/* Grid preview */}
      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {gallery.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Add more tile */}
          {gallery.length < 12 && (
            <button
              onClick={() => ref.current.click()}
              className={`aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-all`}
            >
              <Images className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
        
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
        >
          {gallery.length === 0 ? "Skip Gallery" : `Continue with ${gallery.length} photo${gallery.length > 1 ? "s" : ""}`}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Step 4: Profile Review ────────────────────
const StepReview = ({ data, onConfirm, onBack }) => {
  const gallery = data.gallery || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Review your profile</h2>
        <p className="text-zinc-500 text-sm">This is how clients will see you. Looks good? Save and continue.</p>
      </div>

      {/* Profile card preview */}
      <div className="bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden">

        {/* Cover */}
        <div className="relative h-24 bg-zinc-800 overflow-hidden">
          {data.cover
            ? <img src={data.cover} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full from-zinc-800 to-zinc-700 flex items-center justify-center"><p className="text-xs text-zinc-600">No cover photo</p></div>
          }
          <div className="absolute inset-0 from-zinc-900/80 to-transparent" />
        </div>

        {/* Avatar + name */}
        <div className="px-4 pb-4">
          <div className="flex items-end gap-3 -mt-5 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-4 ring-zinc-900 shrink-0 bg-zinc-700">
              {data.avatar
                ? <img src={data.avatar} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Camera className="w-5 h-5 text-zinc-500" /></div>
              }
            </div>
            <div className="pb-0.5">
              <p className="text-sm font-black text-white">{data.name || "Your Name"}</p>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <MapPin className="w-3 h-3" /> Nairobi
              </div>
            </div>
          </div>

          {data.tagline && (
            <p className={`text-[#e07ab0] italic text-xs mb-3`}>"{data.tagline}"</p>
          )}

          {data.about && (
            <p className="text-zinc-400 text-xs leading-relaxed mb-3 line-clamp-3">{data.about}</p>
          )}

          {/* Specialties */}
          {data.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {data.specialties.map((s) => (
                <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 border border-white/8 text-zinc-400">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery preview */}
      {gallery.length > 0 && (
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Gallery · {gallery.length} photos</p>
          <div className="grid grid-cols-4 gap-1.5">
            {gallery.slice(0, 4).map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 3 && gallery.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xs font-black">+{gallery.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit note */}
      <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3 flex items-start gap-2">
        <Star className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-500">You can edit your profile anytime from your dashboard after publishing.</p>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
        
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
        >
          <CheckCircle className="w-4 h-4" /> Looks Good — Save Profile
        </button>
      </div>
    </div>
  );
};

// ── Step 5: Done (go to pricing) ──────────────
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
        Clients browse for free. <strong className="text-zinc-300">Creators pay a small monthly fee</strong> to be listed — higher plans appear first in search.
      </p>
    </div>
    <button
      onClick={onNext}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25`}
    
    style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
    onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
    onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
    >
      <Flame className="w-4 h-4" /> See Plans & Pricing
    </button>
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
    specialties: [],
    gallery: [],
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-[#A1045A]/25`}
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
          onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
          onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
          >
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black text-white">Sk<span className={`text-[#e07ab0]`}>ort</span></span>
        </div>

        {step <= TOTAL_STEPS && (
          <>
            <ProgressBar step={step} />
            <p className="text-xs text-zinc-600 mb-6">Step {step} of {TOTAL_STEPS}</p>
          </>
        )}

        {step === 1 && <StepPhotos data={data} setData={setData} onNext={() => setStep(2)} onSkip={() => setStep(2)} />}
        {step === 2 && <StepBio    data={data} setData={setData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepGallery data={data} setData={setData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <StepReview  data={data} onConfirm={() => setStep(5)} onBack={() => setStep(3)} />}
        {step === 5 && <StepDone    onNext={() => onGoToPricing(data)} />}

      </div>
    </div>
  );
};

export default CreatorOnboarding;