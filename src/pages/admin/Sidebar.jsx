import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" }
  ];

  return (
    <div className="d-flex flex-column bg-success text-white vh-100 p-3 position-fixed" style={{
  width: "250px",
  height: "100vh",
  position: "fixed",
  top: "55px",   // 👈 ADD THIS
  left: 0,
  backgroundColor: "#198754"
}}>
      
      {/* Logo */}
      <h4 className="text-center mb-4 fw-bold">Admin Panel</h4>

      {/* Menu */}
      <ul className="nav nav-pills flex-column gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link text-white ${isActive ? "active bg-dark" : ""}`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;