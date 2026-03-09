import { useState } from "react";
import {
  ArrowLeft, Star, MapPin, Bed, Bath, Users, Wifi,
  Crown, BadgeCheck, Phone, MessageCircle, ChevronLeft,
  ChevronRight, X, Shield, Calendar,
} from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";

const StayProfile = ({ stay, onBack }) => {
  const [lightbox, setLightbox] = useState(null);
  const [current,  setCurrent]  = useState(0);
  const [showBook, setShowBook] = useState(false);
  const [mpesa,    setMpesa]    = useState("");
  const [booked,   setBooked]   = useState(false);
  const [nights,   setNights]   = useState(1);

  const prev = () => setCurrent(i => (i - 1 + stay.images.length) % stay.images.length);
  const next = () => setCurrent(i => (i + 1) % stay.images.length);

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => { setShowBook(false); setBooked(false); }, 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Image carousel */}
      <div className="relative h-72 overflow-hidden">
        <img src={stay.images[current]} alt={stay.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-black/70 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Availability */}
        <div className="absolute top-4 right-4">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${
            stay.available
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-zinc-800/80 border-white/10 text-zinc-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${stay.available ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
            {stay.available ? "Available" : "Occupied"}
          </span>
        </div>

        {/* Arrow controls */}
        {stay.images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {stay.images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-10 h-7 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              style={{ borderColor: i === current ? brand : "transparent" }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">

        {/* Title + type */}
        <div className="mt-5 mb-4">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stay.type}</p>
          <h1 className="text-2xl font-black text-white">{stay.title}</h1>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-zinc-400">
            <MapPin className="w-3.5 h-3.5" /> {stay.location}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />, value: `${stay.rating} (${stay.reviews})`, label: "Rating" },
            { icon: <Bed className="w-4 h-4 text-zinc-400" />,                  value: `${stay.bedrooms} Bed · ${stay.bathrooms} Bath`, label: "Rooms" },
            { icon: <Users className="w-4 h-4 text-zinc-400" />,                value: `Up to ${stay.guests}`,             label: "Guests" },
          ].map(({ icon, value, label }) => (
            <div key={label} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">{icon}</div>
              <p className="text-xs font-bold text-white leading-tight">{value}</p>
              <p className="text-[10px] text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Host card */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 mb-4 flex items-center gap-4">
          <img src={stay.host.avatar} alt={stay.host.name} className="w-14 h-14 rounded-full object-cover ring-2" style={{ ringColor: `${brand}40` }} />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-black text-white">{stay.host.name}</p>
              {stay.host.superhost && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Crown className="w-3 h-3" /> Superhost
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Host · Responds within 1 hour</p>
            <div className="flex items-center gap-2 mt-2">
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/8 text-zinc-300 hover:text-white transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Message
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/8 text-zinc-300 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mb-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">About this place</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">{stay.about}</p>
        </div>

        {/* Amenities */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 mb-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Amenities</h2>
          <div className="grid grid-cols-2 gap-2">
            {stay.amenities.map(a => (
              <div key={a} className="flex items-center gap-2 text-sm text-zinc-300">
                <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: brandText }} />
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Book button */}
        <button
          onClick={() => setShowBook(true)}
          disabled={!stay.available}
          className="w-full py-4 rounded-2xl text-white font-black text-base shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: stay.available ? `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` : undefined }}
          onMouseEnter={e => stay.available && (e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`)}
          onMouseLeave={e => stay.available && (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`)}
        >
          {stay.available ? `Book · KES ${stay.price.toLocaleString()} / night` : "Currently Occupied"}
        </button>
      </div>

      {/* Booking modal */}
      {showBook && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Book this Stay</h3>
              <button onClick={() => setShowBook(false)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {booked ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                  <BadgeCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-lg font-black text-white">Booking Confirmed!</p>
                <p className="text-sm text-zinc-500 mt-1">The host will contact you shortly.</p>
              </div>
            ) : (
              <>
                {/* Nights selector */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Number of Nights</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setNights(n => Math.max(1, n - 1))} className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/8 text-white font-bold hover:bg-zinc-700 transition-colors">−</button>
                    <span className="text-xl font-black text-white w-8 text-center">{nights}</span>
                    <button onClick={() => setNights(n => n + 1)} className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/8 text-white font-bold hover:bg-zinc-700 transition-colors">+</button>
                    <span className="text-sm text-zinc-500 ml-1">night{nights > 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-zinc-800/60 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Total (KES {stay.price.toLocaleString()} × {nights})</span>
                  <span className="text-lg font-black text-white">KES {(stay.price * nights).toLocaleString()}</span>
                </div>

                {/* M-Pesa */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">M-Pesa Number</p>
                  <input
                    type="tel" value={mpesa} onChange={e => setMpesa(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    onFocus={e => e.target.style.borderColor = brand}
                    onBlur={e => e.target.style.borderColor = ''}
                  />
                </div>

                {/* Security note */}
                <div className="flex items-start gap-2 bg-zinc-800/40 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-500">Payment is held securely and released to host after check-in confirmation.</p>
                </div>

                <button
                  onClick={handleBook}
                  disabled={mpesa.length < 10}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
                  onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`}
                  onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`}
                >
                  Pay KES {(stay.price * nights).toLocaleString()} via M-Pesa
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StayProfile;