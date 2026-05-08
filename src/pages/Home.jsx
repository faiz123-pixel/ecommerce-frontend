import React, { useContext, useEffect, useState } from "react";
import { cartApi, productsApi } from "../api/api";
import { LoginContext } from "../context/LoginContext";

function Home() {
  const [products, setProducts] = useState([]);
  const {user} = useContext(LoginContext);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsApi.get("");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
  if (product.inventoryCount <= 0) {
    alert("Product is out of stock!");
    return;
  }
  

  try {
    // 🔥 Get Existing Cart Items
    const cartRes = await cartApi.get("");

    const cartItems = cartRes.data;

    // 🔥 Find Product Already Exists
    const existingItem = cartItems.find(
      (item) =>
        item.product.productId === product.productId &&
        item.user.id === user.id
    );

    // ✅ If Product Already Exists -> Update Quantity
    if (existingItem) {
      if(existingItem.quantity >= product.inventoryCount){
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

      // alert("Cart quantity updated!");
    }

    // ✅ First Time Add -> Create New Cart
    else {
      const data = {
        product: product,
        user: user,
        quantity: 1,
        totalPrice: product.price,
      };

      await cartApi.post("", data);

      // alert("Added to cart successfully!");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to add to cart");
  }
};

  return (
    <>
      {/* 🔥 Internal CSS */}
      <style>
        {`
          .product-card {
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }

          .product-title {
            font-size: 1.1rem;
            font-weight: 600;
          }

          .product-desc {
            font-size: 0.9rem;
            height: 40px;
            overflow: hidden;
          }

          .product-price {
            font-size: 1.2rem;
            font-weight: bold;
            color: #28a745;
          }

          .btn-cart {
            border-radius: 8px;
            font-weight: 500;
          }
        `}
      </style>

      <div className="container mt-4">
        <h2 className="mb-4 fw-bold text-center">🛒 Products</h2>

        <div className="row g-4">
          {products.length === 0 ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            products
              .filter(
                (product) => product.status === 1 || product.status === true,
              )
              .map((product) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={product.productId}
                >
                  <div className="card product-card h-100 border-0 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="product-title">{product.productName}</h5>

                      <p className="text-muted product-desc">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <p className="product-price">₹{product.price}</p>

                        <button
                          className="btn btn-success w-100 btn-cart"
                          disabled={product.inventoryCount === 0}
                          onClick={() => handleAddToCart(product)}
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
