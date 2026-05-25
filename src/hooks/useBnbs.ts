// ─────────────────────────────────────────────
//  src/hooks/useBnbs.ts
//  Contains both hooks:
//  - useBnbs() — fetch list of BnBs
//  - useBnb(id) — fetch single BnB detail
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { fetchBnbs, fetchBnbById, FetchBnbsParams, Bnb, BnbDetail } from "../api/bnbsApi";


// ── useBnbs — list ────────────────────────────
interface UseBnbsResult {
  bnbs: Bnb[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBnbs(filters: FetchBnbsParams = {}): UseBnbsResult {
  const [bnbs, setBnbs] = useState<Bnb[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBnbs(JSON.parse(filterKey) as FetchBnbsParams);
      setBnbs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { bnbs, loading, error, refetch: load };
}

// ── useBnb — single detail ────────────────────
interface UseBnbResult {
  bnb: BnbDetail | null;
  loading: boolean;
  error: string | null;
}

export function useBnb(id: number): UseBnbResult {
  const [bnb, setBnb]         = useState<BnbDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchBnbById(id)
      .then(setBnb)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, [id]);

  return { bnb, loading, error };
}