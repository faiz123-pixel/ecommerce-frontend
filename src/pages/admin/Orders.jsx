import React, { useEffect, useState } from "react";
import { ordersApi, userApi } from "../../api/api";
import Sidebar from "./Sidebar";

function Orders() {
  const [orders, setOrders] = useState([]);
   const [users, setUsers] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await ordersApi.get("");
      const userRes = await userApi.get("");

      const userMap = {};
    userRes.data.forEach(user => {
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

  const updateStatus = async (id, status) => {
    try {
      await ordersApi.put(`/${id}/status?status=${status}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
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
    margin-left: 250px; /* must match sidebar width */
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
      `}
    </style>
      <Sidebar />

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
                          updateStatus(o.orderId, e.target.value)
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
    </>
  );
}

export default Orders;