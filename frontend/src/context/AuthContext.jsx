import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("nexa_token"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("nexa_user") || "null"));

  useEffect(() => {
    if (!token) return;
    api.get("/auth/me").then(({ data }) => setUser(data.user)).catch(() => logout());
  }, [token]);

  function saveSession(data) {
    localStorage.setItem("nexa_token", data.token);
    localStorage.setItem("nexa_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("nexa_token");
    localStorage.removeItem("nexa_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, setUser, saveSession, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
