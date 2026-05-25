// ─────────────────────────────────────────────
//  src/pages/AddBnbPage.tsx
//  Create a new BnB listing.
//  Requires auth token from AuthContext.
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, ImagePlus, X, MapPin, BadgeCheck,
  Save, Loader2, CheckCircle, AlertCircle,
} from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme";
import { useAuth } from "../context/AuthContext";
import {
  createBnb, fetchAmenities,
  BnbCreationDto, BnbLocationDto, BnbType, Amenity,
} from "../api/bnbsApi";

// ── Constants ─────────────────────────────────
const BNB_TYPES: BnbType[] = [
  "Cottage", "Apartment", "Villa", "Studio",
  "Bungalow", "Penthouse", "Private Room",
];

// ── Types ─────────────────────────────────────
interface AddBnbPageProps {
  onBack: () => void;
}

// ── Reusable field ────────────────────────────
interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

const Field = ({ label, hint, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-zinc-700">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors";

// ── Component ─────────────────────────────────
const AddBnbPage = ({ onBack }: AddBnbPageProps) => {
  const { user } = useAuth();
  const token = user?.token ?? "";

  // ── Form state ────────────────────────────
  const [title, setTitle]             = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType]               = useState<BnbType>("Apartment");
  const [amount, setAmount]           = useState<string>("");
  const [pricePerBooking, setPricePerBooking] = useState<string>("");
  const [guests, setGuests]           = useState<string>("");
  const [bedrooms, setBedrooms]       = useState<string>("");
  const [bathrooms, setBathrooms]     = useState<string>("");

  // Location
  const [location, setLocation]   = useState<string>("");
  const [landmark, setLandmark]   = useState<string>("");
  const [country, setCountry]     = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude]   = useState<string>("");

  // Amenities
  const [amenities, setAmenities]           = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [amenitiesLoading, setAmenitiesLoading]   = useState<boolean>(true);

  // Files
  const [files, setFiles]       = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Submit state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess]       = useState<boolean>(false);
  const [error, setError]           = useState<string | null>(null);

  // ── Load amenities ────────────────────────
  useEffect(() => {
    fetchAmenities(token)
      .then(setAmenities)
      .catch(() => setAmenities([]))
      .finally(() => setAmenitiesLoading(false));
  }, [token]);

  // ── File handling ─────────────────────────
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    const combined = [...files, ...picked].slice(0, 10);
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (i: number) => {
    const updated = files.filter((_, idx) => idx !== i);
    setFiles(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  // ── Submit ────────────────────────────────
  const handleSubmit = async (): Promise<void> => {
    if (!title || !location || !amount) {
      setError("Please fill in Title, Location and Rate per night.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const locationDto: BnbLocationDto = {
      location, landmark, country, longitude, latitude,
    };

    const dto: BnbCreationDto = {
      location: locationDto,
      title,
      description,
      amount: parseFloat(amount),
      pricePerBooking: parseFloat(pricePerBooking || amount),
      guests,
      bedrooms,
      bathrooms,
      amenities: selectedAmenities,
      type,
    };

    try {
      await createBnb(dto, files, token);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onBack(); }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-white">Add New Stay</h1>
          <p className="text-xs text-zinc-500">Fill in your listing details</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`)}
        >
          {submitting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : success
            ? <><CheckCircle className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Publish</>
          }
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Photos */}
        <Field label="Photos" hint="Up to 10 photos. First photo is the cover.">
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white">
                    Cover
                  </span>
                )}
              </div>
            ))}
            {previews.length < 10 && (
              <button
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-zinc-400 transition-all"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Add</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </Field>

        {/* Basic info */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Basic Info</p>

          <Field label="Title">
            <input
              className={inputCls}
              placeholder="e.g. Modern Apartment in Westlands"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = brand)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
          </Field>

          <Field label="Description">
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Describe your space..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = brand)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
          </Field>

          <Field label="Type">
            <select
              className={`${inputCls} appearance-none cursor-pointer`}
              value={type}
              onChange={(e) => setType(e.target.value as BnbType)}
              onFocus={(e) => (e.target.style.borderColor = brand)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            >
              {BNB_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        {/* Pricing */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pricing</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rate per night (KES)">
              <input
                className={inputCls} type="number" placeholder="0.00"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
            <Field label="Price per booking (KES)">
              <input
                className={inputCls} type="number" placeholder="0.00"
                value={pricePerBooking} onChange={(e) => setPricePerBooking(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Capacity</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Guests">
              <input
                className={inputCls} placeholder="2"
                value={guests} onChange={(e) => setGuests(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
            <Field label="Bedrooms">
              <input
                className={inputCls} placeholder="1"
                value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
            <Field label="Bathrooms">
              <input
                className={inputCls} placeholder="1"
                value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
          </div>
        </div>

        {/* Location */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-500" />
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</p>
          </div>
          <Field label="Location">
            <input
              className={inputCls} placeholder="e.g. Westlands, Nairobi"
              value={location} onChange={(e) => setLocation(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = brand)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
          </Field>
          <Field label="Landmark">
            <input
              className={inputCls} placeholder="e.g. Near Sarit Centre"
              value={landmark} onChange={(e) => setLandmark(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = brand)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
          </Field>
          <Field label="Country">
            <input
              className={inputCls} placeholder="Kenya"
              value={country} onChange={(e) => setCountry(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = brand)}
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <input
                className={inputCls} placeholder="-1.2921"
                value={latitude} onChange={(e) => setLatitude(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
            <Field label="Longitude">
              <input
                className={inputCls} placeholder="36.8219"
                value={longitude} onChange={(e) => setLongitude(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = brand)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </Field>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Amenities</p>
          {amenitiesLoading ? (
            <div className="flex items-center gap-2 text-zinc-600 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading amenities…
            </div>
          ) : amenities.length === 0 ? (
            <p className="text-xs text-zinc-600">No amenities available.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {amenities.map((a) => {
                const active = selectedAmenities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={
                      active
                        ? { background: `${brand}20`, borderColor: `${brand}50`, color: brandText }
                        : { borderColor: "rgba(255,255,255,0.08)", color: "#71717a" }
                    }
                  >
                    {a.amenityIcon && (
                      <img src={a.amenityIcon} alt={a.amenityName} className="w-3.5 h-3.5 rounded-sm object-cover" />
                    )}
                    {active && <BadgeCheck className="w-3 h-3" />}
                    {a.amenityName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl text-white font-black text-base shadow-xl transition-all disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`)}
        >
          {submitting
            ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            : success
            ? "Published!"
            : "Publish Listing"
          }
        </button>

      </div>
    </div>
  );
};

export default AddBnbPage;