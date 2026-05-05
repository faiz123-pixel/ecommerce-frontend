import React, { useEffect } from "react";
import { loadScript } from "../utils/scriptLoader";

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const loadRazorpayScript = async () => {
      try {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        setIsLoaded(true);
      } catch (err) {
        setError("Failed to load Razorpay SDK");
        console.error(err);
      }
    };
    loadRazorpayScript();
  }, []);

  const openPaymentModal = (options) => {
    return new Promise((resolve, reject) => {
      if (!isLoaded) {
        reject(new Error("Razorpay SDK not loaded"));
        return;
      }

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_YOUR_KEY_ID", // Use environment variable
        amount: options.amount,
        currency: options.currency || "INR",
        name: "E-Commerce",
        order_id: options.orderId,
        handler: function (response) {
          resolve(response);
        },
        prefill: {
          name: options.name || "",
          email: options.email || "",
          contact: options.phone || "",
        },
        notes: {
          orderId: options.backendOrderId,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            reject(new Error("Payment cancelled by user"));
          },
        },
      });
      
      rzp.open();
    });
  };

  return { isLoaded, error, openPaymentModal };
};
