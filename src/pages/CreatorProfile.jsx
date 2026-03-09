// ─────────────────────────────────────────────
//  pages/CreatorProfile.jsx
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import {
  ArrowLeft, MapPin, BadgeCheck, Star, Users,
  Zap, MessageCircle, Phone, Video, ShoppingBag,
  Clock, Globe, X, ChevronLeft, ChevronRight, Images, Lock,
} from "lucide-react";
import { Badge, OnlineBadge } from "../components/UI.jsx";
import AuthModal from "../components/AuthModal.jsx";

// ── Mock gallery per creator (in production comes from DB) ──
const GALLERY = [
  "https://picsum.photos/seed/g1/600/600",
  "https://picsum.photos/seed/g2/600/600",
  "https://picsum.photos/seed/g3/600/600",
  "https://picsum.photos/seed/g4/600/600",
  "https://picsum.photos/seed/g5/600/600",
  "https://picsum.photos/seed/g6/600/600",
];

// ── Lightbox ──────────────────────────────────
const Lightbox = ({ images, index, onClose }) => {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white/50">
        {current + 1} / {images.length}
      </p>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Image */}
      <img
        src={images[current]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-[#A1045A] opacity-100" : "border-transparent opacity-40 hover:opacity-70"}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Gallery grid ──────────────────────────────
const Gallery = ({ images, isAuthed, onAuthRequired }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const FREE_LIMIT = 3;
  const preview = images.slice(0, FREE_LIMIT);
  const locked  = images.slice(FREE_LIMIT);

  const handleClick = (i) => {
    if (i >= FREE_LIMIT && !isAuthed) { onAuthRequired(); return; }
    setLightboxIndex(i);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Images className="w-4 h-4 text-zinc-500" />
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gallery</h2>
          <span className="text-xs text-zinc-700">{images.length} photos</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* Free photos */}
          {preview.map((img, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-200" />
            </button>
          ))}

          {/* Locked photos — show blurred with lock overlay */}
          {locked.map((img, i) => (
            <button
              key={`locked-${i}`}
              onClick={() => handleClick(FREE_LIMIT + i)}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={img} alt="" className="w-full h-full object-cover scale-110 blur-sm brightness-50" />
              {/* Only show the "sign in" CTA on the first locked tile */}
              {i === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/40">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-[10px] font-bold px-2 text-center leading-tight">Sign in to see {locked.length} more</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Lock className="w-5 h-5 text-white/50" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={isAuthed ? images : images.slice(0, FREE_LIMIT)}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

// ── Action button ─────────────────────────────
const ActionButton = ({ icon: Icon, label, sublabel, color, onClick }) => {
  const colors = {
    rose:    " shadow-[#A1045A]/25 ",
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400",
    violet:  "from-violet-500 to-purple-500 shadow-violet-500/25 hover:from-violet-400 hover:to-purple-400",
    amber:   "from-amber-500 to-orange-500 shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl ${colors[color]} text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl w-full`}
    >
      <Icon className="w-6 h-6" />
      <div className="text-center">
        <p className="text-sm font-bold leading-tight">{label}</p>
        <p className="text-[11px] opacity-75 mt-0.5">{sublabel}</p>
      </div>
    </button>
  );
};

// ── Main profile page ─────────────────────────
const CreatorProfile = ({ creator, onBack, onAction }) => {
  const [isAuthed,   setIsAuthed]   = useState(false);
  const [showAuth,   setShowAuth]   = useState(false);
  return (
  <>
  <div className="min-h-screen bg-zinc-950 text-white">

    <div className="relative overflow-hidden" style={{ height: "140px" }}>
      <img src={creator.cover} alt={creator.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 from-zinc-950 via-zinc-950/40 to-transparent" />
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-black/70 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="absolute top-4 right-4">
        <OnlineBadge online={creator.online} />
      </div>
    </div>

    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">

      {/* Avatar + name */}
      <div className="flex items-end gap-3 -mt-7 mb-5">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-14 h-14 rounded-full object-cover ring-4 ring-zinc-950 shrink-0"
        />
        <div className="pb-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-black text-white tracking-tight">{creator.name}</h1>
            {creator.verified && (
              <Badge color="sky"><BadgeCheck className="w-3 h-3" />Verified</Badge>
            )}
          </div>
          <p className="text-xs text-zinc-500">{creator.handle}</p>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
            <MapPin className="w-3 h-3" /> {creator.location} · Age {creator.age}
          </div>
        </div>
      </div>

      <p className={`text-[#e07ab0] italic text-sm mb-5`}>"{creator.tagline}"</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />, value: `${creator.rating} (${creator.reviews})`, label: "Rating"   },
          { icon: <Users className={`w-4 h-4 text-[#e07ab0]`} />,                value: creator.totalSessions,                    label: "Sessions" },
          { icon: <Zap className="w-4 h-4 text-emerald-400" />,               value: creator.responseTime,                     label: "Response" },
        ].map(({ icon, value, label }) => (
          <div key={label} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-sm font-bold text-white">{value}</p>
            <p className="text-[10px] text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mb-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">About</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">{creator.about}</p>
      </div>

      {/* Details */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mb-6 space-y-3">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Details</h2>
        <div className="flex items-start gap-3">
          <Star className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-zinc-500 text-xs mb-1">Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {creator.specialties.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-zinc-600 shrink-0" />
          <div>
            <p className="text-zinc-500 text-xs">Languages</p>
            <p className="text-white text-sm">{creator.languages.join(", ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-zinc-600 shrink-0" />
          <div>
            <p className="text-zinc-500 text-xs">Typical response time</p>
            <p className="text-white text-sm">{creator.responseTime}</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <Gallery images={GALLERY} isAuthed={isAuthed} onAuthRequired={() => setShowAuth(true)} />

      {/* Action buttons */}
      <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
        Connect with {creator.name.split(" ")[0]}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <ActionButton icon={MessageCircle} color="rose"    label="Text Chat"   sublabel={`${creator.price.chat} pts / 30 min`}  onClick={() => onAction("chat",  creator)} />
        <ActionButton icon={Phone}         color="emerald" label="Voice Call"  sublabel={`${creator.price.call} pts / 30 min`}  onClick={() => onAction("call",  creator)} />
        <ActionButton icon={Video}         color="violet"  label="Video Call"  sublabel={`${creator.price.video} pts / 30 min`} onClick={() => onAction("video", creator)} />
        <ActionButton icon={ShoppingBag}   color="amber"   label="Place Order" sublabel={`From ${creator.price.order} pts`}     onClick={() => onAction("order", creator)} />
      </div>

      <p className="text-center text-xs text-zinc-700 mt-4">
        1 pt = KES 1 · Buy points via M-Pesa
      </p>
    </div>
  </div>

  {showAuth && (
    <AuthModal
      onClose={() => setShowAuth(false)}
      onSuccess={() => { setIsAuthed(true); setShowAuth(false); }}
      reason="Sign in to unlock the full gallery"
    />
  )}
  </>
  );
};

export default CreatorProfile;