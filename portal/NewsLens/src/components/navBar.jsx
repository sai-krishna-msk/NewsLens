import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <img
          src="https://cdn-icons-gif.flaticon.com/15578/15578661.gif"
          width="60"
          height="60"
        ></img>
        <Link
          style={{
            marginRight: "70px",
            textDecoration: "none",
            fontWeight: "500",
            color: "black",
            fontSize: "1.5em",
          }}
          to="/"
        >
          NewsLens
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                style={{
                  marginRight: "30px",
                  textDecoration: "none",
                  fontWeight: "500",
                  color: "grey",
                }}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={{
                  marginRight: "30px",
                  textDecoration: "none",
                  fontWeight: "500",
                  color: "grey",
                }}
                to="/features"
              >
                Recommendations
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
