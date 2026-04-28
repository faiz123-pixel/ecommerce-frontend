import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { api } from "../../api";

function UserDashboard() {

  const {user} = useContext(LoginContext);
  const navigate=useNavigate();
  // Static array of requests
  const [requests, setRequests] = useState([]);

  // Count by status
  const pendingCount = requests.filter(r => r.status === "PENDING").length;
  const approvedCount = requests.filter(r => r.status === "APPROVED").length;
  const rejectedCount = requests.filter(r => r.status === "REJECTED").length;

  const fetchRequest = async()=>{
    const email= user.email;
    try {
      const res = await api.get(`/requests/${email}`);
      console.log(res.data);
      setRequests(res.data);
      
    } catch (error) {
      console.log(error.message);
      alert("somthing went wrong");
      
    }
  }
  useEffect(()=>{
    fetchRequest();
  },[])

  return (
    <div className="container mt-5">
      <div className="card shadow rounded-4 p-4 border-success">
        <h2 className="fw-bold text-success mb-3">User Dashboard</h2>
        <p className="mb-4">
          Welcome, <strong>{user?.firstName} {user?.lastName}</strong>
        </p>

        {/* Summary Cards */}
        <div className="d-flex gap-3 mb-4">
          <div className="card text-center flex-fill shadow-sm p-3 border-success">
            <h5 className="text-success">Pending</h5>
            <p className="fs-4 text-success">{pendingCount}</p>
          </div>
          <div className="card text-center flex-fill shadow-sm p-3 border-success">
            <h5 className="text-success">Approved</h5>
            <p className="fs-4 text-success">{approvedCount}</p>
          </div>
          <div className="card text-center flex-fill shadow-sm p-3 border-success">
            <h5 className="text-success">Rejected</h5>
            <p className="fs-4 text-success">{rejectedCount}</p>
          </div>
        </div>

        {/* Raise Request Button */}
        <button className="btn btn-success mb-4" onClick={()=>navigate("/raise-request")}>
          Raise New Request
        </button>

        {/* Requests Table */}
        <h4 className="fw-bold mb-3 text-success">Your Requests</h4>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Item Type</th>
                <th>Quantity (kg)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.itemType}</td>
                  <td>{r.quantity}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "PENDING"
                          ? "bg-warning text-dark"
                          : r.status === "APPROVED"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
