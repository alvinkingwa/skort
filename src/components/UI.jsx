// ─────────────────────────────────────────────
//  components/UI.jsx  —  Shared primitive components
// ─────────────────────────────────────────────
import { Star, Wifi, WifiOff } from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";

export const Badge = ({ children, color = "zinc" }) => {
  const styles = {
    rose:    "bg-[#A1045A]/18 text-[#e07ab0] border-[#A1045A]/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    sky:     "bg-sky-500/15 text-sky-300 border-sky-500/30",
    amber:   "bg-amber-500/15 text-amber-300 border-amber-500/30",
    zinc:    "bg-zinc-700/50 text-zinc-400 border-zinc-600/40",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[color]}`}>
      {children}
    </span>
  );
};

export const Avatar = ({ src, name, size = "md", online }) => {
  const sizes = { sm: "w-9 h-9", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };
  return (
    <div className="relative inline-block shrink-0">
      <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-[#A1045A]/40`} />
      {online !== undefined && (
        <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900 ${online ? "bg-emerald-400" : "bg-zinc-500"}`} />
      )}
    </div>
  );
};

export const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center gap-1.5">
    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    <span className="text-sm font-bold text-white">{rating}</span>
    {reviews && <span className="text-xs text-zinc-500">({reviews})</span>}
  </div>
);

export const OnlineBadge = ({ online }) =>
  online
    ? <Badge color="emerald"><Wifi className="w-3 h-3" />Online</Badge>
    : <Badge color="zinc"><WifiOff className="w-3 h-3" />Offline</Badge>;

export const SectionTitle = ({ children }) => (
  <h2 className="flex items-center gap-2 text-base font-bold text-white">
    <span
      className="w-1 h-5 rounded-full"
      style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
    />
    {children}
  </h2>
);