import { ThumbsUp, ThumbsDown } from "lucide-react";
import { brand } from "./helpers";
import { sessionIcon, sessionBadge } from "./helpers";
import type { Rating } from "./types";

interface TabRatingsProps {
  ratings: Rating[];
  positiveRatings: number;
}

const TabRatings = ({ ratings, positiveRatings }: TabRatingsProps) => (
  <div className="space-y-4">
    <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Approval rating</p>
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={brand} strokeWidth="3"
              strokeDasharray={`${positiveRatings} ${100 - positiveRatings}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-white">{positiveRatings}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {[
            { label: "Positive", pct: positiveRatings,         color: "bg-emerald-500", textColor: "text-emerald-400", icon: <ThumbsUp   className="w-3 h-3 text-emerald-400" /> },
            { label: "Negative", pct: 100 - positiveRatings,   color: "bg-red-500",     textColor: "text-red-400",     icon: <ThumbsDown className="w-3 h-3 text-red-400"     /> },
          ].map(({ label, pct, color, textColor, icon }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400 flex items-center gap-1">{icon} {label}</span>
                <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-2">
      {ratings.map((r) => (
        <div key={r.id} className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.vote === "up" ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
            {r.vote === "up"
              ? <ThumbsUp   className="w-3.5 h-3.5 text-emerald-400" />
              : <ThumbsDown className="w-3.5 h-3.5 text-red-400"     />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{r.client}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${sessionBadge(r.type)}`}>
                {sessionIcon(r.type)} {r.type}
              </span>
              <span className="text-[10px] text-zinc-600">{r.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TabRatings;