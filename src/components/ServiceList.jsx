// ─────────────────────────────────────────────
//  components/ServiceList.jsx
//  One row per service offered by a creator
// ─────────────────────────────────────────────
import { MessageCircle, Phone, Video } from "lucide-react";

// Maps service id → correct Lucide icon
const ServiceIcon = ({ id, className = "w-4 h-4" }) => {
  if (id === "chat")  return <MessageCircle className={className} />;
  if (id === "call")  return <Phone className={className} />;
  if (id === "video") return <Video className={className} />;
  return null;
};

// Single service row: icon + label + price + action button
const ServiceRow = ({ service, onAction }) => {
  const isCallType = service.id === "call" || service.id === "video";

  return (
    <div className="flex items-center justify-between bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-rose-500/25 rounded-xl px-4 py-3 transition-all">

      {/* Left: icon bubble + label + price */}
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isCallType ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
        }`}>
          <ServiceIcon id={service.id} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{service.label}</p>
          <p className="text-xs text-zinc-500">KES {service.price} · {service.unit}</p>
        </div>
      </div>

      {/* Right: action button */}
      <button
        onClick={() => onAction(service)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          isCallType
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
            : "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
        }`}
      >
        <ServiceIcon id={service.id} className="w-3 h-3" />
        {service.id === "chat" ? "Chat Now" : service.id === "call" ? "Call Now" : "Video Call"}
      </button>
    </div>
  );
};

export default ServiceRow;
export { ServiceIcon };