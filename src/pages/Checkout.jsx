import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, ordersApi, productsApi } from "../api/api";
import { LoginContext } from "../context/LoginContext";
import { createOrder, verifyPayment } from "../services/paymentService";
import { useRazorpay } from "../services/useRazorpay";

function Checkout() {
  const { user } = useContext(LoginContext);

  const navigate = useNavigate();

  const { openPaymentModal, isLoaded } = useRazorpay();

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    address: "",
  });

  // 🔥 Fetch Cart
  const fetchCart = async () => {
    try {
      const res = await cartApi.get("");

      console.log(res.data)
      setCart(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 Total Price
  const totalPrice = cart.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  // 🔥 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Clear Cart
  const clearCart = async () => {
    try {
      for (const item of cart) {
        await cartApi.delete(`/${item.cartId}`);
         }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Place Order
  const handleOrder = async () => {
    if (!form.address) {
      alert("Please enter address");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!isLoaded) {
      alert("Payment system is loading...");
      return;
    }

    try {
      // ✅ Backend Order Payload
      const orderData = {
        customerId: user.id,
        totalAmount: totalPrice,
        shippingAddress: form.address,
      };

      // ✅ Save Order in DB
      const response = await ordersApi.post("", orderData);

      console.log(response.data);

      // ✅ Razorpay Order
      const razorpayOrder = await createOrder(
        totalPrice,
        "INR",
        `${response.data.orderId}`
      );

      // ✅ Open Payment Modal
      const paymentResponse = await openPaymentModal({
        amount: totalPrice * 100,
        orderId: razorpayOrder.id,
        name: user.firstName || user.email,
        email: user.email,
        phone: user.phone || "",
        backendOrderId: `${response.data.orderId}`,
      });

      console.log(paymentResponse);

      // ✅ Verify Payment
      const verificationResponse = await verifyPayment({
        razorpay_order_id:
          paymentResponse.razorpay_order_id,

        razorpay_payment_id:
          paymentResponse.razorpay_payment_id,

        razorpay_signature:
          paymentResponse.razorpay_signature,

        orderId: response.data.orderId,
      });

      if (verificationResponse.success) {
        alert("Order placed successfully!");

        // ✅ Clear Cart
        await clearCart();

        navigate("/");
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error(error);

      alert("Failed to place order");
    }
  };

  return (
    <>
      <style>
        {`
          body {
            background: #f5f7fb;
          }

          .checkout-card {
            border: none;
            border-radius: 18px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          }

          .summary-item {
            border: none;
            border-bottom: 1px solid #eee;
            padding: 14px 0;
          }

          .place-btn {
            border-radius: 12px;
            font-weight: 600;
            padding: 12px;
          }

          .total-text {
            font-size: 1.3rem;
            font-weight: bold;
            color: #198754;
          }
        `}
      </style>

      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          🛍 Checkout
        </h2>

        <div className="row g-4">
          {/* Address */}
          <div className="col-lg-6">
            <div className="card checkout-card p-4">
              <h4 className="mb-4">
                📍 Shipping Address
              </h4>

              <textarea
                name="address"
                rows="6"
                className="form-control"
                placeholder="Enter your full address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-6">
            <div className="card checkout-card p-4">
              <h4 className="mb-4">
                🧾 Order Summary
              </h4>

              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <ul className="list-group mb-4">
                    {cart.map((item) => (
                      <li
                        key={item.cartId}
                        className="list-group-item summary-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 className="mb-1">
                            {item.product.productName}
                          </h6>

                          <small className="text-muted">
                            Qty: {item.quantity}
                          </small>
                        </div>

                        <span className="fw-bold">
                          ₹{item.totalPrice}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Total</h5>

                    <h4 className="total-text">
                      ₹{totalPrice}
                    </h4>
                  </div>

                  <button
                    className="btn btn-success w-100 place-btn"
                    onClick={handleOrder}
                  >
                    Proceed to Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;