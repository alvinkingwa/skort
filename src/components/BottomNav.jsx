import { Flame, Home } from "lucide-react";
import { brand, brandText } from "../theme.js";

const TABS = [
  { id: "creators", label: "Creators", icon: Flame },
  { id: "stays",    label: "Stays",    icon: Home  },
];

const BottomNav = ({ activeTab, onTabChange }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-t border-white/8">
    <div className="max-w-6xl mx-auto flex items-center justify-around px-4 py-2">
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-1 px-8 py-2 rounded-xl transition-all relative"
          >
            {/* Active indicator dot */}
            {active && (
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                style={{ background: `linear-gradient(90deg, ${brand} 0%, #67032F 100%)` }}
              />
            )}
            <Icon
              className="w-5 h-5 transition-all"
              style={{ color: active ? brandText : '#52525b' }}
            />
            <span
              className="text-[10px] font-bold transition-all"
              style={{ color: active ? brandText : '#52525b' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;