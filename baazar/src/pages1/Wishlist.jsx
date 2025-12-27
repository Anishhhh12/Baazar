import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { useUser } from "../context/UserContext";

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();
  const { user } = useUser();

  // Not logged in → redirect message
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">
          Please login to view your wishlist
        </h2>
        <Link
          to="/login"
          className="text-orange-600 font-medium hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-6">
      <h1 className="text-2xl font-bold mb-6">❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-gray-600">
          Your wishlist is empty. Start liking products!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
