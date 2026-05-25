// ─────────────────────────────────────────────
//  hooks/useModelSignup.js
// ─────────────────────────────────────────────
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/open/signup/model`;

const INITIAL = {
  // signUpDto
  firstName:   "",
  lastName:    "",
  email:       "",
  phoneNumber: "",
  gender:      "FEMALE",
  idNumber:    "",
  location:    "",
  country:     "Kenya",
  landmark:    "",
  dob:         "",
  // modelDetails
  modelName:   "",
  tagline:     "",
  aboutMe:     "",
  ratesFrom:   "",
  serviceIds:  [],
  // ui only
  _agreed:     false,
};

export function useModelSignup() {
  const [fields,       setFields]       = useState(INITIAL);
  const [loading,      setLoading]      = useState(false);
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [coverFile,    setCoverFile]    = useState(null);

  const set = useCallback((key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  const REQUIRED = ["firstName","lastName","email","phoneNumber","gender","idNumber","dob","modelName"];
  const canSubmit = REQUIRED.every(k => String(fields[k] || "").trim() !== "");

  const submit = useCallback(async (modelDetailsOverride = {}) => {
    if (!canSubmit) return null;
    setLoading(true);
    const toastId = toast.loading("Creating your account…");
    try {
      const {
        _agreed,
        modelName, tagline, aboutMe, ratesFrom, serviceIds,
        firstName, lastName, email, phoneNumber, gender,
        idNumber, location, country, landmark, dob,
      } = fields;

      const formData = new FormData();

      // ── modelSignupDto blob ──
      formData.append(
        "modelSignupDto",
        new Blob([JSON.stringify({
          signUpDto: {
            firstName, lastName, email, phoneNumber,
            gender, idNumber, location, country, landmark, dob,
          },
          modelDetails: {
            modelName,
            tagline,
            aboutMe,
            ratesFrom:  parseFloat(ratesFrom) || 0.0,
            serviceIds: serviceIds.map(Number),
            ...modelDetailsOverride,
          },
        })], { type: "application/json" })
      );

      // ── photos (optional) ──
      if (avatarFile) formData.append("profilePicture", avatarFile);
      if (coverFile)  formData.append("coverPicture",   coverFile);

      const res  = await fetch(ENDPOINT, { method: "POST", body: formData });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

      toast.success("Account created! Check your email for OTP.", { id: toastId });
      setLoading(false);
      return { ...data, email };
    } catch (err) {
      toast.error(err.message, { id: toastId });
      setLoading(false);
      return null;
    }
  }, [fields, canSubmit, avatarFile, coverFile]);

  return { fields, set, canSubmit, loading, submit, setAvatarFile, setCoverFile, avatarFile, coverFile };
}