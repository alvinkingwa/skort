// ─────────────────────────────────────────────
//  components/ModelCard.jsx
//  Creator profile card with expandable about + services
// ─────────────────────────────────────────────
import { useState } from "react";
import { MapPin, BadgeCheck, Zap, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Badge, Avatar, StarRating, OnlineBadge } from "./UI.jsx";
import ServiceRow from "./ServiceList.jsx";

const ModelCard = ({ model, onAction }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-zinc-900 border border-white/5 hover:border-rose-500/20 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5">

      {/* ── Cover image ───────────────────────── */}
      <div className="relative h-40 overflow-hidden">
        <img src={model.cover} alt={model.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

        {/* Location chip */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] text-zinc-300">
          <MapPin className="w-3 h-3" />
          {model.location}
        </div>

        {/* Verified badge */}
        {model.verified && (
          <div className="absolute top-3 right-3">
            <Badge color="sky">
              <BadgeCheck className="w-3 h-3" /> Verified
            </Badge>
          </div>
        )}
      </div>

      {/* ── Profile header ────────────────────── */}
      <div className="px-4 pt-3 flex items-start gap-3">
        <Avatar src={model.avatar} name={model.name} size="md" online={model.online} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white">{model.name}</h3>
            <OnlineBadge online={model.online} />
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{model.handle} · Age {model.age}</p>
          <p className="text-xs text-rose-300 mt-1 italic">"{model.tagline}"</p>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────── */}
      <div className="px-4 mt-3 flex items-center gap-3 flex-wrap">
        <StarRating rating={model.rating} reviews={model.reviews} />
        <span className="text-zinc-700">·</span>
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Users className="w-3 h-3" /> {model.totalSessions} sessions
        </div>
        <span className="text-zinc-700">·</span>
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Zap className="w-3 h-3" /> {model.responseTime}
        </div>
      </div>

      {/* ── Specialty tags ────────────────────── */}
      <div className="px-4 mt-3 flex flex-wrap gap-1.5">
        {model.specialties.map((s) => (
          <Badge key={s} color="zinc">{s}</Badge>
        ))}
      </div>

      {/* ── About (expandable) ────────────────── */}
      <div className="px-4 mt-3">
        <p className={`text-xs text-zinc-400 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
          {model.about}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 mt-1 transition-colors"
        >
          {expanded
            ? <><ChevronUp className="w-3 h-3" /> Show less</>
            : <><ChevronDown className="w-3 h-3" /> Read more</>
          }
        </button>
      </div>

      {/* ── Services ──────────────────────────── */}
      <div className="px-4 mt-4 pb-4 space-y-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Available Services
        </p>
        {model.services.map((svc) => (
          <ServiceRow key={svc.id} service={svc} onAction={(s) => onAction(model, s)} />
        ))}
      </div>

    </article>
  );
};

export default ModelCard;