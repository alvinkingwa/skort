// ─────────────────────────────────────────────
//  src/api/config.ts
//  Single source of truth for API base URL.
//  Set VITE_API_BASE_URL in your .env file:
//    VITE_API_BASE_URL=http://5.189.157.127:6790
// ─────────────────────────────────────────────

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://5.189.157.127:6790";