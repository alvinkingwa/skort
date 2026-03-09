import { useState, useMemo } from "react";
import { brand, brandHover, brandText, brandDark } from "./theme.js";
import { MODELS, SORT_OPTIONS } from "./data/models.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import TabSwitcher from "./components/TabSwitcher.jsx";
import StaysPage from "./pages/StaysPage.jsx";
import StayProfile from "./pages/StayProfile.jsx";
import FilterBar from "./components/FilterBar.jsx";
import CreatorCard from "./components/CreatorCard.jsx";
import CreatorSignupModal from "./components/CreatorSignupModal.jsx";
import CreatorProfile from "./pages/CreatorProfile.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import CreatorOnboarding from "./pages/CreatorOnboarding.jsx";
import CreatorPricing from "./pages/CreatorPricing.jsx";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import { SearchX } from "lucide-react";
import { PointsProvider, usePoints } from "./context/PointsContext.jsx";

function applyFilters(models, { search, sort, onlineOnly }) {
  let result = models.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.handle.toLowerCase().includes(search.toLowerCase()) ||
      m.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!onlineOnly || m.online);
  });
  if (sort === "Top Rated")
    result = [...result].sort((a, b) => b.rating - a.rating);
  if (sort === "Most Popular")
    result = [...result].sort((a, b) => b.reviews - a.reviews);
  if (sort === "Price: Low")
    result = [...result].sort((a, b) => a.price.chat - b.price.chat);
  if (sort === "Price: High")
    result = [...result].sort((a, b) => b.price.chat - a.price.chat);
  if (sort === "Online First")
    result = [...result].sort((a, b) => Number(b.online) - Number(a.online));
  return result;
}

const BrowsePage = ({
  onSelectCreator,
  onSignIn,
  onJoinCreator,
  onDashboard,
  onTabChange,
}) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Top Rated");
  const [onlineOnly, setOnlineOnly] = useState(false);

  const filtered = useMemo(
    () => applyFilters(MODELS, { search, sort, onlineOnly }),
    [search, sort, onlineOnly],
  );
  const onlineCount = MODELS.filter((m) => m.online).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar
        search={search}
        onSearch={setSearch}
        onlineCount={onlineCount}
        onSignIn={onSignIn}
        onDashboard={onDashboard}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore Creators
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Browse freely — chat, call or order with no account needed
          </p>
        </div>
        <FilterBar
          sort={sort}
          onSortChange={setSort}
          onlineOnly={onlineOnly}
          onOnlineToggle={() => setOnlineOnly(!onlineOnly)}
          resultCount={filtered.length}
        />
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <SearchX className="w-7 h-7 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No creators found
            </h3>
            <p className="text-zinc-500 text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onClick={onSelectCreator}
              />
            ))}
          </div>
        )}
      </main>
      <Footer onJoinCreator={onJoinCreator} onTabChange={onTabChange} />
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("browse");
  const [activeCreator, setActiveCreator] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState("creators");
  const [activeStay, setActiveStay] = useState(null);

  const goToProfile = (creator) => {
    setActiveCreator(creator);
    setPage("profile");
  };
  const handleAction = (action, creator) => {
    setActiveCreator(creator);
    setPage(action);
  };
  const goBack = () => setPage(page === "profile" ? "browse" : "profile");

  return (
    <PointsProvider>
      <div>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {activeTab === "creators" && page === "browse" && (
          <BrowsePage
            onSelectCreator={goToProfile}
            onSignIn={() => setShowSignup(true)}
            onJoinCreator={() => setShowSignup(true)}
            onDashboard={() => setPage("dashboard")}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setActiveStay(null);
            }}
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
        {page === "onboarding" && (
          <CreatorOnboarding onGoToPricing={() => setPage("pricing")} />
        )}
        {page === "pricing" && (
          <CreatorPricing onFinish={() => setPage("browse")} />
        )}
        {page === "dashboard" && (
          <CreatorDashboard onBack={() => setPage("browse")} />
        )}

        {(page === "browse" ||
          page === "dashboard" ||
          (activeTab === "stays" && !activeStay)) && (
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setPage("browse");
              setActiveStay(null);
            }}
          />
        )}

        {showSignup && (
          <CreatorSignupModal
            onClose={() => setShowSignup(false)}
            onSuccess={() => {
              setShowSignup(false);
              setPage("onboarding");
            }}
          />
        )}
      </div>
    </PointsProvider>
  );
}
