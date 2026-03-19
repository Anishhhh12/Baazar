import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext"; // ADD THIS

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <WishlistProvider>          {/* ADD THIS */}
      <CartProvider>
        <App />
      </CartProvider>
    </WishlistProvider>          {/* ADD THIS */}
  </UserProvider>
);
