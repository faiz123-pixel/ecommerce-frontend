import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, couponsApi, ordersApi, productsApi } from "../api/api";
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

  const [couponCode, setCouponCode] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [discountAmount, setDiscountAmount] = useState(0);

  const [finalAmount, setFinalAmount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await cartApi.get(`/user/${user.id}`);

      setCart(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCart();
  }, [user]);

  // 🔥 Total Price
  const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

  useEffect(() => {
    setFinalAmount(totalPrice - discountAmount);
  }, [totalPrice, discountAmount]);

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

  const applyCoupon = async () => {
    if (!couponCode) {
      alert("Enter coupon code");
      return;
    }

    try {
      // Backend API
      const res = await couponsApi.get(`/couponcode/${couponCode}`);

      const coupon = res.data;

      console.log(coupon);

      // Coupon exists?
      if (!coupon) {
        alert("Coupon not found");
        return;
      }

      // Status check
      if (!coupon.status) {
        alert("Coupon is inactive");
        return;
      }

      // Date validation
      const now = new Date();

      const validFrom = new Date(coupon.validFrom);

      const validTo = new Date(coupon.validTo);

      if (now < validFrom) {
        alert("Coupon not started yet");
        return;
      }

      if (now > validTo) {
        alert("Coupon expired");
        return;
      }
      if (coupon.usageLimit <= 0) {
  alert("Coupon usage limit exceeded");

  return;
}
      // Discount calculation
      let discount = 0;

      if (coupon.couponDiscountType === "PERCENTAGE") {
        discount = (totalPrice * coupon.discountValue) / 100;
      } else if (coupon.couponDiscountType === "FIXEDAMOUNT") {
        discount = coupon.discountValue;
      }

      // Prevent negative price
      if (discount > totalPrice) {
        discount = totalPrice-1;
      }

      setDiscountAmount(discount);

      setAppliedCoupon(coupon);

      alert("Coupon applied successfully");
    } catch (error) {
      console.error(error);

      alert("Invalid coupon");
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
        totalAmount: finalAmount,
        shippingAddress: form.address,
      };

      // ✅ Save Order in DB
      const response = await ordersApi.post("", orderData);

      console.log(response.data);

      // ✅ Razorpay Order
      const razorpayOrder = await createOrder(
        finalAmount,
        "INR",
        `${response.data.orderId}`,
      );

      // ✅ Open Payment Modal
      const paymentResponse = await openPaymentModal({
        amount: finalAmount * 100,
        orderId: razorpayOrder.id,
        name: user.firstName || user.email,
        email: user.email,
        phone: user.phone || "",
        backendOrderId: `${response.data.orderId}`,
      });

      console.log(paymentResponse);

      // ✅ Verify Payment
      const verificationResponse = await verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,

        razorpay_payment_id: paymentResponse.razorpay_payment_id,

        razorpay_signature: paymentResponse.razorpay_signature,

        orderId: response.data.orderId,
      });

      if (verificationResponse.success) {
        alert("Order placed successfully!");
        await couponsApi.put(`/reduce-usage/${appliedCoupon.id}`);
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
        <h2 className="text-center fw-bold mb-5">🛍 Checkout</h2>

        <div className="row g-4">
          {/* Address */}
          <div className="col-lg-6">
            <div className="card checkout-card p-4">
              <h4 className="mb-4">📍 Shipping Address</h4>

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
              <h4 className="mb-4">🧾 Order Summary</h4>

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
                          <h6 className="mb-1">{item.product.productName}</h6>

                          <small className="text-muted">
                            Qty: {item.quantity}
                          </small>
                        </div>

                        <span className="fw-bold">₹{item.totalPrice}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Coupon Section */}

                  <div className="mb-4">
                    <label className="form-label fw-bold">Coupon Code</label>

                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />

                      <button className="btn btn-dark" onClick={applyCoupon}>
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Applied Coupon */}

                  {appliedCoupon && (
                    <div className="alert alert-success">
                      <strong>Coupon Applied:</strong>{" "}
                      {appliedCoupon.couponCode}
                      <br />
                      Discount: ₹{discountAmount}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Total</h5>

                    <div className="text-end">
                      <div>
                        Subtotal:
                        <strong> ₹{totalPrice}</strong>
                      </div>

                      <div className="text-danger">
                        Discount:
                        <strong> -₹{discountAmount}</strong>
                      </div>

                      <h4 className="total-text">₹{finalAmount}</h4>
                    </div>
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
