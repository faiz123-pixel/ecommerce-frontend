import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  ordersApi,
  userApi,
  categoriesApi,
  productsApi
} from "../../api/api";

function AdminDashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    users: 0,
    categories: 0
  });
  const [users, setUsers] = useState({});

  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [p, o, u, c] = await Promise.all([
        productsApi.get(""),
        ordersApi.get(""),
        userApi.get(""),
        categoriesApi.get("")
      ]);
      setCounts({
        products: p.data.length,
        orders: o.data.length,
        users: u.data.length,
        categories: c.data.length
      });

       const userMap = {};
    u.data.forEach(user => {
      userMap[user.id] = `${user.firstName} ${user.lastName}`;
    });

    setUsers(userMap);

      setRecentOrders(o.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const getCustomerName = (customerId) => {
  return users[customerId] || "Unknown User";
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Sidebar />

      {/* 🔥 INTERNAL CSS */}
      <style>
        {`
          .admin-main {
            
            padding: 20px;
            background: #f4f6f9;
            min-height: 100vh;
          }
            .card {
            border-radius: 10px;
            }

          @media (min-width: 992px) {
            .admin-main {
              margin-left: 250px;
            }
          }
        `}
      </style>

          <div className="admin-main">
      <div className="container-fluid">

        <h2 className="mb-4">Admin Dashboard</h2>

        {/* 🔥 Cards */}
        <div className="row g-3">

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-white bg-success shadow">
              <div className="card-body text-center">
                <h6>Total Products</h6>
                <h3>{counts.products}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-white bg-primary shadow">
              <div className="card-body text-center">
                <h6>Total Orders</h6>
                <h3>{counts.orders}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-dark bg-warning shadow">
              <div className="card-body text-center">
                <h6>Total Users</h6>
                <h3>{counts.users}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-white bg-dark shadow">
              <div className="card-body text-center">
                <h6>Total Categories</h6>
                <h3>{counts.categories}</h3>
              </div>
            </div>
          </div>

        </div>

        {/* 🔥 Recent Orders */}
        <div className="card mt-4 shadow">
          <div className="card-body">
            <h5>Recent Orders</h5>

            <div className="table-responsive">
              <table className="table table-bordered mt-3 text-center">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.orderId}>
                      <td>{o.orderId}</td>
                      <td>{getCustomerName(o.customerId)}</td>
                      <td>
                        <span
                          className={`badge ${
                            o.orderStatus === "Delivered"
                              ? "bg-success"
                              : o.orderStatus === "Shipped"
                              ? "bg-primary"
                              : o.orderStatus === "Cancelled"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>₹{o.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>
      </div>
    </>
  );
}

export default AdminDashboard;