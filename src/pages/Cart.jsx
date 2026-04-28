import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, addToCart, decreaseQty, removeFromCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  // ✅ Always recalculates when cart changes
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <h5 className="text-center">Your cart is empty</h5>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>

                    <td>₹{item.price}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => decreaseQty(item.productId)}
                      >
                        -
                      </button>

                      <span className="fw-bold">{item.quantity}</span>

                      <button
                        className="btn btn-sm btn-outline-success ms-2"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </td>

                    <td className="fw-semibold">
                      ₹{item.price * item.quantity}
                    </td>

                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Total Section */}
          <div className="d-flex justify-content-end align-items-center mt-3">
            <h4 className="fw-bold me-3 text-success">Total: ₹{totalPrice}</h4>

            <button
              className="btn btn-success"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
