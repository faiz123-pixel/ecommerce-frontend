import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { LoginContext } from "../../context/LoginContext";


function AdminLayout() {

  const { user } = useContext(LoginContext);

  // ✅ Check Admin Role
  console.log(user)
  const isAdmin =
    user?.role?.roleName === "ROLE_ADMIN" ||
    user?.roles?.roleName?.includes("ADMIN");

  // ❌ If Not Admin
  if (!isAdmin) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          background: "#f4f6f9",
        }}
      >
        <div className="card shadow p-5 text-center border-0">
          <h2 className="text-danger mb-3">
            Access Denied
          </h2>

          <p className="text-muted">
            Only Admin Can Access This Page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div style={styles.main}>

        {/* Page Content */}
        <div style={styles.content}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;

const styles = {
  container: {
    display: "flex",
  },

  main: {
    marginLeft: "250px", // same as sidebar width
    width: "100%",
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  content: {
    padding: "20px",
  },
};