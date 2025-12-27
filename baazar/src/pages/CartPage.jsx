// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


const CartPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { cartItems, removeFromCart, totalAmount, clearCart } = useCart();
  const [step, setStep] = useState("cart"); // cart → address → payment

  // If Buy Now used — jump to address
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("buynow") === "true") {
    if (!user) {
      navigate("/login", {
        state: { redirectTo: "/cart?buynow=true" }
      });
    } else {
      setStep("address");
    }
  }
}, [user, navigate]);

useEffect(() => {
  if (step === "address" && !user) {
    navigate("/login", {
      state: { redirectTo: location.pathname + location.search }
    });
  }
}, [step, user]);



  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", pincode: "" });

  // Create order on backend (called after successful payment)
  const placeOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", {
        items: cartItems.map((item) => ({ productId: item.id, quantity: 1 })),
        address,
        totalAmount,
      });

      // keep cart cleared only after order is created on server
      clearCart();
      setStep("cart");
      alert("Order Placed Successfully ✅");
    } catch (error) {
      console.error("Order error:", error);
      alert("Order failed ❌");
    }
  };

  // load Razorpay script
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // handle Razorpay payment
  const handleRazorpay = async () => {
    if (!cartItems.length) {
      alert("No items in cart!");
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load!");
      return;
    }

    // create order on backend — send amount in rupees as number
    const res = await axios.post("http://localhost:5000/api/payment/create-order", {
      amount: Math.round(totalAmount), // totalAmount in rupees (integer)
    });

    // backend should return order { id, amount } where amount is paise (e.g. 7999900)
    const order = res.data;

    const options = {
      key:"rzp_test_Rh9pNAqDrZpiIY",
      amount: order.amount,
      currency: "INR",
      name: "Baazar",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        // send response to backend verify route
        const verify = await axios.post("http://localhost:5000/api/payment/verify-payment", response);
        if (verify.data.success) {
          // place order in DB
          await placeOrder();
        } else {
          alert("Payment verification failed.");
        }
      },
      theme: { color: "#f97316" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // UI unchanged except Cancel no longer clears cart
  if (cartItems.length === 0 && step === "cart") {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty 🛍️</h2>
        <Link to="/" className="text-blue-600 underline font-medium">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {step === "cart" && (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                <Trash2 />
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <h2 className="text-xl font-semibold">Total: ₹{totalAmount}</h2>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={clearCart} className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400">Clear Cart</button>
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login", {
                      state: { redirectTo: "/cart" }
                    });
                    return;
                  }
                  setStep("address");
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Proceed to Address
              </button>

            </div>
          </div>
        </>
      )}

      {step === "address" && (
        <div className="max-w-md mx-auto mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">📦 Shipping Address</h2>
          <form className="space-y-3">
            {["name", "phone", "street", "city", "pincode"].map((field) => (
              <input key={field} placeholder={field.toUpperCase()} value={address[field]} onChange={(e) => setAddress({ ...address, [field]: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
            ))}
          </form>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep("cart")} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Back</button>
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login", {
                    state: { redirectTo: "/cart" }
                  });
                  return;
                }
                setStep("payment");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Proceed to Payment
            </button>

          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold mb-4">💳 Payment</h2>
          <div className="flex flex-col gap-4 items-center">
            <button onClick={handleRazorpay} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 shadow-md">Pay with Razorpay</button>
            <button onClick={() => setStep("cart")} className="text-gray-600 underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
