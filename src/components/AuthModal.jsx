import { X, Images } from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme.js";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
  </svg>
);

const AuthModal = ({ onClose, onSuccess, reason }) => {
  const handleGoogleAuth = () => {
    // In production: trigger real Google OAuth flow
    // For now simulate success after a short delay
    setTimeout(() => {
      onSuccess({ name: "Signed In User", email: "user@gmail.com", avatar: "https://i.pravatar.cc/300?img=60" });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-sm p-7 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
        >
          <Images className="w-7 h-7 text-white" />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white mb-2">
            {reason || "Sign in to see more"}
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Create a free account to unlock the full gallery and connect with creators.
          </p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all shadow-lg"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] text-zinc-700 font-semibold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <p className="text-center text-xs text-zinc-600">
          Already have an account?{" "}
          <button onClick={handleGoogleAuth} className="font-bold transition-colors" style={{ color: brandText }}>
            Sign in with Google
          </button>
        </p>

        <p className="text-center text-[10px] text-zinc-700 mt-4 leading-relaxed">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;