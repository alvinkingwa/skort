import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Coins,
  Eye,
  Users,
  TrendingUp,
  Radio,
  ThumbsUp,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { brand } from "./helpers";

import { G, Delta, StatCard } from "./helpers";
import { AVAILABLE_SERVICES } from "./types";
import type { DashboardStats, Schedule, ScheduleForm } from "./types";

interface TabOverviewProps {
  s: DashboardStats | null;
  email: string;
  token?: string;
}

const TabOverview = ({ s, email, token }: TabOverviewProps) => {
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
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/fetch-schedules`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            pageNumber: 0,
            pageSize: 10,
            startDate: formatDate(
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            ),
            endDate: formatDate(
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            ),
            paid: true,
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
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/model/create-schedule`,
        {
          method: "POST",
          headers,
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
      {/* Hero earnings card */}
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

      {/* Stat grid */}
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

      {/* Account card */}
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

      {/* Schedules section */}
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

        {submitSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-300 font-semibold">
              Schedule created successfully!
            </p>
          </div>
        )}

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
                className="w-11 h-6 rounded-full transition-all relative"
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

export default TabOverview;
