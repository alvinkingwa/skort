import { useState, useEffect } from "react";
import {
  ArrowLeft,
  LogOut,
  AlertCircle,
  Loader2,
  LayoutDashboard,
  ThumbsUp,
  MessageCircle,
  Wallet,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
// Added brand import from helpers where it is now defined as an exported const
import { G, brand } from "../components/dashboard/helpers";
import {
  MOCK_RATINGS,
  MOCK_TRANSACTIONS,
  type DashboardStats,
  type TabId,
} from "../components/dashboard/types";
import TabOverview from "../components/dashboard/TabOverview";
import TabRatings from "../components/dashboard/TabRatings";
import TabInbox from "../components/dashboard/TabInbox";
import TabMoney from "../components/dashboard/TabMoney";
import TabProfile from "../components/dashboard/TabProfile";

interface CreatorDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "ratings", label: "Ratings", icon: ThumbsUp },
  { id: "inbox", label: "Inbox", icon: MessageCircle },
  { id: "money", label: "Money", icon: Wallet },
  { id: "profile", label: "Profile", icon: UserCircle },
];

const CreatorDashboard = ({ onBack, onLogout }: CreatorDashboardProps) => {
  const { user } = useAuth();

  const [tab, setTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Removed totalUnread — TabInbox now self-fetches, MOCK_INBOX is gone
  // Badge count on the Inbox tab is dropped for now; wire it back once
  // TabInbox exposes an unread count via a callback or shared state if needed

  useEffect(() => {
    if (!user?.token) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/payments/model/dashboard-data`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Request failed");
        setStats(json.data as DashboardStats);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.token]);

  const initials = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
          style={{ background: G }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate">
            {user?.name || "Dashboard"}
          </p>
          <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          title="Sign out"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 border border-white/[0.06] text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
        {loading && (tab === "overview" || tab === "money") ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2
              className="w-7 h-7 animate-spin"
              style={{ color: brand }}
            />
            <p className="text-xs text-zinc-500">Loading your dashboard…</p>
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <TabOverview
                s={stats}
                email={user?.email ?? ""}
                token={user?.token}
              />
            )}
            {tab === "ratings" && (
              <TabRatings
                ratings={MOCK_RATINGS}
                positiveRatings={stats?.positiveRatings ?? 0}
              />
            )}
            {/* Removed inbox prop — TabInbox now self-fetches conversations */}
            {tab === "inbox" && <TabInbox />}
            {tab === "money" && stats && (
              <TabMoney
                s={stats}
                txns={MOCK_TRANSACTIONS}
                scheduleId={0} // replace 0 with the real scheduleId when available
                token={user?.token}
              />
            )}
            {tab === "profile" && <TabProfile token={user?.token} />}

            {(tab === "overview" || tab === "money") && !stats && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="text-zinc-400 text-sm font-semibold">
                  Could not load stats
                </p>
                <p className="text-zinc-600 text-xs mt-1">
                  Check your connection and try again
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-white/[0.06] px-2 py-2 flex items-center justify-around z-50">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          // Removed showBadge — unread count no longer available here after MOCK_INBOX removal
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${active ? "" : "text-zinc-600 hover:text-zinc-400"}`}
              style={active ? { color: brand } : {}}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all ${active ? "scale-110" : ""}`}
                />
              </div>
              <span className="text-[10px] font-bold">{label}</span>
              {active && (
                <div
                  className="absolute -bottom-2 w-4 h-0.5 rounded-full"
                  style={{ background: brand }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreatorDashboard;
