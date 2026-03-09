// ─────────────────────────────────────────────
//  context/PointsContext.jsx
//  Global client points balance
// ─────────────────────────────────────────────
import { createContext, useContext, useState } from "react";

const PointsContext = createContext(null);

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  const addPoints   = (amt) => setPoints((p) => p + amt);
  const spendPoints = (amt) => setPoints((p) => Math.max(0, p - amt));
  const hasEnough   = (amt) => points >= amt;

  return (
    <PointsContext.Provider value={{ points, addPoints, spendPoints, hasEnough }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);