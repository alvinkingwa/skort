import { TrendingUp, TrendingDown, Phone, Video, ShoppingBag, MessageCircle } from "lucide-react";
import type { SessionType } from "./types";

export const brand      = "#504f9b";
export const brandDark  = "#3b3a7a";
export const brandHover = "#5e5db0";

export const G  = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`;
export const GH = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`;

export const Delta = ({ val }: { val: number }) => (
  <span
    className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
      val >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
    }`}
  >
    {val >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
    {Math.abs(val)}%
  </span>
);

export const StatCard = ({
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

export const sessionIcon = (t: SessionType) => {
  if (t === "call")  return <Phone         className="w-3.5 h-3.5" />;
  if (t === "video") return <Video         className="w-3.5 h-3.5" />;
  if (t === "order") return <ShoppingBag   className="w-3.5 h-3.5" />;
  return                    <MessageCircle className="w-3.5 h-3.5" />;
};

export const sessionBadge = (t: SessionType) => {
  if (t === "call")  return "bg-emerald-500/15 text-emerald-400";
  if (t === "video") return "bg-violet-500/15  text-violet-400";
  if (t === "order") return "bg-amber-500/15   text-amber-400";
  return "bg-pink-500/15 text-pink-400";
};