// ─────────────────────────────────────────────
//  src/components/Footer.tsx
//  Changes vs original Footer.jsx:
//  - Converted to TSX with typed props
//  - Added "Add a Stay" button in Explore section
//  - Clicking it checks auth and BNB_HOST role:
//    * Not logged in → opens AuthModal with BnB owner reason
//    * Logged in but wrong role → opens AuthModal with BnB owner reason
//    * Logged in with BNBHOST or ADMIN role → calls onAddStay()
// ─────────────────────────────────────────────

import { useState } from "react";
import {
  Flame, UserPlus, Instagram, Twitter, Mail,
  Shield, FileText, HelpCircle, Home, PlusCircle,
} from "lucide-react";
import { brand, brandDark, brandHover, brandText } from "../theme";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { AuthUser } from "../context/AuthContext";

// ── Types ─────────────────────────────────────
interface FooterProps {
  onJoinCreator: () => void;
  onTabChange?: (tab: string) => void;
  onAddStay: () => void; // navigates to AddBnbPage
}

const BNB_ROLES = ["BNBHOST", "ADMIN"];

// ── Component ─────────────────────────────────
const Footer = ({ onJoinCreator, onTabChange, onAddStay }: FooterProps) => {
  const { user, isLoggedIn } = useAuth();
  const [showBnbAuth, setShowBnbAuth] = useState<boolean>(false);

  const handleAddStay = (): void => {
    const hasAccess = isLoggedIn && BNB_ROLES.includes(user?.role ?? "");
    if (hasAccess) {
      onAddStay();
    } else {
      setShowBnbAuth(true);
    }
  };

  const handleBnbAuthSuccess = (userData: AuthUser): void => {
    setShowBnbAuth(false);
    if (BNB_ROLES.includes(userData.role)) {
      onAddStay();
    }
    // If wrong role — modal closes, nothing happens
  };

  return (
    <>
      <footer className="bg-zinc-900 border-t border-white/5 mt-12">

        {/* Creator CTA banner */}
        <div
          className="w-full py-10 px-4"
          style={{ background: `linear-gradient(135deg, ${brand}20 0%, ${brandDark}30 100%)` }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
              style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
            >
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Become a Creator</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
              Join hundreds of Nairobi creators earning on their own terms. Set your prices, choose your services, get paid.
            </p>
            <button
              onClick={onJoinCreator}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all"
              style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)` }}
              onMouseEnter={e => (e.currentTarget.style.background = `linear-gradient(135deg, ${brandHover} 0%, ${brandDark} 100%)`)}
              onMouseLeave={e => (e.currentTarget.style.background = `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`)}
            >
              <UserPlus className="w-4 h-4" /> Join as Creator
            </button>
            <p className="text-xs text-zinc-600 mt-3">Free to start · No experience needed · Paid via M-Pesa</p>
          </div>
        </div>

        {/* Footer links */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: brand }}>
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-black text-white">Sk<span style={{ color: brandText }}>ort</span></span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nairobi's premier creator connection platform. Real conversations, real people.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {[Instagram, Twitter, Mail].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Explore — Added "Add a Stay" button */}
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Explore</p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onTabChange?.("creators")}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-white transition-colors"
                  >
                    <Flame className="w-3 h-3" /> Creators
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange?.("stays")}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-white transition-colors"
                  >
                    <Home className="w-3 h-3" /> Stays
                  </button>
                </li>
                {/* Add a Stay — requires BNBHOST or ADMIN role */}
                <li>
                  <button
                    onClick={handleAddStay}
                    className="flex items-center gap-1.5 text-xs hover:text-white transition-colors font-semibold"
                    style={{ color: brandText }}
                  >
                    <PlusCircle className="w-3 h-3" /> Add a Stay
                  </button>
                </li>
                <li><a href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">Buy Points</a></li>
                <li><a href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">Safety Tips</a></li>
              </ul>
            </div>

            {/* For Creators */}
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Creators</p>
              <ul className="space-y-2">
                {["Join as Creator", "Creator Guide", "Pricing Plans", "Payouts"].map(l => (
                  <li key={l}><a href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Company</p>
              <ul className="space-y-2">
                {["About Us", "Blog", "Careers", "Contact"].map(l => (
                  <li key={l}><a href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-700">© 2025 Skort. All rights reserved. Nairobi, Kenya.</p>
            <div className="flex items-center gap-4">
              {[
                { icon: Shield,     label: "Privacy Policy"   },
                { icon: FileText,   label: "Terms of Service" },
                { icon: HelpCircle, label: "Support"          },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="flex items-center gap-1 text-xs text-zinc-600 hover:text-white transition-colors">
                  <Icon className="w-3 h-3" /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* BnB Owner Auth Modal */}
      {showBnbAuth && (
        <AuthModal
          onClose={() => setShowBnbAuth(false)}
          onSuccess={handleBnbAuthSuccess}
          reason="Sign in as a BnB Owner"
        />
      )}
    </>
  );
};

export default Footer;