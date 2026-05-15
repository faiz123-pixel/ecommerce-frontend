import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  reviewsApi,
} from "../../api/api";

function ReviewDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await reviewsApi.get("");

      setReviews(res.data || []);

      // console.log(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 🔥 Add This Function Inside Component
const toggleReviewStatus = async (review) => {
  try {
    const updatedReview = {
      ...review,
      status: !review.status,
    };

    await reviewsApi.put(
      `/${review.id}`,
      updatedReview
    );

    // Update UI instantly
    setReviews((prev) =>
      prev.map((item) =>
        item.id === review.id
          ? {
              ...item,
              status: !item.status,
            }
          : item
      )
    );
  } catch (error) {
    console.error(error);
    alert("Failed to update review status");
  }
};

  // Analytics
  const totalReviews = reviews.length;

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

  const activeReviews = reviews.filter(
    (review) =>
      review.status === true ||
      review.status === 1
  ).length;

  const inactiveReviews =
    totalReviews - activeReviews;

  return (
    <>
      <style>
        {`
          .review-main {
            padding: 24px;
            background: #f5f7fb;
            min-height: 100vh;
          }

          @media (min-width: 992px) {
            .review-main {
              margin-left: 250px;
            }
          }

          .dashboard-card {
            border: none;
            border-radius: 18px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
          }

          .dashboard-card:hover {
            transform: translateY(-4px);
          }

          .card-icon {
            width: 55px;
            height: 55px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
          }

          .table-wrapper {
            border-radius: 18px;
            overflow: hidden;
          }

          .table th {
            white-space: nowrap;
            font-size: 14px;
          }

          .table td {
            vertical-align: middle;
          }

          .rating-badge {
            background: #fff3cd;
            color: #856404;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
          }

          .review-text {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .status-active {
            background: #198754;
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .status-inactive {
            background: #dc3545;
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .product-name {
            font-weight: 600;
            color: #333;
          }

          .customer-name {
            font-weight: 500;
          }

          .empty-box {
            padding: 50px 20px;
            text-align: center;
            color: #777;
          }
        `}
      </style>

      <Sidebar />

      <div className="review-main">
        <div className="container-fluid">

          {/* Heading */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">
                ⭐ Review Dashboard
              </h2>

              <p className="text-muted mb-0">
                Manage customer product reviews
              </p>
            </div>

            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={fetchReviews}
            >
              Refresh Reviews
            </button>
          </div>

          {/* Analytics Cards */}
          <div className="row g-4 mb-4">

            {/* Total Reviews */}
            <div className="col-md-3">
              <div className="card dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">
                      Total Reviews
                    </p>

                    <h2 className="fw-bold mb-0 text-primary">
                      {totalReviews}
                    </h2>
                  </div>

                  <div className="card-icon bg-primary text-white">
                    <i className="fa-solid fa-comments"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="col-md-3">
              <div className="card dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">
                      Average Rating
                    </p>

                    <h2 className="fw-bold mb-0 text-warning">
                      ⭐ {averageRating}
                    </h2>
                  </div>

                  <div className="card-icon bg-warning text-dark">
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Reviews */}
            <div className="col-md-3">
              <div className="card dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">
                      Active Reviews
                    </p>

                    <h2 className="fw-bold mb-0 text-success">
                      {activeReviews}
                    </h2>
                  </div>

                  <div className="card-icon bg-success text-white">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Inactive Reviews */}
            <div className="col-md-3">
              <div className="card dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">
                      Inactive Reviews
                    </p>

                    <h2 className="fw-bold mb-0 text-danger">
                      {inactiveReviews}
                    </h2>
                  </div>

                  <div className="card-icon bg-danger text-white">
                    <i className="fa-solid fa-ban"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Table */}
          <div className="table-wrapper shadow-sm bg-white p-3">

            <div className="table-responsive">
              <table className="table table-hover align-middle text-center mb-0">

                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>Date</th>
                  </tr>
                </thead>

                {/* 🔥 Replace Table Row */}
<tbody>
  {loading ? (
    <tr>
      <td colSpan="8">
        <div className="py-4">
          <div className="spinner-border text-primary"></div>
        </div>
      </td>
    </tr>
  ) : reviews.length > 0 ? (
    reviews.map((review) => (
      <tr key={review.id}>

        <td className="fw-bold">
          #{review.id}
        </td>

        <td className="customer-name">
          {review.user
            ? `${review.user.firstName || ""} ${review.user.lastName || ""}`
            : "Unknown User"}
        </td>

        <td className="product-name">
          {review.product?.productName || "N/A"}
        </td>

        <td>
          <span className="rating-badge">
            ⭐ {review.rating}/5
          </span>
        </td>

        <td className="review-text">
          {review.reviewText}
        </td>

        <td>
          <span
            className={
              review.status
                ? "status-active"
                : "status-inactive"
            }
          >
            {review.status
              ? "Active"
              : "Inactive"}
          </span>
        </td>

        {/* 🔥 Action Button */}
        <td>
          <button
            className={`btn btn-sm ${
              review.status
                ? "btn-danger"
                : "btn-success"
            }`}
            onClick={() =>
              toggleReviewStatus(review)
            }
          >
            {review.status
              ? "Set Inactive"
              : "Set Active"}
          </button>
        </td>

        <td>
          {review.createdAt
            ? new Date(
                review.createdAt
              ).toLocaleDateString()
            : "-"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8">
        <div className="empty-box">
          <i className="fa-regular fa-face-frown fs-1 mb-3"></i>

          <h5>No Reviews Found</h5>

          <p className="mb-0">
            Customer reviews will appear here.
          </p>
        </div>
      </td>
    </tr>
  )}
</tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewDashboard;