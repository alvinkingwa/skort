import { Search, Flame, LogIn, LayoutDashboard, Coins } from "lucide-react";
import { usePoints } from "../context/PointsContext.jsx";
import { brand, brandDark, brandHover, brandText } from "../theme.js";

const Navbar = ({ search, onSearch, onlineCount, onSignIn, onDashboard }) => {
  const { points } = usePoints();
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: brand }}>
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-black text-white tracking-tight">Sk</span>
            <span className="text-base font-black tracking-tight" style={{ color: brandText }}>ort</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text" value={search} onChange={(e) => onSearch(e.target.value)}
            placeholder="Search creators…"
            className="w-full bg-zinc-800/70 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
            onFocus={e => e.target.style.borderColor = brand}
            onBlur={e => e.target.style.borderColor = ''}
          />
        </div>

        {/* Online count */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400 text-xs">{onlineCount} online</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">

          {/* Points balance */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ backgroundColor: `${brand}15`, borderColor: `${brand}40` }}>
            <Coins className="w-3.5 h-3.5" style={{ color: brandText }} />
            <span className="text-xs font-black" style={{ color: brandText }}>{points.toLocaleString()}</span>
            <span className="text-[10px] hidden sm:block" style={{ color: `${brandText}80` }}>pts</span>
          </div>

          {/* Dashboard icon */}
          <button onClick={onDashboard} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
            <LayoutDashboard className="w-4 h-4" />
          </button>

          {/* Client sign in */}
          <button
            onClick={onSignIn}
            className="flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md"
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;