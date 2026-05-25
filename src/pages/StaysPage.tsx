// ─────────────────────────────────────────────
//  src/pages/StaysPage.tsx
// ─────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, RefreshCw } from "lucide-react";
import StayCard from "../components/StayCard";
import { useBnbs } from "../hooks/useBnbs";
import { fetchBnbTypes, Bnb } from "../api/bnbsApi";
import { brand, brandText } from "../theme";
import Footer from "../components/Footer";

const AREAS = [
  "All Areas",
  "Westlands",
  "Kilimani",
  "Karen",
  "Lavington",
  "Parklands",
  "Kileleshwa",
  "Runda",
  "Muthaiga",
];

interface StaysPageProps {
  onSelectStay: (stay: Bnb) => void;
  onJoinCreator: () => void;
  onTabChange: (tab: string) => void;
}

const StaysPage = ({ onSelectStay, onJoinCreator, onTabChange }: StaysPageProps) => {
  const [search, setSearch]     = useState<string>("");
  const [type, setType]         = useState<string>("All Types");
  const [area, setArea]         = useState<string>("All Areas");
  const [stayTypes, setStayTypes] = useState<string[]>(["All Types"]);

  useEffect(() => {
    fetchBnbTypes()
      .then((types) => setStayTypes(["All Types", ...types]))
      .catch(() => {
        setStayTypes(["All Types", "Cottage", "Apartment", "Villa", "Studio", "Bungalow", "Penthouse", "Private Room"]);
      });
  }, []);

  const { bnbs, loading, error, refetch } = useBnbs();

  const filtered = useMemo(() => bnbs.filter((s) => {
    if (
      search &&
      !s.title?.toLowerCase().includes(search.toLowerCase()) &&
      !s.location?.toLowerCase().includes(search.toLowerCase())
    ) return false;
    if (type !== "All Types" && s.type !== type) return false;
    if (area !== "All Areas" && !s.location?.toLowerCase().includes(area.toLowerCase())) return false;
    return true;
  }), [bnbs, search, type, area]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stays in Nairobi…"
                className="w-full bg-zinc-800/70 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </div>
          </div>

          {/* Area filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {AREAS.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={
                  area === a
                    ? { background: `${brand}20`, borderColor: `${brand}50`, color: brandText }
                    : { borderColor: "rgba(255,255,255,0.08)", color: "#71717a" }
                }
              >
                {a}
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
            <p className="text-zinc-500 text-sm mt-0.5">
              {loading ? "Loading…" : `${filtered.length} place${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {/* Type dropdown */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-zinc-800/60 border border-white/8 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none appearance-none cursor-pointer"
          >
            {stayTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-zinc-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-white font-bold">No stays found</p>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Stays grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((stay) => (
              <StayCard key={stay.bnbId} stay={stay} onClick={onSelectStay} />
            ))}
          </div>
        )}
      </div>

      <Footer onJoinCreator={onJoinCreator} onTabChange={onTabChange} />
    </div>
  );
};

export default StaysPage;