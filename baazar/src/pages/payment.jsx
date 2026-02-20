import React, { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const { product, amount } = location.state || {};

  // Razorpay script loader
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    await loadRazorpay();

    // Create order from backend
    const order = await API.post("/api/payment/create-order", {
      amount: amount || product.price,
    });

    const options = {
      key: "YOUR_KEY_ID",  
      amount: order.data.amount,
      currency: "INR",
      name: "Baazar Payment",
      description: "Order Purchase",
      order_id: order.data.id,

      handler: async (response) => {
        const verify = await API.post"/api/payment/verify-payment", {
          ...response,
        });

        if (verify.data.success) {
          alert("🎉 Payment Successful!");
        } else {
          alert("❌ Payment Failed!");
        }
      },

      prefill: {
        name: "Baazar User",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: { color: "#ff6f00" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return (
    <div className="text-center py-20 text-xl font-semibold">
      Redirecting to secure payment...
    </div>
  );
}

