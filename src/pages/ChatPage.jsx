// ─────────────────────────────────────────────
//  pages/ChatPage.jsx
//  Points deducted per message. When balance hits
//  0, sending is blocked and BuyPointsModal opens.
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Coins } from "lucide-react";
import BuyPointsModal from "../components/BuyPointsModal.jsx";
import RatingModal    from "../components/RatingModal.jsx";
import { usePoints }  from "../context/PointsContext.jsx";

const MSG_COST = 10; // pts per message sent

const ChatPage = ({ creator, onBack }) => {
  const { points, addPoints, hasEnough, spendPoints } = usePoints();
  const [input,      setInput]      = useState("");
  const [messages,   setMessages]   = useState([
    { id: 1, from: "creator", text: `Hey! I'm ${creator.name.split(" ")[0]} 👋 What's on your mind?`, time: "Now" },
  ]);
  const [showBuy,    setShowBuy]    = useState(false);
  const [showRating, setShowRating] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    if (!hasEnough(MSG_COST)) {
      // Not enough points — block send, show buy modal
      setShowBuy(true);
      return;
    }

    spendPoints(MSG_COST);
    setMessages((p) => [...p, { id: Date.now(), from: "client", text: input.trim(), time: "Now" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950">

      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={() => setShowRating(true)} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src={creator.avatar} alt="" className={`w-9 h-9 rounded-full object-cover ring-2 ring-[#A1045A]/30`} />
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{creator.name}</p>
          <p className={`text-xs ${creator.online ? "text-emerald-400" : "text-zinc-500"}`}>
            {creator.online ? "Online" : "Offline"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button key={i} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Points balance bar */}
      <div className="bg-zinc-900/80 border-b border-white/5 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-zinc-400">Balance:</span>
          <span className={`text-xs font-black ${points <= 20 ? "text-[#e07ab0]" : "text-amber-400"}`}>
            {points} pts
          </span>
          {points <= 20 && (
            <span className={`text-[10px] text-[#e07ab0] font-semibold animate-pulse`}>· Low!</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-600">{MSG_COST} pts per message</span>
          <button
            onClick={() => setShowBuy(true)}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all"
          >
            + Top Up
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
            {msg.from === "creator" && (
              <img src={creator.avatar} alt="" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0" />
            )}
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.from === "client"
                ? "bg-[#A1045A] text-white rounded-br-sm"
                : "bg-zinc-800 text-zinc-200 rounded-bl-sm border border-white/5"
            }`}>
              {msg.text}
              <p className={`text-[10px] mt-1 ${msg.from === "client" ? "text-zinc-300" : "text-zinc-600"}`}>{msg.time}</p>
            </div>
          </div>
        ))}

        {/* Low points notice inside chat */}
        {points <= 20 && points > 0 && (
          <div className="flex justify-center">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 text-center max-w-xs">
              <p className="text-xs text-amber-300 font-semibold">Running low on points!</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Top up to keep chatting</p>
              <button
                onClick={() => setShowBuy(true)}
                className="mt-2 text-xs font-bold px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-white transition-all"
              >
                Buy Points
              </button>
            </div>
          </div>
        )}

        {/* Out of points notice */}
        {points === 0 && (
          <div className="flex justify-center">
            <div className={`bg-[#A1045A]/18 border border-[#A1045A]/30 rounded-xl px-4 py-3 text-center max-w-xs`}>
              <p className="text-sm font-black text-white mb-1">Out of points</p>
              <p className="text-xs text-zinc-500 mb-3">Recharge to continue chatting with {creator.name.split(" ")[0]}</p>
              <button
                onClick={() => setShowBuy(true)}
                className={`w-full py-2 rounded-xl text-white text-xs font-bold transition-all`}
              
              style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
              onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
              onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
              >
                Recharge Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="bg-zinc-900 border-t border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={points === 0 ? "Recharge to send messages…" : "Type a message…"}
          disabled={points === 0}
          className={`flex-1 bg-zinc-800 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-md shadow-[#A1045A]/25 disabled:opacity-40 disabled:cursor-not-allowed`}
        
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
        onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Buy points modal */}
      {showBuy && (
        <BuyPointsModal
          sessionType="chat"
          required={MSG_COST}
          onClose={() => setShowBuy(false)}
          onSuccess={(pts) => {
            addPoints(pts);
            setShowBuy(false);
          }}
        />
      )}

      {/* Rating modal on exit */}
      {showRating && (
        <RatingModal
          creator={creator}
          sessionType="chat"
          onClose={() => { setShowRating(false); onBack(); }}
        />
      )}
    </div>
  );
};

export default ChatPage;