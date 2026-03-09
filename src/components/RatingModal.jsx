// ─────────────────────────────────────────────
//  components/RatingModal.jsx
//  Post-session thumbs up / down rating
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { ThumbsUp, ThumbsDown, X, CheckCircle } from "lucide-react";

const RatingModal = ({ creator, sessionType, onClose }) => {
  const [choice,  setChoice]  = useState(null); // "up" | "down"
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const sessionLabels = { chat: "chat session", call: "voice call", video: "video call", order: "order" };

  const handleSubmit = () => {
    if (!choice) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="font-black text-white">Thanks for the feedback!</p>
              <p className="text-zinc-500 text-sm mt-1">It helps improve Skort for everyone.</p>
            </div>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 text-sm font-semibold hover:text-white transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Creator info */}
            <img src={creator.avatar} alt={creator.name} className={`w-14 h-14 rounded-full object-cover ring-2 ring-[#A1045A]/30 mx-auto mb-3`} />
            <p className="font-black text-white text-base">{creator.name}</p>
            <p className="text-zinc-500 text-xs mt-1 mb-6">
              How was your {sessionLabels[sessionType] || "session"}?
            </p>

            {/* Thumbs */}
            <div className="flex justify-center gap-6 mb-6">
              <button
                onClick={() => setChoice("up")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  choice === "up"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 scale-105"
                    : "bg-zinc-800 border-white/8 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30"
                }`}
              >
                <ThumbsUp className={`w-8 h-8 ${choice === "up" ? "fill-emerald-400" : ""}`} />
                <span className="text-xs font-bold">Good</span>
              </button>

              <button
                onClick={() => setChoice("down")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  choice === "down"
                    ? "bg-[#A1045A]/35 border-[#A1045A]/50 text-[#e07ab0] scale-105"
                    : "bg-zinc-800 border-white/8 text-zinc-500 hover:text-[#e07ab0] hover:border-[#A1045A]/30"
                }`}
              >
                <ThumbsDown className={`w-8 h-8 ${choice === "down" ? "fill-[#d4589a]" : ""}`} />
                <span className="text-xs font-bold">Poor</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!choice || loading}
              className={`w-full flex items-center justify-center py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25 disabled:opacity-40 disabled:cursor-not-allowed`}
            
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "Submit"
              }
            </button>

            <button onClick={onClose} className="w-full mt-2 py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;