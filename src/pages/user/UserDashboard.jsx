import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, ordersApi, wishlistApi, reviewsApi } from "../../api/api";
import { LoginContext } from "../../context/LoginContext";

function UserDashboard() {
  const { user } = useContext(LoginContext);
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const [cartRes, wishlistRes, ordersRes, reviewsRes] = await Promise.all([
        cartApi.get(`/user/${user.id}`),
        wishlistApi.get(`/user/${user.id}`),
        ordersApi.get(`/user/${user.id}`),
        reviewsApi.get(`/user/${user.id}`),
      ]);

      setCartCount(Array.isArray(cartRes.data) ? cartRes.data.length : 0);

      setWishlistCount(
        Array.isArray(wishlistRes.data) ? wishlistRes.data.length : 0,
      );

      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (error) {
      console.error("Dashboard fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Delete Review
  const deleteReview = async (reviewId) => {
    try {
      await reviewsApi.delete(`/${reviewId}`);

      setReviews((prev) =>
        prev.filter((review) => review.reviewId !== reviewId),
      );

      alert("Review deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          Please log in to view your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <style>
        {`
          .dashboard-card {
            border-radius: 20px;
            border: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }

          .dashboard-action {
            border-radius: 50px;
            padding: 10px 18px;
          }

          .order-status {
            min-width: 100px;
          }

          .review-card {
            border-radius: 16px;
            border: 1px solid #eee;
            transition: 0.3s;
          }

          .review-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 18px rgba(0,0,0,0.08);
          }
        `}
      </style>

      <div className="row g-4">
        {/* Welcome */}
        <div className="col-12">
          <div className="card dashboard-card p-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
              <div>
                <h2 className="fw-bold">
                  Hello, {user.firstName || user.email}
                </h2>

                <p className="text-muted mb-1">
                  Welcome back to your dashboard.
                </p>

                <p className="mb-0">
                  Manage your profile, orders, wishlist, reviews and cart from
                  one place.
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-success dashboard-action"
                  onClick={() => navigate("/cart")}
                >
                  Cart
                </button>

                <button
                  className="btn btn-outline-success dashboard-action"
                  onClick={() => navigate("/wishlist")}
                >
                  Wishlist
                </button>

                <button
                  className="btn btn-outline-dark dashboard-action"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="col-lg-4">
          <div className="card dashboard-card p-4 h-100">
            <h5 className="fw-bold mb-3">My Profile</h5>

            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            {user.phone && (
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            )}

            {user.address && (
              <p>
                <strong>Address:</strong> {user.address}
              </p>
            )}

            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => navigate("/profile")}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="col-lg-8">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card dashboard-card text-center p-4 h-100">
                <h6 className="text-success">Cart</h6>
                <h2>{cartCount}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card dashboard-card text-center p-4 h-100">
                <h6 className="text-primary">Wishlist</h6>
                <h2>{wishlistCount}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card dashboard-card text-center p-4 h-100">
                <h6 className="text-warning">Orders</h6>
                <h2>{orders.length}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card dashboard-card text-center p-4 h-100">
                <h6 className="text-danger">Reviews</h6>
                <h2>{reviews.length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="col-12">
          <div className="card dashboard-card p-4">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h5 className="fw-bold">Recent Orders</h5>
                <small className="text-muted">Your latest purchases</small>
              </div>

              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/orders")}
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="alert alert-info">No orders found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle text-center">
                  <thead className="table-success">
                    <tr>
                      <th>Order ID</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Address</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>

                        <td>
                          <span
                            className={`badge order-status ${
                              order.orderStatus === "Delivered"
                                ? "bg-success"
                                : order.orderStatus === "Cancelled"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                            }`}
                          >
                            {order.orderStatus || "Pending"}
                          </span>
                        </td>

                        <td>₹{order.totalAmount}</td>
                        <td>{order.shippingAddress || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="col-12">
          <div className="card dashboard-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-0">My Reviews</h5>
                <small className="text-muted">
                  Manage your product reviews and ratings
                </small>
              </div>

              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/products")}
              >
                Add Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="alert alert-secondary">
                You haven't added any reviews yet.
              </div>
            ) : (
              <div className="row g-3">
                {reviews.map((review) => (
                  <div className="col-md-6" key={review.id}>
                    <div className="review-card p-3 h-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold mb-0">⭐ {review.rating}/5</h6>

                        <span
                          className={`badge ${
                            review.status
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {review.status ? "Approved" : "Pending"}
                        </span>
                      </div>

                      <p className="mt-3 mb-2">{review.reviewText}</p>

                      <small className="text-muted">
                        Product ID: {review.product.productName}
                      </small>

                      <div className="mt-3 d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            navigate(`/reviews/edit/${review.id}`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteReview(review.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
