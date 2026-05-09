import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi } from "../api/api";
import { LoginContext } from "../context/LoginContext";

function Cart() {
  const navigate = useNavigate();

    const { user } = useContext(LoginContext);

  const [cart, setCart] = useState([]);

  // 🔥 Fetch Cart Items
  const fetchCart = async () => {
    try {
      const res = await cartApi.get(`/user/${user.id}`);

      setCart(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.id)
      fetchCart();
  }, [user]);

  // 🔥 Increase Quantity
  const increaseQty = async (item) => {
    try {
      if(item.quantity >= item.product.inventoryCount){
   alert("No more stock available");
   return;
}
      const updatedCart = {
        ...item,
        quantity: item.quantity + 1,
        totalPrice: item.product.price * (item.quantity + 1),
      };

      await cartApi.put(`/${item.cartId}`, updatedCart);

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Decrease Quantity
  const decreaseQty = async (item) => {
    try {
      if (item.quantity === 1) {
        await cartApi.delete(`/${item.cartId}`);

        fetchCart();
        return;
      }

      const updatedCart = {
        ...item,
        quantity: item.quantity - 1,
        totalPrice: item.product.price * (item.quantity - 1),
      };

      await cartApi.put(`/${item.cartId}`, updatedCart);

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Total Price
  const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <>
      <style>
        {`
    body {
      background: #f5f7fb;
    }

    .cart-card {
      border: none;
      border-radius: 18px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    /* ❌ Removed Hover Effect Completely */
    
    .product-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #222;
    }

    .product-price {
      font-size: 1rem;
      color: #6c757d;
    }

    .total-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #198754;
    }

    .qty-container {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 8px 12px;
      width: fit-content;
    }

    .qty-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: bold;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qty-text {
      min-width: 35px;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
    }

    .summary-box {
      border-radius: 18px;
      background: white;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }

    .checkout-btn {
      border-radius: 12px;
      font-weight: 600;
      padding: 10px 20px;
    }

    .empty-cart {
      background: white;
      padding: 40px;
      border-radius: 18px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }
  `}
      </style>

      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">🛒 Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart text-center">
            <h4>Your cart is empty 😔</h4>

            <button
              className="btn btn-success mt-3 px-4"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {cart.map((item) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.cartId}>
                  <div className="card cart-card h-100">
                    <div className="card-body d-flex flex-column p-4">
                      {/* Product Name */}
                      <h5 className="product-title mb-2">
                        {item.product.productName}
                      </h5>

                      {/* Description */}
                      <p className="text-muted small">
                        {item.product.description}
                      </p>

                      {/* Price */}
                      <p className="product-price mb-3">
                        Price: ₹{item.product.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="qty-container d-flex align-items-center gap-3 mb-3">
                        <button
                          className="btn qty-btn btn-danger text-white"
                          onClick={() => decreaseQty(item)}
                        >
                          −
                        </button>

                        <span className="qty-text">{item.quantity}</span>

                        <button
                          className="btn qty-btn btn-success text-white"
                          onClick={() => increaseQty(item)}
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <div className="mt-auto">
                        <h5 className="total-price">
                          Total: ₹{item.totalPrice}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="summary-box mt-5 p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h3 className="fw-bold text-success mb-0">
                Grand Total: ₹{totalPrice}
              </h3>

              <button
                className="btn btn-success checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
