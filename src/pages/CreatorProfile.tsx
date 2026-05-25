import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme";
import {
  ArrowLeft, MapPin, Star, Users,
  MessageCircle, Phone, Video, ShoppingBag,
  X, ChevronLeft, ChevronRight, Images, Lock,
} from "lucide-react";
import { Badge } from "../components/UI";
import AuthModal from "../components/AuthModal";
import { useModel } from "../hooks/useModels";
import { Model, ModelDetail, ModelFile } from "../api/modelsApi";

const IMAGE_BASE = `${import.meta.env.VITE_API_BASE_URL ?? "http://5.189.157.127:6790"}/skort_app/files/`;
const PLACEHOLDER = (name: string) => `https://ui-avatars.com/api/?background=27272a&color=fff&size=128&name=${encodeURIComponent(name)}`;

const fileUrl = (file: ModelFile) => `${IMAGE_BASE}${file.storeFileName}`;

// ── Lightbox ──────────────────────────────────
interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
}

const Lightbox = ({ images, index, onClose }: LightboxProps) => {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
        <X className="w-5 h-5" />
      </button>
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white/50">
        {current + 1} / {images.length}
      </p>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <img src={images[current]} alt="" className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-[#A1045A] opacity-100" : "border-transparent opacity-40 hover:opacity-70"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Gallery ───────────────────────────────────
interface GalleryProps {
  images: string[];
  isAuthed: boolean;
  onAuthRequired: () => void;
}

const Gallery = ({ images, isAuthed, onAuthRequired }: GalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const FREE_LIMIT = 3;
  const preview = images.slice(0, FREE_LIMIT);
  const locked  = images.slice(FREE_LIMIT);

  const handleClick = (i: number) => {
    if (i >= FREE_LIMIT && !isAuthed) { onAuthRequired(); return; }
    setLightboxIndex(i);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Images className="w-4 h-4 text-zinc-500" />
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gallery</h2>
          <span className="text-xs text-zinc-700">{images.length} photos</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {preview.map((img, i) => (
            <button key={i} onClick={() => handleClick(i)} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-200" />
            </button>
          ))}
          {locked.map((img, i) => (
            <button key={`locked-${i}`} onClick={() => handleClick(FREE_LIMIT + i)} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover scale-110 blur-sm brightness-50" />
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
interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  color: "rose" | "emerald" | "violet" | "amber";
  onClick: () => void;
}

const ActionButton = ({ icon: Icon, label, sublabel, color, onClick }: ActionButtonProps) => {
  const colors = {
    rose:    "shadow-[#A1045A]/25",
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
interface CreatorProfileProps {
  creator: Model;
  onBack: () => void;
  onAction: (action: string, creator: Model) => void;
}

const CreatorProfile = ({ creator, onBack, onAction }: CreatorProfileProps) => {
  const { model, loading, error } = useModel(creator.modelId);
  const [isAuthed, setIsAuthed]   = useState(false);
  const [showAuth, setShowAuth]   = useState(false);

  const avatarUrl = model?.profilePic
    ? fileUrl(model.profilePic)
    : creator.profilePic
    ? fileUrl(creator.profilePic)
    : PLACEHOLDER(creator.fullName);

  const coverUrl = model?.coverPicture
    ? fileUrl(model.coverPicture)
    : null;

  const galleryImages = model?.files?.map(fileUrl) ?? [];

  // ── Loading ───────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="h-36 bg-zinc-800 animate-pulse" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────
  if (error || !model) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error ?? "Creator not found"}</p>
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-white">

        {/* Cover */}
        <div className="relative overflow-hidden" style={{ height: "140px" }}>
          {coverUrl ? (
            <img src={coverUrl} alt={model.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #1c1c1f 0%, #3f1728 100%)" }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-black/70 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">

          {/* Avatar + name */}
          <div className="flex items-end gap-3 -mt-7 mb-5">
            <img src={avatarUrl} alt={model.fullName} className="w-14 h-14 rounded-full object-cover ring-4 ring-zinc-950 shrink-0" />
            <div className="pb-1 min-w-0 flex-1">
              <h1 className="text-lg font-black text-white tracking-tight">{model.fullName}</h1>
              <p className="text-xs text-zinc-500">@{model.modelName}</p>
              <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                <MapPin className="w-3 h-3" /> {model.location} · Age {model.age}
              </div>
            </div>
          </div>

          {model.tagline && (
            <p className="text-[#e07ab0] italic text-sm mb-5">"{model.tagline}"</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />, value: `${model.ratingsAvg} (${model.ratingsCount})`, label: "Rating" },
              { icon: <Users className="w-4 h-4" style={{ color: brandText }} />, value: `KES ${model.ratesFrom?.toLocaleString()}`, label: "Rates From" },
            ].map(({ icon, value, label }) => (
              <div key={label} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{icon}</div>
                <p className="text-sm font-bold text-white">{value}</p>
                <p className="text-[10px] text-zinc-500">{label}</p>
              </div>
            ))}
          </div>

          {/* About */}
          {model.aboutMe && (
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mb-4">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">About</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">{model.aboutMe}</p>
            </div>
          )}

          {/* Services */}
          {model.services?.length > 0 && (
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mb-6">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Services</h2>
              <div className="flex flex-wrap gap-1.5">
                {model.services.map((s) => <Badge key={s.id}>{s.serviceName}</Badge>)}
              </div>
            </div>
          )}

          {/* Gallery */}
          <Gallery images={galleryImages} isAuthed={isAuthed} onAuthRequired={() => setShowAuth(true)} />

          {/* Action buttons */}
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
            Connect with {model.fullName.split(" ")[0]}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={MessageCircle} color="rose"    label="Text Chat"   sublabel={`KES ${model.ratesFrom?.toLocaleString()} / session`} onClick={() => onAction("chat",  creator)} />
            <ActionButton icon={Phone}         color="emerald" label="Voice Call"  sublabel={`KES ${model.ratesFrom?.toLocaleString()} / session`} onClick={() => onAction("call",  creator)} />
            <ActionButton icon={Video}         color="violet"  label="Video Call"  sublabel={`KES ${model.ratesFrom?.toLocaleString()} / session`} onClick={() => onAction("video", creator)} />
            <ActionButton icon={ShoppingBag}   color="amber"   label="Place Order" sublabel={`From KES ${model.ratesFrom?.toLocaleString()}`}       onClick={() => onAction("order", creator)} />
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