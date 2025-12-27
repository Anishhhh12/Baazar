import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  User,
  ShoppingBag,
  Heart,
  Gift,
  Star,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import apiFetch from "../services/api";


export default function LandingPage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const loginRef = useRef(null);
  const menuRef = useRef(null);

  // Load all products from backend once
  useEffect(() => {
  const loadProducts = async () => {
    try {
      const API_ROOT = import.meta.env.VITE_API_URL || "";
      const res = await axios.get(`${API_ROOT}/api/products`);
      setAllProducts(res.data);
    } catch (err) {
      console.error("Landing page product fetch failed:", err);
    }
  };
  loadProducts();
}, []);


  // Define category tiles (same as before — unchanged)
 const categoryTiles = [
  {
    slug: "sneakers",
    title: "Sneakers",
    fallbackImg: "/images/pexels-nytheone-1070360.jpg",
  },
  {
    slug: "backpack",
    title: "Backpack",
    fallbackImg:
      "/images/LumberUnion_UrbanExplorerBackpack_FrontLeft_Black_590x.webp",
  },
  {
    slug: "smartwatch",
    title: "Smart Watch",
    fallbackImg: "/images/product-image-1442855703.webp",
  },
  {
    slug: "wireless-headphones",
    title: "Wireless Headphones",
    fallbackImg:
      "/images/Wireless-Headphone_10bc81af-06d2-49bc-8d15-88d079626d88.jpg",
  },
];


const handleLogout = async () => {
  try {
    // 1. Logout from your app
    await apiFetch("/api/auth/logout", { method: "POST" });
    
    // 2. Optional: Logout from Google (opens new tab)
    const googleLogoutWindow = window.open(
      'https://accounts.google.com/Logout',
      'google-logout',
      'width=500,height=500'
    );
    
    // Close the popup after 2 seconds
    setTimeout(() => {
      if (googleLogoutWindow) googleLogoutWindow.close();
    }, 2000);
    
  } catch (error) {
    console.error('Logout error:', error);
    // ignore - still log out locally
  } finally {
    setUser(null);
    navigate("/");
  }
};




  // click outside menu close handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="font-sans bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white flex justify-between items-center px-12 py-4 relative">
        <h1 className="text-2xl font-bold">Baazar</h1>

        {/* Default Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

        </div>

        

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {/* Login dropdown */}
          {/* Login / My Account dropdown */}
          <div className="relative" ref={loginRef}>
            {/* NOT LOGGED IN */}
            {!user && (
              <div
                onMouseEnter={() => setLoginOpen(true)}
                onMouseLeave={() => setLoginOpen(false)}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-gray-100"
                >
                  Login
                </button>

                {loginOpen && (
                  <div className="absolute right-0 mt-0.5 w-64 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="flex justify-between items-center px-4 py-2 border-b">
                      <span className="text-sm">New customer?</span>
                      <button
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Sign Up
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (!user) {
                          navigate("/login", {
                            state: { redirectTo: "/profile" }
                          });
                        } else {
                          navigate("/profile");
                        }
                      }}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <User size={18} className="mr-2" /> My Profile
                    </button>


                    <button
                      onClick={() => navigate("/orders")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <ShoppingBag size={18} className="mr-2" /> Orders
                    </button>

                    <button
                      onClick={() => navigate("/wishlist")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Heart size={18} className="mr-2" /> Wishlist
                    </button>

                    <button
                      onClick={() => navigate("/gift-cards")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Gift size={18} className="mr-2" /> Gift Cards
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LOGGED IN */}
            {user && (
              <>
                <button
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="bg-white text-gray-800 font-semibold px-4 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
                >
                  My Account
                  <span className="text-xs">⌄</span>
                </button>

                {loginOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <User size={18} className="mr-2" /> My Profile
                    </button>

                    <button
                      onClick={() => navigate("/orders")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <ShoppingBag size={18} className="mr-2" /> Orders
                    </button>

                    <button
                      onClick={() => navigate("/wishlist")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Heart size={18} className="mr-2" /> Wishlist
                    </button>

                    <button
                      onClick={() => navigate("/gift-cards")}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Gift size={18} className="mr-2" /> Gift Cards
                    </button>

                    <div className="my-1 border-t" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>


          

          <Link to="/cart" className="hover:text-orange-400">
            Cart
          </Link>
          <Link to="/seller" className="hover:text-orange-400">
            Sell Online
          </Link>
          <Link to="/explore-plus" className="hover:text-orange-400">
            Explore Plus
          </Link>
          <Link to="/visual-search" className="hover:text-orange-400">Search by Image</Link>


          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <MoreVertical size={22} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                <Link to="/help" className="block px-4 py-2 hover:bg-gray-100">
                  Help
                </Link>

                <Link to="/contact-support" className="block px-4 py-2 hover:bg-gray-100">
                  Contact & Support
                </Link>

                <Link to="/suggestions" className="block px-4 py-2 hover:bg-gray-100">
                  Suggestions
                </Link>

                {user && (
                  <>
                    <div className="my-1 border-t" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </nav>
      </header>

      {/* Categories (unchanged) */}
      <section className="px-12 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        <Link
          to="/top-selling"
          className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:bg-gradient-to-t from-gray-50 to-white hover:scale-105 transition-transform duration-300 block"
        >
          <img
            src="/images/two-open-laptops-with-one-that-has-white-screen-that-says-touch_1191225-13909.jpg"
            alt="Top Selling"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">Top Selling Products</h3>
        </Link>

        <Link
          to="/category/lifestyle"
          className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 block"
        >
          <img
            src="/images/ai-generated-8702726_640.webp"
            alt="Lifestyle"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">Lifestyle</h3>
        </Link>

        <Link
          to="/category/electronics"
          className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 block"
        >
          <img
            src="/images/two-open-laptops-with-one-that-has-white-screen-that-says-touch_1191225-13909.jpg"
            alt="Electronics"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">Electronics</h3>
        </Link>

        <Link
          to="/category/grocery"
          className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 block"
        >
          <img
            src="/images/istockphoto-2186457342-612x612.webp"
            alt="Grocery"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">Grocery</h3>
        </Link>

        <Link
          to="/category/healthcare"
          className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 block"
        >
          <img
            src="/images/facewash-sunscreen-combo-with-vitamin-c-hyaluronic-acid-niacinamide-597.webp"
            alt="Healthcare"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">Healthcare</h3>
        </Link>
      </section>

      {/* Offers (unchanged) */}
      <section className="px-12 py-8 relative">
        <h2 className="text-2xl font-bold mb-4">🎉 Special Offers & Events</h2>

        <div
          id="offerCarousel"
          className="flex space-x-6 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {[
            {
              id: 1,
              title: "Big Brand Sale",
              desc: "Up to 70% Off",
              img: "/images/AUaDk6VmkFriSBiQJHrx4V.jpg",
              link: "/big-brand-sale",
            },
            {
              id: 2,
              title: "Electronics Fiesta",
              desc: "Flat ₹2000 Off",
              img: "/images/two-open-laptops-with-one-that-has-white-screen-that-says-touch_1191225-13909.jpg",
              link: "/category/electronics",
            },
            {
              id: 3,
              title: "Mega Grocery Days",
              desc: "Buy 1 Get 1 Free",
              img: "/images/istockphoto-2186457342-612x612.webp",
              link: "/category/grocery",
            },
            {
              id: 4,
              title: "Healthcare Essentials",
              desc: "Save 50%",
              img: "/images/facewash-sunscreen-combo-with-vitamin-c-hyaluronic-acid-niacinamide-597.webp",
              link: "/category/healthcare",
            },
            {
              id: 5,
              title: "Concert Tickets",
              desc: "Exclusive Discounts",
              img: "/images/concert-3084876_640.webp",
              link: "/category/concert",
            },
          ].map((offer) => (
            <Link
              key={offer.id}
              to={offer.link}
              className="min-w-[300px] bg-gradient-to-r from-indigo-500/80 to-purple-600/80 rounded-lg shadow-lg p-6 text-white flex-shrink-0 hover:scale-[1.03] transition-transform"
            >
              <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
              <p className="text-sm mb-4">{offer.desc}</p>
              <img
                src={offer.img}
                alt={offer.title}
                className="h-28 w-full object-cover rounded-md"
              />
            </Link>
          ))}
        </div>

        {/* scroll arrows */}
        <button
          onClick={() =>
            document
              .getElementById("offerCarousel")
              .scrollBy({ left: -320, behavior: "smooth" })
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 shadow-lg"
        >
          ◀
        </button>

        <button
          onClick={() =>
            document
              .getElementById("offerCarousel")
              .scrollBy({ left: 320, behavior: "smooth" })
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 shadow-lg"
        >
          ▶
        </button>
      </section>

      {/* Bottom Category Tiles — now using backend images */}
      <section className="p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categoryTiles.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-105 text-center block"
          >
            <img
              src={cat.fallbackImg}
              alt={cat.title}
              className="w-40 h-40 object-cover mx-auto mb-4 rounded-lg"
            />

            <h3 className="font-semibold text-lg">{cat.title}</h3>

            <button className="bg-orange-500 text-white px-4 py-2 rounded mt-3 hover:bg-orange-600">
              Explore More
            </button>
          </Link>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4 mt-12">
        <p>&copy; 2025 Baazar. All rights reserved.</p>
      </footer>
    </div>
  );
}
