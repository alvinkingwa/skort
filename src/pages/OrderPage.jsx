// ─────────────────────────────────────────────
//  pages/OrderPage.jsx
//  Place a custom content order with a creator
// ─────────────────────────────────────────────
import { useState } from "react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";
import RatingModal from "../components/RatingModal.jsx";
import { ArrowLeft, ShoppingBag, CheckCircle, Clock, FileText } from "lucide-react";

const ORDER_TYPES = [
  { id: "custom",    label: "Custom Content",   desc: "Personalised content made just for you" },
  { id: "shoutout",  label: "Shoutout",         desc: "Personal video or audio shoutout" },
  { id: "advice",    label: "Advice Session",   desc: "Recorded response to your questions" },
  { id: "other",     label: "Other Request",    desc: "Describe what you need" },
];

const OrderPage = ({ creator, onBack }) => {
  const [type,      setType]      = useState("");
  const [details,   setDetails]   = useState("");
  const [deadline,  setDeadline]  = useState("3days");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!type || !details.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Order Sent!</h2>
          <p className="text-zinc-400 text-sm max-w-xs">
            Your request has been sent to <strong className="text-white">{creator.name}</strong>. They'll review and confirm via M-Pesa payment request.
          </p>
        </div>
        <button onClick={onBack} className="px-6 py-3 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 text-sm font-semibold hover:text-white transition-colors">
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-white leading-tight">Place an Order</p>
          <p className="text-xs text-zinc-500">{creator.name}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Price note */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Orders from KES {creator.price.order}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Payment via M-Pesa after creator confirms your request</p>
          </div>
        </div>

        {/* Order type */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">
            What do you need?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ORDER_TYPES.map((ot) => (
              <button
                key={ot.id}
                onClick={() => setType(ot.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  type === ot.id
                    ? "bg-[#A1045A]/18 border-[#A1045A]/50 text-white"
                    : "bg-zinc-900 border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                }`}
              >
                <p className="text-sm font-semibold">{ot.label}</p>
                <p className="text-xs mt-0.5 opacity-70">{ot.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Describe your request
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Be as specific as possible — the more detail the better…"
            rows={4}
            className={`w-full bg-zinc-900 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#A1045A]/50 transition-colors resize-none`}
          />
          <p className="text-xs text-zinc-600 mt-1">{details.length} / 500 characters</p>
        </div>

        {/* Deadline */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            Delivery deadline
          </label>
          <div className="flex gap-2">
            {[
              { id: "24hrs",  label: "24 Hours" },
              { id: "3days",  label: "3 Days"   },
              { id: "1week",  label: "1 Week"   },
              { id: "flex",   label: "Flexible" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDeadline(d.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  deadline === d.id
                    ? "bg-[#A1045A]/18 border-[#A1045A]/50 text-[#e07ab0]"
                    : "bg-zinc-900 border-white/8 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!type || !details.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" />
          Send Order Request
        </button>

      </div>
    </div>
  );
};

export default OrderPage;