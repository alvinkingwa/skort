// ─────────────────────────────────────────────
//  src/components/StayCard.tsx
//  Changes vs original StayCard.jsx:
//  - Converted to TSX with typed props
//  - stay.images        -> removed (files is null in API); replaced with gradient banner
//  - stay.available     -> removed (not in API); availability badge removed
//  - stay.host.superhost -> removed (not in API); superhost badge removed
//  - stay.bedrooms      -> stay.beds
//  - stay.bathrooms     -> stay.baths
//  - stay.amenities     -> stay.amenities (now array of BnbAmenity objects, use amenityName)
//  - stay.rating        -> stay.ratingsAvg
//  - stay.reviews       -> stay.ratingsCount
//  - stay.price         -> stay.ratePerNight
//  - key changed to stay.bnbId where needed
// ─────────────────────────────────────────────

import { MapPin, Star, Users, Bed, Bath } from "lucide-react";
import { brand, brandText } from "../theme";
import { Bnb } from "../api/bnbsApi";

interface StayCardProps {
  stay: Bnb;
  onClick: (stay: Bnb) => void;
}

const StayCard = ({ stay, onClick }: StayCardProps) => {
  return (
    <article
      onClick={() => onClick(stay)}
      className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${brand}50`)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
    >
      {/* Banner — gradient since API has no images yet */}
      <div
        className="relative h-44 flex items-end p-3"
        style={{ background: "linear-gradient(135deg, #1c1c1f 0%, #3f1728 100%)" }}
      >
        {/* Type badge */}
        {stay.type && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm"
            style={{ background: `${brand}20`, borderColor: `${brand}50`, color: brandText }}
          >
            {stay.type}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">

        {/* Location + title */}
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{stay.title}</h3>
          {stay.location && (
            <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-500">
              <MapPin className="w-3 h-3" /> {stay.location}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1"><Bed className="w-3 h-3" />{stay.beds} bed</div>
          <div className="flex items-center gap-1"><Bath className="w-3 h-3" />{stay.baths} bath</div>
          <div className="flex items-center gap-1"><Users className="w-3 h-3" />{stay.guests} guests</div>
        </div>

        {/* Amenities — now objects with amenityName */}
        {stay.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {stay.amenities.slice(0, 4).map((a) => (
              <span
                key={a.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-zinc-400"
              >
                {a.amenityName}
              </span>
            ))}
            {stay.amenities.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-zinc-500">
                +{stay.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Rating + price */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white">{stay.ratingsAvg}</span>
            <span className="text-xs text-zinc-600">({stay.ratingsCount})</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white">
              KES {stay.ratePerNight?.toLocaleString()}
            </p>
            <p className="text-[10px] text-zinc-600">per night</p>
          </div>
        </div>

      </div>
    </article>
  );
};

export default StayCard;