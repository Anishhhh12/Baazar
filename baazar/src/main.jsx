// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext"; // ✅ ADD THIS

createRoot(document.getElementById("root")).render(
    <UserProvider>        {/* ✅ MUST wrap App */}
      <CartProvider>
        <App />
      </CartProvider>
    </UserProvider>
);
