import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import apiFetch from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Reusable function to fetch current user
  const loadUser = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Run once on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser: loadUser, // 🔥 important
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    return {
      user: null,
      setUser: () => {},
      loading: false,
      refreshUser: () => {},
    };
  }

  return context;
}
