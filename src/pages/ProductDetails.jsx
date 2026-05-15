import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cartApi,
  productsApi,
  reviewsApi,
} from "../api/api";
import { LoginContext } from "../context/LoginContext";

function ProductDetails() {
  const { productId } = useParams();

  const { user } = useContext(LoginContext);

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await productsApi.get(`/${productId}`);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await reviewsApi.get(
        `/product/${productId}`
      );

      // ✅ Only Active Reviews
      const activeReviews = (res.data || []).filter(
        (review) =>
          review.status === true ||
          review.status === 1
      );

      setReviews(activeReviews);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Average Rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const data = {
        product,
        user,
        quantity: 1,
        totalPrice: product.price,
      };

      await cartApi.post("", data);

      alert("Added To Cart");
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <style>
        {`
          .details-card{
            border-radius:24px;
            overflow:hidden;
            border:none;
          }

          .price{
            font-size:2rem;
            font-weight:bold;
            color:#198754;
          }

          .stock-badge{
            border-radius:30px;
            padding:8px 16px;
            font-size:0.9rem;
          }

          .action-btn{
            border-radius:12px;
            padding:12px 20px;
            font-weight:600;
          }

          .review-card{
            border:none;
            border-radius:18px;
            box-shadow:0 4px 14px rgba(0,0,0,0.06);
            transition:0.3s;
          }

          .review-card:hover{
            transform:translateY(-4px);
          }

          .review-user{
            width:45px;
            height:45px;
            border-radius:50%;
            background:#198754;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            font-weight:bold;
          }

          .rating-box{
            background:#fff8e1;
            border-radius:14px;
            padding:14px 18px;
            display:inline-flex;
            align-items:center;
            gap:10px;
            margin-top:20px;
          }

          .rating-number{
            font-size:1.4rem;
            font-weight:bold;
            color:#ff9800;
          }
        `}
      </style>

      {/* Product Section */}
      <div className="card shadow-lg details-card">
        <div className="row g-0">

          {/* Product Info */}
          <div className="col-md-12">
            <div className="card-body p-4 p-lg-5">

              <h2 className="fw-bold mb-3">
                {product.productName}
              </h2>

              <h3 className="price">
                ₹{product.price}
              </h3>

              <p className="text-muted mt-4">
                {product.description}
              </p>

              {/* ✅ Overall Rating */}
              <div className="rating-box">
                <div className="rating-number">
                  ⭐ {averageRating}
                </div>

                <div>
                  <div className="fw-bold">
                    Overall Rating
                  </div>

                  <small className="text-muted">
                    Based on {reviews.length} reviews
                  </small>
                </div>
              </div>

              <div className="mt-4">
                {product.inventoryCount > 0 ? (
                  <span className="badge bg-success stock-badge">
                    {product.inventoryCount} In Stock
                  </span>
                ) : (
                  <span className="badge bg-danger stock-badge">
                    Out Of Stock
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-3 mt-5">

                <button
                  className="btn btn-success action-btn"
                  onClick={handleAddToCart}
                  disabled={
                    product.inventoryCount === 0
                  }
                >
                  <i className="fa-solid fa-cart-shopping me-2"></i>
                  Add To Cart
                </button>

                <button
                  className="btn btn-outline-dark action-btn"
                  onClick={() => navigate("/cart")}
                >
                  Go To Cart
                </button>

                {/* Add Review Button */}
                {user && (
                  <button
                    className="btn btn-primary action-btn"
                    onClick={() =>
                      navigate(
                        `/reviews/add/${productId}`
                      )
                    }
                  >
                    <i className="fa-solid fa-star me-2"></i>
                    Add Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              Customer Reviews
            </h3>

            <p className="text-muted mb-0">
              See what customers say about this product
            </p>
          </div>

          <span className="badge bg-dark px-3 py-2">
            {reviews.length} Reviews
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="alert alert-light border text-center py-4">
            No Active Reviews Yet
          </div>
        ) : (
          <div className="row g-4">
            {reviews.map((review) => (
              <div
                className="col-md-6"
                key={review.id}
              >
                <div className="card review-card h-100 p-3">

                  <div className="d-flex align-items-center gap-3">

                    <div className="review-user">
                      {review.customerName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <h6 className="mb-0 fw-bold">
                        {review.customerName ||
                          "Customer"}
                      </h6>

                      <small className="text-warning">
                        {"⭐".repeat(review.rating)}
                      </small>
                    </div>
                  </div>

                  <p className="mt-4 mb-0 text-muted">
                    {review.reviewText}
                  </p>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;