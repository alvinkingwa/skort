// ─────────────────────────────────────────────
//  pages/CreatorDashboard.tsx
// ─────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { brand, brandDark, brandHover } from "../theme";
import {
  LayoutDashboard,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Coins,
  Eye,
  Users,
  Phone,
  Video,
  ShoppingBag,
  ArrowLeft,
  Send,
  Wallet,
  ArrowDownToLine,
  Gift,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle,
  UserCircle,
  Camera,
  ImagePlus,
  Images,
  X,
  Save,
  BadgeCheck,
  LogOut,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Radio,
  MapPin,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────

interface DashboardStats {
  totalBookings: number;
  totalEarnings: number;
  positiveRatings: number;
  totalStreams: number;
  earningsThisMonth: number;
  percentageIncreaseInEarnings: number;
  totalBookingsThisMonth: number;
  percentageIncreaseInBookings: number;
}

interface Schedule {
  id: number;
  scheduleTime: string;
  scheduledLocation: string;
  amount: number;
  notes: string;
  testKitRequired: boolean;
  paid: boolean;
  services: { id: number; serviceName: string; serviceDescription: string }[];
  client: { email: string; firstName: string; lastName: string };
}

interface ScheduleForm {
  clientEmail: string;
  scheduledDateTime: string;
  scheduledLocation: string;
  amount: string;
  notes: string;
  testKitRequired: boolean;
  serviceIds: number[];
}

const AVAILABLE_SERVICES = [
  { id: 1, name: "Text Chat" },
  { id: 2, name: "Voice Call" },
  { id: 3, name: "Video Call" },
  { id: 4, name: "Orders" },
];

interface CreatorDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

type SessionType = "call" | "video" | "order" | "chat";
type VoteType = "up" | "down";
type TabId = "overview" | "ratings" | "inbox" | "money" | "profile";

interface Rating {
  id: number;
  client: string;
  type: SessionType;
  vote: VoteType;
  time: string;
}
interface InboxItem {
  id: number;
  client: string;
  lastMsg: string;
  time: string;
  unread: number;
  type: SessionType;
}
interface Transaction {
  id: number;
  label: string;
  amount: number;
  points: number;
  time: string;
  type: "session" | "tip";
}

interface ModelFile {
  id: number;
  fileName: string;
  storeFileName: string;
  contentType: string;
  size: string;
}

interface ModelService {
  id: number;
  serviceName: string;
  serviceDescription: string;
}

interface GalleryItem {
  preview: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  fileId?: number;
}

// ── Mock data ─────────────────────────────────

const MOCK_RATINGS: Rating[] = [
  {
    id: 1,
    client: "Client #4821",
    type: "call",
    vote: "up",
    time: "Today, 2:14 PM",
  },
  {
    id: 2,
    client: "Client #3302",
    type: "chat",
    vote: "up",
    time: "Today, 11:30 AM",
  },
  {
    id: 3,
    client: "Client #9871",
    type: "video",
    vote: "down",
    time: "Yesterday, 8:45 PM",
  },
  {
    id: 4,
    client: "Client #1145",
    type: "order",
    vote: "up",
    time: "Yesterday, 3:20 PM",
  },
  {
    id: 5,
    client: "Client #5530",
    type: "chat",
    vote: "up",
    time: "Mon, 6:00 PM",
  },
  {
    id: 6,
    client: "Client #2278",
    type: "call",
    vote: "up",
    time: "Mon, 1:15 PM",
  },
  {
    id: 7,
    client: "Client #6643",
    type: "chat",
    vote: "down",
    time: "Sun, 9:30 AM",
  },
  {
    id: 8,
    client: "Client #8812",
    type: "video",
    vote: "up",
    time: "Sat, 4:50 PM",
  },
];

const MOCK_INBOX: InboxItem[] = [
  {
    id: 1,
    client: "Client #4821",
    lastMsg: "Thank you, that was really helpful!",
    time: "2:14 PM",
    unread: 0,
    type: "call",
  },
  {
    id: 2,
    client: "Client #3302",
    lastMsg: "Can we continue tomorrow?",
    time: "11:30 AM",
    unread: 2,
    type: "chat",
  },
  {
    id: 3,
    client: "Client #7761",
    lastMsg: "How much for a custom order?",
    time: "Yesterday",
    unread: 1,
    type: "order",
  },
  {
    id: 4,
    client: "Client #1145",
    lastMsg: "Loved the session 🔥",
    time: "Mon",
    unread: 0,
    type: "video",
  },
  {
    id: 5,
    client: "Client #5530",
    lastMsg: "Are you available tonight?",
    time: "Mon",
    unread: 3,
    type: "chat",
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    label: "Voice Call — Client #4821",
    amount: 500,
    points: 50,
    time: "Today, 2:14 PM",
    type: "session",
  },
  {
    id: 2,
    label: "Chat Session — Client #3302",
    amount: 200,
    points: 20,
    time: "Today, 11:30 AM",
    type: "session",
  },
  {
    id: 3,
    label: "Tip from Client #9871",
    amount: 300,
    points: 0,
    time: "Yesterday, 9:00 PM",
    type: "tip",
  },
  {
    id: 4,
    label: "Custom Order — Client #1145",
    amount: 1500,
    points: 150,
    time: "Yesterday, 3:20 PM",
    type: "session",
  },
  {
    id: 5,
    label: "Video Call — Client #5530",
    amount: 800,
    points: 80,
    time: "Mon, 6:00 PM",
    type: "session",
  },
];

// ── Style helpers ─────────────────────────────

const G = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`;
const GH = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`;

const sessionIcon = (t: SessionType) => {
  if (t === "call") return <Phone className="w-3.5 h-3.5" />;
  if (t === "video") return <Video className="w-3.5 h-3.5" />;
  if (t === "order") return <ShoppingBag className="w-3.5 h-3.5" />;
  return <MessageCircle className="w-3.5 h-3.5" />;
};

const sessionBadge = (t: SessionType) => {
  if (t === "call") return "bg-emerald-500/15 text-emerald-400";
  if (t === "video") return "bg-violet-500/15  text-violet-400";
  if (t === "order") return "bg-amber-500/15   text-amber-400";
  return "bg-pink-500/15 text-pink-400";
};

const Delta = ({ val }: { val: number }) => (
  <span
    className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${val >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
  >
    {val >= 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    )}
    {Math.abs(val)}%
  </span>
);

const StatCard = ({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: number;
}) => (
  <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center">
        {icon}
      </div>
      {delta !== undefined && <Delta val={delta} />}
    </div>
    <p className="text-2xl font-black text-white leading-none">{value}</p>
    <p className="text-xs text-zinc-500 font-medium">{label}</p>
  </div>
);

// ── Tab: Overview ─────────────────────────────

const TabOverview = ({
  s,
  email,
  token,
}: {
  s: DashboardStats | null;
  email: string;
  token?: string;
}) => {
  if (!s) return null;

  const goal = 50000;
  const pct = Math.min((s.earningsThisMonth / goal) * 100, 100);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState<ScheduleForm>({
    clientEmail: "",
    scheduledDateTime: "",
    scheduledLocation: "",
    amount: "",
    notes: "",
    testKitRequired: false,
    serviceIds: [],
  });

  const authHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const formatDate = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const fetchSchedules = async () => {
    setLoadingList(true);
    setListError(null);
    const authHeaders = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/fetch-schedules`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            pageNumber: 0,
            pageSize: 10, // fixed: was 10
            startDate: formatDate(
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            ), // fixed: yyyy-MM-dd HH:mm:ss
            endDate: formatDate(
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            ), // fixed: yyyy-MM-dd HH:mm:ss
            paid: true, // added: missing filter field
          }),
        },
      );
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(json.message ?? "Failed to fetch schedules");
      setSchedules(Array.isArray(json.data?.content) ? json.data.content : []);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load schedules");
    } finally {
      setLoadingList(false);
    }
  };
  useEffect(() => {
    if (token) fetchSchedules();
  }, [token]);

  const toggleServiceId = (id: number) =>
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter((s) => s !== id)
        : [...f.serviceIds, id],
    }));

  const handleSubmit = async () => {
    if (
      !form.clientEmail ||
      !form.scheduledDateTime ||
      !form.scheduledLocation ||
      !form.amount
    )
      return;
    setSubmitting(true);
    setSubmitError(null);
    // Moved authHeaders inside so it always reads the current token prop
    const authHeaders = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/model/create-schedule`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            clientEmail: form.clientEmail,
            scheduledDateTime: form.scheduledDateTime,
            scheduledLocation: form.scheduledLocation,
            amount: parseFloat(form.amount),
            notes: form.notes,
            testKitRequired: form.testKitRequired,
            serviceIds: form.serviceIds,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Failed to create schedule");
      setSubmitSuccess(true);
      setShowForm(false);
      setForm({
        clientEmail: "",
        scheduledDateTime: "",
        scheduledLocation: "",
        amount: "",
        notes: "",
        testKitRequired: false,
        serviceIds: [],
      });
      fetchSchedules();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Failed to create schedule",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formReady =
    !!form.clientEmail &&
    !!form.scheduledDateTime &&
    !!form.scheduledLocation &&
    !!form.amount;
  const inputCls =
    "w-full bg-zinc-800/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500/40 transition-colors";

  return (
    <div className="space-y-5">
      {/* existing hero card */}
      <div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: G }}
      >
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
          This month
        </p>
        <p className="text-4xl font-black text-white mb-1">
          KES {s.earningsThisMonth.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <Delta val={s.percentageIncreaseInEarnings} />
          <span className="text-white/50 text-xs">vs last month</span>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-white/40 text-[11px] mt-1.5">
          KES {Math.max(goal - s.earningsThisMonth, 0).toLocaleString()} to
          monthly goal
        </p>
      </div>

      {/* existing stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Coins className="w-4 h-4 text-amber-400" />}
          label="Total earnings"
          value={`KES ${(s.totalEarnings / 1000).toFixed(1)}k`}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          label="Earnings this month"
          value={`KES ${s.earningsThisMonth.toLocaleString()}`}
          delta={s.percentageIncreaseInEarnings}
        />
        <StatCard
          icon={<Users className="w-4 h-4 text-sky-400" />}
          label="Total bookings"
          value={s.totalBookings}
        />
        <StatCard
          icon={<Eye className="w-4 h-4 text-violet-400" />}
          label="Bookings this month"
          value={s.totalBookingsThisMonth}
          delta={s.percentageIncreaseInBookings}
        />
        <StatCard
          icon={<ThumbsUp className="w-4 h-4 text-emerald-400" />}
          label="Positive ratings"
          value={`${s.positiveRatings}%`}
        />
        <StatCard
          icon={<Radio className="w-4 h-4 text-pink-400" />}
          label="Total streams"
          value={s.totalStreams}
        />
      </div>

      {/* existing account card */}
      <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
          style={{ background: G }}
        >
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{email}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Active creator account</p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400">
          Pro
        </span>
      </div>

      {/* ── Schedule section ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Schedules
          </p>
          <button
            onClick={() => {
              setShowForm((v) => !v);
              setSubmitError(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all"
            style={{ background: G }}
          >
            <Clock className="w-3.5 h-3.5" />
            {showForm ? "Cancel" : "New Schedule"}
          </button>
        </div>

        {/* success banner */}
        {submitSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-300 font-semibold">
              Schedule created successfully!
            </p>
          </div>
        )}

        {/* ── Create form ── */}
        {showForm && (
          <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4 mb-4 space-y-3">
            <p className="text-sm font-black text-white mb-1">New Schedule</p>

            {submitError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{submitError}</p>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Client Email
              </label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, clientEmail: e.target.value }))
                }
                placeholder="client@email.com"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={form.scheduledDateTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, scheduledDateTime: e.target.value }))
                }
                className={inputCls}
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.scheduledLocation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, scheduledLocation: e.target.value }))
                }
                placeholder="Meeting location"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Amount (KES)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0.00"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                Notes
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Any notes for the client…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                Services
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SERVICES.map((svc) => {
                  const on = form.serviceIds.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      onClick={() => toggleServiceId(svc.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${on ? "border-pink-500/40" : "bg-zinc-800 border-white/[0.08] text-zinc-500"}`}
                      style={
                        on ? { background: `${brand}25`, color: brand } : {}
                      }
                    >
                      {svc.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test kit toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-semibold text-white">
                  Test Kit Required
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Client must bring a test kit
                </p>
              </div>
              <button
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    testKitRequired: !f.testKitRequired,
                  }))
                }
                className={`w-11 h-6 rounded-full transition-all relative`}
                style={{ background: form.testKitRequired ? brand : "#3f3f46" }}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.testKitRequired ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !formReady}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: G }}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Create Schedule
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Schedule list ── */}
        {listError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{listError}</p>
          </div>
        )}

        {loadingList ? (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: brand }}
            />
            <p className="text-xs text-zinc-500">Loading schedules…</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="w-7 h-7 text-zinc-700 mb-2" />
            <p className="text-zinc-500 text-xs font-semibold">
              No schedules yet
            </p>
            <p className="text-zinc-700 text-xs mt-0.5">
              Create your first schedule above
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {schedules.map((sc) => (
              <div
                key={sc.id}
                className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-start gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${sc.paid ? "bg-emerald-500/15" : "bg-amber-500/15"}`}
                >
                  <Clock
                    className={`w-3.5 h-3.5 ${sc.paid ? "text-emerald-400" : "text-amber-400"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white truncate">
                      {sc.client?.firstName
                        ? `${sc.client.firstName} ${sc.client.lastName}`
                        : sc.client?.email}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${sc.paid ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}
                    >
                      {sc.paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {sc.scheduledLocation}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {new Date(sc.scheduleTime).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex flex-wrap gap-1">
                      {sc.services?.map((svc) => (
                        <span
                          key={svc.id}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-lg bg-zinc-800 text-zinc-400"
                        >
                          {svc.serviceName}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-black text-emerald-400">
                      KES {sc.amount?.toLocaleString()}
                    </span>
                  </div>
                  {sc.testKitRequired && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-400 mt-1">
                      <BadgeCheck className="w-3 h-3" /> Test kit required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Tab: Ratings ──────────────────────────────

const TabRatings = ({
  ratings,
  positiveRatings,
}: {
  ratings: Rating[];
  positiveRatings: number;
}) => (
  <div className="space-y-4">
    <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
        Approval rating
      </p>
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={brand}
              strokeWidth="3"
              strokeDasharray={`${positiveRatings} ${100 - positiveRatings}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-white">
              {positiveRatings}%
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {[
            {
              label: "Positive",
              pct: positiveRatings,
              color: "bg-emerald-500",
              textColor: "text-emerald-400",
              icon: <ThumbsUp className="w-3 h-3 text-emerald-400" />,
            },
            {
              label: "Negative",
              pct: 100 - positiveRatings,
              color: "bg-red-500",
              textColor: "text-red-400",
              icon: <ThumbsDown className="w-3 h-3 text-red-400" />,
            },
          ].map(({ label, pct, color, textColor, icon }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  {icon} {label}
                </span>
                <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-2">
      {ratings.map((r) => (
        <div
          key={r.id}
          className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.vote === "up" ? "bg-emerald-500/15" : "bg-red-500/15"}`}
          >
            {r.vote === "up" ? (
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ThumbsDown className="w-3.5 h-3.5 text-red-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{r.client}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${sessionBadge(r.type)}`}
              >
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

// ── Tab: Inbox ────────────────────────────────

const TabInbox = ({ inbox }: { inbox: InboxItem[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  const [reply, setReply] = useState<string>("");

  if (open !== null) {
    const c = inbox.find((x) => x.id === open)!;
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setOpen(null)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold mb-4 w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to inbox
        </button>
        <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-3 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
            C
          </div>
          <div>
            <p className="text-sm font-bold text-white">{c.client}</p>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${sessionBadge(c.type)}`}
            >
              {sessionIcon(c.type)} {c.type}
            </span>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-white/[0.05] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-zinc-200 max-w-[80%]">
              {c.lastMsg}
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className="rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-white max-w-[80%]"
              style={{ background: G }}
            >
              Thanks for reaching out! I'll get back to you shortly.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply…"
            className="flex-1 bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
          />
          <button
            onClick={() => setReply("")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ background: G }}
            onMouseEnter={(e) => (e.currentTarget.style.background = GH)}
            onMouseLeave={(e) => (e.currentTarget.style.background = G)}
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
          className="w-full bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/[0.15] transition-all text-left"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
              C
            </div>
            {c.unread > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                style={{ background: G }}
              >
                {c.unread}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p
                className={`text-sm font-bold ${c.unread > 0 ? "text-white" : "text-zinc-300"}`}
              >
                {c.client}
              </p>
              <span className="text-[10px] text-zinc-600 shrink-0 ml-2">
                {c.time}
              </span>
            </div>
            <p
              className={`text-xs truncate ${c.unread > 0 ? "text-zinc-400" : "text-zinc-600"}`}
            >
              {c.lastMsg}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />
        </button>
      ))}
    </div>
  );
};

// ── Tab: Money ────────────────────────────────

const TabMoney = ({ s, txns }: { s: DashboardStats; txns: Transaction[] }) => {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg,#064e3b,#065f46)" }}
      >
        <p className="text-emerald-300/60 text-xs font-bold uppercase tracking-widest mb-1">
          Total earnings
        </p>
        <p className="text-4xl font-black text-white mb-4">
          KES {s.totalEarnings.toLocaleString()}
        </p>
        {withdrawn ? (
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
            <CheckCircle className="w-4 h-4" /> Withdrawal sent to M-Pesa!
          </div>
        ) : (
          <button
            onClick={() => {
              setWithdrawing(true);
              setTimeout(() => {
                setWithdrawing(false);
                setWithdrawn(true);
              }, 1500);
            }}
            disabled={withdrawing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-900 text-sm font-black transition-all disabled:opacity-60"
          >
            {withdrawing ? (
              <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4" /> Withdraw to M-Pesa
              </>
            )}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs text-zinc-500 font-medium mb-1">This month</p>
          <p className="text-xl font-black text-white">
            KES {s.earningsThisMonth.toLocaleString()}
          </p>
          <div className="mt-2">
            <Delta val={s.percentageIncreaseInEarnings} />
          </div>
        </div>
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs text-zinc-500 font-medium mb-1">
            Bookings / month
          </p>
          <p className="text-xl font-black text-white">
            {s.totalBookingsThisMonth}
          </p>
          <div className="mt-2">
            <Delta val={s.percentageIncreaseInBookings} />
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 flex items-center justify-center">
            <Radio className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Total streams</p>
            <p className="text-xs text-zinc-500">Live sessions completed</p>
          </div>
        </div>
        <p className="text-2xl font-black text-white">{s.totalStreams}</p>
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
          Recent transactions
        </p>
        <div className="space-y-2">
          {txns.map((t) => (
            <div
              key={t.id}
              className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.type === "tip" ? "bg-pink-500/15" : "bg-zinc-800"}`}
              >
                {t.type === "tip" ? (
                  <Gift className="w-3.5 h-3.5 text-pink-400" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-300 truncate">
                  {t.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="w-2.5 h-2.5 text-zinc-600" />
                  <span className="text-[10px] text-zinc-600">{t.time}</span>
                  {t.points > 0 && (
                    <span className="text-[10px] font-bold text-amber-400">
                      +{t.points} pts
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400 shrink-0">
                +{t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Tab: Profile ──────────────────────────────

const SPECIALTY_OPTIONS = [
  "Deep Conversations",
  "Life Coaching",
  "Companionship",
  "Entertainment",
  "Storytelling",
  "Advice",
  "Mental Wellness",
  "Motivation",
  "Music Talk",
  "Fun Chats",
  "Stress Relief",
  "Goal Setting",
  "Humor",
  "Positivity",
  "Casual Chat",
];

const TabProfile = ({ token }: { token?: string }) => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [gender, setGender] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [avatarFileId, setAvatarFileId] = useState<number | null>(null);
  const [coverFileId, setCoverFileId] = useState<number | null>(null);

  // ── Gallery load state ──
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryFetchError, setGalleryFetchError] = useState<string | null>(
    null,
  );

  // ── Editable fields ──
  const [avatar, setAvatar] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  // ── Gallery ──
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // ── Save ──
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Fetch gallery ──
  useEffect(() => {
    (async () => {
      setGalleryLoading(true);
      setGalleryFetchError(null);
      try {
        const authHeaders = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const galleryRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/model/my-gallery`,
          { headers: authHeaders },
        );
        if (!galleryRes.ok) throw new Error("Failed to load gallery");
        const galleryJson = await galleryRes.json();
        const raw: ModelFile[] = Array.isArray(galleryJson.data)
          ? galleryJson.data
          : [];
        if (raw.length) {
          const existing: GalleryItem[] = raw.map((f) => ({
            preview: `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${f.storeFileName}`,
            file: new File([], f.fileName),
            status: "done",
            fileId: f.id,
          }));
          setGallery(existing);
        }
      } catch (e) {
        setGalleryFetchError(
          e instanceof Error ? e.message : "Failed to load gallery",
        );
      } finally {
        setGalleryLoading(false);
      }
    })();
  }, [token]);

  // ── Fetch profile ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/my-profile`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!res.ok) throw new Error("Failed to load profile");
        const json = await res.json();
        const d = json.data;
        setName(`${d.firstName ?? ""} ${d.lastName ?? ""}`.trim());
        setLocation(d.location?.location ?? "");
        setGender(d.gender ?? "");
        setEmail(d.email ?? "");
        setIdNumber(d.idNumber ?? "");
        setPhone(d.phoneNumber ?? "");
        if (d.profilePicture?.storeFileName) {
          setAvatar(
            `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${d.profilePicture.storeFileName}`,
          );
          setAvatarFileId(d.profilePicture.id);
        }
        if (d.coverPicture?.storeFileName) {
          setCover(
            `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${d.coverPicture.storeFileName}`,
          );
          setCoverFileId(d.coverPicture.id);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  // ── Helpers ──
  const deleteFile = async (fileId: number) => {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/delete/${fileId}`,
      {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      },
    );
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/profile-picture`,
        {
          method: "PUT",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Failed to update profile picture");
      const json = await res.json();
      const storeFileName = json.data?.profilePicture?.storeFileName;
      if (storeFileName) {
        setAvatar(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${storeFileName}`,
        );
        setAvatarFileId(json.data?.profilePicture?.id ?? null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadCover = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/cover-picture`,
        {
          method: "PUT",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Failed to update cover picture");
      const json = await res.json();
      const storeFileName = json.data?.coverPicture?.storeFileName;
      if (storeFileName) {
        setCover(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${storeFileName}`,
        );
        setCoverFileId(json.data?.coverPicture?.id ?? null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pickGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    // removed: setUploadError(null) and setUploadSuccess(false)
    const newItems: GalleryItem[] = files
      .slice(0, 12 - gallery.length)
      .map((f) => ({
        preview: URL.createObjectURL(f),
        file: f,
        status: "pending" as const,
      }));
    setGallery((g) => [...g, ...newItems].slice(0, 12));
    e.target.value = "";
  };
  const removeGallery = async (i: number) => {
    const item = gallery[i];
    if (item.fileId) {
      const toastId = toast.loading("Deleting photo…");
      try {
        await deleteFile(item.fileId);
        toast.success("Photo deleted.", { id: toastId });
      } catch {
        toast.error("Failed to delete photo.", { id: toastId });
        return; // don't remove from UI if delete failed
      }
    }
    setGallery((g) => g.filter((_, idx) => idx !== i));
  };

  const handleUploadPictures = async (): Promise<void> => {
    let pendingItems: GalleryItem[] = [];
    setGallery((g) => {
      pendingItems = g.filter((item) => item.status === "pending");
      return g.map((item) =>
        item.status === "pending" ? { ...item, status: "uploading" } : item,
      );
    });
    await Promise.resolve();
    if (!pendingItems.length) return;

    // replaced setUploadError/setUploadSuccess with toast
    const toastId = toast.loading("Uploading photos…");
    try {
      const formData = new FormData();
      pendingItems.forEach((item) => formData.append("pictures", item.file));
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/model/add-pictures`,
        {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: formData,
        },
      );
      if (!res.ok) throw new Error((await res.text()) || "Upload failed");
      setGallery((g) =>
        g.map((item) =>
          item.status === "uploading" ? { ...item, status: "done" } : item,
        ),
      );
      toast.success("Photos uploaded successfully!", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed", {
        id: toastId,
      });
      setGallery((g) =>
        g.map((item) =>
          item.status === "uploading" ? { ...item, status: "error" } : item,
        ),
      );
    }
  };

  const toggleTag = (tag: string) =>
    setSpecialties((s) =>
      s.includes(tag)
        ? s.filter((t) => t !== tag)
        : s.length < 5
          ? [...s, tag]
          : s,
    );

  const inputCls =
    "w-full bg-zinc-800/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500/40 transition-colors";
  const pendingCount = gallery.filter((i) => i.status === "pending").length;
  const uploadingCount = gallery.filter((i) => i.status === "uploading").length;

  return (
    <div className="space-y-5 pb-4">
      {/* Cover */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
          Cover photo
        </p>
        <div
          onClick={() => coverRef.current?.click()}
          className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.08]"
          style={
            cover
              ? {
                  backgroundImage: `url(${cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {!cover && (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl">
              <ImagePlus className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-bold">Change cover</span>
            </div>
          </div>
          {cover && coverFileId && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await deleteFile(coverFileId);
                setCover("");
                setCoverFileId(null);
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center z-10"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setCover(URL.createObjectURL(f));
              await uploadCover(f);
            }}
          />
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            onClick={() => avatarRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group border-2 border-white/10"
          >
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Camera className="w-6 h-6 text-zinc-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setAvatar(URL.createObjectURL(f));
                await uploadAvatar(f);
              }}
            />
          </div>
          {/* Delete button outside the circle */}
          {avatar && avatarFileId && (
            <button
              onClick={async () => {
                await deleteFile(avatarFileId);
                setAvatar("");
                setAvatarFileId(null);
              }}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 border-2 border-zinc-950 flex items-center justify-center z-10"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-semibold">
            {name || "Your name"}
          </p>
          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {location || "Location not set"}
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            Tap avatar to change photo
          </p>
        </div>
      </div>

      {/* Editable fields */}
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Display name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City / area"
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Phone number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          ID number
        </label>
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Gender
        </label>
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="e.g. Male, Female, Other"
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={60}
          className={inputCls}
        />
        <p className="text-xs text-zinc-700 mt-1 text-right">
          {tagline.length}/60
        </p>
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          About me
        </label>
        <textarea
          rows={3}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          maxLength={300}
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-zinc-700 mt-1 text-right">
          {about.length}/300
        </p>
      </div>

      {/* Specialties */}
      <div>
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
          Specialties{" "}
          <span className="text-zinc-700 normal-case font-normal">
            (up to 5)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map((tag) => {
            const on = specialties.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${on ? "border-pink-500/40 text-pink-400" : "bg-zinc-800 border-white/[0.08] text-zinc-500 hover:text-zinc-300"}`}
                style={on ? { background: `${brand}25` } : {}}
              >
                {on && <X className="w-3 h-3 inline mr-1" />}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Gallery{" "}
            <span className="text-zinc-700 normal-case font-normal">
              ({gallery.length}/12)
            </span>
          </label>
          {gallery.length < 12 && (
            <button
              onClick={() => galleryRef.current?.click()}
              className="flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Images className="w-3.5 h-3.5" /> Add photos
            </button>
          )}
        </div>

        {galleryFetchError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{galleryFetchError}</p>
          </div>
        )}

        {galleryLoading ? (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: brand }}
            />
            <p className="text-xs text-zinc-500">Loading gallery…</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((item, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img
                  src={item.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
                {item.status === "done" && (
                  <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-300" />
                  </div>
                )}
                {item.status === "pending" && (
                  <div className="absolute bottom-1.5 left-1.5 bg-amber-500 text-[9px] font-black text-zinc-900 px-1.5 py-0.5 rounded-md">
                    NEW
                  </div>
                )}
                {item.status !== "uploading" && (
                  <button
                    onClick={() => void removeGallery(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {gallery.length < 12 && (
              <button
                onClick={() => galleryRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-pink-500/40 flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-zinc-400 transition-all"
              >
                <Images className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Add</span>
              </button>
            )}
          </div>
        )}
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={pickGallery}
        />

        {pendingCount > 0 && (
          <button
            onClick={handleUploadPictures}
            disabled={uploadingCount > 0}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: G }}
            onMouseEnter={(e) => (e.currentTarget.style.background = GH)}
            onMouseLeave={(e) => (e.currentTarget.style.background = G)}
          >
            {uploadingCount > 0 ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" /> Upload {pendingCount} photo
                {pendingCount > 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </div>

      {/* Save profile */}
      <button
        onClick={() => {
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }, 1000);
        }}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60"
        style={{ background: G }}
        onMouseEnter={(e) => (e.currentTarget.style.background = GH)}
        onMouseLeave={(e) => (e.currentTarget.style.background = G)}
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : saved ? (
          <>
            <BadgeCheck className="w-4 h-4" /> Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Save changes
          </>
        )}
      </button>
    </div>
  );
};

// ── Tabs config ───────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "ratings", label: "Ratings", icon: ThumbsUp },
  { id: "inbox", label: "Inbox", icon: MessageCircle },
  { id: "money", label: "Money", icon: Wallet },
  { id: "profile", label: "Profile", icon: UserCircle },
];

// ── Main ──────────────────────────────────────

const CreatorDashboard = ({ onBack, onLogout }: CreatorDashboardProps) => {
  const { user } = useAuth();

  const [tab, setTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalUnread = MOCK_INBOX.reduce((s, c) => s + c.unread, 0);

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
        console.log("dashboard-data status:", res.status); // add this
        const json = await res.json();
        console.log("dashboard-data response:", json); // add this
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
            {tab === "inbox" && <TabInbox inbox={MOCK_INBOX} />}
            {tab === "money" && stats && (
              <TabMoney s={stats} txns={MOCK_TRANSACTIONS} />
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
          const showBadge = id === "inbox" && totalUnread > 0;
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
                {showBadge && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                    style={{ background: G }}
                  >
                    {totalUnread}
                  </span>
                )}
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
