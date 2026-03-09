// ─────────────────────────────────────────────
//  pages/CreatorDashboard.jsx
//  Creator's private dashboard — 4 tabs:
//  Overview | Ratings | Inbox | Points & Money
// ─────────────────────────────────────────────
import { useState, useRef } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import {
  Flame, LayoutDashboard, ThumbsUp, ThumbsDown,
  MessageCircle, Coins, TrendingUp, Eye, Users,
  Star, Phone, Video, ShoppingBag, ArrowLeft,
  Send, Wallet, ArrowDownToLine, Gift, Zap,
  ChevronRight, Clock, CheckCircle, UserCircle,
  Camera, ImagePlus, Images, X, Save, BadgeCheck,
} from "lucide-react";

// ── Mock data ─────────────────────────────────
const MOCK_CREATOR = {
  name: "Amara Njeri",
  handle: "@amaranjeri",
  avatar: "https://i.pravatar.cc/300?img=47",
  plan: "Pro",
  trialEndsIn: null,
  balance: 12450,
  points: 3280,
  totalEarnings: 48900,
};

const MOCK_STATS = {
  profileViews: 1284,
  totalSessions: 94,
  thumbsUp: 81,
  thumbsDown: 13,
  thisMonthEarnings: 8750,
  lastMonthEarnings: 6200,
};

const MOCK_RATINGS = [
  { id: 1, client: "Client #4821", type: "call",  vote: "up",   time: "Today, 2:14 PM"      },
  { id: 2, client: "Client #3302", type: "chat",  vote: "up",   time: "Today, 11:30 AM"     },
  { id: 3, client: "Client #9871", type: "video", vote: "down", time: "Yesterday, 8:45 PM"  },
  { id: 4, client: "Client #1145", type: "order", vote: "up",   time: "Yesterday, 3:20 PM"  },
  { id: 5, client: "Client #5530", type: "chat",  vote: "up",   time: "Mon, 6:00 PM"        },
  { id: 6, client: "Client #2278", type: "call",  vote: "up",   time: "Mon, 1:15 PM"        },
  { id: 7, client: "Client #6643", type: "chat",  vote: "down", time: "Sun, 9:30 AM"        },
  { id: 8, client: "Client #8812", type: "video", vote: "up",   time: "Sat, 4:50 PM"        },
];

const MOCK_INBOX = [
  { id: 1, client: "Client #4821", lastMsg: "Thank you, that was really helpful!", time: "2:14 PM",  unread: 0, type: "call"  },
  { id: 2, client: "Client #3302", lastMsg: "Can we continue tomorrow?",           time: "11:30 AM", unread: 2, type: "chat"  },
  { id: 3, client: "Client #7761", lastMsg: "How much for a custom order?",        time: "Yesterday",unread: 1, type: "order" },
  { id: 4, client: "Client #1145", lastMsg: "Loved the session 🔥",               time: "Mon",      unread: 0, type: "video" },
  { id: 5, client: "Client #5530", lastMsg: "Are you available tonight?",          time: "Mon",      unread: 3, type: "chat"  },
];

const MOCK_TRANSACTIONS = [
  { id: 1, label: "Voice Call — Client #4821", amount: 500,  points: 50,  time: "Today, 2:14 PM",      type: "session" },
  { id: 2, label: "Chat Session — Client #3302", amount: 200, points: 20, time: "Today, 11:30 AM",      type: "session" },
  { id: 3, label: "Tip from Client #9871",       amount: 300,  points: 0, time: "Yesterday, 9:00 PM",   type: "tip"     },
  { id: 4, label: "Custom Order — Client #1145", amount: 1500, points: 150,time: "Yesterday, 3:20 PM",  type: "session" },
  { id: 5, label: "Video Call — Client #5530",   amount: 800,  points: 80, time: "Mon, 6:00 PM",        type: "session" },
  { id: 6, label: "Tip from Client #2278",       amount: 200,  points: 0,  time: "Mon, 2:00 PM",        type: "tip"     },
  { id: 7, label: "Chat Session — Client #6643", amount: 200,  points: 20, time: "Sun, 9:30 AM",        type: "session" },
];

// ── Helpers ───────────────────────────────────
const sessionIcon = (type) => {
  if (type === "call")  return <Phone     className="w-3.5 h-3.5" />;
  if (type === "video") return <Video     className="w-3.5 h-3.5" />;
  if (type === "order") return <ShoppingBag className="w-3.5 h-3.5" />;
  return                       <MessageCircle className="w-3.5 h-3.5" />;
};

const sessionColor = (type) => {
  if (type === "call")  return "bg-emerald-500/15 text-emerald-400";
  if (type === "video") return "bg-violet-500/15 text-violet-400";
  if (type === "order") return "bg-amber-500/15 text-amber-400";
  return                       "bg-[#A1045A]/18 text-[#e07ab0]";
};

// ── Tab: Overview ─────────────────────────────
const TabOverview = ({ creator, stats }) => {
  const pct = Math.round((stats.thumbsUp / (stats.thumbsUp + stats.thumbsDown)) * 100);
  const growth = Math.round(((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100);

  return (
    <div className="space-y-4">

      {/* Earnings hero */}
      <div className={`border border-[#A1045A]/30 rounded-2xl p-5`}>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">This Month</p>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-3xl font-black text-white">KES {stats.thisMonthEarnings.toLocaleString()}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${growth >= 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
            {growth >= 0 ? "+" : ""}{growth}% vs last month
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full`} style={{ width: `${Math.min((stats.thisMonthEarnings / 15000) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-zinc-600 mt-1">KES {(15000 - stats.thisMonthEarnings).toLocaleString()} to reach monthly goal</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Eye className="w-4 h-4 text-sky-400" />,      label: "Profile Views",  value: stats.profileViews.toLocaleString(), bg: "bg-sky-500/10"     },
          { icon: <Users className={`w-4 h-4 text-[#e07ab0]`} />,   label: "Total Sessions", value: stats.totalSessions,                  bg: "bg-[#A1045A]/18"    },
          { icon: <ThumbsUp className="w-4 h-4 text-emerald-400" />, label: "Positive Ratings", value: `${pct}%`,                     bg: "bg-emerald-500/10" },
          { icon: <Coins className="w-4 h-4 text-amber-400" />,  label: "Total Earned",   value: `KES ${(creator.totalEarnings / 1000).toFixed(1)}k`, bg: "bg-amber-500/10" },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className="bg-zinc-900 border border-white/5 rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>{icon}</div>
            <p className="text-lg font-black text-white">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Plan badge */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{creator.plan} Plan</p>
            <p className="text-xs text-zinc-500">Boosted in search results</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">Active</span>
      </div>

    </div>
  );
};

// ── Tab: Ratings ──────────────────────────────
const TabRatings = ({ ratings, stats }) => {
  const pct = Math.round((stats.thumbsUp / (stats.thumbsUp + stats.thumbsDown)) * 100);
  return (
    <div className="space-y-4">

      {/* Summary */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Overall Rating</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-black text-white">{pct}%</p>
            <p className="text-xs text-zinc-500 mt-0.5">Positive</p>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-400 w-6 text-right">{stats.thumbsUp}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className={`w-3.5 h-3.5 text-[#e07ab0] shrink-0`} />
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full`} style={{ width: `${100 - pct}%` }} />
              </div>
              <span className={`text-xs font-bold text-[#e07ab0] w-6 text-right`}>{stats.thumbsDown}</span>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {ratings.map((r) => (
          <div key={r.id} className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${r.vote === "up" ? "bg-emerald-500/15" : "bg-[#A1045A]/18"}`}>
              {r.vote === "up"
                ? <ThumbsUp   className="w-3.5 h-3.5 text-emerald-400" />
                : <ThumbsDown className={`w-3.5 h-3.5 text-[#e07ab0]`} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">{r.client}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${sessionColor(r.type)}`}>
                  {sessionIcon(r.type)} {r.type}
                </span>
                <span className="text-[10px] text-zinc-600">{r.time}</span>
              </div>
            </div>
            {r.vote === "up"
              ? <ThumbsUp   className="w-4 h-4 text-emerald-400/40 shrink-0" />
              : <ThumbsDown className={`w-4 h-4 text-[#e07ab0]/40 shrink-0`} />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Tab: Inbox ────────────────────────────────
const TabInbox = ({ inbox }) => {
  const [open, setOpen] = useState(null);
  const [reply, setReply] = useState("");

  if (open !== null) {
    const convo = inbox.find((c) => c.id === open);
    return (
      <div className="flex flex-col h-full">
        <button onClick={() => setOpen(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-semibold mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to inbox
        </button>
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-3 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">C</div>
          <div>
            <p className="text-sm font-bold text-white">{convo.client}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${sessionColor(convo.type)}`}>
              {sessionIcon(convo.type)} {convo.type}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-zinc-200 max-w-[80%]">
              {convo.lastMsg}
            </div>
          </div>
          <div className="flex justify-end">
            <div className={`rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-white max-w-[80%]`}
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
            onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
            >
              Thanks for reaching out! I'll get back to you shortly.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text" value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply…"
            className={`flex-1 bg-zinc-800 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50`}
          />
          <button onClick={() => setReply("")} className={`w-10 h-10 rounded-xl flex items-center justify-center text-white`}
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
          onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
          onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {inbox.map((c) => (
        <button
          key={c.id}
          onClick={() => setOpen(c.id)}
          className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/15 transition-all text-left"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">C</div>
        {c.unread > 0 && (
  <span
    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
    style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
    onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
    onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
  >
    {c.unread}
  </span>
)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className={`text-sm font-bold ${c.unread > 0 ? "text-white" : "text-zinc-300"}`}>{c.client}</p>
              <span className="text-[10px] text-zinc-600 shrink-0 ml-2">{c.time}</span>
            </div>
            <p className={`text-xs truncate ${c.unread > 0 ? "text-zinc-400" : "text-zinc-600"}`}>{c.lastMsg}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />
        </button>
      ))}
    </div>
  );
};

// ── Tab: Points & Money ───────────────────────
const TabMoney = ({ creator, transactions }) => {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn,   setWithdrawn]   = useState(false);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => { setWithdrawing(false); setWithdrawn(true); }, 1500);
  };

  return (
    <div className="space-y-4">

      {/* Balance card */}
      <div className="from-emerald-950 via-zinc-900 to-zinc-900 border border-emerald-500/20 rounded-2xl p-5">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Available Balance</p>
        <p className="text-3xl font-black text-white mb-4">KES {creator.balance.toLocaleString()}</p>

        {withdrawn ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <CheckCircle className="w-4 h-4" /> Withdrawal sent to M-Pesa!
          </div>
        ) : (
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-all disabled:opacity-60"
          >
            {withdrawing
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><ArrowDownToLine className="w-4 h-4" /> Withdraw to M-Pesa</>
            }
          </button>
        )}
      </div>

      {/* Points card */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Your Points</p>
              <p className="text-xs text-zinc-500">Earned from sessions & tips</p>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400">{creator.points.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-800 rounded-lg px-3 py-2">
          <Gift className="w-3.5 h-3.5 text-amber-500/50" />
          <span>500 pts = KES 50 bonus · Redeem soon</span>
        </div>
      </div>

      {/* How points work */}
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">How you earn</p>
        {[
          { icon: <MessageCircle className={`w-3.5 h-3.5 text-[#e07ab0]`} />,    label: "Chat session completed",  pts: "+20 pts"  },
          { icon: <Phone className="w-3.5 h-3.5 text-emerald-400" />,         label: "Voice call completed",    pts: "+50 pts"  },
          { icon: <Video className="w-3.5 h-3.5 text-violet-400" />,          label: "Video call completed",    pts: "+80 pts"  },
          { icon: <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />,     label: "Order fulfilled",         pts: "+150 pts" },
          { icon: <Gift className={`w-3.5 h-3.5 text-[#e07ab0]`} />,             label: "Client tip received",     pts: "+varies"  },
          { icon: <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />,      label: "Positive rating streak",  pts: "+10 pts"  },
        ].map(({ icon, label, pts }) => (
          <div key={label} className="flex items-center gap-3 text-xs">
            <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">{icon}</div>
            <span className="flex-1 text-zinc-400">{label}</span>
            <span className="font-bold text-amber-400">{pts}</span>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Recent Transactions</p>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === "tip" ? "bg-[#A1045A]/18" : "bg-zinc-800"}`}>
                {t.type === "tip"
                  ? <Gift className={`w-3.5 h-3.5 text-[#e07ab0]`} />
                  : <Zap  className="w-3.5 h-3.5 text-zinc-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-300 truncate">{t.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="w-2.5 h-2.5 text-zinc-600" />
                  <span className="text-[10px] text-zinc-600">{t.time}</span>
                  {t.points > 0 && <span className="text-[10px] font-bold text-amber-500">+{t.points} pts</span>}
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400 shrink-0">+{t.amount}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ── Main Dashboard ────────────────────────────

// ── Tab: Profile (edit) ───────────────────────
const SPECIALTY_OPTIONS = [
  "Deep Conversations","Life Coaching","Companionship","Entertainment",
  "Storytelling","Advice","Mental Wellness","Motivation","Music Talk",
  "Fun Chats","Stress Relief","Goal Setting","Humor","Positivity","Casual Chat",
];

const TabProfile = ({ creator }) => {
  const avatarRef  = useRef();
  const coverRef   = useRef();
  const galleryRef = useRef();

  const [avatar,      setAvatar]      = useState(creator.avatar);
  const [cover,       setCover]       = useState("https://picsum.photos/seed/amara/800/400");
  const [name,        setName]        = useState(creator.name);
  const [tagline,     setTagline]     = useState("Let's talk, laugh and vibe");
  const [about,       setAbout]       = useState("Hey! I'm Amara. I love deep conversations, good vibes and making people smile. Let's connect!");
  const [specialties, setSpecialties] = useState(["Deep Conversations","Companionship","Fun Chats"]);
  const [gallery,     setGallery]     = useState([
    "https://picsum.photos/seed/g1/600/600",
    "https://picsum.photos/seed/g2/600/600",
    "https://picsum.photos/seed/g3/600/600",
  ]);
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  const pickFile = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const pickGallery = (e) => {
    const files = Array.from(e.target.files);
    const urls  = files.map((f) => URL.createObjectURL(f));
    setGallery((g) => [...g, ...urls].slice(0, 12));
  };

  const removeGallery = (i) => setGallery((g) => g.filter((_, idx) => idx !== i));

  const toggleTag = (tag) => {
    setSpecialties((s) =>
      s.includes(tag) ? s.filter((t) => t !== tag) : s.length < 5 ? [...s, tag] : s
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 1000);
  };

  return (
    <div className="space-y-6 pb-4">

      {/* Cover photo */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cover Photo</p>
        <div
          onClick={() => coverRef.current.click()}
          className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group border border-white/8"
          style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          {!cover && <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><ImagePlus className="w-6 h-6 text-zinc-600" /></div>}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl">
              <ImagePlus className="w-4 h-4 text-white" /><span className="text-white text-xs font-bold">Change Cover</span>
            </div>
          </div>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={pickFile(setCover)} />
        </div>
      </div>

      {/* Avatar */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Profile Photo</p>
        <div className="flex items-center gap-4">
          <div
            onClick={() => avatarRef.current.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group border-2 border-white/10 shrink-0"
          >
            {avatar
              ? <img src={avatar} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><Camera className="w-6 h-6 text-zinc-600" /></div>
            }
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-full transition-all flex items-center justify-center">
              <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={pickFile(setAvatar)} />
          </div>
          <div>
            <p className="text-sm text-zinc-300 font-semibold">Tap to change</p>
            <p className="text-xs text-zinc-600 mt-0.5">JPG or PNG · Recommended 400×400</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Display Name</label>
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          className={`w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A1045A]/50 transition-colors`}
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Tagline</label>
        <input
          type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={60}
          className={`w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A1045A]/50 transition-colors`}
        />
        <p className="text-xs text-zinc-700 mt-1 text-right">{tagline.length}/60</p>
      </div>

      {/* About */}
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">About Me</label>
        <textarea
          rows={3} value={about} onChange={(e) => setAbout(e.target.value)} maxLength={300}
          className={`w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A1045A]/50 transition-colors resize-none`}
        />
        <p className="text-xs text-zinc-700 mt-1 text-right">{about.length}/300</p>
      </div>

      {/* Specialties */}
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Specialties <span className="text-zinc-700 normal-case font-normal">(up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map((tag) => {
            const active = specialties.includes(tag);
            return (
              <button
                key={tag} onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active ? "bg-[#A1045A]/35 border-[#A1045A]/50 text-[#e07ab0]" : "bg-zinc-800 border-white/8 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {active && <X className="w-3 h-3 inline mr-1" />}{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Gallery <span className="text-zinc-700 normal-case font-normal">({gallery.length}/12 photos)</span>
          </label>
          {gallery.length < 12 && (
            <button
              onClick={() => galleryRef.current.click()}
              className={`flex items-center gap-1 text-xs font-bold text-[#e07ab0] hover:text-[#e07ab0] transition-colors`}
            >
              <Images className="w-3.5 h-3.5" /> Add photos
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {gallery.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeGallery(i)}
                className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {gallery.length < 12 && (
            <button
              onClick={() => galleryRef.current.click()}
              className={`aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#A1045A]/50 flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-zinc-400 transition-all`}
            >
              <Images className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Add</span>
            </button>
          )}
        </div>
        <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={pickGallery} />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-[#A1045A]/25 disabled:opacity-60`}
      
      style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
      onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
      onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
      >
        {saving
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : saved
            ? <><BadgeCheck className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Save Changes</>
        }
      </button>

    </div>
  );
};

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "ratings",  label: "Ratings",  icon: ThumbsUp        },
  { id: "inbox",    label: "Inbox",    icon: MessageCircle   },
  { id: "money",    label: "Money",    icon: Wallet          },
  { id: "profile",  label: "Profile",  icon: UserCircle      },
];

const CreatorDashboard = ({ onBack }) => {
  const [tab, setTab] = useState("overview");
  const totalUnread = MOCK_INBOX.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/5 px-4 py-4 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src={MOCK_CREATOR.avatar} alt="" className={`w-9 h-9 rounded-full object-cover ring-2 ring-[#A1045A]/30`} />
        <div className="flex-1">
          <p className="text-sm font-black text-white">{MOCK_CREATOR.name}</p>
          <p className="text-xs text-zinc-500">{MOCK_CREATOR.handle}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
          <Star className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-bold text-amber-300">{MOCK_CREATOR.plan}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {tab === "overview" && <TabOverview creator={MOCK_CREATOR} stats={MOCK_STATS} />}
        {tab === "ratings"  && <TabRatings  ratings={MOCK_RATINGS} stats={MOCK_STATS} />}
        {tab === "inbox"    && <TabInbox    inbox={MOCK_INBOX} />}
        {tab === "money"    && <TabMoney    creator={MOCK_CREATOR} transactions={MOCK_TRANSACTIONS} />}
        {tab === "profile"  && <TabProfile  creator={MOCK_CREATOR} />}
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-white/8 px-2 py-2 flex items-center justify-around z-50">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          const showBadge = id === "inbox" && totalUnread > 0;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all relative ${active ? "text-[#e07ab0]" : "text-zinc-600 hover:text-zinc-400"}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all ${active ? "scale-110" : ""}`} />
                {showBadge && (
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center`}
                  style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
                  onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
                  onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
                  >
                    {totalUnread}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold transition-all ${active ? "text-[#e07ab0]" : ""}`}>{label}</span>
              {active && <div className={`absolute -bottom-2 w-4 h-0.5 rounded-full `} />}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default CreatorDashboard;