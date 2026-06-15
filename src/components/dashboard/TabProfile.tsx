import { useRef, useState, useEffect } from "react";
import {
  Camera,
  ImagePlus,
  Images,
  X,
  Save,
  BadgeCheck,
  AlertCircle,
  Loader2,
  CheckCircle,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { brand } from "./helpers";
import { G, GH } from "./helpers";
import type { GalleryItem, ModelFile } from "./types";

interface TabProfileProps {
  token?: string;
}

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

const TabProfile = ({ token }: TabProfileProps) => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFileId, setAvatarFileId] = useState<number | null>(null);
  const [coverFileId, setCoverFileId] = useState<number | null>(null);

  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryFetchError, setGalleryFetchError] = useState<string | null>(
    null,
  );

  const [avatar, setAvatar] = useState("");
  const [cover, setCover] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Fetch gallery
  useEffect(() => {
    (async () => {
      setGalleryLoading(true);
      setGalleryFetchError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/model/my-gallery`,
          { headers: authHeaders },
        );
        if (!res.ok) throw new Error("Failed to load gallery");
        const json = await res.json();
        const raw: ModelFile[] = Array.isArray(json.data) ? json.data : [];
        if (raw.length) {
          setGallery(
            raw.map((f) => ({
              preview: `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${f.storeFileName}`,
              file: new File([], f.fileName),
              status: "done" as const,
              fileId: f.id,
            })),
          );
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

  // Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/my-profile`,
          { headers: authHeaders },
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
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/profile-picture`,
        {
          method: "PUT",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd,
        },
      );
      if (!res.ok) throw new Error("Failed to update profile picture");
      const json = await res.json();
      const sf = json.data?.profilePicture?.storeFileName;
      if (sf) {
        setAvatar(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${sf}`,
        );
        setAvatarFileId(json.data?.profilePicture?.id ?? null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadCover = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/cover-picture`,
        {
          method: "PUT",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd,
        },
      );
      if (!res.ok) throw new Error("Failed to update cover picture");
      const json = await res.json();
      const sf = json.data?.coverPicture?.storeFileName;
      if (sf) {
        setCover(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/files/open/get-with-name?storeFileName=${sf}`,
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
      const tid = toast.loading("Deleting photo…");
      try {
        await deleteFile(item.fileId);
        toast.success("Photo deleted.", { id: tid });
      } catch {
        toast.error("Failed to delete photo.", { id: tid });
        return;
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

    const tid = toast.loading("Uploading photos…");
    try {
      const fd = new FormData();
      pendingItems.forEach((item) => fd.append("pictures", item.file));
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/models/model/add-pictures`,
        {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd,
        },
      );
      if (!res.ok) throw new Error((await res.text()) || "Upload failed");
      setGallery((g) =>
        g.map((item) =>
          item.status === "uploading" ? { ...item, status: "done" } : item,
        ),
      );
      toast.success("Photos uploaded successfully!", { id: tid });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed", {
        id: tid,
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

      {/* Fields */}
      {[
        {
          label: "Display name",
          value: name,
          setter: setName,
          type: "text",
          placeholder: "",
        },
        {
          label: "Location",
          value: location,
          setter: setLocation,
          type: "text",
          placeholder: "City / area",
        },
        {
          label: "Email",
          value: email,
          setter: setEmail,
          type: "email",
          placeholder: "",
        },
        {
          label: "Phone number",
          value: phone,
          setter: setPhone,
          type: "tel",
          placeholder: "",
        },
        {
          label: "ID number",
          value: idNumber,
          setter: setIdNumber,
          type: "text",
          placeholder: "",
        },
        {
          label: "Gender",
          value: gender,
          setter: setGender,
          type: "text",
          placeholder: "e.g. Male, Female, Other",
        },
      ].map(({ label, value, setter, type, placeholder }) => (
        <div key={label}>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
            {label}
          </label>
          <input
            type={type}
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
        </div>
      ))}

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

      {/* Save */}
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

export default TabProfile;
