import { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  CheckCircle,
  Clock,
  Gift,
  Zap,
  Radio,
  Phone,
  Loader2,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { Delta } from "./helpers";
import type { DashboardStats, Transaction, Schedule } from "./types";

interface TabMoneyProps {
  s: DashboardStats;
  txns: Transaction[];
  token?: string;
  // Removed: scheduleId prop — now selected from fetched paid schedules
}

const TabMoney = ({ s, txns, token }: TabMoneyProps) => {
  const [withdrawing,    setWithdrawing]    = useState(false);
  const [withdrawn,      setWithdrawn]      = useState(false);
  const [phone,          setPhone]          = useState("");
  const [phoneTouched,   setPhoneTouched]   = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  // Added: paid schedules state for the picker
  const [schedules,        setSchedules]        = useState<Schedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [selectedId,       setSelectedId]       = useState<number | null>(null);

  const authHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const formatDate = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // Fetches phone number from profile on mount
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/my-profile`,
          { headers: authHeaders },
        );
        if (!res.ok) return;
        const json = await res.json();
        const fetched = json.data?.phoneNumber ?? "";
        if (fetched && !phoneTouched) setPhone(fetched);
      } catch {
        // non-critical
      }
    })();
  }, [token]);

  // Added: fetches paid schedules on mount for the picker
  useEffect(() => {
    if (!token) return;
    (async () => {
      setSchedulesLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/fetch-schedules`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              pageNumber: 0,
              pageSize: 50,
              startDate: formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
              endDate:   formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
              paid: true,
            }),
          },
        );
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error(json.message ?? "Failed to fetch schedules");
        const list: Schedule[] = Array.isArray(json.data?.content) ? json.data.content : [];
        setSchedules(list);
        // Auto-select the first one if available
        if (list.length > 0) setSelectedId(list[0].id);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load schedules");
      } finally {
        setSchedulesLoading(false);
      }
    })();
  }, [token]);

  const handleWithdraw = async () => {
    if (!phone) {
      toast.error("Please enter a phone number.");
      return;
    }
    if (!selectedId) {
      toast.error("Please select a schedule to withdraw for.");
      return;
    }
    setWithdrawing(true);
    const tid = toast.loading("Processing withdrawal…");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/payments/safaricom/model/withdraw-schedule-payment`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            phoneNumber: phone,
            scheduleId:  selectedId,
          }),
        },
      );
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(json.message ?? "Withdrawal failed");
      toast.success("Withdrawal sent to M-Pesa!", { id: tid });
      setWithdrawn(true);
      setShowPhoneInput(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Withdrawal failed", { id: tid });
    } finally {
      setWithdrawing(false);
    }
  };

  // Formats a schedule label for the picker
  const scheduleLabel = (sc: Schedule) => {
    const client = sc.client?.firstName
      ? `${sc.client.firstName} ${sc.client.lastName}`
      : (sc.client?.email ?? "Unknown client");
    const date = new Date(sc.scheduleTime).toLocaleDateString();
    return `${client} — KES ${sc.amount?.toLocaleString()} (${date})`;
  };

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
        ) : showPhoneInput ? (
          <div className="space-y-2">

            {/* Added: schedule picker */}
            <div>
              <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                Select schedule
              </p>
              {schedulesLoading ? (
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                  <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />
                  <span className="text-xs text-emerald-300/60">Loading schedules…</span>
                </div>
              ) : schedules.length === 0 ? (
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                  <Clock className="w-4 h-4 text-emerald-300/40" />
                  <span className="text-xs text-emerald-300/40">No paid schedules found</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedId ?? ""}
                    onChange={(e) => setSelectedId(Number(e.target.value))}
                    className="w-full appearance-none bg-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none pr-8"
                    style={{ colorScheme: "dark" }}
                  >
                    {schedules.map((sc) => (
                      <option key={sc.id} value={sc.id} className="bg-zinc-900 text-white">
                        {scheduleLabel(sc)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-emerald-300/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Phone input */}
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
              <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhoneTouched(true); setPhone(e.target.value); }}
                placeholder="e.g. 0712345678"
                className="flex-1 bg-transparent text-sm text-white placeholder-emerald-300/40 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPhoneInput(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing || !phone || !selectedId}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-900 text-sm font-black transition-all disabled:opacity-60"
              >
                {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPhoneInput(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-900 text-sm font-black transition-all"
          >
            <ArrowDownToLine className="w-4 h-4" /> Withdraw to M-Pesa
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs text-zinc-500 font-medium mb-1">This month</p>
          <p className="text-xl font-black text-white">KES {s.earningsThisMonth.toLocaleString()}</p>
          <div className="mt-2"><Delta val={s.percentageIncreaseInEarnings} /></div>
        </div>
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs text-zinc-500 font-medium mb-1">Bookings / month</p>
          <p className="text-xl font-black text-white">{s.totalBookingsThisMonth}</p>
          <div className="mt-2"><Delta val={s.percentageIncreaseInBookings} /></div>
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
            <div key={t.id} className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.type === "tip" ? "bg-pink-500/15" : "bg-zinc-800"}`}>
                {t.type === "tip"
                  ? <Gift className="w-3.5 h-3.5 text-pink-400" />
                  : <Zap  className="w-3.5 h-3.5 text-zinc-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-300 truncate">{t.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="w-2.5 h-2.5 text-zinc-600" />
                  <span className="text-[10px] text-zinc-600">{t.time}</span>
                  {t.points > 0 && <span className="text-[10px] font-bold text-amber-400">+{t.points} pts</span>}
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

export default TabMoney;