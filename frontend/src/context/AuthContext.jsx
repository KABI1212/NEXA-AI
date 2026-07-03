import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("nexa_user") || "null");
  } catch {
    localStorage.removeItem("nexa_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("nexa_token"));
  const [user, setUser] = useState(loadStoredUser);

  useEffect(() => {
    let cancelled = false;
    async function bootSession() {
      try {
        await api.get("/auth/csrf");
        const { data } = await api.get("/auth/me");
        if (!cancelled) {
          setUser(data.user);
          localStorage.setItem("nexa_user", JSON.stringify(data.user));
        }
      } catch {
        try {
          const { data } = await api.post("/auth/refresh");
          if (!cancelled) saveSession(data);
        } catch {
          if (!cancelled) logout(false);
        }
      }
    }
    bootSession();
    return () => {
      cancelled = true;
    };
  }, []);

  function saveSession(data) {
    if (data.token) localStorage.setItem("nexa_token", data.token);
    localStorage.setItem("nexa_user", JSON.stringify(data.user));
    setToken(data.token || "cookie-session");
    setUser(data.user);
  }

  async function logout(callApi = true) {
    if (callApi) {
      try {
        await api.get("/auth/csrf");
        await api.post("/auth/logout");
      } catch {
        // Local cleanup still protects this browser session.
      }
    }
    localStorage.removeItem("nexa_token");
    localStorage.removeItem("nexa_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, setUser, saveSession, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
