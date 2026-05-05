import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { paymentApi, userApi } from "../../api/api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState({});

  const fetchPayments = async () => {
    try {
      const res = await paymentApi.get("");
      const userRes = await userApi.get("");

      const userMap = {};
      userRes.data.forEach((user) => {
        userMap[user.id] = `${user.firstName} ${user.lastName}`;
      });

      setUsers(userMap);
      setPayments(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCustomerName = (customerId) => {
    return users[customerId] || "Unknown User";
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId) => {
    try {
      const res = await paymentApi.put(`/refund/${paymentId}`);
      alert(res.data.message || "Refund successful");
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || "Refund failed");
    }
  };

  return (
    <>
      <style>
        {`
        .payments-main {
          padding: 20px;
          background: #f4f6f9;
          min-height: 100vh;
        }

        @media (min-width: 992px) {
          .payments-main {
            margin-left: 250px;
          }
        }

        .table-responsive {
          overflow-x: auto;
        }

        table th {
          white-space: nowrap;
        }
        `}
      </style>

      <Sidebar />

      <div className="payments-main">
        <div className="container-fluid">
          <h2 className="mb-4">Payment Dashboard</h2>

          <div className="table-responsive shadow rounded bg-white p-3">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId}>
                    <td>{p.paymentId}</td>
                    <td>{p.order.orderId}</td>
                    <td>{getCustomerName(p.order.customerId.id)}</td>
                    <td>₹{p.amount}</td>
                    <td>{p.paymentMethod}</td>

                    <td>
                      <span
                        className={`badge ${
                          p.status === "SUCCESS"
                            ? "bg-success"
                            : p.status === "FAILED"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>

                    <td>
                      {p.paymentStatus === "PAID" &&
                      p.order.orderStatus === "CANCELLED" ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRefund(p.paymentId)}
                        >
                          Refund
                        </button>
                      ) : p.paymentStatus === "REFUNDED" ? (
                        <span className="text-success">Refunded</span>
                      ) : (
                        <span className="text-muted">Not Eligible</span>
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

export default Payments;
