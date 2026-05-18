import React, { useEffect, useState } from "react";
import { ordersApi, shippingApi, userApi,} from "../../api/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Shipping form
  const [shippingData, setShippingData] = useState({
    courierService: "",
    shippingCost: "",
    trackingNumber: "",
  });

  const fetchOrders = async () => {
    try {
      const res = await ordersApi.get("");
      const userRes = await userApi.get("");

      const userMap = {};

      userRes.data.forEach((user) => {
        userMap[user.id] = `${user.firstName} ${user.lastName}`;
      });

      setUsers(userMap);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCustomerName = (customerId) => {
    return users[customerId] || "Unknown User";
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open modal when shipped selected
  const handleStatusChange = (order, status) => {
    if (status === "Shipped") {
      setSelectedOrderId(order);
      setShowModal(true);
    } else {
      updateStatus(order.orderId, status);
    }
  };

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await ordersApi.put(`/${id}/status?status=${status}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit shipping details
  const handleShippingSubmit = async (e) => {
  e.preventDefault();

  try {

    const payload = {
      orders: {
        orderId: selectedOrderId.orderId,
      },
      courierService: shippingData.courierService,
      shippingCost: shippingData.shippingCost,
      trackingNumber: shippingData.trackingNumber,
    };

    console.log(payload);

    // Save shipping info
    const res = await shippingApi.post("", payload);

    console.log(res.data);

    // Update order status
    await updateStatus(selectedOrderId.orderId, "Shipped");

    // Reset form
    setShippingData({
      courierService: "",
      shippingCost: "",
      trackingNumber: "",
    });

    setShowModal(false);

    alert("Shipping details added successfully");

    fetchOrders();

  } catch (err) {
    console.error(err);
    alert("Failed to add shipping details");
  }
};

  const cancelOrder = async (id) => {
    try {
      const res = await ordersApi.delete(`/${id}`);
      alert(res.data.message);
      fetchOrders();
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong";
      alert(message);
    }
  };

  return (
    <>
      <style>
        {`
        .orders-main {
          padding: 20px;
          background: #f4f6f9;
          min-height: 100vh;
        }

        @media (min-width: 992px) {
          .orders-main {
          }
        }

        .table-responsive {
          overflow-x: auto;
        }

        table th {
          white-space: nowrap;
        }

        .form-select {
          min-width: 130px;
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

      <div className="orders-main">
        <div className="container-fluid">
          <h2 className="mb-4">Orders Dashboard</h2>

          <div className="table-responsive shadow rounded bg-white p-3">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId}>
                    <td>{o.orderId}</td>
                    <td>{getCustomerName(o.customerId)}</td>
                    <td>{o.shippingAddress}</td>

                    <td>
                      <span
                        className={`badge ${
                          o.orderStatus === "Delivered"
                            ? "bg-success"
                            : o.orderStatus === "Shipped"
                            ? "bg-primary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>

                    <td>₹{o.totalAmount}</td>

                    <td>
                      <select
                        className="form-select mb-2"
                        value={o.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            o,
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Option</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      {o.orderStatus !== "Shipped" &&
                        o.orderStatus !== "Delivered" && (
                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => cancelOrder(o.orderId)}
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="custom-modal">
            <h4 className="mb-3">Shipping Details</h4>

            <form onSubmit={handleShippingSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Courier Service
                </label>

                <input
                  type="text"
                  className="form-control"
                  required
                  value={shippingData.courierService}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      courierService: e.target.value,
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
                  required
                  value={shippingData.shippingCost}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      shippingCost: e.target.value,
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
                  required
                  value={shippingData.trackingNumber}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      trackingNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Save
                </button>

                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => setShowModal(false)}
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

export default Orders;