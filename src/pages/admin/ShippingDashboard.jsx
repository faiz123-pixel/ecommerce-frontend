import React, { useEffect, useState } from "react";
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
    *{
      box-sizing:border-box;
    }

    body{
      overflow-x:hidden;
      background:#f4f6f9;
    }

    .shipping-main{
      width:calc(100% - 250px);
      min-height:100vh;
      padding:25px;
      overflow-x:hidden;
      background:#f4f6f9;
    }

    @media(max-width:992px){
      .shipping-main{
        margin-left:0;
        width:100%;
        padding:15px;
      }
    }

    .dashboard-wrapper{
      width:100%;
      overflow:hidden;
    }

    .shipping-card{
      border:none;
      border-radius:20px;
      overflow:hidden;
      width:100%;
    }

    .track-card{
      border:none;
      border-radius:20px;
      width:100%;
    }

    .table-responsive{
      width:100%;
      overflow-x:auto;
      -webkit-overflow-scrolling:touch;
    }

    .table{
      min-width:900px;
      margin-bottom:0;
    }

    .table th{
      white-space:nowrap;
    }

    .badge-status{
      padding:8px 14px;
      border-radius:20px;
      font-size:13px;
      font-weight:600;
    }

    .custom-modal{
      width:100%;
      max-width:450px;
      background:white;
      border-radius:20px;
      padding:25px;
    }

    .modal-backdrop-custom{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.5);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
      padding:15px;
    }
  `}
</style>

    <div className="shipping-main">
      <div className="container-fluid">

        {/* Track Shipment */}
        <div className="card shadow border-0 mb-4 track-card">
          <div className="card-body">

            <h4 className="mb-3 fw-bold">
              📦 Track Shipment
            </h4>

            <div className="row g-2">
              <div className="col-md-9">
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
              </div>

              <div className="col-md-3">
                <button
                  className="btn btn-primary w-100 track-btn"
                  onClick={handleTrackShipment}
                >
                  Track
                </button>
              </div>
            </div>

            {trackingResult && (
              <div className="alert alert-success mt-4 mb-0">
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

                <p className="mb-0">
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

            <h2 className="dashboard-title">
              🚚 Shipping Dashboard
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

                <table className="table table-hover align-middle text-center">

                  <thead className="table-dark">
                    <tr>
                      <th>Shipping ID</th>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Courier</th>
                      <th>Tracking No.</th>
                      <th>Cost</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {shippingList.map(
                      (shipping) => (
                        <tr key={shipping.id}>

                          <td>
                            {shipping.id}
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
                            <span className="tracking-number">
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

    {/* Modal */}
    {showModal && (
      <div className="modal-backdrop-custom">

        <div className="custom-modal">

          <h4 className="mb-4 fw-bold">
            Update Shipping
          </h4>

          <form onSubmit={handleUpdateShipping}>

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

            <div className="mb-4">
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