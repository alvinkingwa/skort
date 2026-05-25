// ─────────────────────────────────────────────
//  src/components/CreatorCard.tsx
//  Changes vs original CreatorCard.jsx:
//  - Converted to TSX with typed props
//  - creator.name        -> creator.fullName
//  - creator.handle      -> creator.modelName
//  - creator.avatar      -> derived from creator.profilePic.storeFileName (or placeholder)
//  - creator.cover       -> removed (not in API); replaced with a solid gradient banner
//  - creator.online      -> removed (not in API)
//  - creator.verified    -> removed (not in API)
//  - creator.specialties -> creator.services (array of ModelService)
//  - creator.rating      -> creator.ratingsAvg
//  - creator.reviews     -> creator.ratingsCount
//  - creator.price       -> creator.ratesFrom
// ─────────────────────────────────────────────

import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { Badge } from "./UI";
import { brand, brandHover, brandText } from "../theme";
import { Model } from "../api/modelsApi";

// ── Image base URL ────────────────────────────
// Profile pics are served from the same API server.
// Adjust the path below if the server uses a different static files route.
const IMAGE_BASE = `${import.meta.env.VITE_API_BASE_URL ?? "http://5.189.157.127:6790"}/skort_app/files/`;
const PLACEHOLDER = "https://ui-avatars.com/api/?background=27272a&color=fff&size=128&name=";

// ── StarRater ─────────────────────────────────
const StarRater = () => {
  const [hovered, setHovered] = useState<number>(0);
  const [rated, setRated]     = useState<number>(0);

  return (
    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => !rated && setHovered(star)}
          onMouseLeave={() => !rated && setHovered(0)}
          onClick={(e) => { e.stopPropagation(); setRated(star); }}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors ${
              star <= (hovered || rated)
                ? "fill-amber-400 text-amber-400"
                : "text-zinc-700"
            }`}
          />
        </button>
      ))}
      {rated > 0 && <span className="text-[10px] text-zinc-500 ml-1">Rated!</span>}
    </div>
  );
};

// ── CreatorCard ───────────────────────────────
interface CreatorCardProps {
  creator: Model;
  onClick: (creator: Model) => void;
}

const CreatorCard = ({ creator, onClick }: CreatorCardProps) => {
  // Build avatar URL from profilePic object, fall back to generated placeholder
  const avatarUrl = creator.profilePic
    ? `${IMAGE_BASE}${creator.profilePic.storeFileName}`
    : `${PLACEHOLDER}${encodeURIComponent(creator.fullName)}`;

  return (
    <article
      onClick={() => onClick(creator)}
      className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${brand}50`)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
    >
      {/* Cover banner — gradient since API has no cover image */}
      <div
        className="relative h-24 flex items-end p-3"
        style={{ background: `linear-gradient(135deg, #27272a 0%, #3f1728 100%)` }}
      >
        {creator.featured && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${brand}30`, color: brandText }}
          >
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2 flex-1">

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={creator.fullName}
            className="w-9 h-9 rounded-full object-cover ring-2 shrink-0"
            style={{ ringColor: `${brand}50` }}
          />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white leading-tight">{creator.fullName}</h3>
            <p className="text-xs text-zinc-500">@{creator.modelName}</p>
            {creator.location && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-500">
                <MapPin className="w-3 h-3" /> {creator.location}
              </div>
            )}
          </div>
        </div>

        {/* Tagline */}
        {creator.tagline && (
          <p className="text-xs italic" style={{ color: brandText }}>
            "{creator.tagline}"
          </p>
        )}

        {/* Services as badges */}
        {creator.services?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {creator.services.map((s) => (
              <Badge key={s.id}>{s.serviceName}</Badge>
            ))}
          </div>
        )}

        {/* Ratings row */}
        <div className="flex items-center justify-between">
          <StarRater />
          <span className="text-[10px] text-zinc-600">
            {creator.ratingsAvg} · {creator.ratingsCount} reviews
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">From</span>
            <p className="text-sm font-black text-white">KES {creator.ratesFrom?.toLocaleString()}</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md"
            style={{ background: `linear-gradient(135deg, ${brand} 0%, #67032F 100%)` }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, #67032F 100%)`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, #67032F 100%)`)
            }
          >
            View Profile
          </button>
        </div>

      </div>
    </article>
  );
};

export default CreatorCard;