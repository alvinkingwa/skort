
import { useState } from "react";
import { MapPin, Star, Users, Bed, Bath, Wifi, Crown } from "lucide-react";
import { brand, brandDark, brandText } from "../theme.js";

const StayCard = ({ stay, onClick }) => {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <article
      onClick={() => onClick(stay)}
      className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
      onMouseEnter={e => e.currentTarget.style.borderColor = `${brand}50`}
      onMouseLeave={e => e.currentTarget.style.borderColor = ''}
    >
      {/* Photo */}
      <div className="relative h-44 overflow-hidden group">
        <img
          src={stay.images[imgIdx]}
          alt={stay.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />

        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${
            stay.available
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-zinc-800/80 border-white/10 text-zinc-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stay.available ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
            {stay.available ? "Available" : "Occupied"}
          </span>
        </div>

        {/* Superhost badge */}
        {stay.host.superhost && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-sm">
              <Crown className="w-3 h-3" /> Superhost
            </span>
          </div>
        )}

        {/* Image dots */}
        {stay.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {stay.images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">

        {/* Type + location */}
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{stay.type}</p>
          <h3 className="text-sm font-bold text-white leading-tight">{stay.title}</h3>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-500">
            <MapPin className="w-3 h-3" /> {stay.location}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1"><Bed className="w-3 h-3" />{stay.bedrooms} bed</div>
          <div className="flex items-center gap-1"><Bath className="w-3 h-3" />{stay.bathrooms} bath</div>
          <div className="flex items-center gap-1"><Users className="w-3 h-3" />{stay.guests} guests</div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1">
          {stay.amenities.slice(0, 4).map(a => (
            <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-zinc-400">{a}</span>
          ))}
          {stay.amenities.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-zinc-500">+{stay.amenities.length - 4}</span>
          )}
        </div>

        {/* Rating + price */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white">{stay.rating}</span>
            <span className="text-xs text-zinc-600">({stay.reviews})</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white">KES {stay.price.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-600">per night</p>
          </div>
        </div>

      </div>
    </article>
  );
};

export default StayCard;