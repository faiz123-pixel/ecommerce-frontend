import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { ordersApi, shippingApi, userApi } from "../../api/api";


function ShippingDashboard() {
  const [shippingList, setShippingList] = useState([]);
  const [orders, setOrders] = useState({});
  const [users, setUsers] = useState({});

  // Track shipment
  const [trackingNumber, setTrackingNumber] =
    useState("");

  const [trackingResult, setTrackingResult] =
    useState(null);

  // Update shipping
  const [showModal, setShowModal] = useState(false);

  const [selectedShipping, setSelectedShipping] =
    useState(null);

  const [updateData, setUpdateData] = useState({
    courierService: "",
    trackingNumber: "",
    shippingCost: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      const shippingRes = await shippingApi.get("");

      const ordersRes = await ordersApi.get("");

      const usersRes = await userApi.get("");

      // Order map
      const orderMap = {};

      ordersRes.data.forEach((o) => {
        orderMap[o.orderId] = o;
      });

      // User map
      const userMap = {};

      usersRes.data.forEach((u) => {
        userMap[u.id] =
          `${u.firstName} ${u.lastName}`;
      });

      setOrders(orderMap);

      setUsers(userMap);

      setShippingList(shippingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Customer name
  const getCustomerName = (orderId) => {
    const order = orders[orderId];

    if (!order) return "Unknown User";

    return users[order.customerId] ||
      "Unknown User";
  };

  // Track shipment
  const handleTrackShipment = () => {
    const shipment = shippingList.find(
      (s) =>
        s.trackingNumber.toLowerCase() ===
        trackingNumber.toLowerCase()
    );

    if (shipment) {
      setTrackingResult(shipment);
    } else {
      setTrackingResult(null);
      alert("Shipment not found");
    }
  };

  // Open update modal
  const openUpdateModal = (shipping) => {
    setSelectedShipping(shipping);

    setUpdateData({
      courierService: shipping.courierService,
      trackingNumber: shipping.trackingNumber,
      shippingCost: shipping.shippingCost,
    });

    setShowModal(true);
  };

  // Update shipping
  const handleUpdateShipping = async (e) => {
    e.preventDefault();

    try {
      await shippingApi.put(
        `/${selectedShipping.id}`,
        updateData
      );

      alert("Shipping updated successfully");

      setShowModal(false);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update shipping");
    }
  };

  return (
    <>
      <style>
        {`
        .shipping-main {
          padding: 20px;
          background: #f4f6f9;
          min-height: 100vh;
        }

        @media (min-width: 992px) {
          .shipping-main {
            margin-left: 250px;
          }
        }

        .shipping-card {
          border-radius: 12px;
          overflow: hidden;
        }

        .table th {
          white-space: nowrap;
        }

        .badge-status {
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 20px;
        }

        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .custom-modal {
          background: white;
          padding: 25px;
          border-radius: 10px;
          width: 400px;
        }
      `}
      </style>

      <Sidebar />

      <div className="shipping-main">
        <div className="container-fluid">

          {/* Track Shipment */}
          <div className="card shadow border-0 mb-4">
            <div className="card-body">
              <h4 className="mb-3">
                Track Shipment
              </h4>

              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Tracking Number"
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn btn-primary"
                  onClick={handleTrackShipment}
                >
                  Track
                </button>
              </div>

              {trackingResult && (
                <div className="alert alert-success mt-3">
                  <p>
                    <strong>Courier:</strong>{" "}
                    {
                      trackingResult.courierService
                    }
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    Shipped
                  </p>

                  <p>
                    <strong>Tracking:</strong>{" "}
                    {
                      trackingResult.trackingNumber
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Dashboard */}
          <div className="card shadow shipping-card border-0">
            <div className="card-body">

              <h2 className="mb-4 fw-bold">
                Shipping Dashboard
              </h2>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : shippingList.length === 0 ? (
                <div className="text-center py-5">
                  <h5>
                    No shipping records found
                  </h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>Shipping ID</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Courier Service</th>
                        <th>Tracking Number</th>
                        <th>Shipping Cost</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {shippingList.map(
                        (shipping) => (
                          <tr
                            key={
                              shipping.id
                            }
                          >
                            <td>
                              {
                                shipping.id
                              }
                            </td>

                            <td>
                              {
                                shipping.orders
                                  ?.orderId
                              }
                            </td>

                            <td>
                              {getCustomerName(
                                shipping.orders
                                  ?.orderId
                              )}
                            </td>

                            <td>
                              {
                                shipping.courierService
                              }
                            </td>

                            <td>
                              <span className="fw-semibold text-primary">
                                {
                                  shipping.trackingNumber
                                }
                              </span>
                            </td>

                            <td>
                              ₹
                              {
                                shipping.shippingCost
                              }
                            </td>

                            <td>
                              <span className="badge bg-success badge-status">
                                Shipped
                              </span>
                            </td>

                            <td>
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  openUpdateModal(
                                    shipping
                                  )
                                }
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Update Shipping Modal */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="custom-modal">

            <h4 className="mb-3">
              Update Shipping
            </h4>

            <form
              onSubmit={handleUpdateShipping}
            >
              <div className="mb-3">
                <label className="form-label">
                  Courier Service
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    updateData.courierService
                  }
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      courierService:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Tracking Number
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    updateData.trackingNumber
                  }
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      trackingNumber:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Shipping Cost
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={
                    updateData.shippingCost
                  }
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      shippingCost:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}

export default ShippingDashboard;