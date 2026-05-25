import { useState } from "react";
import { Toaster } from "react-hot-toast";

import TabSwitcher from "./components/TabSwitcher";
import BrowsePage from "./pages/BrowsePage";
import StaysPage from "./pages/StaysPage";
import StayProfile from "./pages/StayProfile";
import CreatorProfile from "./pages/CreatorProfile";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import OrderPage from "./pages/OrderPage";
import CreatorOnboarding from "./pages/CreatorOnboarding";
import CreatorPricing from "./pages/CreatorPricing";
import CreatorDashboard from "./pages/CreatorDashboard";
import AddBnbPage from "./pages/AddBnbPage";
import CreatorSignupModal from "./components/CreatorSignupModal";
import AuthModal from "./components/AuthModal";

import { PointsProvider } from "./context/PointsContext";
import { AuthProvider, useAuth, AuthUser } from "./context/AuthContext";
import { Model } from "./api/modelsApi";
import { Bnb } from "./api/bnbsApi";

type Page =
  | "browse"
  | "profile"
  | "chat"
  | "call"
  | "video"
  | "order"
  | "onboarding"
  | "pricing"
  | "dashboard"
  | "addStay";

type Tab = "creators" | "stays";

const DASHBOARD_ROLES = ["MODEL", "ADMIN"];
const BNB_ROLES = ["BNBHOST", "ADMIN"];

function AppInner() {
  const { isLoggedIn, user, logout } = useAuth();

  const canSeeDashboard =
    isLoggedIn && DASHBOARD_ROLES.includes(user?.role ?? "");
  const canAddStay = isLoggedIn && BNB_ROLES.includes(user?.role ?? "");

  const [page, setPage] = useState<Page>("browse");
  const [activeCreator, setActiveCreator] = useState<Model | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("creators");
  const [activeStay, setActiveStay] = useState<Bnb | null>(null);
  const [showClientAuth, setShowClientAuth] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [forceAuth, setForceAuth] = useState<boolean>(false);

  const goToProfile = (creator: Model): void => {
    setActiveCreator(creator);
    setPage("profile");
  };

  const handleAction = (action: Page, creator: Model): void => {
    setActiveCreator(creator);
    setPage(action);
  };

  const goBack = (): void => setPage(page === "profile" ? "browse" : "profile");

  const handleAuthSuccess = (userData: AuthUser): void => {
    const role = userData.role?.toUpperCase();
    if (role === "MODEL" || role === "ADMIN") {
      setPage("dashboard");
    } else if (role === "BNBHOST") {
      setPage("addStay");
    } else {
      setPage("browse");
    }
    setShowClientAuth(false);
    setShowSignup(false);
    setForceAuth(false);
  };

  const handleSignupSuccess = (): void => {
    setShowSignup(false);
    setForceAuth(true);
    setShowClientAuth(true);
  };

  const safeDashboard = (): void => {
    if (canSeeDashboard) setPage("dashboard");
    else setShowClientAuth(true);
  };

  const handleAddStay = (): void => {
    if (canAddStay) setPage("addStay");
  };

  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
          },
          duration: 4000,
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {activeTab === "creators" && page === "browse" && (
        <BrowsePage
          onSelectCreator={goToProfile}
          onSignIn={() => setShowClientAuth(true)}
          onJoinCreator={() => setShowSignup(true)}
          onDashboard={safeDashboard}
          onTabChange={(tab) => {
            setActiveTab(tab as Tab);
            setActiveStay(null);
          }}
          onAddStay={handleAddStay}
        />
      )}

      {activeTab === "stays" && !activeStay && (
        <StaysPage onSelectStay={(stay) => setActiveStay(stay)} />
      )}
      {activeTab === "stays" && activeStay && (
        <StayProfile stay={activeStay} onBack={() => setActiveStay(null)} />
      )}

      {page === "profile" && activeCreator && (
        <CreatorProfile
          creator={activeCreator}
          onBack={() => setPage("browse")}
          onAction={handleAction}
        />
      )}
      {page === "chat" && activeCreator && (
        <ChatPage creator={activeCreator} onBack={goBack} />
      )}
      {(page === "call" || page === "video") && activeCreator && (
        <CallPage creator={activeCreator} mode={page} onBack={goBack} />
      )}
      {page === "order" && activeCreator && (
        <OrderPage creator={activeCreator} onBack={goBack} />
      )}

      {/* Onboarding — no signup prop needed, signup already done in modal */}
      {page === "onboarding" && (
        <CreatorOnboarding onGoToPricing={() => setPage("pricing")} />
      )}
      {page === "pricing" && (
        <CreatorPricing onFinish={() => setPage("browse")} />
      )}

      {page === "dashboard" && (
        <CreatorDashboard
          onBack={() => setPage("browse")}
          onLogout={() => {
            logout();
            setPage("browse");
          }}
        />
      )}

      {page === "addStay" && canAddStay && (
        <AddBnbPage onBack={() => setPage("browse")} />
      )}
      {page === "addStay" && !canAddStay && (
        <>
          {(() => {
            setPage("browse");
            return null;
          })()}
        </>
      )}

      {(page === "browse" ||
        page === "dashboard" ||
        (activeTab === "stays" && !activeStay)) && (
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as Tab);
            setPage("browse");
            setActiveStay(null);
          }}
        />
      )}

      {showClientAuth && !isLoggedIn && (
        <AuthModal
          onClose={() => {
            if (!forceAuth) setShowClientAuth(false);
          }}
          onSuccess={handleAuthSuccess}
          reason="Sign in to activate your account"
        />
      )}
      {showSignup && (
        <CreatorSignupModal
          onClose={() => setShowSignup(false)}
          onSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PointsProvider>
        <AppInner />
      </PointsProvider>
    </AuthProvider>
  );
}
