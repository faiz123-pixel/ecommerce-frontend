import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reviewsApi } from "../../api/api";

function EditReview() {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState({
    rating: 5,
    reviewText: "",
  });

  const fetchReview = async () => {
    try {
      const res = await reviewsApi.get(`/${reviewId}`);

      setReview(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await reviewsApi.put(`/${reviewId}`, review);

      alert("Review Updated Successfully");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to update review");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4 text-center">Update Review</h3>

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Rating</label>

            <select
              className="form-select"
              value={review.rating}
              onChange={(e) =>
                setReview({
                  ...review,
                  rating: e.target.value,
                })
              }
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
              value={review.reviewText}
              onChange={(e) =>
                setReview({
                  ...review,
                  reviewText: e.target.value,
                })
              }
              required
            ></textarea>
          </div>

          <button className="btn btn-primary w-100">
            Update Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditReview;