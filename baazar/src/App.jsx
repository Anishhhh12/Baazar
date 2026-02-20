// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";


/* Auth pages */
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthSuccess from "./pages/AuthSuccess";
import Profile from "./pages/Profile";




/* User context */
import { UserProvider } from "./context/UserContext";

/* Main pages */
import LandingPage from "./pages/landingpage";
import CartPage from "./pages/CartPage";
import Payment from "./pages/payment";

/* Seller pages */
import Seller from "./pages/Seller";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOnboarding from "./pages/SellerOnboarding";
import WishlistPage from "./pages/Wishlist";

/* Static Feature Pages */
import ExplorePlus from "./pages/ExplorePlus";
import TopSelling from "./pages/TopSelling";
import BigBrandSale from "./pages/BigBrandSale";
import Help from "./pages/Help";
import ContactSupport from "./pages/ContactSupport";
import Suggestions from "./pages/Suggestions";

/* Dynamic pages */
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import { useUser } from "./context/UserContext";
import VisualSearch from "./pages/VisualSearch";
import SearchResults from "./pages/searchResults";


  

function App() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking login...
      </div>
    );
  }
  return (
    <CartProvider>     {/* <-- MUST wrap everything */}
      <Router>
        <Routes>

          {/* Home */}
          <Route path="/" element={<LandingPage />} />

          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* Seller Flow */}
          <Route path="/seller" element={<Seller />} />
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />

          {/* Static Pages */}
          <Route path="/explore-plus" element={<ExplorePlus />} />
          <Route path="/top-selling" element={<TopSelling />} />
          <Route path="/big-brand-sale" element={<BigBrandSale />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/suggestions" element={<Suggestions />} />

          {/* Dynamic Pages */}
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Payment */}
          <Route path="/payment" element={<Payment />} />

                    {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          <Route path="/profile" element={<Profile />} />
          
          // inside routes
          <Route path="/visual-search" element={<VisualSearch />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishlist" element={<WishlistPage />} />



        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
