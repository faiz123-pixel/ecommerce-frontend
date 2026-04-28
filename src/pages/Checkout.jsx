import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../api/api";
import { LoginContext } from "../context/LoginContext";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(LoginContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: ""
  });

  // ✅ Calculate total safely
  const totalPrice = cart?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
  if (!form.address) {
    alert("Please enter address");
    return;
  }

  if (!cart || cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  try {
    // ✅ Calculate total
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Prepare payload (IMPORTANT: match backend)
    const orderData = {
      customerId: user.id,
      totalAmount: totalAmount,
      shippingAddress: form.address
    };

    // ✅ API call
    const response = await ordersApi.post("", orderData);

    console.log("Order Response:", response.data);

    alert("Order placed successfully!");

    clearCart();
    navigate("/");

  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order");
  }
};

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">

        {/* Address */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Shipping Address</h4>

            <textarea
              name="address"
              className="form-control"
              rows="4"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your full address"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Order Summary</h4>

            <ul className="list-group mb-3">
              {cart?.map((item) => (
                <li
                  key={item.productId}
                  className="list-group-item d-flex justify-content-between"
                >
                  <div>
                    {item.productName} × {item.quantity}
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}

              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span className="text-success">
                  ₹{totalPrice?.toLocaleString()}
                </span>
              </li>
            </ul>

            <button
              className="btn btn-success w-100"
              onClick={handleOrder}
            >
              Place Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;