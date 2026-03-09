// ─────────────────────────────────────────────
//  pages/CallPage.jsx
//  Points drain every 30s during call.
//  When balance = 0, call pauses + buy modal opens.
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, ArrowLeft, Coins } from "lucide-react";
import BuyPointsModal from "../components/BuyPointsModal.jsx";
import RatingModal    from "../components/RatingModal.jsx";
import { usePoints }  from "../context/PointsContext.jsx";

const DRAIN_INTERVAL = 30;  // seconds between point deductions
const DRAIN_COST     = 10;  // points deducted each interval

const CallPage = ({ creator, mode, onBack }) => {
  const { points, addPoints, hasEnough, spendPoints } = usePoints();
  const [muted,      setMuted]      = useState(false);
  const [camOff,     setCamOff]     = useState(false);
  const [seconds,    setSeconds]    = useState(0);
  const [status,     setStatus]     = useState("connecting"); // connecting | active | paused
  const [showBuy,    setShowBuy]    = useState(false);
  const [showRating, setShowRating] = useState(false);
  const isVideo = mode === "video";

  // Connecting → active after 2s
  useEffect(() => {
    const t = setTimeout(() => setStatus("active"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Timer — drains points every DRAIN_INTERVAL seconds
  useEffect(() => {
    if (status !== "active") return;
    const t = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  // Drain points every DRAIN_INTERVAL ticks
  useEffect(() => {
    if (status !== "active") return;
    if (seconds > 0 && seconds % DRAIN_INTERVAL === 0) {
      if (hasEnough(DRAIN_COST)) {
        spendPoints(DRAIN_COST);
      } else {
        // Out of points — pause call
        setStatus("paused");
        setShowBuy(true);
      }
    }
  }, [seconds]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleHangUp = () => setShowRating(true);

  const ptsCostPerMin = Math.round((DRAIN_COST / DRAIN_INTERVAL) * 60);

  return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 40%, #f43f5e 0%, transparent 60%)" }} />

      <button onClick={onBack} className="absolute top-4 left-4 z-10 text-zinc-400 hover:text-white">
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Points balance — top right */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-1.5">
        <Coins className="w-3.5 h-3.5 text-amber-400" />
        <span className={`text-xs font-black ${points <= 20 ? "text-rose-400 animate-pulse" : "text-amber-400"}`}>{points} pts</span>
        <button onClick={() => setShowBuy(true)} className="text-[10px] font-bold text-amber-500 hover:text-amber-300 transition-colors ml-1">+ Top up</button>
      </div>

      {/* Creator info */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <img src={creator.avatar} alt="" className="w-28 h-28 rounded-full object-cover ring-4 ring-rose-500/40 shadow-2xl" />
          {status === "connecting" && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-rose-500/40 animate-ping" />
              <div className="absolute -inset-3 rounded-full border border-rose-500/20 animate-ping" style={{ animationDelay: "0.3s" }} />
            </>
          )}
          {status === "paused" && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
              <span className="text-xs font-black text-rose-400">PAUSED</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{creator.name}</h2>
          <p className="text-zinc-500 text-sm mt-1">
            {status === "connecting" ? (isVideo ? "Starting video…" : "Calling…")
             : status === "paused"   ? "Call paused — recharge to continue"
             : fmt(seconds)}
          </p>
          <p className="text-xs text-zinc-600 mt-1">{ptsCostPerMin} pts / min · 1 pt = KES 1</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ${isVideo ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}>
          {isVideo ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
          {isVideo ? "Video Call" : "Voice Call"}
        </div>
      </div>

      {/* Video preview */}
      {isVideo && (
        <div className="relative z-10 w-full max-w-sm h-48 bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <VideoOff className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-600">Camera preview</p>
          </div>
          <div className="absolute bottom-3 right-3 w-20 h-14 bg-zinc-800 rounded-lg border border-white/10 flex items-center justify-center">
            <p className="text-[10px] text-zinc-600">You</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-6">
        <button onClick={() => setMuted(!muted)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted ? "bg-rose-500/20 border border-rose-500/40 text-rose-400" : "bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white"}`}>
          {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button onClick={handleHangUp} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30 transition-all">
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
        {isVideo && (
          <button onClick={() => setCamOff(!camOff)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOff ? "bg-rose-500/20 border border-rose-500/40 text-rose-400" : "bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white"}`}>
            {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Buy points modal — shown when call pauses */}
      {showBuy && (
        <BuyPointsModal
          sessionType={mode}
          required={DRAIN_COST}
          onClose={() => setShowBuy(false)}
          onSuccess={(pts) => {
            addPoints(pts);
            setShowBuy(false);
            setStatus("active"); // resume call
          }}
        />
      )}

      {showRating && (
        <RatingModal
          creator={creator}
          sessionType={mode}
          onClose={() => { setShowRating(false); onBack(); }}
        />
      )}
    </div>
  );
};

export default CallPage;