import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
    <style>
      {`
      /* 🔥 MAIN FOOTER */
.footer {
  background: linear-gradient(135deg, #198754, #146c43);
  color: #fff;
  margin-top: auto;
  padding-top: 40px;
  padding-bottom: 20px;
}


/* 🔥 TITLES */
.footer-title {
  font-weight: 600;
  margin-bottom: 15px;
}

/* 🔥 TEXT */
.footer-text {
  font-size: 14px;
  line-height: 1.6;
}

/* 🔥 LINKS */
.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #fff;
  text-decoration: none;
  transition: 0.3s;
}

.footer-links a:hover {
  color: #ffc107;
  padding-left: 5px;
}

/* 🔥 SOCIAL ICONS */
.social-icons {
  margin-top: 10px;
}

.social-icons i {
  font-size: 20px;
  margin-right: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.social-icons i:hover {
  color: #ffc107;
  transform: scale(1.2);
}

/* 🔥 BOTTOM */
.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.2);
  margin-top: 20px;
  padding-top: 10px;
  font-size: 14px;
}

/* 🔥 STICKY FOOTER FIX */
html, body, #root {
  height: 100%;
}

#root {
  display: flex;
  flex-direction: column;
}

.app-container {
  flex: 1;
}
      `}
    </style>
    <footer className="footer">
      <div className="container">
        

        <div className="footer-bottom">
          <p>© 2026 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </>
  );
}

export default Footer;