// ─────────────────────────────────────────────
//  src/pages/BrowsePage.tsx
//  Changes vs previous version:
//  - applyFilters updated to use real API field names:
//    m.name -> m.fullName
//    m.handle -> m.modelName
//    m.specialties -> m.services (mapped to service names)
//    m.rating -> m.ratingsAvg
//    m.reviews -> m.ratingsCount
//    m.price.chat -> m.ratesFrom
//    m.online removed (not in API response — filter disabled)
//  - onlineOnly filter and onlineCount removed (no online field from API)
// ─────────────────────────────────────────────

import { useState, useMemo } from "react";
import { useModels } from "../hooks/useModels";
import { Model } from "../api/modelsApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterBar from "../components/FilterBar";
import CreatorCard from "../components/CreatorCard";
import { SearchX, RefreshCw } from "lucide-react";

// ── Types ─────────────────────────────────────
interface BrowsePageProps {
  onSelectCreator: (creator: Model) => void;
  onSignIn: () => void;
  onJoinCreator: () => void;
  onDashboard: () => void;
  onTabChange: (tab: string) => void;
  onAddStay: () => void;
}

interface FilterState {
  search: string;
  sort: string;
}

// ── Filter logic ──────────────────────────────
function applyFilters(models: Model[], { search, sort }: FilterState): Model[] {
  let result = models.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const matchName     = m.fullName?.toLowerCase().includes(q);
    const matchHandle   = m.modelName?.toLowerCase().includes(q);
    const matchService  = m.services?.some((s) =>
      s.serviceName?.toLowerCase().includes(q)
    );
    return matchName || matchHandle || matchService;
  });

  if (sort === "Top Rated")
    result = [...result].sort((a, b) => b.ratingsAvg - a.ratingsAvg);
  if (sort === "Most Popular")
    result = [...result].sort((a, b) => b.ratingsCount - a.ratingsCount);
  if (sort === "Price: Low")
    result = [...result].sort((a, b) => a.ratesFrom - b.ratesFrom);
  if (sort === "Price: High")
    result = [...result].sort((a, b) => b.ratesFrom - a.ratesFrom);

  return result;
}

// ── Component ─────────────────────────────────
const BrowsePage = ({
  onSelectCreator,
  onSignIn,
  onJoinCreator,
  onDashboard,
  onTabChange,
  onAddStay,
}: BrowsePageProps) => {
  const [search, setSearch] = useState<string>("");
  const [sort, setSort]     = useState<string>("Top Rated");

  const { models, loading, error, refetch } = useModels();

  const filtered = useMemo(
    () => applyFilters(models, { search, sort }),
    [models, search, sort],
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar
        search={search}
        onSearch={setSearch}
        onlineCount={0}
        onSignIn={onSignIn}
        onDashboard={onDashboard}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore Creators
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Browse freely to chat, call or order with no account needed
          </p>
        </div>

        <FilterBar
          sort={sort}
          onSortChange={setSort}
          onlineOnly={false}
          onOnlineToggle={() => {}}
          resultCount={filtered.length}
        />

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-zinc-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <SearchX className="w-7 h-7 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No creators found</h3>
            <p className="text-zinc-500 text-sm">Try a different search term</p>
          </div>
        )}

        {/* Creator grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((creator) => (
              <CreatorCard
                key={creator.modelId}
                creator={creator}
                onClick={onSelectCreator}
              />
            ))}
          </div>
        )}
      </main>

      <Footer onJoinCreator={onJoinCreator} onTabChange={onTabChange} onAddStay={onAddStay} />
    </div>
  );
};

export default BrowsePage;