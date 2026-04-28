import React, { useEffect, useState, useContext } from "react";
import { productsApi } from "../api/api";
import { CartContext } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

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

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Products</h2>

      <div className="row g-4">
        {products.length === 0 ? (
  <p>Loading...</p>
) : (
  products
    .filter(product => product.status === 1 || product.status === true)
    .map((product) => (
      <div className="col-md-4" key={product.productId}>
        <div className="card shadow-sm border-0 h-100">

          <div className="card-body">
            <h5 className="fw-bold">{product.productName}</h5>

            <p className="text-muted">{product.description}</p>

            <p className="text-success fw-bold">
              ₹{product.price}
            </p>

            <button
              className="btn btn-success w-100"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    ))
)}
      </div>
    </div>
  );
}

export default Home;