import { paymentApi } from "../api/api";

export const createOrder = async (amount, currency = "INR", receipt = null) => {
  try {
    const response = await paymentApi.post("/create-order", {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await paymentApi.post("/verify", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};