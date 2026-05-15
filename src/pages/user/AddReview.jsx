import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsApi, reviewsApi } from "../../api/api";
import { LoginContext } from "../../context/LoginContext";

function AddReview() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);

  const [rating, setRating] = useState(5);
  const [product, setProduct] = useState(null);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log(product,user,rating,reviewText)
      await reviewsApi.post("", {
        product:product,
        user: user,
        rating,
        reviewText,
      });

      alert("Review Added Successfully");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to add review");
    }
  };
  useEffect(() => {
      fetchProduct();
    }, []);
  
    const fetchProduct = async () => {
      try {
        const res = await productsApi.get(`/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4 text-center">Add Review</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Rating</label>

            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
              <option value="2">2 Star</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Review</label>

            <textarea
              className="form-control"
              rows="5"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
          </div>

          <button className="btn btn-success w-100">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReview;