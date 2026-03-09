// ─────────────────────────────────────────────
//  components/FilterBar.jsx
//  Online toggle + sort dropdown
// ─────────────────────────────────────────────
import { Wifi, SlidersHorizontal } from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { SORT_OPTIONS } from "../data/models.js";

const FilterBar = ({ sort, onSortChange, onlineOnly, onOnlineToggle, resultCount }) => (
  <div className="flex items-center gap-3 flex-wrap">

    {/* Online Now toggle */}
    <button
      onClick={onOnlineToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
        onlineOnly
          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
          : "bg-zinc-800/50 border-white/8 text-zinc-400 hover:text-white"
      }`}
    >
      <Wifi className="w-3.5 h-3.5" /> Online Now
    </button>

    {/* Sort */}
    <div className="relative flex items-center">
      <SlidersHorizontal className="absolute left-3 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className={`bg-zinc-800/60 border border-white/8 text-zinc-300 text-sm rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#A1045A]/50 cursor-pointer appearance-none`}
      >
        {SORT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>

    {/* Result count */}
    <span className="text-xs text-zinc-600 ml-auto">
      {resultCount} creator{resultCount !== 1 ? "s" : ""}
    </span>
  </div>
);

export default FilterBar;