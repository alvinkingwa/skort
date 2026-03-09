import { Flame, Home } from "lucide-react";
import { brand, brandDark, brandText } from "../theme.js";

const TabSwitcher = ({ activeTab, onTabChange }) => (
  <div
    className="fixed bottom-8 right-5 z-50 flex flex-col gap-2"
  >
    {[
      { id: "creators", label: "Creators", icon: Flame },
      { id: "stays",    label: "Stays",    icon: Home  },
    ].map(({ id, label, icon: Icon }) => {
      const active = activeTab === id;
      return (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold shadow-xl transition-all duration-200 border"
          style={active ? {
            background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
            borderColor: "transparent",
            color: "#fff",
            boxShadow: `0 8px 32px ${brand}50`,
            transform: "scale(1.05)",
          } : {
            background: "rgba(24,24,27,0.95)",
            borderColor: "rgba(255,255,255,0.08)",
            color: "#71717a",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#71717a"; }}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      );
    })}
  </div>
);

export default TabSwitcher;