import React from "react";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div style={styles.main}>

        {/* Page Content */}
        <div style={styles.content} >
          {children}
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;

const styles = {
  container: {
    display: "flex"
  },

  main: {
    marginLeft: "250px", // same as sidebar width
    width: "100%",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  topbar: {
    height: "60px",
    background: "#198754", // Bootstrap green
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  logoutBtn: {
    background: "#fff",
    color: "#198754",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  content: {
    padding: "20px"
  }
};