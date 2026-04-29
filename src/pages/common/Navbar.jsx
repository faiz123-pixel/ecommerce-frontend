import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-bold" to="/">
          E-Shop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">Orders</Link>
              </li>
            )}

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="text-white fw-semibold ms-lg-3">
                    Hi, {user?.firstName}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-dark btn-sm ms-lg-2"
                    onClick={logoutUser}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm ms-lg-3" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;