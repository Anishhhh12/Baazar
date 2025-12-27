import { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "../services/api";
import { useUser } from "./UserContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, loading: userLoading } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ wait until user auth check is finished
    if (userLoading) return;

    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user, userLoading]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/wishlist");
      setWishlist(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch wishlist failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const res = await apiFetch(`/api/wishlist/${productId}`, {
        method: "POST",
      });
      setWishlist(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Toggle wishlist failed:", err.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
