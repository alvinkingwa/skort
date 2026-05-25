// ─────────────────────────────────────────────
//  hooks/useOtpVerify.js
// ─────────────────────────────────────────────
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/skort_app/profiles/open/password/otp-reset`;

export function useOtpVerify(email) {
  const [otp,      setOtp]      = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const canSubmit = otp.trim().length > 0 && password.length >= 6 && password === confirm;

  const submit = useCallback(async () => {
    if (!canSubmit) return null;
    setLoading(true);
    const toastId = toast.loading("Verifying OTP…");
    try {
      const res = await fetch(ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, otp, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

      toast.success("Account verified! You can now log in.", { id: toastId });
      setLoading(false);
      return data;
    } catch (err) {
      toast.error(err.message, { id: toastId });
      setLoading(false);
      return null;
    }
  }, [email, otp, password, canSubmit]);

  return { otp, setOtp, password, setPassword, confirm, setConfirm, canSubmit, loading, submit };
}