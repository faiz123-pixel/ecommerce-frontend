import React, { useEffect, useState } from "react";
import { cartApi, userApi } from "../../api/api";

function CartDashboard() {
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState({});

  // 🔥 Fetch Cart Data
  const fetchCarts = async () => {
    try {
      const cartRes = await cartApi.get("");
      const userRes = await userApi.get("");

      // 🔥 Create User Map
      const userMap = {};

      userRes.data.forEach((user) => {
        userMap[user.id] =
          `${user.firstName} ${user.lastName}`;
      });

      setUsers(userMap);
      setCarts(cartRes.data);

      console.log(cartRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // 🔥 Get Customer Name
  const getCustomerName = (userId) => {
    return users[userId] || "Unknown User";
  };

  // 🔥 Cart Analytics
  const totalCartValue = carts.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  const totalProducts = carts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <style>
        {`
          .cart-main {
            padding: 20px;
            background: #f4f6f9;
            min-height: 100vh;
          }

            transition: 0.3s;
          }

          .dashboard-card:hover {
            transform: translateY(-3px);
          }

          .table-responsive {
            overflow-x: auto;
          }

          table th {
            white-space: nowrap;
          }

          .product-name {
            font-weight: 600;
            color: #333;
          }

          .price {
            color: #198754;
            font-weight: bold;
          }

          .qty-badge {
            background: #0d6efd;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
          }
        `}
      </style>

      <div className="cart-main">
        <div className="container-fluid">

          {/* 🔥 Heading */}
          <h2 className="mb-4 fw-bold">
            🛒 Cart Dashboard
          </h2>

          {/* 🔥 Analytics Cards */}
          <div className="row g-4 mb-4">

            {/* Total Cart Items */}
            <div className="col-md-4">
              <div className="card dashboard-card p-4">
                <h6 className="text-muted">
                  Total Cart Items
                </h6>

                <h2 className="fw-bold text-primary">
                  {carts.length}
                </h2>
              </div>
            </div>

            {/* Total Quantity */}
            <div className="col-md-4">
              <div className="card dashboard-card p-4">
                <h6 className="text-muted">
                  Total Products
                </h6>

                <h2 className="fw-bold text-success">
                  {totalProducts}
                </h2>
              </div>
            </div>

            {/* Total Cart Value */}
            <div className="col-md-4">
              <div className="card dashboard-card p-4">
                <h6 className="text-muted">
                  Total Cart Value
                </h6>

                <h2 className="fw-bold text-danger">
                  ₹{totalCartValue}
                </h2>
              </div>
            </div>
          </div>

          {/* 🔥 Cart Table */}
          <div className="table-responsive shadow rounded bg-white p-3">

            <table className="table table-bordered table-hover align-middle text-center">

              <thead className="table-dark">
                <tr>
                  <th>Cart ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {carts.length > 0 ? (
                  carts.map((cart) => (
                    <tr key={cart.cartId}>

                      <td>{cart.cartId}</td>

                      <td>
                        {getCustomerName(cart.user.id)}
                      </td>

                      <td className="product-name">
                        {cart.product.productName}
                      </td>

                      <td className="price">
                        ₹{cart.product.price}
                      </td>

                      <td>
                        <span className="qty-badge">
                          {cart.quantity}
                        </span>
                      </td>

                      <td className="fw-bold text-success">
                        ₹{cart.totalPrice}
                      </td>

                      <td>
                        {new Date(
                          cart.createdAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      No cart data found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartDashboard;