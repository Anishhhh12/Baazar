import React, { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ AUTO-RESTORE LOGIN (GOOGLE / NORMAL)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        if (res?.user) {
          setUser(res.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
