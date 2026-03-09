import { useState } from "react";
import { MapPin, BadgeCheck, Star } from "lucide-react";
import { Badge, OnlineBadge } from "./UI.jsx";
import { brand, brandHover, brandText } from "../theme.js";

const StarRater = () => {
  const [hovered, setHovered] = useState(0);
  const [rated,   setRated]   = useState(0);
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
          <Star className={`w-3.5 h-3.5 transition-colors ${star <= (hovered || rated) ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
        </button>
      ))}
      {rated > 0 && <span className="text-[10px] text-zinc-500 ml-1">Rated!</span>}
    </div>
  );
};

const CreatorCard = ({ creator, onClick }) => (
  <article
    onClick={() => onClick(creator)}
    className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300  hover:shadow-xl flex flex-col"
    style={{ '--hover-border': brand }}
    onMouseEnter={e => e.currentTarget.style.borderColor = `${brand}50`}
    onMouseLeave={e => e.currentTarget.style.borderColor = ''}
  >
    {/* Cover — keep the zinc fade gradient */}
    <div className="relative h-24 overflow-hidden">
      <img src={creator.cover} alt={creator.name} className="w-full h-full object-cover transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent" />
      <div className="absolute top-3 left-3">
        <OnlineBadge online={creator.online} />
      </div>
      {creator.verified && (
        <div className="absolute top-3 right-3">
          <Badge color="sky"><BadgeCheck className="w-3 h-3" />Verified</Badge>
        </div>
      )}
    </div>

    {/* Body */}
    <div className="p-3 flex flex-col gap-2 flex-1">

      <div className="flex items-center gap-3">
        <img src={creator.avatar} alt={creator.name} className="w-9 h-9 rounded-full object-cover ring-2 shrink-0" style={{ ringColor: `${brand}50` }} />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white leading-tight">{creator.name}</h3>
          <p className="text-xs text-zinc-500">{creator.handle}</p>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-500">
            <MapPin className="w-3 h-3" /> {creator.location}
          </div>
        </div>
      </div>

      <p className="text-xs italic" style={{ color: brandText }}>"{creator.tagline}"</p>

      <div className="flex flex-wrap gap-1.5">
        {creator.specialties.map((s) => <Badge key={s}>{s}</Badge>)}
      </div>

      <div className="flex items-center justify-between">
        <StarRater />
        <span className="text-[10px] text-zinc-600">{creator.rating} · {creator.reviews} reviews</span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">From</span>
          <p className="text-sm font-black text-white">KES {Math.min(...Object.values(creator.price))}</p>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md"
          style={{ background: `linear-gradient(135deg, ${brand} 0%, #67032F 100%)` }}
          onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, #67032F 100%)`}
          onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, #67032F 100%)`}
        >
          View Profile
        </button>
      </div>

    </div>
  </article>
);

export default CreatorCard;