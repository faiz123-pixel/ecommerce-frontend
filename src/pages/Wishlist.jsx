import React, { useContext, useEffect, useState } from "react";
import { cartApi, wishlistApi } from "../api/api";
import { LoginContext } from "../context/LoginContext";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const { user } = useContext(LoginContext);

  // 🔥 Fetch Wishlist
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.get(
        `/user/${user.id}`
      );

      setWishlist(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Remove From Wishlist
  const removeWishlist = async (id) => {
    try {
      await wishlistApi.delete(`/${id}`);

      setWishlist((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to remove wishlist item");
    }
  };

  // 🔥 Move Wishlist Product To Cart
  const moveToCart = async (wishlistItem) => {
    const product = wishlistItem.product;

    // ❌ Stock Check
    if (product.inventoryCount <= 0) {
      alert("Product is out of stock");
      return;
    }

    try {
      // 🔥 Fetch Cart
      const cartRes = await cartApi.get("");

      const cartItems = cartRes.data;

      // 🔥 Check Existing Cart Item
      const existingItem = cartItems.find(
        (item) =>
          item.product.productId ===
            product.productId &&
          item.user.id === user.id
      );

      // ✅ Already Exists
      if (existingItem) {
        if (
          existingItem.quantity >=
          product.inventoryCount
        ) {
          alert("No more stock available");
          return;
        }

        const updatedCart = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          totalPrice:
            product.price *
            (existingItem.quantity + 1),
        };

        await cartApi.put(
          `/${existingItem.cartId}`,
          updatedCart
        );
      }

      // ✅ Add New Product
      else {
        const data = {
          user: user,
          product: product,
          quantity: 1,
          totalPrice: product.price,
        };

        await cartApi.post("", data);
      }

      // 🔥 Remove From Wishlist After Move
      await wishlistApi.delete(`/${wishlistItem.id}`);

      setWishlist((prev) =>
        prev.filter(
          (item) => item.id !== wishlistItem.id
        )
      );

      alert("Product moved to cart!");
    } catch (error) {
      console.error(error);
      alert("Failed to move product");
    }
  };

  return (
    <>
      <style>
        {`
          .wishlist-card {
            border-radius: 16px;
            transition: 0.3s;
          }

          .wishlist-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }

          .product-desc {
            height: 45px;
            overflow: hidden;
            font-size: 0.9rem;
          }

          .wishlist-price {
            color: #198754;
            font-weight: bold;
            font-size: 1.2rem;
          }

          .empty-box {
            min-height: 60vh;
          }
        `}
      </style>

      <div className="container mt-4">
        <h2 className="fw-bold text-center mb-4">
          ❤️ My Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center empty-box">
            <h4 className="text-muted">
              Your wishlist is empty
            </h4>
          </div>
        ) : (
          <div className="row g-4">
            {wishlist.map((item) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={item.id}
              >
                <div className="card wishlist-card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column">

                    {/* Product Name */}
                    <h5 className="fw-bold">
                      {item.product.productName}
                    </h5>

                    {/* Description */}
                    <p className="text-muted product-desc">
                      {item.product.description}
                    </p>

                    {/* Price */}
                    <h5 className="wishlist-price mt-auto">
                      ₹{item.product.price}
                    </h5>

                    {/* Buttons */}
                    <div className="d-grid gap-2 mt-3">

                      {/* 🔥 Move To Cart */}
                      <button
                        className="btn btn-success rounded-pill"
                        onClick={() =>
                          moveToCart(item)
                        }
                      >
                        Move To Cart
                      </button>

                      {/* ❌ Remove */}
                      <button
                        className="btn btn-outline-danger rounded-pill"
                        onClick={() =>
                          removeWishlist(item.id)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;