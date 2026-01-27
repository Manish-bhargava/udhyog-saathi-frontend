import React, { useState } from "react";
import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Ensure this points to https://udhyogsaathi.in/api/v1
const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// Helper to load Razorpay Script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: "₹499", // Updated to match your backend amount (499)
    period: "/month",
    description: "For professional creators & businesses.",
    icon: Crown,
    color: "bg-purple-50 text-purple-600",
    features: ["50 AI Generations", "Connect 5 Accounts", "Priority Support", "Advanced Analytics"],
    recommended: true,
  },
];

const Pricing = () => {
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    setLoadingId(plan.id);
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!userString) {
      alert("Please login first!");
      setLoadingId(null);
      return;
    }
    const user = JSON.parse(userString);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load.");
        setLoadingId(null);
        return;
      }

      // --- FIX 1: Correct URL (Removed '/user') ---
      const orderRes = await fetch(`${BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            planName: plan.id, 
            amount: 499 // Sending explicit amount or plan ID
        }), 
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Order Creation Failed");

      const options = {
        key: orderData.keyId, 
        amount: orderData.amount,
        currency: "INR",
        name: "Udhyog Saathi", // Updated App Name
        description: `Subscription for ${plan.name}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // --- FIX 2: Correct URL (Updated to match backend '/verify-payment') ---
            const verifyRes = await fetch(`${BASE_URL}/payment/verify-payment`, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id || user._id,
                planName: plan.id
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("PAYMENT SUCCESSFUL! 🎉 Plan Activated.");
              navigate("/dashboard"); // Redirect to Dashboard after success
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert("Backend verification error");
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email,
        },
        theme: { color: "#4F46E5" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-4 font-sans text-slate-900 flex flex-col justify-center py-12">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-indigo-600 font-bold uppercase text-xs md:text-sm tracking-widest mb-3">
          Pricing Plans
        </h2>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Ready to scale your business?
        </h1>
        <p className="text-slate-500 leading-relaxed">
          The all-in-one plan for professional creators.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full relative z-10">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className="relative bg-white rounded-3xl border border-indigo-200 shadow-[0_20px_50px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/20 flex flex-col transition-all duration-300"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Most Popular
            </div>

            <div className="p-6 md:p-8 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color}`}>
                <plan.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                <span className="text-slate-400 font-medium text-lg">{plan.period}</span>
              </div>

              <div className="w-full h-px bg-slate-100 mb-8" />
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 md:p-8 pt-0 mt-auto">
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loadingId !== null}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 ${loadingId === plan.id ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {loadingId === plan.id ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </span>
                ) : (
                  <span>Get Started with {plan.name}</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default Pricing;