// ─────────────────────────────────────────────
//  components/ActionModal.jsx
//  Chat / Call confirmation modal
// ─────────────────────────────────────────────
import { X, Clock, Users, Star, MessageCircle, Phone, Video } from "lucide-react";
import { Avatar } from "./UI.jsx";

// Maps service id → Lucide icon
const ServiceIcon = ({ id, className = "w-5 h-5" }) => {
  if (id === "chat")  return <MessageCircle className={className} />;
  if (id === "call")  return <Phone className={className} />;
  if (id === "video") return <Video className={className} />;
  return null;
};

const ActionModal = ({ model, service, onClose }) => {
  if (!model || !service) return null;

  const isCallType = service.id === "call" || service.id === "video";

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Creator header */}
        <div className="flex items-center gap-3 mb-5">
          <Avatar src={model.avatar} name={model.name} size="md" online={model.online} />
          <div>
            <h3 className="font-bold text-white">{model.name}</h3>
            <p className="text-xs text-zinc-500">{model.handle}</p>
          </div>
        </div>

        {/* Selected service summary */}
        <div className="bg-white/5 rounded-xl p-4 mb-5 border border-white/8 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isCallType ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
          }`}>
            <ServiceIcon id={service.id} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{service.label}</p>
            <p className="text-xs text-zinc-400">KES {service.price} · {service.unit}</p>
          </div>
        </div>

        {/* Detail rows */}
        <div className="space-y-3 mb-5">
          {[
            { icon: <Clock className="w-4 h-4" />,  label: "Response time", value: model.responseTime,                        highlight: false },
            { icon: <Users className="w-4 h-4" />,  label: "Languages",     value: model.languages.join(", "),                 highlight: false },
            { icon: <Star  className="w-4 h-4" />,  label: "Rating",        value: `${model.rating} (${model.reviews} reviews)`, highlight: true  },
          ].map(({ icon, label, value, highlight }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-zinc-500">{icon} {label}</div>
              <span className={`font-medium ${highlight ? "text-amber-400" : "text-white"}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
          isCallType
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20"
            : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-400 hover:to-pink-400 shadow-lg shadow-rose-500/20"
        }`}>
          <ServiceIcon id={service.id} className="w-4 h-4" />
          {service.id === "chat" ? "Start Chat" : service.id === "call" ? "Start Call" : "Start Video Call"}
        </button>

        <p className="text-center text-xs text-zinc-600 mt-3">
          Payments via M-Pesa · You'll be prompted to add credits
        </p>
      </div>
    </div>
  );
};

export default ActionModal;