// ─────────────────────────────────────────────
//  context/AuthContext.tsx
// ─────────────────────────────────────────────
import { createContext, useContext, useState, ReactNode } from "react";


// ── Types ─────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  /** Normalised to uppercase: "MODEL" | "ADMIN" | "CLIENT" */
  role: string;
  token?: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True for MODEL and ADMIN roles */
  isModel: boolean;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const DASHBOARD_ROLES = ["MODEL", "ADMIN"];

// ── Context ───────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("skort_user");
        
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: AuthUser): void => {
    setUser(userData);
    localStorage.setItem("skort_user", JSON.stringify(userData));
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("skort_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isModel: DASHBOARD_ROLES.includes(user?.role ?? ""),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};