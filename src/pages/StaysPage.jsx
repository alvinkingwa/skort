import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import StayCard from "../components/StayCard.jsx";
import { STAYS, STAY_TYPES, NEIGHBORHOODS } from "../data/stays.js";
import { brand, brandDark, brandText } from "../theme.js";

const StaysPage = ({ onSelectStay }) => {
  const [search,       setSearch]       = useState("");
  const [type,         setType]         = useState("All Types");
  const [neighborhood, setNeighborhood] = useState("All Areas");
  const [availOnly,    setAvailOnly]    = useState(false);

  const filtered = useMemo(() => STAYS.filter(s => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (type !== "All Types" && s.type !== type) return false;
    if (neighborhood !== "All Areas" && s.neighborhood !== neighborhood) return false;
    if (availOnly && !s.available) return false;
    return true;
  }), [search, type, neighborhood, availOnly]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search stays in Nairobi…"
                className="w-full bg-zinc-800/70 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                onFocus={e => e.target.style.borderColor = brand}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>
            <button
              onClick={() => setAvailOnly(!availOnly)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0"
              style={availOnly
                ? { background: `${brand}20`, borderColor: `${brand}50`, color: brandText }
                : { borderColor: 'rgba(255,255,255,0.08)', color: '#71717a' }
              }
            >
              <span className={`w-2 h-2 rounded-full ${availOnly ? "bg-emerald-400" : "bg-zinc-600"}`} />
              Available only
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {NEIGHBORHOODS.map(n => (
              <button
                key={n}
                onClick={() => setNeighborhood(n)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={neighborhood === n
                  ? { background: `${brand}20`, borderColor: `${brand}50`, color: brandText }
                  : { borderColor: 'rgba(255,255,255,0.08)', color: '#71717a' }
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-white">Nairobi Stays</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{filtered.length} place{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          <select
            value={type} onChange={e => setType(e.target.value)}
            className="bg-zinc-800/60 border border-white/8 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none appearance-none cursor-pointer"
          >
            {STAY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-white font-bold">No stays found</p>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(stay => (
              <StayCard key={stay.id} stay={stay} onClick={onSelectStay} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaysPage;