// ─────────────────────────────────────────────
//  src/api/authApi.ts
//  All auth-related API calls live here.
// ─────────────────────────────────────────────

import { API_BASE_URL } from "./config";
import { AuthUser } from "../context/AuthContext";

const LOGIN_ENDPOINT = `${API_BASE_URL}/skort_app/profiles/open/login`;

// ── Request shape ─────────────────────────────
export interface LoginParams {
  email: string;
  password: string;
}

// ── Response shape ────────────────────────────
interface LoginResponseData {
  email: string;
  role: string;
  token: string;
  refreshToken: string;
}

interface LoginEnvelope {
  status: number;
  message: string;
  timestamp: string;
  data: LoginResponseData;
}

// ── login ─────────────────────────────────────
export async function login(params: LoginParams): Promise<AuthUser> {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const envelope: LoginEnvelope = await response.json();
  const d = envelope.data;

  // Map API response to AuthUser shape
  return {
    id:    d.email,           // API has no separate id field — email is unique
    email: d.email,
    name:  d.email,           // name not returned at login; update after profile fetch if needed
    role:  d.role.toUpperCase(),
    token: d.token,
  };
}