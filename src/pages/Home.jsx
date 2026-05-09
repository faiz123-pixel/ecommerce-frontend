import React, { useContext, useEffect, useState } from "react";
import { cartApi, productsApi, wishlistApi } from "../api/api";
import { LoginContext } from "../context/LoginContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const { user } = useContext(LoginContext);

  // 🔥 Fetch Products + Wishlist
  useEffect(() => {
    fetchProducts();
    if(user?.id)
      fetchWishlist();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await productsApi.get("");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWishlist = async () => {
    try {
      console.log(user)
      const res = await wishlistApi.get(`/user/${user.id}`);

      console.log(res.data)
      // 🔥 Only current user wishlist
      setWishlist(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Add To Cart
  const handleAddToCart = async (product) => {
    if (product.inventoryCount <= 0) {
      alert("Product is out of stock!");
      return;
    }

    try {
      const cartRes = await cartApi.get("");

      const cartItems = cartRes.data;

      const existingItem = cartItems.find(
        (item) =>
          item.product.productId === product.productId &&
          item.user.id === user.id
      );

      // ✅ Update Quantity
      if (existingItem) {
        if (existingItem.quantity >= product.inventoryCount) {
          alert("No more stock available");
          return;
        }

        const updatedCart = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          totalPrice:
            product.price * (existingItem.quantity + 1),
        };

        await cartApi.put(
          `/${existingItem.cartId}`,
          updatedCart
        );
      }

      // ✅ New Product
      else {
        const data = {
          product: product,
          user: user,
          quantity: 1,
          totalPrice: product.price,
        };

        await cartApi.post("", data);
      }

      // alert("Added to cart!");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  // 🔥 Wishlist Toggle
  const toggleWishlist = async (product) => {
    const existingItem = wishlist.find(
      (item) =>
        item.product.productId === product.productId
    );

    try {
      // console.log(existingItem)
      // ❌ Remove
      if (existingItem) {
        await wishlistApi.delete(
          `/${existingItem.id}`
        );

        setWishlist(
          wishlist.filter(
            (item) =>
              item.id !== existingItem.id
          )
        );
      }

      // ✅ Add
      else {
        const data = {
          product: product,
          user: user,
        };

        const res = await wishlistApi.post("", data);

        setWishlist([...wishlist, res.data]);
      }
    } catch (error) {
      console.error(error);
      alert("Wishlist operation failed");
    }
  };

  // 🔥 Check Wishlisted
  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) =>
        item.product.productId === productId
    );
  };

  return (
    <>
      {/* 🔥 Internal CSS */}
      <style>
        {`
          .product-card {
            border-radius: 16px;
            transition: all 0.3s ease;
            overflow: hidden;
          }

          .product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 28px rgba(0,0,0,0.12);
          }

          .product-title {
            font-size: 1.1rem;
            font-weight: 600;
          }

          .product-desc {
            font-size: 0.9rem;
            height: 45px;
            overflow: hidden;
          }

          .product-price {
            font-size: 1.2rem;
            font-weight: bold;
            color: #198754;
          }

          .btn-cart {
            border-radius: 10px;
            font-weight: 500;
          }

          .wishlist-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: 0.3s;
          }

          .wishlist-btn:hover {
            transform: scale(1.08);
          }
        `}
      </style>

      <div className="container mt-4">
        <h2 className="mb-4 fw-bold text-center">
          🛒 Products
        </h2>

        <div className="row g-4">
          {products.length === 0 ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            products
              .filter(
                (product) =>
                  product.status === 1 ||
                  product.status === true
              )
              .map((product) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={product.productId}
                >
                  <div className="card product-card h-100 border-0 shadow-sm position-relative">

                    {/* ❤️ Wishlist Button */}
                    <button
                      className="wishlist-btn position-absolute top-0 end-0 m-2"
                      onClick={() =>
                        toggleWishlist(product)
                      }
                    >
                      <i
                        className={`fa-heart fs-5 ${
                          isWishlisted(
                            product.productId
                          )
                            ? "fa-solid text-danger"
                            : "fa-regular text-secondary"
                        }`}
                      ></i>
                    </button>

                    <div className="card-body d-flex flex-column">
                      <h5 className="product-title">
                        {product.productName}
                      </h5>

                      <p className="text-muted product-desc">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <p className="product-price">
                          ₹{product.price}
                        </p>

                        <button
                          className="btn btn-success w-100 btn-cart"
                          disabled={
                            product.inventoryCount === 0
                          }
                          onClick={() =>
                            handleAddToCart(product)
                          }
                        >
                          {product.inventoryCount === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}

export default Home;